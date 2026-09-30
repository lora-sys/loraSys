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
          const overflow = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth, elements: [...document.querySelectorAll('main *')].filter((element) => element.getBoundingClientRect().right > innerWidth + 1).slice(0, 8).map((element) => ({ tag: element.tagName, class: element.className, right: element.getBoundingClientRect().right })) }))
          assert.ok(overflow.width <= overflow.viewport + 1, `No page overflow: ${JSON.stringify(overflow)}`)
          await capture(route.replace('/', '-') + '-light')
          await page.evaluate(() => { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark') })
          await capture(route.replace('/', '-') + '-dark')
          await page.evaluate(() => { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light') })
        })
      }

      await check(`${label} English writing archive lists and filters the canonical article collection`, page, async () => {
        await open('en/writing')
        const sitemapIndex = await context.request.get(new URL('sitemap-index.xml', site).href)
        assert.equal(sitemapIndex.status(), 200, 'Sitemap index should be available')
        const sitemapPaths = [...(await sitemapIndex.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
          .map((match) => new URL(match[1]).pathname)
        const canonicalArticles = new Set()
        for (const sitemapPath of sitemapPaths) {
          const response = await context.request.get(new URL(sitemapPath, site).href)
          assert.equal(response.status(), 200, `Article sitemap should load: ${sitemapPath}`)
          const xml = await response.text()
          for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
            const pathname = new URL(match[1]).pathname
            const article = pathname.match(/\/blog\/([^/]+)\/?$/)
            if (article && article[1] !== 'language' && !/^\d+$/.test(article[1])) canonicalArticles.add(article[1])
          }
        }
        assert.ok(canonicalArticles.size > 0, 'Canonical article sitemap should contain articles')

        const articleLinks = page.locator('[data-article] a[href]')
        const allLinks = await articleLinks.evaluateAll((items) => items.map((item) => item.href)
          .filter((href) => /\/blog\/[^/?#]+\/?$/.test(new URL(href).pathname)))
        const archiveArticles = new Set(allLinks.map((href) => new URL(href).pathname.match(/\/blog\/([^/]+)\/?$/)?.[1]).filter(Boolean))
        assert.deepEqual([...archiveArticles].sort(), [...canonicalArticles].sort(), 'English archive must link to every canonical article exactly by ID')

        const filter = page.locator('#language-filter')
        assert.notEqual(await filter.getAttribute('data-writing-language'), null, 'Language filter should expose its stable selector')
        assert.ok(await page.getByLabel(/language/i).count(), 'Language filter must have an accessible label')
        const chinese = page.locator('.publication-list [data-article][data-language="zh-CN"]').first()
        const english = page.locator('[data-article]').filter({ has: page.locator('a[href*="/blog/newtube"]') }).first()
        await chinese.waitFor({ state: 'visible' })
        await english.waitFor({ state: 'visible' })

        const options = await filter.locator('option').evaluateAll((items) => items.map((item) => ({ value: item.value, label: item.textContent.trim() })))
        const englishIndex = options.findIndex((item) => /english/i.test(item.label))
        assert.ok(englishIndex >= 0, 'Filter should offer an English option')
        const currentValue = await filter.inputValue()
        let currentIndex = options.findIndex((item) => item.value === currentValue)
        assert.ok(currentIndex >= 0, 'Default filter value should match an option')
        await filter.focus()
        while (currentIndex !== englishIndex) {
          const key = currentIndex < englishIndex ? 'ArrowDown' : 'ArrowUp'
          await filter.press(key)
          currentIndex += key === 'ArrowDown' ? 1 : -1
        }
        assert.equal(await filter.inputValue(), options[englishIndex].value, 'Keyboard should select English')
        assert.equal(await english.isVisible(), true, 'English filter should keep an English article visible')
        assert.equal(await chinese.isVisible(), false, 'English filter should hide the latest Chinese article')

        const allIndex = options.findIndex((item) => /all|全部/i.test(item.label))
        assert.ok(allIndex >= 0, 'Filter should offer a reset to all articles')
        await filter.selectOption(options[allIndex].value)
        assert.equal(await chinese.isVisible(), true, 'Reset should restore the latest Chinese article')
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Writing archive must not cause horizontal overflow')
        await capture('writing-en-archive')
        await filter.selectOption('en-US')
        const projectsLink = page.locator('.type-filter a').filter({ hasText: 'Projects & practice' })
        assert.equal(new URL(await projectsLink.getAttribute('href'), page.url()).searchParams.get('language'), 'en-US', 'Type links retain the selected language')
        await projectsLink.click()
        await page.waitForURL((url) => url.pathname.replace(/\/$/, '').endsWith('/en/writing/type/projects') && url.searchParams.get('language') === 'en-US')
        const waitForEnglish = () => page.waitForFunction(() => {
          const filter = document.querySelector('#language-filter')
          return filter instanceof HTMLSelectElement && !filter.disabled && filter.value === 'en-US'
            && [...document.querySelectorAll('[data-article][data-language="zh-CN"]')].every((article) => article instanceof HTMLElement && article.hidden)
        })
        // A visible server-rendered select can precede the deferred language script.
        // Await the selected state, not an arbitrary delay or a weaker assertion.
        await waitForEnglish()
        assert.equal(await page.locator('#language-filter').inputValue(), 'en-US', 'Changing type keeps the selected language')
        assert.equal(await page.locator('[data-article][data-language="zh-CN"]:visible').count(), 0)
        await page.goBack()
        assert.equal(new URL(page.url()).searchParams.get('language'), 'en-US')
        await waitForEnglish()
        await page.goForward()
        assert.equal(new URL(page.url()).searchParams.get('language'), 'en-US')
        await waitForEnglish()

      })

      await check(`${label} writing types, topics and series share classification across locales`, page, async () => {
        await open('en/writing')
        const englishNewsCount = await page.locator('[data-article][data-content-type="news"][data-language="en-US"]').count()
        const types = await page.locator('[data-article]').evaluateAll((items) => items.map((item) => item.dataset.contentType))
        assert.ok(types.length > 0 && types.every((type) => ['technical', 'projects', 'guides', 'news'].includes(type)), 'Every article has a visible canonical type')
        for (const type of ['technical', 'projects', 'guides', 'news']) {
          await open(`en/writing/type/${type}`)
          const classified = await page.locator('[data-article]').evaluateAll((items) => items.map((item) => item.dataset.contentType))
          assert.equal(classified.length, types.filter((value) => value === type).length)
          assert.ok(classified.every((value) => value === type))
          await open(`blog/type/${type}`)
          assert.ok(await page.locator(`.type-filter a[aria-current="page"][href$="/${type}"]`).count())
          assert.ok((await page.locator('[data-article]').evaluateAll((items) => items.map((item) => item.dataset.contentType))).every((value) => value === type))
        }
        await open('en/writing/series/agent-engineering-reading')
        const seriesCount = await page.locator('[data-article]').count()
        assert.ok(seriesCount > 0)
        assert.ok((await page.locator('[data-article]').evaluateAll((items) => items.map((item) => item.dataset.series))).every((value) => value === 'agent-engineering-reading'))
        const seriesEnglishCount = await page.locator('[data-article][data-language="en-US"]').count()
        await page.locator('#language-filter').selectOption('en-US')
        assert.equal(await page.locator('[data-article]:visible').count(), seriesEnglishCount)
        assert.equal(await page.locator('#filter-empty').isVisible(), seriesEnglishCount === 0)
        await page.goBack()
        await page.locator('#filter-empty').waitFor({ state: 'hidden' })
        assert.equal(await page.locator('[data-article]:visible').count(), seriesCount, 'Back restores the language and complete series')
        await page.goForward()
        assert.equal(await page.locator('[data-article]:visible').count(), seriesEnglishCount)
        await page.locator('#language-filter').selectOption('all')
        assert.equal(await page.locator('[data-article]:visible').count(), seriesCount)
        await open('en/writing/topic/multi-agent?language=en-US')
        await page.waitForFunction(() => {
          const filter = document.querySelector('#language-filter')
          return filter instanceof HTMLSelectElement && !filter.disabled && filter.value === 'en-US'
        })
        const topicEnglishCount = await page.locator('[data-article]:visible').count()
        assert.equal((await page.locator('#article-count').textContent()).trim(), `Newest first · ${topicEnglishCount} ${topicEnglishCount === 1 ? 'article' : 'articles'}`, 'Filtered counts use the correct singular or plural')
        await open('blog/type/news/language/en-US')
        assert.equal(await page.locator('.empty-state').isVisible(), englishNewsCount === 0, 'Empty language/type selection stays readable')
        await page.locator('.language-filter a').filter({ hasText: '中文' }).click()
        await page.locator('.post-card').first().waitFor({ state: 'visible' })
        assert.ok((await page.locator('[data-article]').evaluateAll((items) => items.map((item) => item.dataset.contentType))).every((value) => value === 'news'))
        await open('blog/series/agent-engineering-reading')
        const seriesIds = new Set()
        while (true) {
          for (const href of await page.locator('.post-link').evaluateAll((items) => items.map((item) => item.href))) seriesIds.add(new URL(href).pathname)
          const next = page.getByRole('link', { name: '下一页', exact: true })
          if (!await next.count()) break
          await next.click()
          await page.locator('.post-card').first().waitFor({ state: 'visible' })
        }
        assert.equal(seriesIds.size, seriesCount, 'Series pagination must retain every installment across old page boundaries')
        await open('blog/topic/security')
        const summary = page.locator('.writing-taxonomy summary')
        await summary.press('Enter')
        assert.equal(await page.locator('.writing-taxonomy details').getAttribute('open'), null, 'Keyboard collapses the topic list')
        await summary.press('Enter')
        assert.notEqual(await page.locator('.writing-taxonomy details').getAttribute('open'), null)
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await capture('writing-taxonomy')
      })

      await check(`${label} reviewed article covers load without duplicate body covers`, page, async () => {
        const visuals = JSON.parse(await readFile('content-sync/blog-visuals.json', 'utf8'))
        for (const entry of visuals.entries) {
          await open(`blog/${entry.slug}`)
          const hero = page.locator('.article-hero-image img')
          assert.equal(await hero.count(), 1, `${entry.slug}: one hero`)
          await hero.scrollIntoViewIfNeeded()
          await page.waitForFunction(() => {
            const image = document.querySelector('.article-hero-image img')
            return image?.complete && image.naturalWidth > 0
          })
          assert.equal(await hero.getAttribute('alt'), entry.alt)
          assert.equal(await page.locator('.prose img[src*="lora-explainer-v2"]').count(), 0, 'Cover must not be duplicated in article body')
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), entry.slug)
          if (['agent-demo-harness-control-layer', 'herdr-coding-agent-runtime', 'opencloak-local-pii-redaction'].includes(entry.slug)) await capture(`cover-${entry.slug}`)
        }
      })

      await check(`${label} search UI returns canonical articles only`, page, async () => {
        await open('search')
        const input = page.locator('.pagefind-ui__search-input')
        await input.fill('Harness')
        await page.locator('.pagefind-ui__result-link').first().waitFor({ state: 'visible' })
        const links = await page.locator('.pagefind-ui__result-link').evaluateAll((items) => items.map((item) => ({ title: item.textContent, href: item.href })))
        assert.ok(links.some((item) => item.href.includes('/blog/')), 'Search must retain matching articles')
        assert.ok(links.every((item) => !/\/en\/writing\/[^/?#]+/.test(new URL(item.href).pathname)), 'Search must not show legacy duplicates')
        // The UI includes section links for a page. Check page-level uniqueness in the index.
        const indexed = await page.evaluate(async (base) => {
          const pagefind = await import(`${location.origin}${base}pagefind/pagefind.js`)
          const result = await pagefind.search('Harness')
          return Promise.all(result.results.map(async (item) => {
            const data = await item.data()
            return { title: data.meta.title, href: new URL(data.url, location.origin).href }
          }))
        }, base)
        assert.ok(indexed.length > 0, 'Page-level search must contain results')
        const urls = indexed.map((item) => new URL(item.href).pathname)
        assert.equal(new Set(urls).size, urls.length, 'Index must not repeat a page')
        assert.ok(urls.every((url) => !/\/en\/writing\/[^/]+/.test(url)), 'Index must exclude legacy article aliases')
        report.searches.push({ label, indexed, links })
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
          const resumeHref = route === 'en' ? `${base}en/resume` : `${base}resume`
          const primary = page.locator(`.home-about a[href="${resumeHref}"]`).first()
          await primary.waitFor({ state: 'visible' })
          assert.ok((await primary.getAttribute('href')).startsWith(resumeHref))
          assert.equal(await page.locator('[data-resume-pdf][src]').count(), 0, 'Homepage must not preload a PDF')
          await primary.click()
          await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === resumeHref)
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

      await check(`${label} MDX reading surfaces render and stay responsive`, page, async () => {
        await open('blog/free-vision-skill')
        const tableShell = page.locator('[data-mdx-table]').first()
        await tableShell.waitFor({ state: 'visible' })
        assert.ok(await page.locator('[data-mdx-table]').count() >= 1, 'Markdown tables should use the MDX table renderer')
        const chart = page.locator('[data-mdx-chart]').first()
        await chart.waitFor({ state: 'visible' })
        const points = chart.locator('[data-chart-point]')
        assert.ok(await points.count() >= 2, 'DataChart needs interactive points')
        await points.nth(1).focus()
        assert.equal(await points.nth(1).getAttribute('aria-pressed'), 'true')
        const selected = (await chart.locator('[data-chart-readout]').innerText()).trim()
        assert.ok(selected.length > 0, 'DataChart readout should update on keyboard focus')
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'MDX page must not create page-level horizontal overflow')
        await chart.scrollIntoViewIfNeeded()
        await capture('mdx-free-vision')

        await open('blog/newtube')
        const mermaidSource = page.locator('[data-language="mermaid"] pre code, code.language-mermaid').first()
        await mermaidSource.scrollIntoViewIfNeeded()
        await page.locator('.mermaid-diagram svg').first().waitFor({ state: 'visible', timeout: 12000 })
        assert.equal(await page.locator('[data-language="mermaid"] pre code, code.language-mermaid').count(), 0, 'Rendered Mermaid should replace source code')
        await capture('mdx-newtube')
      })

      await check(`${label} explicit MDX components render on article content`, page, async () => {
        await open('blog/agent-credential-boundary-vault-broker')
        const comparison = page.locator('.mdx-compare-panel').first()
        await comparison.waitFor({ state: 'visible' })
        await comparison.scrollIntoViewIfNeeded()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await capture('mdx-compare-panel')

        await open('blog/agent-tool-search-mcp-ard')
        const process = page.locator('.mdx-process-steps').first()
        await process.waitFor({ state: 'visible' })
        assert.equal(await page.locator('.mdx-process-steps li').count(), 4)
        await process.scrollIntoViewIfNeeded()
        await capture('mdx-process-steps')

        await open('blog/agent-budget-memory-evaluation')
        const keyPoints = page.locator('.mdx-key-points').first()
        await keyPoints.waitFor({ state: 'visible' })
        assert.equal(await page.locator('.mdx-key-points article').count(), 3)
        await keyPoints.scrollIntoViewIfNeeded()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await capture('mdx-key-points')
      })

      await check(`${label} second MDX component pass stays readable`, page, async () => {
        await open('blog/long-running-agent-session-context-state')
        await page.locator('.mdx-key-points').first().waitFor({ state: 'visible' })
        assert.equal(await page.locator('.mdx-key-points article').count(), 3)

        await open('blog/kitaru-agent-regression-testing')
        const replaySteps = page.locator('.mdx-process-steps').first()
        await replaySteps.waitFor({ state: 'visible' })
        assert.equal(await replaySteps.locator('li').count(), 5)
        await replaySteps.scrollIntoViewIfNeeded()
        await capture('mdx-kitaru-process')

        await open('blog/tau-agent-loop-events')
        const messageComparison = page.locator('.mdx-compare-panel').first()
        await messageComparison.waitFor({ state: 'visible' })
        await messageComparison.scrollIntoViewIfNeeded()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await capture('mdx-tau-compare')

        await open('blog/eve-agent')
        const evePoints = page.locator('.mdx-key-points').first()
        await evePoints.waitFor({ state: 'visible' })
        assert.equal(await evePoints.locator('article').count(), 4)
        await evePoints.scrollIntoViewIfNeeded()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await capture('mdx-eve-key-points')
      })

      await check(`${label} interactive MDX comparisons work with keyboard`, page, async () => {
        await open('blog/tau-agent-architecture')
        const tauTabs = page.locator('[data-option-tabs]').first()
        await tauTabs.waitFor({ state: 'visible' })
        const tauButtons = tauTabs.locator('[data-option-tab]')
        assert.equal(await tauButtons.count(), 3)
        await tauButtons.nth(0).focus()
        await tauButtons.nth(0).press('ArrowRight')
        assert.equal(await tauButtons.nth(1).getAttribute('aria-selected'), 'true')
        assert.equal(await tauTabs.locator('[data-option-panel]:visible').count(), 1)
        await tauTabs.scrollIntoViewIfNeeded()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await capture('mdx-tau-option-tabs')

        await open('blog/hermes-stepfun-imagegen')
        const billingTabs = page.locator('[data-option-tabs]').first()
        await billingTabs.waitFor({ state: 'visible' })
        const billingButtons = billingTabs.locator('[data-option-tab]')
        assert.equal(await billingButtons.count(), 2)
        await billingButtons.nth(0).focus()
        await billingButtons.nth(0).press('End')
        assert.equal(await billingButtons.nth(1).getAttribute('aria-selected'), 'true')
        await billingTabs.scrollIntoViewIfNeeded()
        await capture('mdx-stepfun-billing')

        await open('blog/agent-budget-memory-evaluation')
        const budgetChart = page.locator('[data-mdx-chart]').first()
        await budgetChart.waitFor({ state: 'visible' })
        const budgetPoints = budgetChart.locator('[data-chart-point]')
        assert.equal(await budgetPoints.count(), 3)
        await budgetPoints.nth(1).focus()
        assert.equal(await budgetPoints.nth(1).getAttribute('aria-pressed'), 'true')
        await budgetChart.scrollIntoViewIfNeeded()
        await capture('mdx-budget-chart')

        await open('blog/eve-agent')
        const eveTabs = page.locator('[data-option-tabs]').first()
        await eveTabs.waitFor({ state: 'visible' })
        assert.equal(await eveTabs.locator('[data-option-tab]').count(), 4)
        await eveTabs.scrollIntoViewIfNeeded()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))

        await open('blog/hermes-minimax-media')
        await page.locator('.mdx-stat-strip').first().waitFor({ state: 'visible' })
        const mediaCompare = page.locator('.mdx-compare-panel').first()
        await mediaCompare.waitFor({ state: 'visible' })
        await mediaCompare.scrollIntoViewIfNeeded()
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await capture('mdx-minimax-compare')
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
  const noJs = await browser.newContext({ viewport: { width: 320, height: 740 }, javaScriptEnabled: false })
  const noJsPage = await noJs.newPage()
  await check('writing taxonomy has a narrow-screen no-JavaScript fallback', noJsPage, async () => {
    await noJsPage.goto(new URL('blog', site).href)
    await noJsPage.getByRole('link', { name: '新闻与阅读清单', exact: true }).first().click()
    assert.ok(await noJsPage.locator('.post-card').count() > 0)
    await noJsPage.locator('.writing-taxonomy summary').press('Enter')
    await noJsPage.locator('.writing-taxonomy a').filter({ hasText: 'AI Agent 工程阅读清单' }).click()
    assert.ok(await noJsPage.locator('.post-card').count() > 0)
    assert.ok(await noJsPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    await noJsPage.screenshot({ path: path.join(output, '320-no-js-writing-series.png'), animations: 'disabled' })
    report.screenshots.push('320-no-js-writing-series.png')
  })
  await noJs.close()
} finally {
  await browser.close()
  if (server) await new Promise((resolve) => server.close(resolve))
  report.finishedAt = new Date().toISOString()
  report.failures = failures.length
  await save()
}
console.log(JSON.stringify({ checks: report.checks.length, failures: failures.length, output }, null, 2))
if (failures.length) process.exitCode = 1
