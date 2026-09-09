import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// This test serves a local production build. It has no live-site write path.
const dist = path.resolve(process.argv[2] || 'dist')
const output = path.resolve(process.env.SITE_TEST_OUTPUT || '/tmp/lorasys-studio-v4', 'studio-v4')
await mkdir(output, { recursive: true })
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')
const report = { revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), startedAt: new Date().toISOString(), checks: [], pages: [], screenshots: [], accessibility: [] }
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.wasm': 'application/wasm', '.xml': 'application/xml' }
const base = '/loraSys/'
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return }
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith(base)) { res.writeHead(404); res.end(); return }
    let file = path.resolve(dist, decodeURIComponent(url.pathname.slice(base.length)))
    if (file !== dist && !file.startsWith(`${dist}${path.sep}`)) { res.writeHead(403); res.end(); return }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' })
    res.end(req.method === 'HEAD' ? undefined : await readFile(file))
  } catch { res.writeHead(404); res.end('Not found') }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const site = `http://127.0.0.1:${server.address().port}${base}`
const browser = await chromium.launch({ headless: true, channel: 'chromium' })
const save = () => writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
async function check(name, fn) {
  try { await fn(); report.checks.push({ name, passed: true }); console.log('PASS', name) }
  catch (error) { report.checks.push({ name, passed: false, error: String(error.stack) }); console.error('FAIL', name, error.message) }
  await save()
}
const pairs = [
  ['', 'en/'], ['projects/', 'en/work/'], ['blog/', 'en/writing/'],
  ['lab/', 'en/lab/'], ['lab/evidence-selection/', 'en/lab/evidence-selection/'],
  ['lab/evaluation-rules/', 'en/lab/evaluation-rules/'],
  ['projects/glassbox/', 'en/projects/glassbox/'], ['projects/zhihu-threads/', 'en/projects/zhihu-threads/'],
  ['projects/ai-engineering-harness/', 'en/projects/ai-engineering-harness/'],
  ['projects/agentarena/', 'en/projects/agentarena/'], ['collections/', 'en/collections/'],
  ['reading/', 'en/reading/'], ['about/', 'en/about/'], ['contact/', 'en/contact/'], ['now/', 'en/now/']
]
try {
  for (const width of [1440, 390, 768, 360]) {
    const height = width >= 768 ? 1000 : 844
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', colorScheme: 'light' })
    await context.route('**/*', route => {
      const request = route.request(), url = new URL(request.url())
      return ['GET', 'HEAD'].includes(request.method()) && (url.origin === new URL(site).origin || ['data:', 'blob:'].includes(url.protocol)) ? route.continue() : route.abort()
    })
    const page = await context.newPage()
    page.setDefaultTimeout(12000)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const open = async route => {
      const response = await page.goto(new URL(route, site).href, { waitUntil: 'load' })
      assert.equal(response.status(), 200)
      await page.evaluate(() => document.fonts.ready)
      return response
    }
    const capture = async (route, suffix = '', fullPage = false) => {
      const name = `${width}-${(route || 'home').replaceAll('/', '-').replaceAll('?', '-')}${suffix}.png`
      await page.screenshot({ path: path.join(output, name), fullPage, animations: 'disabled' })
      report.screenshots.push({ file: name, route, viewport: { width, height }, fullPage, suffix })
    }
    for (const route of pairs.flat()) {
      await check(`${width}: ${route || 'home'} layout and language`, async () => {
        const response = await open(route)
        const state = await page.evaluate(() => {
          const ids = [...document.querySelectorAll('[id]')].map(el => el.id)
          const leaves = [...document.querySelectorAll('main *')].filter(el => !el.children.length && !el.closest('script,style,pre,code,svg,[aria-hidden="true"]') && el.getBoundingClientRect().height > 0)
          return {
            lang: document.documentElement.lang,
            h1: document.querySelectorAll('h1').length,
            overflow: document.documentElement.scrollWidth - innerWidth,
            duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
            han: leaves.filter(el => /[\u3400-\u9fff]/.test(el.textContent) && !el.closest('[lang]')?.getAttribute('lang').startsWith('zh')).map(el => el.textContent.trim()),
            badImages: [...document.images].filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0 && img.complete && img.naturalWidth === 0).map(img => img.src)
          }
        })
        report.pages.push({ route, width, ...state, sha256: createHash('sha256').update(await response.body()).digest('hex') })
        assert.equal(state.h1, 1)
        assert.ok(state.overflow <= 1, `Horizontal overflow: ${state.overflow}`)
        assert.deepEqual(state.duplicateIds, [])
        assert.deepEqual(state.badImages, [])
        assert.ok(state.lang.startsWith(route.startsWith('en/') ? 'en' : 'zh'))
        if (route.startsWith('en/')) assert.deepEqual(state.han, [], 'Unmarked Chinese UI')
        if (width === 1440 || width === 390) await capture(route)
      })
    }
    for (const prefix of ['', 'en/']) {
      await check(`${width}/${prefix}: all source combinations and keyboard reset`, async () => {
        const route = `${prefix}lab/evidence-selection/`
        await open(route)
        const checks = page.locator('[data-source-id]')
        assert.equal(await checks.count(), 3)
        for (let mask = 0; mask < 8; mask++) {
          for (let i = 0; i < 3; i++) await checks.nth(i).setChecked(Boolean(mask & (1 << i)))
          const states = await page.locator('[data-source-node]').evaluateAll(nodes => nodes.map(node => node.dataset.supported === 'true'))
          assert.deepEqual(states, [Boolean(mask & 1), Boolean(mask & 2), (mask & 3) === 3, Boolean(mask & 4)])
          assert.equal(await page.locator('[data-source-node]:visible').count(), 4)
        }
        await page.locator('[data-source-reset]').press('Enter')
        assert.equal(await checks.nth(0).isChecked(), true)
        assert.equal(await checks.nth(1).isChecked(), true)
        assert.equal(await checks.nth(2).isChecked(), false)
        await checks.nth(1).press('Space')
        assert.equal(await page.locator('[data-source-node][data-supported="true"]').count(), 1)
        if (width === 390 || width === 1440) await capture(route, '-missing-evidence', true)
      })
      await check(`${width}/${prefix}: rule changes leave four outputs unchanged`, async () => {
        const route = `${prefix}lab/evaluation-rules/`
        await open(route)
        const before = await page.locator('.eval-record-body').allTextContents()
        assert.equal(await page.locator('[data-eval-total]').innerText(), '3 / 4')
        await page.locator('[data-eval-rule="strict"]').press('Enter')
        assert.equal(await page.locator('[data-eval-total]').innerText(), '1 / 4')
        assert.equal(await page.locator('[data-eval-record][data-passed="true"]').count(), 1)
        for (const summary of await page.locator('[data-eval-record] summary').all()) await summary.press('Enter')
        assert.equal(await page.locator('[data-eval-record][open]').count(), 4)
        assert.deepEqual(await page.locator('.eval-record-body').allTextContents(), before)
        if (width === 390 || width === 1440) await capture(route, '-strict', true)
        await page.locator('[data-eval-reset]').press('Enter')
        assert.equal(await page.locator('[data-eval-total]').innerText(), '3 / 4')
      })
      await check(`${width}/${prefix}: trace navigation and boundaries`, async () => {
        await open(`${prefix}projects/glassbox/`)
        const root = page.locator('[data-trace-viewer]')
        assert.equal(await root.locator('[data-trace-prev]').isDisabled(), true)
        for (let i = 1; i < 4; i++) {
          await root.locator('[data-trace-next]').press('Enter')
          assert.equal(await root.locator('[data-trace-panel]:visible').getAttribute('data-trace-panel'), String(i))
        }
        assert.equal(await root.locator('[data-trace-next]').isDisabled(), true)
        await root.locator('[data-trace-step="0"]').press('Enter')
        assert.equal(await root.locator('[data-trace-panel]:visible').getAttribute('data-trace-panel'), '0')
      })
      await check(`${width}/${prefix}: shelf filter retains records`, async () => {
        await open(`${prefix}collections/`)
        const total = await page.locator('[data-shelf-item]').count()
        const anime = await page.locator('[data-shelf-item="anime"]').count()
        await page.locator('[data-shelf-filter="anime"]').press('Enter')
        assert.equal(await page.locator('[data-shelf-item]:visible').count(), anime)
        await page.locator('[data-shelf-filter="favorites"]').press('Enter')
        assert.equal(await page.locator('[data-shelf-item]:visible').count(), total - anime)
        await page.locator('[data-shelf-filter="all"]').press('Enter')
        assert.equal(await page.locator('[data-shelf-item]:visible').count(), total)
      })
      await check(`${width}/${prefix}: four cases and all archive records retained`, async () => {
        const work = prefix ? 'en/work/' : 'projects/'
        await open(work)
        assert.equal(await page.locator('[data-project-card]').count(), 4)
        const snapshot = JSON.parse(await readFile('src/data/github-projects.json', 'utf8'))
        assert.equal(await page.locator('[data-project-item]').count(), Object.keys(snapshot.projects).length)
        await open(`${work}?q=not-matching-any-project#zhihu-threads`)
        await page.locator('#zhihu-threads').waitFor({ state: 'visible' })
        assert.equal(await page.locator('[data-work-archive]').evaluate(el => el.open), true)
        assert.equal(await page.locator('[data-project-search]').inputValue(), '')
        await page.locator('[data-project-search]').fill('hermes-minimax-media')
        assert.equal(await page.locator('[data-project-item]:visible').count(), 1)
        await page.locator('[data-filter-reset]').press('Enter')
        assert.equal(await page.locator('[data-project-item]:visible').count(), Object.keys(snapshot.projects).length)
      })
    }
    if (width === 1440 || width === 390) {
      for (const route of ['lab/evidence-selection/', 'en/lab/evaluation-rules/', 'collections/', 'en/about/']) {
        await check(`${width}: ${route} dark contrast and reduced motion`, async () => {
          await page.evaluate(() => localStorage.setItem('theme', 'dark'))
          await open(route)
          await page.waitForFunction(() => document.documentElement.classList.contains('dark'))
          if (process.env.AXE_PATH) {
            await page.addScriptTag({ path: process.env.AXE_PATH })
            const result = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }))
            const violations = result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))
            report.accessibility.push({ route, width, theme: 'dark', violations })
            assert.deepEqual(violations.filter(v => ['serious', 'critical'].includes(v.impact)), [])
          }
          assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0)
          await capture(route, '-dark')
        })
      }
    }
    await check(`${width}: no application exceptions`, async () => assert.deepEqual(errors, []))
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
  report.completedAt = new Date().toISOString()
  await save()
}
const failed = report.checks.filter(item => !item.passed).length
console.log(JSON.stringify({ checks: report.checks.length, failed, output }))
if (failed) process.exitCode = 1
