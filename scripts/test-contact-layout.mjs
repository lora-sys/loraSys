import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const output = path.resolve(process.env.SITE_TEST_OUTPUT || '/tmp/lorasys-contact-layout', 'contact-layout')
await mkdir(output, { recursive: true })
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff' }

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith('/loraSys/')) { res.writeHead(404); res.end(); return }
    let file = path.resolve(dist, decodeURIComponent(url.pathname.slice('/loraSys/'.length)))
    if (file !== dist && !file.startsWith(`${dist}${path.sep}`)) { res.writeHead(403); res.end(); return }
    const info = await stat(file)
    if (info.isDirectory()) file = path.join(file, 'index.html')
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' })
    res.end(await readFile(file))
  } catch { res.writeHead(404); res.end('Not found') }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}/loraSys/`
const browser = await chromium.launch({ headless: true, channel: 'chromium' })

try {
  for (const viewport of [
    { name: 'desktop-1440', width: 1440, height: 1000 },
    { name: 'reported-872', width: 872, height: 700 },
    { name: 'mobile-390', width: 390, height: 844 }
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', colorScheme: 'light' })
    await context.route('**/*', route => {
      const requestUrl = new URL(route.request().url())
      if (requestUrl.origin === new URL(base).origin && ['GET', 'HEAD'].includes(route.request().method())) route.continue()
      else route.abort()
    })
    const page = await context.newPage()
    const response = await page.goto(new URL('contact/', base).href, { waitUntil: 'load' })
    assert.equal(response.status(), 200)
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.contact-intro').scrollIntoViewIfNeeded()
    await page.locator('.contact-visual').evaluate(async image => {
      if (image instanceof HTMLImageElement && !image.complete) await new Promise(resolve => image.addEventListener('load', resolve, { once: true }))
    })

    const metrics = await page.evaluate(() => {
      const intro = document.querySelector('.contact-intro').getBoundingClientRect()
      const title = document.querySelector('.contact-intro h2').getBoundingClientRect()
      const visual = document.querySelector('.contact-visual').getBoundingClientRect()
      const style = getComputedStyle(document.querySelector('.contact-visual'))
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        intro: { left: intro.left, right: intro.right, top: intro.top, bottom: intro.bottom },
        title: { left: title.left, right: title.right, top: title.top, bottom: title.bottom },
        visual: { left: visual.left, right: visual.right, top: visual.top, bottom: visual.bottom },
        mask: style.maskImage || style.webkitMaskImage || ''
      }
    })
    assert.ok(metrics.overflow <= 1, `${viewport.name}: page must not overflow horizontally`)
    if (viewport.width > 620) {
      assert.ok(metrics.title.right < metrics.intro.right - metrics.intro.right * 0.02, `${viewport.name}: title must remain inside card`)
      assert.ok(metrics.mask.includes('linear-gradient'), `${viewport.name}: artwork must retain the protective fade`)
    } else {
      assert.ok(metrics.visual.top >= metrics.title.bottom, `${viewport.name}: mobile artwork must sit below the title`)
    }
    await page.screenshot({ path: path.join(output, `${viewport.name}.png`), animations: 'disabled' })
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
