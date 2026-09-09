import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve('dist')
const out = path.resolve(process.env.SITE_TEST_OUTPUT || '/tmp/lorasys-studio-v4', 'reading-and-full-pages')
await mkdir(out, { recursive: true })
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.avif':'image/avif', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.woff':'font/woff', '.wasm':'application/wasm' }
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    if (req.method !== 'GET' || !url.pathname.startsWith('/loraSys/')) { res.writeHead(404); res.end(); return }
    let file = path.resolve(root, decodeURIComponent(url.pathname.slice('/loraSys/'.length)))
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) { res.writeHead(403); res.end(); return }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
    res.end(await readFile(file))
  } catch { res.writeHead(404); res.end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}/loraSys/`
const browser = await chromium.launch({ headless:true, channel:'chromium' })
const report = { checks:[], screenshots:[], startedAt:new Date().toISOString() }
async function check(name, run) {
  try { await run(); report.checks.push({ name, passed:true }) }
  catch (error) { report.checks.push({ name, passed:false, error:String(error.stack) }) }
}
try {
  for (const width of [1440,390]) {
    const context = await browser.newContext({ viewport:{width,height:width === 1440 ? 1000 : 844}, reducedMotion:'reduce', colorScheme:'light' })
    await context.route('**/*', route => route.request().method === 'GET' && new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort())
    const page = await context.newPage()
    page.setDefaultTimeout(12000)
    for (const route of ['', 'en/', 'projects/', 'en/work/', 'blog/', 'en/writing/', 'lab/', 'en/lab/', 'projects/glassbox/', 'projects/zhihu-threads/', 'projects/ai-engineering-harness/', 'projects/agentarena/', 'en/projects/zhihu-threads/', 'about/', 'en/about/', 'collections/', 'contact/', 'now/', 'reading/']) {
      await check(`${width}: full rendered page ${route || 'home'}`, async () => {
        assert.equal((await page.goto(new URL(route, base).href, {waitUntil:'load'})).status(),200)
        await page.evaluate(() => document.fonts.ready)
        for (const image of await page.locator('main img:visible').all()) {
          await image.scrollIntoViewIfNeeded()
          await image.evaluate(img => img.complete ? null : new Promise(resolve => { img.addEventListener('load',resolve,{once:true}); img.addEventListener('error',resolve,{once:true}) }))
          assert.equal(await image.evaluate(img => img.naturalWidth > 0),true,'Visible image must decode')
        }
        await page.evaluate(() => window.scrollTo(0,0))
        await page.waitForFunction(() => window.scrollY === 0)
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        const file = `${width}-${(route || 'home').replaceAll('/','-')}-full.png`
        await page.screenshot({ path:path.join(out,file), fullPage:true, animations:'disabled' })
        report.screenshots.push({route,width,file,fullPage:true})
      })
    }
    await context.close()
  }
  for (const reducedMotion of ['reduce','no-preference']) {
    const context = await browser.newContext({ viewport:{width:768,height:1024}, reducedMotion })
    await context.route('**/*', route => route.request().method === 'GET' && new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort())
    const page = await context.newPage()
    page.setDefaultTimeout(12000)
    await check(`${reducedMotion}: article contents resize, focus trap and Escape`, async () => {
      await page.goto(new URL('blog/ai-engineering-harness/',base).href,{waitUntil:'load'})
      const sidebar = page.locator('#sidebar'), trigger = page.locator('#sidebar-btn')
      assert.equal(await sidebar.evaluate(el => el.inert),false,'Desktop navigation must be focusable at 768px')
      assert.equal(await trigger.isVisible(),false)
      await page.setViewportSize({width:390,height:844})
      await page.waitForFunction(() => document.querySelector('#sidebar')?.inert === true)
      await page.locator('#content h2').first().scrollIntoViewIfNeeded()
      await trigger.waitFor({state:'visible'})
      await trigger.press('Enter')
      await page.waitForFunction(() => document.querySelector('#sidebar')?.classList.contains('show'))
      assert.equal(await sidebar.evaluate(el => el.contains(document.activeElement)),true)
      const count = await sidebar.locator('button:visible,a:visible').count()
      for (let i=0;i<count+2;i++) { await page.keyboard.press('Tab'); assert.equal(await sidebar.evaluate(el=>el.contains(document.activeElement)),true) }
      await page.keyboard.press('Escape')
      assert.equal(await trigger.evaluate(el=>el === document.activeElement),true)
      assert.equal(await sidebar.evaluate(el=>el.inert),true)
      await trigger.press('Enter')
      const file = `390-${reducedMotion}-article-contents.png`
      await page.screenshot({path:path.join(out,file),animations:'disabled'})
      report.screenshots.push({route:'blog/ai-engineering-harness/',width:390,file,state:'contents open'})
      await page.setViewportSize({width:768,height:1024})
      await page.waitForFunction(() => document.querySelector('#sidebar')?.inert === false && document.querySelector('#sidebar-shade')?.hidden === true)
      assert.equal(await trigger.getAttribute('aria-expanded'),'false')
    })
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
  report.completedAt = new Date().toISOString()
  await writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2))
}
console.log(JSON.stringify({checks:report.checks.length,failed:report.checks.filter(item=>!item.passed).length,out}))
if (report.checks.some(item=>!item.passed)) process.exitCode=1
