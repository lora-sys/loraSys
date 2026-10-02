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
const fontPreloads = [...home.matchAll(/<link\b[^>]*>/g)]
  .map(([tag]) => attributes(tag))
  .filter((tag) => tag.rel === 'preload' && tag.as === 'font')
assert.equal(fontPreloads.length, 2, 'Preload both normal Satoshi weights before first paint')
report.checks.push({ name: 'Satoshi font preloads', passed: true, count: fontPreloads.length })
const projectHtml = await readFile(path.join(dist, 'projects/index.html'), 'utf8')
const archiveStart = projectHtml.search(/<details\b[^>]*\bdata-work-archive(?:[\s=>])/i)
assert.ok(archiveStart >= 0, 'Projects page must contain the archive disclosure')
const archivedProjects = projectHtml.slice(archiveStart)
assert.ok(!/<img\b[^>]*loading="eager"/.test(archivedProjects), 'Collapsed project archive must not eagerly load a duplicate hero')
report.checks.push({ name: 'collapsed archive image loading', passed: true })
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
  await check('Collection original links work without JavaScript in both languages', async () => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
    try {
      await context.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort())
      const page = await context.newPage()
      const expected = [
        'https://www.youtube.com/watch?v=Sy7cLG6XHRY',
        'https://www.youtube.com/watch?v=nLdeQHeuHck',
        'https://open.spotify.com/track/2RGoMak3qjAjMfR0duV2Dp',
        'https://www.bilibili.com/video/BV1oH4y1c7Kk/'
      ]
      for (const route of ['', 'en/']) {
        await page.goto(`${origin}${base}${route}`, { waitUntil: 'load' })
        assert.equal(await page.locator('[data-archive-card]').count(), 16)
        const links = page.locator('[data-media-direct]')
        assert.deepEqual(await links.evaluateAll((elements) => elements.map((element) => element.href)), expected)
        for (const link of await links.all()) {
          await link.scrollIntoViewIfNeeded()
          assert.equal(await link.isVisible(), true)
          assert.equal(await link.getAttribute('target'), '_blank')
          assert.ok((await link.getAttribute('rel')).includes('noopener'))
          assert.equal(await link.evaluate((element) => Boolean(element.parentElement.closest('a'))), false, 'Media links must never nest inside card links')
          assert.ok(await link.getAttribute('aria-label'))
        }
        assert.equal(await page.locator('[data-archive-viewer] iframe[src]').count(), 0)
      }
    } finally { await context.close() }
  })
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
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
        // Keep actionability checks deterministic when the site uses smooth scrolling
        // together with scroll-linked transforms. The interaction assertions below
        // still exercise the same controls and focus behavior.
        await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })
      }
      const capture = async (name) => {
        const filename = `${label}-${name}.png`
        await page.screenshot({ path: path.join(evidence, filename), fullPage: false, animations: 'disabled' })
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

      await check(`${label}: paper scene is bounded, pausable and motion safe`, async () => {
        await open()
        const scene = page.locator('[data-paper-scene]')
        const camera = page.locator('[data-scene-camera]')
        const toggle = page.locator('[data-scene-motion]')
        await scene.waitFor({state: 'visible'})
        await page.waitForFunction(() => [...document.querySelectorAll('[data-paper-scene] img')].every(image => image.complete && image.naturalWidth > 0))
        assert.equal(await scene.locator('canvas').count(), 0, 'Paper scene remains dependency-free CSS perspective')
        assert.equal(await page.locator('.home-hero h1').count(), 1, 'Main title remains HTML')
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Paper scene cannot create horizontal overflow')
        if (reducedMotion === 'reduce' || viewport.width <= 900) {
          assert.equal(await toggle.isVisible(), false)
          assert.equal(await scene.getAttribute('data-motion'), 'static')
          assert.equal(await camera.evaluate(element => getComputedStyle(element).transform), 'none')
        } else {
          await toggle.waitFor({state: 'visible'})
          const box = await scene.boundingBox()
          await page.mouse.move(box.x + box.width * .8, box.y + box.height * .4)
          await page.waitForFunction(() => document.querySelector('[data-scene-camera]').style.getPropertyValue('--scene-x') !== '')
          const angle = await camera.evaluate(element => parseFloat(element.style.getPropertyValue('--scene-x')))
          assert.ok(Math.abs(angle) <= 4, 'Pointer angle must stay bounded')
          await toggle.press('Enter')
          assert.equal(await toggle.getAttribute('aria-pressed'), 'true')
          assert.equal(await scene.getAttribute('data-motion'), 'static')
          assert.equal(await camera.evaluate(element => element.style.getPropertyValue('--scene-x')), '')
          await page.reload()
          assert.equal(await toggle.getAttribute('aria-pressed'), 'true', 'Pause survives navigation')
          await toggle.press('Enter')
          await page.locator('#writing').scrollIntoViewIfNeeded()
          await page.waitForFunction(() => document.querySelector('[data-paper-scene]').dataset.motion === 'static')
        }
        await open()
        await capture('paper-depth')
      })

      await check(`${label}: homepage evidence and keyboard section navigation`, async () => {
        await open()
        const workEvidence = page.locator('#work .section-meta')
        assert.equal(await workEvidence.locator('[data-evidence-kind="verified"]').count(), 1, 'Selected work should retain its evidence label')
        const syncedAt = await workEvidence.locator('time').getAttribute('datetime')
        assert.match(syncedAt ?? '', /^\d{4}-\d{2}-\d{2}$/, 'Selected work should expose its snapshot date')
        assert.ok(Number.isFinite(Date.parse(syncedAt)), 'Snapshot date must be valid')
        assert.equal(await page.locator('#writing .section-meta [data-evidence-kind="field-note"]').count(), 1, 'Writing should keep its distinct evidence label')
        assert.equal(await page.locator('.scroll-rail').count(), 0, 'Homepage should not duplicate the header scroll progress')
        assert.equal(await page.locator('[data-site-header]').count(), 1, 'Homepage should retain one consistent navigation header')
        for (const id of ['work', 'writing']) {
          const link = page.locator(`.hero-actions a[href$="#${id}"]`)
          await link.press('Enter')
          await page.waitForURL((url) => url.hash === `#${id}`)
          await page.waitForFunction((sectionId) => {
            const heading = document.querySelector(`#${sectionId} h2`)
            const header = document.querySelector('[data-site-header]')
            if (!heading || !header) return false
            const bounds = heading.getBoundingClientRect()
            return bounds.top >= header.getBoundingClientRect().bottom && bounds.top < innerHeight
          }, id)
        }
      })

      await check(`${label}: Now separates reviewed focus from automatic snapshots`, async () => {
        await open('now')
        assert.equal(await page.locator('[data-freshness-status]').count(), 1)
        assert.equal(await page.locator('[data-information-origin="human"]').count(), 1)
        assert.equal(await page.locator('[data-information-origin="automatic"]').count(), 2)
      })

      await check(`${label}: featured writing exposes project context`, async () => {
        await open('blog')
        assert.ok(await page.locator('.related-context').count() > 0, 'Featured writing should surface related projects when curated links exist')
      })

      await check(`${label}: lead project demo and keyboard project navigation`, async () => {
        await open()
        const stage = page.locator('#work .lead-project-stage')
        assert.equal(await stage.locator('[data-project-card]').count(), 1, 'Lead project should contain one project card')
        await stage.scrollIntoViewIfNeeded()
        const accept = stage.locator('[data-review-decision="accept"]')
        const rework = stage.locator('[data-review-decision="rework"]')
        await accept.press('Enter')
        assert.equal(await stage.locator('[data-review-status]').textContent(), 'Task · DONE')
        assert.equal(await accept.getAttribute('aria-pressed'), 'true')
        await rework.press('Enter')
        assert.equal(await stage.locator('[data-review-status]').textContent(), 'Review · REWORK')
        assert.equal(await rework.getAttribute('aria-pressed'), 'true')
        assert.equal(await accept.getAttribute('aria-pressed'), 'false')
        assert.equal(await stage.locator('[data-review-result="accept"]').isVisible(), false)
        assert.equal(await stage.locator('[data-review-result="rework"]').isVisible(), true)
        const projectLink = stage.locator('[data-interaction="project_website"]')
        const repository = await projectLink.getAttribute('data-destination')
        assert.ok(repository, 'Lead project link should identify its repository')
        assert.equal(await projectLink.getAttribute('href'), `${base}projects#${repository}`)
        const source = stage.locator('[data-interaction="project_source"]')
        assert.equal(new URL(await source.getAttribute('href')).hostname, 'github.com')
        assert.equal(await source.getAttribute('target'), '_blank')
        assert.match(await source.getAttribute('rel'), /(?:^|\s)noopener(?:\s|$)/)
        await projectLink.press('Enter')
        await page.waitForURL((url) => url.hash === `#${repository}` && url.pathname.replace(/\/$/, '') === `${base}projects`)
        const target = page.locator(`[id="${repository}"]`)
        assert.equal(await target.count(), 1, 'Lead project destination must be unique')
        await target.waitFor({ state: 'visible' })
        await page.waitForFunction((id) => {
          const target = document.getElementById(id)
          if (!target) return false
          const bounds = target.getBoundingClientRect()
          return bounds.top >= 0 && bounds.top < innerHeight && bounds.bottom > 0
        }, repository)
      })

      await check(`${label}: Anime Archive opens and returns from its keyboard-accessible viewer`, async () => {
        await open()
        const shelf = page.locator('[data-showcase-id="anime"]')
        const trigger = shelf.locator('[data-viewer-trigger]').first()
        await trigger.scrollIntoViewIfNeeded()
        assert.equal(await trigger.getAttribute('aria-haspopup'), 'dialog')
        await trigger.press('Enter')
        const viewer = page.locator('[data-archive-viewer]')
        await viewer.waitFor({ state: 'visible' })
        assert.equal(await viewer.evaluate((element) => element.open), true)
        assert.ok(await viewer.locator('[data-viewer-close]').evaluate((element) => element === document.activeElement), 'Opening the viewer should focus its close button')
        assert.ok(await viewer.locator('[data-viewer-image]').getAttribute('alt'), 'Archive poster needs alt text')
        assert.equal(await viewer.locator('[data-viewer-image]').evaluate((element) => getComputedStyle(element).objectFit), 'contain', 'Archive posters should remain uncropped')
        assert.equal(await viewer.locator('[data-viewer-status]').getAttribute('role'), 'status')
        assert.equal(await viewer.locator('.viewer-artwork').count(), 1, 'Archive viewer needs a dedicated artwork panel around the uncropped poster')
        assert.equal(await viewer.getAttribute('aria-labelledby'), 'archive-viewer-title', 'Archive dialog must be named by its visible title')
        assert.equal(await viewer.locator('[data-viewer-detail]').getAttribute('href'), await trigger.getAttribute('href'), 'Viewer details should retain the originating card destination')
        assert.equal(await viewer.locator('[data-viewer-prev]').isDisabled(), true)
        const initial = await viewer.locator('[data-viewer-count]').textContent()
        const secondTitle = (await shelf.locator('[data-archive-card] [data-viewer-trigger] h3').nth(1).textContent()).trim()
        await page.keyboard.press('ArrowRight')
        assert.notEqual(await viewer.locator('[data-viewer-count]').textContent(), initial, 'Arrow navigation should change the archive item')
        assert.equal(await viewer.locator('[data-viewer-title]').textContent(), secondTitle)
        assert.equal(await viewer.locator('[data-viewer-prev]').isDisabled(), false)
        await page.keyboard.press('ArrowLeft')
        assert.equal(await viewer.locator('[data-viewer-count]').textContent(), initial, 'Left arrow should return to the first item')
        await page.keyboard.press('Escape')
        await viewer.waitFor({ state: 'hidden' })
        await page.waitForFunction((element) => element === document.activeElement, await trigger.elementHandle())
        assert.ok(await trigger.evaluate((element) => element === document.activeElement), 'Closing the viewer should restore focus to the originating card')
        if (reducedMotion === 'reduce') {
          assert.equal(await shelf.locator('[data-track]').evaluate((element) => getComputedStyle(element).scrollBehavior), 'auto', 'Reduced motion should disable smooth archive scrolling')
        }
      })

      await check(`${label}: official trailer stays optional and never outlives its archive item`, async () => {
        await open()
        const cards = page.locator('[data-showcase-id="anime"] [data-archive-card]')
        const videoIds = await cards.evaluateAll((elements) => elements.map((element) => element.dataset.videoId ?? ''))
        const videoIndex = videoIds.findIndex((id, index) => id && index + 1 < videoIds.length && !videoIds[index + 1])
        assert.ok(videoIndex >= 0, 'Archive should provide a verified trailer followed by a poster-only item to exercise media changes')
        const trigger = cards.nth(videoIndex).locator('[data-viewer-trigger]')
        await trigger.scrollIntoViewIfNeeded()
        await trigger.click()
        const viewer = page.locator('[data-archive-viewer]')
        await viewer.waitFor({ state: 'visible' })
        const player = viewer.locator('[data-viewer-player]')
        const playButton = viewer.locator('[data-viewer-play]')
        // The viewer retains an empty iframe and only assigns its source on request.
        assert.equal(await player.getAttribute('src'), null, 'Archive viewer must not load media before activation')
        assert.equal(await player.isVisible(), false)
        assert.equal(await playButton.isVisible(), true, 'A verified trailer must offer an explicit play control')
        await viewer.locator('[data-viewer-next]').click()
        assert.equal(await playButton.isVisible(), false, 'Items without a verified video must hide the trailer control')
        assert.equal(await viewer.locator('[data-viewer-media]').isVisible(), false)
        assert.equal(await player.getAttribute('src'), null)
        await viewer.locator('[data-viewer-prev]').click()
        await playButton.click()
        await player.waitFor({ state: 'visible' })
        assert.equal(await player.getAttribute('src'), `https://www.youtube.com/embed/${videoIds[videoIndex]}?autoplay=0&rel=0`)
        assert.equal(await viewer.locator('iframe[src]').count(), 1, 'Only one player may be active')
        assert.equal(await playButton.isVisible(), false)
        await viewer.locator('[data-viewer-next]').click()
        assert.equal(await player.getAttribute('src'), null, 'Changing archive items must unload the previous player')
        assert.equal(await player.isVisible(), false)
        await viewer.locator('[data-viewer-prev]').click()
        await playButton.click()
        await player.waitFor({ state: 'visible' })
        assert.ok(await player.getAttribute('src'), 'Replaying the trailer should load it again')
        await viewer.locator('[data-viewer-close]').click()
        await viewer.waitFor({ state: 'hidden' })
        await page.waitForFunction(() => {
          const player = document.querySelector('[data-archive-viewer] [data-viewer-player]')
          return player instanceof HTMLIFrameElement && !player.hasAttribute('src') && player.hidden
        })
        assert.equal(await viewer.locator('iframe[src], audio, video').count(), 0, 'Closing the viewer must leave no loaded player behind')
        assert.ok(await trigger.evaluate((element) => element === document.activeElement), 'Closing the viewer should restore focus after video playback')
      })

      await check(`${label}: collection media sources and external-only Bilibili`, async () => {
        await open()
        const favorites = page.locator('[data-showcase-id="favorites"]')
        const cards = favorites.locator('[data-archive-card]')
        assert.equal(await cards.count(), 5, 'All five favorites must remain')
        assert.ok((await cards.nth(3).locator('img').getAttribute('src')).endsWith('/images/favorites/bitcoin-mark.webp'), 'Bitcoin must use the corrected BTC illustration')
        const wukong = cards.filter({ has: page.locator('[data-viewer-trigger]') }).nth(4)
        await wukong.locator('[data-viewer-trigger]').click()
        const viewer = page.locator('[data-archive-viewer]')
        await viewer.waitFor({ state: 'visible' })
        assert.equal(await viewer.locator('[data-viewer-original]').getAttribute('href'), 'https://www.bilibili.com/video/BV1oH4y1c7Kk/')
        assert.equal(await viewer.locator('[data-viewer-play]').isVisible(), false, 'Bilibili must remain external-only without the new frame host')
        assert.equal(await viewer.locator('iframe[src]').count(), 0)
        assert.equal(await viewer.locator('[data-media-checked]').textContent(), '2026-10-02')
        assert.ok((await viewer.locator('[data-media-source]').textContent()).includes('Game Science'))
        await viewer.locator('[data-viewer-close]').click()
        await cards.nth(2).locator('[data-viewer-trigger]').click()
        await viewer.waitFor({ state: 'visible' })
        assert.equal(await viewer.locator('[data-viewer-original]').getAttribute('href'), 'https://open.spotify.com/track/2RGoMak3qjAjMfR0duV2Dp')
        assert.equal(await viewer.locator('iframe[src]').count(), 0, 'Spotify must also wait for activation')
        await viewer.locator('[data-viewer-play]').click()
        assert.ok((await viewer.locator('[data-viewer-player]').getAttribute('src')).startsWith('https://open.spotify.com/embed/track/'))
        await viewer.locator('[data-viewer-stop]').click()
        assert.equal(await viewer.locator('iframe[src]').count(), 0, 'Stop must unload the player')
        assert.equal(await viewer.locator('[data-viewer-play]').isVisible(), true)
        await viewer.locator('[data-viewer-close]').click()
      })

      await check(`${label}: English media dialog repeat activation Tab and history`, async () => {
        await open('en/')
        const trigger = page.locator('[data-showcase-id="anime"] [data-viewer-trigger]').first()
        const viewer = page.locator('[data-archive-viewer]')
        const initialOverflow = await page.evaluate(() => document.documentElement.style.overflow)
        await trigger.evaluate((element) => { element.click(); element.click() })
        await viewer.waitFor({ state: 'visible' })
        assert.equal(await viewer.locator('[data-viewer-play]').textContent(), 'Load YouTube player')
        assert.match(await viewer.locator('[data-media-title]').textContent(), /official trailer/)
        assert.match(await viewer.locator('[data-media-source]').textContent(), /KADOKAWAanime/)
        assert.equal(await viewer.locator('iframe[src]').count(), 0)
        await viewer.locator('[data-viewer-close]').focus()
        await page.keyboard.press('Shift+Tab')
        assert.ok(await viewer.locator('[data-viewer-next]').evaluate((element) => element === document.activeElement), 'Shift+Tab from the first control must wrap to the last enabled visible control')
        await page.keyboard.press('Tab')
        assert.ok(await viewer.locator('[data-viewer-close]').evaluate((element) => element === document.activeElement), 'Tab from the last control must wrap to Close')
        for (let n = 0; n < 14; n++) {
          await page.keyboard.press('Tab')
          assert.ok(await viewer.evaluate((element) => element.contains(document.activeElement)), 'Tab must stay inside the modal')
        }
        await page.keyboard.press('Escape')
        await viewer.waitFor({ state: 'hidden' })
        assert.equal(await page.evaluate(() => document.documentElement.style.overflow), initialOverflow, 'Repeated activation must not leave scroll locked')
        assert.ok(await trigger.evaluate((element) => element === document.activeElement))
        await trigger.click()
        await viewer.locator('[data-viewer-play]').click()
        const rapidCycle = await trigger.evaluate((element) => {
          const dialog = document.querySelector('[data-archive-viewer]')
          const close = dialog.querySelector('[data-viewer-close]')
          const play = dialog.querySelector('[data-viewer-play]')
          return new Promise((resolve) => {
            let closedState
            dialog.addEventListener('close', () => resolve({
              closedState,
              reopened: dialog.open,
              overflow: document.documentElement.style.overflow,
              loadedPlayers: dialog.querySelectorAll('iframe[src]').length
            }), { once: true })
            close.click()
            close.click()
            closedState = {
              open: dialog.open,
              overflow: document.documentElement.style.overflow,
              loadedPlayers: dialog.querySelectorAll('iframe[src]').length,
              focusRestored: document.activeElement === element
            }
            element.click()
            play.click()
          })
        })
        assert.deepEqual(rapidCycle.closedState, { open: false, overflow: initialOverflow, loadedPlayers: 0, focusRestored: true }, 'Repeated close must clean up synchronously')
        assert.equal(rapidCycle.reopened, true, 'A queued close event must not dismiss the reopened dialog')
        assert.equal(rapidCycle.overflow, 'hidden', 'A queued close event must not unlock an open dialog')
        assert.equal(rapidCycle.loadedPlayers, 1, 'A queued close event must not unload the new player')
        await viewer.locator('[data-viewer-next]').click()
        assert.equal(await viewer.locator('[data-viewer-title]').textContent(), 'Maison Ikkoku', 'The reopened session must retain its card inventory')
        await viewer.locator('[data-viewer-close]').click()
        assert.equal(await page.evaluate(() => document.documentElement.style.overflow), initialOverflow)
        await trigger.click()
        await viewer.locator('[data-viewer-play]').click()
        assert.equal(await viewer.locator('iframe[src]').count(), 1)
        await page.goto(`${origin}${base}en/work/`, { waitUntil: 'load' })
        await page.goBack({ waitUntil: 'load' })
        assert.equal(await page.locator('[data-archive-viewer]').evaluate((element) => element.open), false, 'Back must not restore a playing modal')
        assert.equal(await page.locator('[data-archive-viewer] iframe[src]').count(), 0)
        assert.notEqual(await page.evaluate(() => document.documentElement.style.overflow), 'hidden')
        await page.goForward({ waitUntil: 'load' })
        assert.ok(page.url().includes('/en/work'))
      })

      await check(`${label}: source labels filtering empty state and browser history`, async () => {
        await open('projects?q=loraSys')
        const archive = page.locator('[data-work-archive]')
        await page.waitForFunction(() => document.querySelector('[data-work-archive]')?.open === true)
        const items = page.locator('[data-project-browser] [data-project-item]:not([hidden])')
        await page.waitForFunction(() => document.querySelectorAll('[data-project-browser] [data-project-item]:not([hidden])').length === 1)
        // Archive rows use content-visibility:auto. Scroll to the result as a reader
        // would before asserting innerText, which excludes skipped offscreen content.
        await items.scrollIntoViewIfNeeded()
        await items.locator('h3').waitFor({ state: 'visible' })
        await page.waitForFunction(() => {
          const result = document.querySelector('[data-project-browser] [data-project-item]:not([hidden])')
          return result instanceof HTMLElement && /loraSys/i.test(result.innerText)
        })
        assert.match(await items.innerText(), /loraSys/i)
        await capture('lorasys-result')
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
        const visibleSources = await items.evaluateAll((elements) => elements.map((element) => element.dataset.source))
        assert.ok(visibleSources.length > 0, 'External filter should retain matching contributions')
        assert.ok(visibleSources.every((source) => source === 'External'))
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
  await check('mobile DPR 1.75: responsive hero sources retain pixel coverage', async () => {
    const context = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, reducedMotion: 'reduce' })
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort())
    const page = await context.newPage()
    try {
      for (const [route, selectors] of [
        ['', [['.scene-paper img', 720], ['.hero-figure img', 480]]],
        ['projects', [['.project-card--lead [data-project-poster]', 640]]],
        ['en/work', [['.project-card--lead [data-project-poster]', 640]]]
      ]) {
        await page.goto(`${origin}${base}${route}`, { waitUntil: 'load' })
        await page.evaluate(() => document.fonts.ready)
        for (const [selector, maximumWidth] of selectors) {
          const image = page.locator(selector).first()
          await image.scrollIntoViewIfNeeded()
          await page.waitForFunction(selector => {
            const image = document.querySelector(selector)
            return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
          }, selector)
          const measurement = await image.evaluate(image => {
            const selected = image.srcset.split(',').map(candidate => candidate.trim().split(/\s+/)).find(([url]) => new URL(url, location.href).href === image.currentSrc)
            return { currentSrc: image.currentSrc, selectedWidth: selected ? Number.parseInt(selected[1], 10) : 0, renderedWidth: image.getBoundingClientRect().width, dpr: devicePixelRatio, sizes: image.sizes }
          })
          assert.ok(measurement.selectedWidth >= Math.ceil(measurement.renderedWidth * measurement.dpr), `${route} ${selector}: source must cover rendered pixels at the emulated DPR: ${JSON.stringify(measurement)}`)
          assert.ok(measurement.selectedWidth <= maximumWidth, `${route} ${selector}: select the closer responsive candidate: ${JSON.stringify(measurement)}`)
          report.checks.push({ name: `${route || 'home'} ${selector}: responsive source`, passed: true, measurement })
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route}: image sizing must not cause overflow`)
        const filename = `412-dpr175-${route.replaceAll('/', '-') || 'home'}-responsive-source.png`
        await page.screenshot({ path: path.join(evidence, filename), animations: 'disabled' })
        report.screenshots.push(filename)
      }
    } finally { await context.close() }
  })
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
  await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2))
}
console.log(JSON.stringify({ checks: report.checks.length, failures: errors.length, evidence }, null, 2))
if (errors.length) process.exitCode = 1
