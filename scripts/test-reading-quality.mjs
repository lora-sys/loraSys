import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright')
const dist = path.resolve(process.argv[2] ?? 'dist')
const output = path.resolve(process.env.SITE_TEST_OUTPUT ?? path.join(os.tmpdir(), 'lorasys-reading-quality'))
await mkdir(output, { recursive: true })
const report = { startedAt: new Date().toISOString(), mode: process.env.SITE_TEST_URL ? 'published-site' : 'production-build', checks: [], measurements: [], screenshots: [], searches: [], htmlHashes: {} }
const failures = []
let server
let site

if (process.env.SITE_TEST_URL) {
  site = new URL(process.env.SITE_TEST_URL)
  assert.equal(site.protocol, 'https:', 'Published-site checks must use HTTPS')
} else {
  const home = await readFile(path.join(dist, 'index.html'), 'utf8')
  const tag = home.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/)?.[0]
  const href = tag?.match(/href=["']([^"']+)/)?.[1]
  assert.ok(href, 'Build needs a canonical homepage URL')
  const base = `${new URL(href).pathname.replace(/\/$/, '')}/`
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.woff': 'font/woff', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.xml': 'application/xml', '.ico': 'image/x-icon' }
  server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost')
      if (url.pathname === base.slice(0, -1) && base !== '/') {
        response.writeHead(302, { Location: `${base}${url.search}` }); response.end(); return
      }
      if (!url.pathname.startsWith(base)) { response.writeHead(404); response.end(); return }
      let file = path.resolve(dist, decodeURIComponent(url.pathname.slice(base.length)))
      if (file !== dist && !file.startsWith(`${dist}${path.sep}`)) { response.writeHead(403); response.end(); return }
      let info
      try { info = await stat(file) } catch { file += '.html'; info = await stat(file) }
      if (info.isDirectory()) file = path.join(file, 'index.html')
      response.writeHead(200, { 'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream' })
      response.end(await readFile(file))
    } catch { response.writeHead(404); response.end('Not found') }
  })
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve) })
  site = new URL(`http://127.0.0.1:${server.address().port}${base}`)
}
site.pathname = `${site.pathname.replace(/\/$/, '')}/`
report.site = site.href
const base = site.pathname
const browser = await chromium.launch({ headless: true, channel: 'chromium' })
const save = () => writeFile(path.join(output, 'reading-quality.json'), JSON.stringify(report, null, 2))
const text = (html, attr) => html.match(new RegExp(`${attr}=["']([^"']+)`))?.[1]

async function check(name, page, fn) {
  try {
    await fn()
    report.checks.push({ name, passed: true })
    console.log(`PASS ${name}`)
  } catch (error) {
    failures.push(name)
    report.checks.push({ name, passed: false, error: String(error.stack ?? error) })
    console.error(`FAIL ${name}: ${error.message}`)
    const filename = `FAIL-${name.replace(/[^a-z0-9]+/gi, '-')}.png`
    try { await page.screenshot({ path: path.join(output, filename), animations: 'disabled', timeout: 10000 }); report.screenshots.push(filename) } catch {}
  }
  await save()
}

try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const label = `${viewport.width}-${reducedMotion}`
      const context = await browser.newContext({ viewport, reducedMotion, colorScheme: 'light' })
      // This runner only reads public pages or local build output. It cannot submit forms.
      await context.route('**/*', (route) => {
        const request = route.request()
        return ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort()
      })
      const page = await context.newPage()
      page.setDefaultTimeout(12000)
      page.setDefaultNavigationTimeout(30000)
      const pageErrors = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      const open = async (route = '') => {
        const response = await page.goto(new URL(route, site).href, { waitUntil: 'load' })
        assert.equal(response?.status(), 200, route)
        report.htmlHashes[route || '/'] = createHash('sha256').update(await response.body()).digest('hex')
        await page.evaluate(() => document.fonts.ready)
      }
      const capture = async (name) => {
        await page.waitForFunction(() => [...document.images].filter((image) => {
          const r = image.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0
        }).every((image) => image.complete), null, { timeout: 12000 })
        const filename = `${label}-${name}.png`
        await page.screenshot({ path: path.join(output, filename), animations: 'disabled', timeout: 12000 })
        report.screenshots.push(filename)
      }

      for (const route of ['projects', 'en/work']) {
        await check(`${label} ${route} shows first project title without scrolling`, page, async () => {
          await open(route)
          const card = page.locator('.work-page [data-project-card]').first()
          await page.waitForFunction(() => {
            const card = document.querySelector('.work-page [data-project-card]')
            return card && Number(getComputedStyle(card).opacity) === 1
          }, null, { timeout: 12000 })
          const heading = card.locator('.project-heading h3')
          const box = await heading.boundingBox()
          const cardBox = await card.boundingBox()
          assert.ok(box && cardBox, 'Project heading must have rendered bounds')
          report.measurements.push({ label, route, cardY: cardBox.y, titleY: box.y, titleBottom: box.y + box.height, viewportHeight: viewport.height })
          assert.ok(box.y >= 0 && box.y + box.height <= viewport.height, `First project title below fold: ${JSON.stringify(box)}`)
          assert.ok(cardBox.y < viewport.height / 2, `First card starts too low: ${cardBox.y}`)
          assert.equal(await page.evaluate(() => scrollY), 0, 'Test must not scroll to make the title pass')
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No page overflow')
          await capture(route.replace('/', '-') + '-light')
          await page.evaluate(() => { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark') })
          await capture(route.replace('/', '-') + '-dark')
          await page.evaluate(() => { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light') })
        })
      }

      await check(`${label} search UI returns canonical articles only`, page, async () => {
        await open('search')
        const input = page.locator('.pagefind-ui__search-input')
        await input.fill('Harness')
        await page.locator('.pagefind-ui__result-link').first().waitFor({ state: 'visible' })
        const links = await page.locator('.pagefind-ui__result-link').evaluateAll((items) => items.map((item) => ({ title: item.textContent, href: item.href })))
        assert.ok(links.some((item) => item.href.includes('/blog/')), 'Search must retain matching articles')
        assert.ok(links.every((item) => !/\/en\/writing\/[^/?#]+/.test(new URL(item.href).pathname)), 'Search must not show legacy duplicates')
        const urls = links.map((item) => new URL(item.href).pathname)
        assert.equal(new Set(urls).size, urls.length, 'Search must not repeat a page')
        report.searches.push({ label, links })
        await capture('search')
        const article = page.locator('.pagefind-ui__result-link').filter({ hasText: /Harness/i }).first()
        await article.click()
        assert.ok(new URL(page.url()).pathname.startsWith(base), 'Search destination keeps the deployment base')
      })

      await check(`${label} old article link preserves query and section`, page, async () => {
        await open('blog/loop-engineering-harness')
        const section = await page.locator('h2[id]').first().getAttribute('id')
        assert.ok(section, 'Original article needs a real section')
        const hash = `#${encodeURIComponent(section)}`
        await page.goto(new URL(`en/writing/loop-engineering-harness?source=legacy${hash}`, site).href, { waitUntil: 'load' })
        await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === `${base}blog/loop-engineering-harness`)
        assert.equal(new URL(page.url()).searchParams.get('source'), 'legacy')
        assert.equal(decodeURIComponent(new URL(page.url()).hash.slice(1)), section)
        assert.equal(await page.locator('link[rel="alternate"][hreflang="en-US"]').count(), 0, 'Chinese article must not claim its alias is a translation')
        await capture('legacy-link')
      })

      await check(`${label} web resume is primary and PDF stays optional`, page, async () => {
        for (const route of ['', 'en']) {
          await open(route)
          const primary = page.locator('[data-resume-reading]').first()
          await primary.waitFor({ state: 'visible' })
          const expected = route === 'en' ? `${base}en/resume` : `${base}resume`
          assert.ok((await primary.getAttribute('href')).startsWith(expected))
          assert.equal(await page.locator('[data-resume-pdf][src]').count(), 0, 'Homepage must not preload a PDF')
          await primary.click()
          await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === expected)
          assert.equal(await page.locator('dialog[open]').count(), 0, 'Primary action must not open a PDF modal')
          await page.locator('#resume-title').waitFor({ state: 'visible' })
          if (viewport.width === 390) {
            const font = await page.locator('.resume-summary').first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
            assert.ok(font >= 16, `Mobile web resume text must be at least 16px, got ${font}`)
          }
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
          await capture(route === 'en' ? 'resume-en-web' : 'resume-zh-web')
        }
        const previews = page.locator('[data-resume-preview]')
        assert.equal(await previews.count(), 2, 'Keep both English PDF entrances')
        for (let i = 0; i < 2; i += 1) {
          const preview = previews.nth(i)
          assert.match(await preview.locator('.resume-pdf-language').innerText(), /Chinese/)
          const trigger = preview.locator('[data-resume-trigger]')
          await trigger.press('Enter')
          await preview.locator('dialog').waitFor({ state: 'visible' })
          assert.equal(await page.locator('dialog[open]').count(), 1)
          assert.ok((await preview.locator('iframe').getAttribute('src')).startsWith(`${base}resume.pdf`))
          await page.keyboard.press('Escape')
          await preview.locator('dialog').waitFor({ state: 'hidden' })
          assert.ok(await trigger.evaluate((element) => element === document.activeElement))
        }
      })

      await check(`${label} no uncaught application errors`, page, async () => assert.deepEqual(pageErrors, []))
      await context.close()
    }
  }

  const context = await browser.newContext()
  const page = await context.newPage()
  await check('all legacy aliases have canonical noindex and no sitemap entry', page, async () => {
    const listing = await context.request.get(new URL('blog', site).href)
    assert.equal(listing.status(), 200)
    const html = await listing.text()
    const slugs = [...new Set([...html.matchAll(/href=["'][^"']*\/blog\/([^/"'#?]+)["']/g)].map((match) => match[1]).filter((slug) => !/^\d+$/.test(slug) && slug !== 'language'))]
    assert.ok(slugs.length >= 9, `Expected the existing article collection, found ${slugs.length}`)
    for (const slug of slugs) {
      const response = await context.request.get(new URL(`en/writing/${slug}`, site).href)
      assert.equal(response.status(), 200, `Keep existing alias ${slug}`)
      const body = await response.text()
      assert.match(body, /noindex/)
      assert.match(body, /data-pagefind-ignore=["']all["']/)
      const canonical = body.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/)?.[0]
      assert.equal(new URL(text(canonical, 'href')).pathname, `${base}blog/${slug}`)
      const original = await context.request.get(new URL(`blog/${slug}`, site).href)
      assert.equal(original.status(), 200)
    }
    const index = await context.request.get(new URL('sitemap-index.xml', site).href)
    assert.equal(index.status(), 200)
    const xml = await index.text()
    const sitemapPaths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)
    assert.ok(sitemapPaths.length, 'Sitemap index must reference a sitemap')
    for (const pathname of sitemapPaths) {
      const response = await context.request.get(new URL(pathname, site).href)
      const sitemap = await response.text()
      assert.equal(response.status(), 200)
      assert.doesNotMatch(sitemap, /\/en\/writing\/[^<]+/)
      assert.match(sitemap, /\/blog\//)
    }
    report.aliases = slugs
  })
  await context.close()
} finally {
  await browser.close()
  if (server) await new Promise((resolve) => server.close(resolve))
  report.finishedAt = new Date().toISOString()
  report.failures = failures.length
  await save()
}
console.log(JSON.stringify({ checks: report.checks.length, failures: failures.length, output }, null, 2))
if (failures.length) process.exitCode = 1
