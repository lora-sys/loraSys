import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const output = process.env.SITE_TEST_OUTPUT
await mkdir(output, { recursive: true })
// Read-only production inspection. No page resources, CSS, APIs, or history are mocked.
const base = 'https://lora-sys.github.io/loraSys/'
const expectedIndexHash = '46111dc098393482ab7abb7e633f0511377ac13679e899a05ec89794ca837fae'
const report = { startedAt: new Date().toISOString(), target: base, deployedCommit: 'f376d3b673e793b9ce5e90f7304d538b96a7f2ac', expectedIndexHash, checks: [], captures: [], network: [], console: [], pageErrors: [] }
const browser = await chromium.launch({ headless: true })
let failures = 0
const cleanName = (s) => s.replaceAll(/[^a-zA-Z0-9_-]/g, '-')

async function settled(page) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => [...document.images].filter((image) => {
    const r = image.getBoundingClientRect()
    return r.width && r.height && r.bottom > 0 && r.top < innerHeight
  }).every((image) => image.complete), { timeout: 15000 })
  if (await page.locator('[data-hero-scene]').count()) {
    await page.waitForFunction(() => document.querySelector('[data-hero-scene]')?.getAttribute('data-hero-ready') === 'true')
  }
  await page.evaluate(async () => {
    const finite = document.getAnimations().filter((a) => a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming().endTime))
    await Promise.all(finite.map((a) => a.finished.catch(() => {})))
  })
}

try {
  for (const width of [1440, 390]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const label = `${width}-${reducedMotion}`
      const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion, colorScheme: 'light' })
      const page = await context.newPage()
      page.setDefaultTimeout(20000)
      page.setDefaultNavigationTimeout(35000)
      page.on('pageerror', (error) => report.pageErrors.push({ label, page: page.url(), error: error.message }))
      page.on('console', (message) => { if (message.type() === 'error') report.console.push({ label, page: page.url(), error: message.text() }) })
      page.on('response', (response) => { if (response.status() >= 400 || response.url().includes('resume.pdf')) report.network.push({ label, url: response.url(), status: response.status() }) })
      page.on('requestfailed', (request) => report.network.push({ label, url: request.url(), failure: request.failure()?.errorText }))
      const open = async (route = '') => {
        const response = await page.goto(`${base}${route}`, { waitUntil: 'load' })
        assert.equal(response?.status(), 200, `Page status: ${route}`)
        await settled(page)
        return response
      }
      const capture = async (name) => {
        await settled(page)
        const file = `${label}-${cleanName(name)}.png`
        await page.screenshot({ path: path.join(output, file) })
        const measurements = await page.evaluate(() => {
          const rect = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, width: r.width, height: r.height, pageTop: r.top + scrollY } }
          const images = [...document.images].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight })
          return { title: document.title, scrollY, scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, h1: rect(document.querySelector('h1')), banner: rect(document.querySelector('.page-visual-banner')), firstProject: rect(document.querySelector('[data-project-card]')), brokenVisibleImages: images.filter((e) => !e.naturalWidth).map((e) => e.currentSrc), activeElement: document.activeElement?.id, visibleImages: images.length }
        })
        report.captures.push({ label, file, url: page.url(), measurements })
        return measurements
      }
      const check = async (name, fn) => {
        try {
          const details = await fn()
          report.checks.push({ label, name, passed: true, details })
          console.log(`PASS ${label}: ${name}`)
        } catch (error) {
          failures += 1
          report.checks.push({ label, name, passed: false, error: String(error.stack ?? error) })
          console.error(`FAIL ${label}: ${name}: ${error.message}`)
          try { await page.screenshot({ path: path.join(output, `${label}-FAIL-${cleanName(name)}.png`) }) } catch {}
        }
      }

      await check('published revision and homepage', async () => {
        const response = await open()
        const hash = createHash('sha256').update(await response.body()).digest('hex')
        const headers = await response.allHeaders()
        report.liveRevision = { receivedIndexHash: hash, headers, checkedAt: new Date().toISOString() }
        await writeFile(path.join(output, 'live-index.html'), await response.body())
        await capture('home-light')
        assert.equal(hash, expectedIndexHash, 'Live HTML must match the downloaded deployed artifact')
        assert.equal(await page.locator('[data-resume-preview]').count(), 1, 'New resume implementation must be deployed')
        return { hash, url: page.url() }
      })

      await check('mobile search menu and keyboard focus', async () => {
        await open()
        const search = page.locator('.header-tools .search-link')
        await search.waitFor({ state: 'visible' })
        const bounds = await search.boundingBox()
        if (width < 900) {
          assert.ok(bounds.width >= 44 && bounds.height >= 44)
          const toggle = page.locator('[data-menu-toggle]')
          await toggle.press('Enter')
          await page.locator('[data-mobile-nav]').waitFor({ state: 'visible' })
          await capture('mobile-menu')
          await page.keyboard.press('Escape')
          await page.locator('[data-mobile-nav]').waitFor({ state: 'hidden' })
          assert.ok(await toggle.evaluate((e) => e === document.activeElement))
        }
        await search.click()
        await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === '/loraSys/search')
        const input = page.locator('input[type="search"]')
        await input.waitFor({ state: 'visible' })
        await input.fill('Harness')
        await page.locator('.pagefind-ui__result').first().waitFor({ state: 'visible' })
        await capture('search-results')
        const hrefs = await page.locator('.pagefind-ui__result-link').evaluateAll((es) => es.map((e) => e.href))
        assert.ok(hrefs.length > 0)
        assert.ok(hrefs.every((href) => new URL(href).pathname.startsWith('/loraSys/')))
        return { searchBounds: bounds, resultLinks: hrefs }
      })

      await check('source labels filters empty state and history', async () => {
        await open('projects?q=loraSys')
        await page.waitForFunction(() => document.querySelector('[data-work-archive]')?.open === true)
        const visible = page.locator('[data-project-browser] [data-project-item]:not([hidden])')
        await page.waitForFunction(() => document.querySelectorAll('[data-project-browser] [data-project-item]:not([hidden])').length === 1)
        await visible.scrollIntoViewIfNeeded()
        await visible.locator('h3').waitFor({ state: 'visible' })
        assert.match(await visible.innerText(), /loraSys/i)
        await capture('lorasys-result')
        const labels = (await page.locator('[data-source-filter]').allTextContents()).map((s) => s.trim())
        assert.equal(new Set(labels).size, labels.length)
        assert.ok(labels.includes('外部贡献'))
        await page.locator('[data-project-search]').fill('no-match-live-verification-91827')
        await page.locator('[data-empty-state]').waitFor({ state: 'visible' })
        await page.locator('[data-empty-state]').scrollIntoViewIfNeeded()
        await capture('empty-state')
        await page.locator('[data-filter-reset]').click()
        await page.locator('[data-source-filter="External"]').click()
        await page.waitForFunction(() => new URL(location.href).searchParams.get('source') === 'External')
        assert.ok(await visible.count() > 0)
        assert.ok((await visible.evaluateAll((es) => es.map((e) => e.dataset.source))).every((s) => s === 'External'))
        await capture('source-filters')
        await page.goBack()
        await page.waitForFunction(() => document.querySelector('[data-source-filter="all"]')?.getAttribute('aria-pressed') === 'true')
        await page.goForward()
        await page.waitForFunction(() => document.querySelector('[data-source-filter="External"]')?.getAttribute('aria-pressed') === 'true')
        await page.reload({ waitUntil: 'load' })
        await page.waitForFunction(() => document.querySelector('[data-source-filter="External"]')?.getAttribute('aria-pressed') === 'true')
        return { labels, persistedURL: page.url() }
      })

      for (const repo of ['hermes-minimax-media', 'hermes-stepfun-imagegen']) {
        await check(`article to project ${repo}`, async () => {
          await open(`blog/${repo}`)
          const link = page.locator(`a[data-interaction="article_project_link"][href$="#${repo}"]`)
          assert.equal(await link.count(), 1)
          await link.click()
          await page.waitForURL((url) => url.hash === `#${repo}`)
          const target = page.locator(`[id="${repo}"]`)
          assert.equal(await target.count(), 1)
          await target.waitFor({ state: 'visible' })
          await page.waitForFunction((id) => document.activeElement?.id === id, repo)
          assert.ok(await page.locator('[data-work-archive]').evaluate((e) => e.open))
          await settled(page)
          const titleBounds = await target.locator('h3').boundingBox()
          const viewport = page.viewportSize()
          assert.ok(titleBounds.y >= 0 && titleBounds.y < viewport.height, 'Project title should be in view, not merely present in DOM')
          await capture(repo)
          await open(`projects?q=stale-filter#${repo}`)
          await page.waitForFunction(() => new URL(location.href).searchParams.get('q') === null)
          await target.waitFor({ state: 'visible' })
          return { titleBounds, destination: page.url() }
        })
      }

      await check('both resume previews and PDF response', async () => {
        await open('en/resume')
        const previews = page.locator('[data-resume-preview]')
        assert.equal(await previews.count(), 2)
        const ids = await page.locator('[data-resume-dialog]').evaluateAll((es) => es.map((e) => e.id))
        assert.equal(new Set(ids).size, ids.length)
        for (let i = 0; i < 2; i++) {
          const preview = previews.nth(i)
          const trigger = preview.locator('[data-resume-trigger]')
          const dialog = preview.locator('[data-resume-dialog]')
          assert.equal(await preview.locator('iframe').getAttribute('src'), null)
          await trigger.press('Enter')
          await dialog.waitFor({ state: 'visible' })
          assert.equal(await page.locator('dialog[open]').count(), 1)
          assert.equal(await preview.locator('iframe').getAttribute('src'), '/loraSys/resume.pdf#view=FitH')
          await capture(`resume-preview-${i+1}`)
          if (i === 0) await preview.locator('[data-resume-close]').click()
          else await page.keyboard.press('Escape')
          await dialog.waitFor({ state: 'hidden' })
          assert.ok(await trigger.evaluate((e) => e === document.activeElement))
        }
        const pdf = await context.request.get(`${base}resume.pdf`)
        assert.equal(pdf.status(), 200)
        assert.ok((await pdf.body()).subarray(0, 5).toString() === '%PDF-')
        return { ids, pdfStatus: pdf.status() }
      })

      await check('light and dark visual surfaces', async () => {
        const details = []
        for (const route of ['', 'projects', 'blog', 'blog/ai-engineering-harness']) {
          await open(route)
          const metrics = await capture(route || 'home-stable')
          assert.ok(metrics.scrollWidth <= width + 1, `Horizontal overflow: ${route}`)
          assert.equal(metrics.brokenVisibleImages.length, 0, `Visible broken image: ${route}`)
          details.push({ route, ...metrics })
        }
        await open()
        await page.locator('#toggleDarkMode').click()
        await settled(page)
        await capture('theme-after-toggle')
        return details
      })
      await check('runtime errors', async () => {
        const errors = report.pageErrors.filter((e) => e.label === label)
        assert.deepEqual(errors, [])
      })
      await context.close()
    }
  }
} finally {
  report.finishedAt = new Date().toISOString()
  report.summary = { checks: report.checks.length, failures, screenshots: report.captures.length }
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
  await browser.close()
}
console.log(JSON.stringify(report.summary))
if (failures) process.exitCode = 1
