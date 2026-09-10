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
const report = { checks:[], screenshots:[], startedAt:new Date().toISOString(), browser:browser.version(), revision:process.env.GITHUB_SHA || null }
const localReadOnly = route => route.request().method() === 'GET' && new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort()
async function check(name, run) {
  try { await run(); report.checks.push({ name, passed:true }); console.log('PASS', name) }
  catch (error) { report.checks.push({ name, passed:false, error:String(error.stack) }); console.error('FAIL', name, error.message) }
}
async function capture(page, route, width, name, state, fullPage = false) {
  const file = `${width}-${name}.png`
  await page.screenshot({path:path.join(out,file),fullPage,animations:'disabled'})
  report.screenshots.push({route,width,file,state,fullPage})
}
try {
  for (const width of [1440,390]) {
    const context = await browser.newContext({ viewport:{width,height:width === 1440 ? 1000 : 844}, reducedMotion:'reduce', colorScheme:'light' })
    await context.route('**/*', localReadOnly)
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
        await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}))
        await page.waitForFunction(() => window.scrollY === 0)
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await capture(page,route,width,`${(route || 'home').replaceAll('/','-')}-full`,'full page',true)
      })
    }
    await context.close()
  }
  for (const reducedMotion of ['reduce','no-preference']) {
    for (const route of ['blog/ai-engineering-harness/','blog/eve-agent/']) {
      const context = await browser.newContext({ viewport:{width:768,height:1024}, reducedMotion, colorScheme:'light' })
      await context.route('**/*', localReadOnly)
      await context.tracing.start({screenshots:true,snapshots:true,sources:false})
      const page = await context.newPage()
      page.setDefaultTimeout(12000)
      const lang = route.includes('eve-agent') ? 'en' : 'zh'
      const name = `${lang}-${reducedMotion}`
      const sidebar = page.locator('#sidebar'), trigger = page.locator('#sidebar-btn')
      const inside = () => sidebar.evaluate(el => el.contains(document.activeElement))
      const open = async () => {
        if (await trigger.getAttribute('aria-expanded') !== 'true') {
          await page.locator('#content h2').first().scrollIntoViewIfNeeded()
          await trigger.waitFor({state:'visible'})
          await trigger.press('Enter')
        }
        await page.waitForFunction(() => document.querySelector('#sidebar')?.classList.contains('show'))
        assert.equal(await inside(),true)
      }
      const backgroundReleased = () => page.evaluate(() => !document.querySelector('.reading-article')?.inert && !document.querySelector('[data-site-header]')?.inert)
      await check(`${name}: article contents resize, focus trap and Escape`, async () => {
        await page.goto(new URL(route,base).href,{waitUntil:'load'})
        assert.equal(await sidebar.evaluate(el => el.inert),false,'Desktop navigation must be focusable at 768px')
        assert.equal(await trigger.isVisible(),false)
        await page.setViewportSize({width:390,height:844})
        await page.waitForFunction(() => document.querySelector('#sidebar')?.inert === true)
        await open()
        assert.equal(await sidebar.getAttribute('role'),'dialog')
        assert.equal(await sidebar.getAttribute('aria-modal'),'true')
        assert.equal(await backgroundReleased(),false)
        // Include native disclosure summaries and cycle across every reachable control.
        const count = await sidebar.locator('button:visible,a:visible,summary:visible').count()
        const visited = []
        for (let i=0;i<count+2;i++) {
          await page.keyboard.press('Tab')
          const active = await page.evaluate(() => ({tag:document.activeElement.tagName,text:document.activeElement.textContent.trim().slice(0,100)}))
          visited.push(active)
          assert.equal(await inside(),true,JSON.stringify({i,active,visited}))
        }
        assert.ok(visited.some(item=>item.tag==='SUMMARY'),'The collapsed disclosure remains keyboard reachable')
        for (let i=0;i<count+2;i++) { await page.keyboard.press('Shift+Tab'); assert.equal(await inside(),true) }
        await capture(page,route,390,`${name}-contents-collapsed`,'contents open, disclosure collapsed')
        await page.keyboard.press('Escape')
        assert.equal(await trigger.evaluate(el=>el === document.activeElement),true)
        assert.equal(await sidebar.evaluate(el=>el.inert),true)
        assert.equal(await backgroundReleased(),true)
      })
      await check(`${name}: expanded contents and hidden controls keep focus inside`, async () => {
        await open()
        const summary = sidebar.locator('details > summary').first()
        await summary.press('Enter')
        await page.waitForFunction(() => document.querySelector('#sidebar details')?.open === true)
        const links = sidebar.locator('a:visible')
        await links.last().focus()
        await page.keyboard.press('Tab')
        assert.equal(await sidebar.locator('[data-sidebar-close]').evaluate(el=>el===document.activeElement),true)
        await page.keyboard.press('Shift+Tab')
        assert.equal(await links.last().evaluate(el=>el===document.activeElement),true)
        // Non-tabbable sentinels must not change the end of the loop.
        await sidebar.evaluate(el=>{
          const hidden=document.createElement('button');hidden.hidden=true;hidden.dataset.focusSentinel='hidden';el.append(hidden)
          const disabled=document.createElement('button');disabled.disabled=true;disabled.dataset.focusSentinel='disabled';el.append(disabled)
          const negative=document.createElement('button');negative.tabIndex=-1;negative.dataset.focusSentinel='negative';el.append(negative)
        })
        await page.keyboard.press('Tab')
        assert.equal(await sidebar.locator('[data-sidebar-close]').evaluate(el=>el===document.activeElement),true)
        await sidebar.locator('[data-focus-sentinel]').evaluateAll(elements=>elements.forEach(el=>el.remove()))
        await summary.focus()
        await capture(page,route,390,`${name}-contents-expanded`,'contents open, full disclosure expanded')
        await page.setViewportSize({width:768,height:1024})
        await page.waitForFunction(() => document.querySelector('#sidebar')?.inert === false && document.querySelector('#sidebar-shade')?.hidden === true)
        assert.equal(await trigger.getAttribute('aria-expanded'),'false')
        assert.equal(await sidebar.getAttribute('aria-modal'),null)
        assert.equal(await backgroundReleased(),true)
        assert.equal(await inside(),true,'Resize must not leave focus on a hidden mobile close button')
      })
      await check(`${name}: chapter links transfer focus and modal restores prior inert state`, async () => {
        await page.setViewportSize({width:390,height:844})
        await page.waitForFunction(() => document.querySelector('#sidebar')?.inert === true)
        await page.evaluate(()=>{const sentinel=document.createElement('div');sentinel.id='prior-inert-sentinel';sentinel.inert=true;document.body.append(sentinel)})
        await open()
        const link = sidebar.locator('a:visible').first()
        const hash = await link.getAttribute('href')
        await link.press('Enter')
        await page.waitForFunction(expected=>document.activeElement?.id===decodeURIComponent(expected.slice(1)),hash)
        assert.equal(await trigger.getAttribute('aria-expanded'),'false')
        assert.equal(await backgroundReleased(),true)
        assert.equal(await page.locator('#prior-inert-sentinel').evaluate(el=>el.inert),true)
        await page.locator('#prior-inert-sentinel').evaluate(el=>el.remove())
        await page.waitForFunction(() => document.getAnimations().every(animation=>animation.playState!=='running'))
        await capture(page,route,390,`${name}-chapter-focus`,'chapter selected, contents closed')
        await page.evaluate(()=>localStorage.setItem('theme','dark'))
        await page.reload({waitUntil:'load'})
        await open()
        if (process.env.AXE_PATH) {
          await page.addScriptTag({path:process.env.AXE_PATH})
          const failures=await page.evaluate(async()=>{const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return result.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,targets:v.nodes.map(node=>node.target)}))})
          assert.deepEqual(failures,[],'Open dark contents must have no serious accessibility failures')
        }
        await capture(page,route,390,`${name}-contents-dark`,'dark contents open')
        await sidebar.locator('[data-sidebar-close]').press('Enter')
        assert.equal(await backgroundReleased(),true)
        assert.equal(await trigger.evaluate(el=>el===document.activeElement),true)
      })
      await context.tracing.stop({path:path.join(out,`${name}-reading-trace.zip`)})
      await context.close()
    }
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
  report.completedAt = new Date().toISOString()
  await writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2))
}
console.log(JSON.stringify({checks:report.checks.length,failed:report.checks.filter(item=>!item.passed).length,out}))
if (report.checks.some(item=>!item.passed)) process.exitCode=1
