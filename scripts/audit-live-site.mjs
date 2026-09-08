import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const output = process.env.SITE_TEST_OUTPUT
await mkdir(output, { recursive: true })
const base = 'https://lora-sys.github.io/loraSys/'
const expectedIndexHash = '46111dc098393482ab7abb7e633f0511377ac13679e899a05ec89794ca837fae'
const report = { startedAt: new Date().toISOString(), target: base, deployedCommit: 'f376d3b673e793b9ce5e90f7304d538b96a7f2ac', expectedIndexHash, checks: [], captures: [], network: [], console: [], pageErrors: [] }
const save = () => writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
const browser = await chromium.launch({ headless: true })
let failures = 0
const safeName = (s) => s.replaceAll(/[^a-zA-Z0-9_-]/g, '-')

// Wait for observable rendered state with explicit deadlines. No animations or resources are mocked.
async function settle(page) {
  await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 10000 })
  await page.waitForFunction(() => [...document.images].filter((e) => {
    const r = e.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight
  }).every((e) => e.complete), null, { timeout: 10000 })
  await page.waitForFunction(() => !document.querySelector('[data-hero-scene]') || document.querySelector('[data-hero-scene]').dataset.heroReady === 'true', null, { timeout: 10000 })
  await page.waitForFunction(() => !document.getAnimations().some((a) => a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming().endTime)), null, { timeout: 6000 })
}

try {
  for (const width of [1440, 390]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const label = `${width}-${reducedMotion}`
      const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion, colorScheme: 'light' })
      const page = await context.newPage()
      page.setDefaultTimeout(15000)
      page.setDefaultNavigationTimeout(25000)
      page.on('pageerror', (e) => report.pageErrors.push({ label, url: page.url(), error: e.message }))
      page.on('console', (e) => { if (e.type() === 'error') report.console.push({ label, url: page.url(), error: e.text() }) })
      page.on('response', (r) => { if (r.status() >= 400 || r.url().includes('resume.pdf')) report.network.push({ label, url: r.url(), status: r.status() }) })
      page.on('requestfailed', (r) => report.network.push({ label, url: r.url(), failure: r.failure()?.errorText }))
      const open = async (route = '') => {
        console.log(`OPEN ${label} ${base}${route}`)
        const r = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' })
        assert.equal(r?.status(), 200)
        return r
      }
      const capture = async (name) => {
        await settle(page)
        const file = `${label}-${safeName(name)}.png`
        await page.screenshot({ path: path.join(output, file), timeout: 10000 })
        const metrics = await page.evaluate(() => {
          const rect = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, width: r.width, height: r.height, pageTop: r.top + scrollY } }
          const images = [...document.images].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && r.bottom > 0 && r.top < innerHeight })
          return { title: document.title, scrollY, scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, theme: document.documentElement.className, h1: rect(document.querySelector('h1')), banner: rect(document.querySelector('.page-visual-banner')), firstProject: rect(document.querySelector('[data-project-card]')), brokenVisibleImages: images.filter((e) => !e.naturalWidth).map((e) => e.currentSrc), visibleImages: images.length }
        })
        report.captures.push({ label, file, url: page.url(), metrics })
        await save()
        return metrics
      }
      const check = async (name, fn) => {
        console.log(`START ${label}: ${name}`)
        report.current = { label, name, startedAt: new Date().toISOString() }
        await save()
        try {
          const details = await fn()
          report.checks.push({ label, name, passed: true, details })
          console.log(`PASS ${label}: ${name}`)
          return true
        } catch (e) {
          failures++
          report.checks.push({ label, name, passed: false, error: String(e.stack ?? e) })
          console.error(`FAIL ${label}: ${name}: ${e.message}`)
          try { await page.screenshot({ path: path.join(output, `${label}-FAIL-${safeName(name)}.png`), timeout: 5000 }) } catch {}
          return false
        } finally { await save() }
      }
      const reached = await check('published revision', async () => {
        const r = await open()
        const body = await r.body()
        const hash = createHash('sha256').update(body).digest('hex')
        report.liveRevision = { receivedIndexHash: hash, headers: await r.allHeaders(), checkedAt: new Date().toISOString() }
        await writeFile(path.join(output, 'live-index.html'), body)
        assert.equal(hash, expectedIndexHash, 'Live HTML must match the deployed artifact')
        assert.equal(await page.locator('[data-resume-preview]').count(), 1)
        return { hash, url: page.url() }
      })
      if (!reached) { await context.close(); continue }
      await check('search results and mobile menu', async () => {
        const search = page.locator('.header-tools .search-link')
        await search.waitFor({ state: 'visible' })
        const bounds = await search.boundingBox()
        if (width < 900) {
          assert.ok(bounds.width >= 44 && bounds.height >= 44)
          const menu = page.locator('[data-menu-toggle]')
          await menu.press('Enter')
          await page.locator('[data-mobile-nav]').waitFor({ state: 'visible' })
          await capture('mobile-menu')
          await page.keyboard.press('Escape')
          await page.locator('[data-mobile-nav]').waitFor({ state: 'hidden' })
          assert.ok(await menu.evaluate((e) => e === document.activeElement))
        }
        await search.click()
        await page.waitForURL((u) => u.pathname.replace(/\/$/, '') === '/loraSys/search', { waitUntil: 'domcontentloaded' })
        // Pagefind renders type=text with enterkeyhint=search.
        const input = page.locator('.pagefind-ui__search-input')
        await input.fill('Harness')
        await page.locator('.pagefind-ui__result').first().waitFor({ state: 'visible' })
        await capture('search-results')
        const links = await page.locator('.pagefind-ui__result-link').evaluateAll((es) => es.map((e) => e.href))
        assert.ok(links.length > 0 && links.every((h) => new URL(h).pathname.startsWith('/loraSys/')))
        return { bounds, links }
      })
      await check('source filtering and history', async () => {
        await open('projects?q=loraSys')
        await page.waitForFunction(() => document.querySelector('[data-work-archive]')?.open === true)
        const visible = page.locator('[data-project-browser] [data-project-item]:not([hidden])')
        await page.waitForFunction(() => document.querySelectorAll('[data-project-browser] [data-project-item]:not([hidden])').length === 1)
        await visible.scrollIntoViewIfNeeded()
        await visible.locator('h3').waitFor({ state: 'visible' })
        assert.match(await visible.textContent(), /loraSys/i)
        await capture('lorasys-result')
        const labels = (await page.locator('[data-source-filter]').allTextContents()).map((s) => s.trim())
        assert.equal(new Set(labels).size, labels.length)
        assert.ok(labels.includes('外部贡献'))
        await page.locator('[data-project-search]').fill('no-match-live-audit-91827')
        await page.locator('[data-empty-state]').waitFor({ state: 'visible' })
        await page.locator('[data-filter-reset]').click()
        await page.locator('[data-source-filter="External"]').click()
        assert.ok(await visible.count() > 0)
        assert.ok((await visible.evaluateAll((es) => es.map((e) => e.dataset.source))).every((s) => s === 'External'))
        await capture('source-filters')
        await page.goBack({ waitUntil: 'domcontentloaded' })
        await page.waitForFunction(() => document.querySelector('[data-source-filter="all"]')?.getAttribute('aria-pressed') === 'true')
        await page.goForward({ waitUntil: 'domcontentloaded' })
        await page.waitForFunction(() => document.querySelector('[data-source-filter="External"]')?.getAttribute('aria-pressed') === 'true')
        return { labels, url: page.url() }
      })
      for (const repo of ['hermes-minimax-media', 'hermes-stepfun-imagegen']) {
        await check(`article to project ${repo}`, async () => {
          await open(`blog/${repo}`)
          const link = page.locator(`a[data-interaction="article_project_link"][href$="#${repo}"]`)
          assert.equal(await link.count(), 1)
          await link.click()
          await page.waitForURL((u) => u.hash === `#${repo}`, { waitUntil: 'domcontentloaded' })
          const target = page.locator(`[id="${repo}"]`)
          assert.equal(await target.count(), 1)
          await target.waitFor({ state: 'visible' })
          await page.waitForFunction((id) => document.activeElement?.id === id, repo)
          await page.waitForFunction((id) => { const e = document.getElementById(id)?.querySelector('h3'); if (!e) return false; const r = e.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight }, repo)
          await capture(repo)
          await open(`projects?q=stale-filter#${repo}`)
          await page.waitForFunction(() => new URL(location.href).searchParams.get('q') === null)
          await target.waitFor({ state: 'visible' })
          return { url: page.url(), bounds: await target.boundingBox() }
        })
      }
      await check('two resume previews and PDF', async () => {
        await open('en/resume')
        const previews = page.locator('[data-resume-preview]')
        assert.equal(await previews.count(), 2)
        const ids = await page.locator('[data-resume-dialog]').evaluateAll((es) => es.map((e) => e.id))
        assert.equal(new Set(ids).size, 2)
        for (let i = 0; i < 2; i++) {
          const preview = previews.nth(i), trigger = preview.locator('[data-resume-trigger]'), dialog = preview.locator('[data-resume-dialog]')
          assert.equal(await preview.locator('iframe').getAttribute('src'), null)
          await trigger.press('Enter')
          await dialog.waitFor({ state: 'visible' })
          assert.equal(await page.locator('dialog[open]').count(), 1)
          assert.equal(await preview.locator('iframe').getAttribute('src'), '/loraSys/resume.pdf#view=FitH')
          await capture(`resume-preview-${i+1}`)
          if (!i) await preview.locator('[data-resume-close]').click()
          else await page.keyboard.press('Escape')
          await dialog.waitFor({ state: 'hidden' })
          assert.ok(await trigger.evaluate((e) => e === document.activeElement))
        }
        const pdf = await context.request.get(`${base}resume.pdf`, { timeout: 15000 })
        assert.equal(pdf.status(), 200)
        assert.equal((await pdf.body()).subarray(0, 5).toString(), '%PDF-')
        return { ids, pdfStatus: pdf.status() }
      })
      await check('stable visual surfaces', async () => {
        const details = []
        for (const route of ['', 'projects', 'blog', 'blog/ai-engineering-harness']) {
          await open(route)
          const m = await capture(route || 'home-light')
          assert.ok(m.scrollWidth <= width + 1)
          assert.equal(m.brokenVisibleImages.length, 0)
          details.push({ route, ...m })
        }
        await open()
        for (let n = 0; n < 3; n++) {
          if (await page.locator('html').evaluate((e) => e.classList.contains('dark'))) break
          await page.locator('#toggleDarkMode').click()
          await page.waitForFunction(() => !document.documentElement.hasAttribute('data-theme-transition'))
        }
        assert.ok(await page.locator('html').evaluate((e) => e.classList.contains('dark')))
        await capture('home-dark')
        return details
      })
      await check('runtime errors', async () => assert.deepEqual(report.pageErrors.filter((e) => e.label === label), []))
      await context.close()
    }
  }
} finally {
  report.finishedAt = new Date().toISOString()
  report.summary = { checks: report.checks.length, failures, screenshots: report.captures.length }
  delete report.current
  await save()
  await browser.close()
}
console.log(JSON.stringify(report.summary))
if (failures) process.exitCode = 1
