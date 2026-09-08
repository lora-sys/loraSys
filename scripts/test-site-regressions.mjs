import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'

// Run against production output. Browser evidence stays outside the source tree.
const dist = path.resolve(process.argv[2] ?? 'dist')
const evidence = path.resolve(process.env.SITE_TEST_OUTPUT ?? path.join(os.tmpdir(), 'lorasys-site-regressions'))
await mkdir(evidence, { recursive: true })
const moduleName = process.env.PLAYWRIGHT_MODULE
const { chromium } = await import(moduleName ? pathToFileURL(path.resolve(moduleName)).href : 'playwright')
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1], match[2] ?? match[3]]))
const home = await readFile(path.join(dist, 'index.html'), 'utf8')
const canonicalTag = [...home.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag)).find((tag) => tag.rel === 'canonical')
assert.ok(canonicalTag?.href, 'Homepage must declare its canonical URL')
const canonical = new URL(canonicalTag.href)
const base = `${canonical.pathname.replace(/\/$/, '')}/`

async function htmlFiles(directory) {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...await htmlFiles(file))
    else if (entry.name.endsWith('.html')) result.push(file)
  }
  return result
}

const report = { base, checks: [], screenshots: [] }
const errors = []
const files = await htmlFiles(dist)
let alternateCount = 0
for (const file of files) {
  const html = await readFile(file, 'utf8')
  for (const [tag] of html.matchAll(/<link\b[^>]*>/g)) {
    const attrs = attributes(tag)
    if (attrs.rel !== 'alternate' || !attrs.hreflang) continue
    const url = new URL(attrs.href, canonical)
    assert.equal(url.origin, canonical.origin, `Unexpected alternate origin in ${file}`)
    assert.ok(url.pathname === base.slice(0, -1) || url.pathname.startsWith(base), `Alternate loses deployment base in ${file}: ${url.href}`)
    alternateCount += 1
  }
}
report.checks.push({ name: 'language alternate deployment paths', passed: true, pages: files.length, alternates: alternateCount })

const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf',
  '.wasm': 'application/wasm', '.xml': 'application/xml', '.ico': 'image/x-icon'
}
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost')
    if (url.pathname === base.slice(0, -1) && base !== '/') {
      response.writeHead(302, { Location: `${base}${url.search}` }); response.end(); return
    }
    if (!url.pathname.startsWith(base)) { response.writeHead(404); response.end(); return }
    let file = path.resolve(dist, decodeURIComponent(url.pathname.slice(base.length)))
    if (file !== dist && !file.startsWith(`${dist}${path.sep}`)) { response.writeHead(403); response.end(); return }
    let info
    try { info = await stat(file) } catch {
      file += '.html'
      info = await stat(file)
    }
    if (info.isDirectory()) file = path.join(file, 'index.html')
    const content = await readFile(file)
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(file)] ?? 'application/octet-stream' })
    response.end(content)
  } catch {
    response.writeHead(404); response.end('Not found')
  }
})
await new Promise((resolve, reject) => {
  server.once('error', reject)
  server.listen(0, '127.0.0.1', resolve)
})
const origin = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ headless: true })

async function check(name, fn) {
  try {
    await fn()
    report.checks.push({ name, passed: true })
    console.log(`PASS ${name}`)
  } catch (error) {
    report.checks.push({ name, passed: false, error: String(error.stack ?? error) })
    errors.push(`${name}: ${error.message}`)
    console.error(`FAIL ${name}: ${error.message}`)
  }
}

try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const label = `${viewport.width}-${reducedMotion}`
      const context = await browser.newContext({ viewport, reducedMotion })
      // The test never calls production APIs or writes to a published site.
      await context.route('**/*', (route) => {
        const url = new URL(route.request().url())
        return url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort()
      })
      const page = await context.newPage()
      page.setDefaultTimeout(12000)
      const pageErrors = []
      page.on('pageerror', (error) => pageErrors.push(error.message))
      const open = async (route = '') => {
        const response = await page.goto(`${origin}${base}${route}`, { waitUntil: 'load' })
        assert.equal(response?.status(), 200, `Route must load: ${route}`)
      }
      const capture = async (name) => {
        const filename = `${label}-${name}.png`
        await page.screenshot({ path: path.join(evidence, filename), fullPage: false })
        report.screenshots.push(filename)
      }

      await check(`${label}: search navigation and mobile keyboard menu`, async () => {
        await open()
        const search = page.locator('.header-tools .search-link')
        await search.waitFor({ state: 'visible' })
        if (viewport.width < 900) {
          const bounds = await search.boundingBox()
          assert.ok(bounds.width >= 44 && bounds.height >= 44, 'Mobile search needs a 44px target')
          const menu = page.locator('[data-menu-toggle]')
          await menu.press('Enter')
          await page.locator('[data-mobile-nav]').waitFor({ state: 'visible' })
          await page.keyboard.press('Escape')
          await page.locator('[data-mobile-nav]').waitFor({ state: 'hidden' })
          assert.ok(await menu.evaluate((element) => element === document.activeElement), 'Escape should return menu focus')
        }
        await capture('home')
        await search.click()
        await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === `${base}search`)
        assert.ok(await page.locator('h1').count(), 'Search destination should contain a heading')
      })

      await check(`${label}: source labels filtering empty state and browser history`, async () => {
        await open('projects?q=loraSys')
        const archive = page.locator('[data-work-archive]')
        await page.waitForFunction(() => document.querySelector('[data-work-archive]')?.open === true)
        const items = page.locator('[data-project-browser] [data-project-item]:not([hidden])')
        await page.waitForFunction(() => document.querySelectorAll('[data-project-browser] [data-project-item]:not([hidden])').length === 1)
        assert.match(await items.innerText(), /loraSys/i)
        const labels = await page.locator('[data-source-filter]').allTextContents()
        assert.equal(new Set(labels.map((text) => text.trim())).size, labels.length, 'Source labels must be distinct')
        const search = page.locator('[data-project-search]')
        await search.fill('no-matching-project-4f714a')
        await page.locator('[data-empty-state]').waitFor({ state: 'visible' })
        await page.locator('[data-filter-reset]').click()
        await page.locator('[data-empty-state]').waitFor({ state: 'hidden' })
        const external = page.locator('[data-source-filter="External"]')
        assert.equal((await external.textContent()).trim(), '外部贡献')
        await external.click()
        assert.equal(new URL(page.url()).searchParams.get('source'), 'External')
        assert.ok((await items.evaluateAll((elements) => elements.map((element) => element.dataset.source))).every((source) => source === 'External'))
        await page.goBack()
        await page.waitForFunction(() => document.querySelector('[data-source-filter="all"]')?.getAttribute('aria-pressed') === 'true')
        await page.goForward()
        await page.waitForFunction(() => document.querySelector('[data-source-filter="External"]')?.getAttribute('aria-pressed') === 'true')
        assert.equal(await archive.getAttribute('open'), '')
        await capture('filters')
      })

      await check(`${label}: both Hermes article links reveal the target`, async () => {
        for (const repo of ['hermes-minimax-media', 'hermes-stepfun-imagegen']) {
          await open(`blog/${repo}`)
          const link = page.locator(`a[data-interaction="article_project_link"][href$="#${repo}"]`)
          assert.equal(await link.count(), 1, `Article must link to ${repo}`)
          await link.click()
          await page.waitForURL((url) => url.hash === `#${repo}` && url.pathname.replace(/\/$/, '') === `${base}projects`)
          const target = page.locator(`[id="${repo}"]`)
          assert.equal(await target.count(), 1, 'Deep link ID must be unique')
          await target.waitFor({ state: 'visible' })
          await page.waitForFunction((id) => document.activeElement?.id === id, repo)
          assert.ok(await page.locator('[data-work-archive]').evaluate((element) => element.open))
          // A copied link with stale filters must still reveal its explicit target.
          await open(`projects?q=no-matching-project-4f714a#${repo}`)
          await target.waitFor({ state: 'visible' })
          assert.equal(new URL(page.url()).searchParams.get('q'), null)
          await capture(repo)
        }
      })

      await check(`${label}: both English resume buttons and keyboard focus`, async () => {
        await open('en/resume')
        const previews = page.locator('[data-resume-preview]')
        assert.equal(await previews.count(), 2, 'English resume should retain both preview entrances')
        const ids = await page.locator('dialog[data-resume-dialog]').evaluateAll((elements) => elements.map((element) => element.id))
        assert.equal(new Set(ids).size, ids.length, 'Dialog IDs must be unique')
        for (let index = 0; index < await previews.count(); index += 1) {
          const preview = previews.nth(index)
          const trigger = preview.locator('[data-resume-trigger]')
          const dialog = preview.locator('[data-resume-dialog]')
          const frame = preview.locator('[data-resume-pdf]')
          assert.equal(await trigger.getAttribute('aria-controls'), await dialog.getAttribute('id'))
          assert.equal(await frame.getAttribute('src'), null, 'PDF should remain lazy before opening')
          await trigger.press('Enter')
          await dialog.waitFor({ state: 'visible' })
          assert.equal(await page.locator('dialog[open]').count(), 1)
          assert.equal(await frame.getAttribute('src'), `${base}resume.pdf#view=FitH`)
          if (index === 0) await preview.locator('[data-resume-close]').click()
          else await page.keyboard.press('Escape')
          await dialog.waitFor({ state: 'hidden' })
          assert.ok(await trigger.evaluate((element) => element === document.activeElement), 'Dialog close should restore its own trigger')
        }
      })

      await check(`${label}: reading surfaces have no document overflow`, async () => {
        for (const route of ['', 'projects', 'blog', 'blog/ai-engineering-harness']) {
          await open(route)
          await page.evaluate(() => document.fonts.ready)
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
          assert.ok(overflow <= 1, `Horizontal page overflow on ${route}: ${overflow}px`)
          await capture(route === '' ? 'home-final' : route.replaceAll('/', '-'))
        }
      })
      await check(`${label}: no uncaught application errors`, async () => assert.deepEqual(pageErrors, []))
      await context.close()
    }
  }
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
  await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2))
}
console.log(JSON.stringify({ checks: report.checks.length, failures: errors.length, evidence }, null, 2))
if (errors.length) process.exitCode = 1
