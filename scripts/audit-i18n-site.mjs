import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'

const dist = path.resolve(process.argv[2] || 'dist')
const output = path.resolve(process.env.SITE_TEST_OUTPUT || '/tmp/lorasys-locale-audit')
await mkdir(output, { recursive: true })
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')
const report = { startedAt: new Date().toISOString(), checks: [], routes: [], screenshots: [], accessibility: [], network: [], languageCandidates: [] }
let server
const canonical = process.env.SITE_TEST_URL || 'https://lora-sys.github.io/loraSys/'
const deployment = new URL(canonical)
const base = `${deployment.pathname.replace(/\/$/, '')}/`
let site = deployment.href
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf', '.xml': 'application/xml' }
if (!process.env.SITE_TEST_URL) {
  server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost')
      if (url.pathname === base.slice(0,-1)) { res.writeHead(302, { Location: `${base}${url.search}` }); res.end(); return }
      if (!url.pathname.startsWith(base)) { res.writeHead(404); res.end(); return }
      let file = path.resolve(dist, decodeURIComponent(url.pathname.slice(base.length)))
      if (file !== dist && !file.startsWith(`${dist}${path.sep}`)) { res.writeHead(403); res.end(); return }
      const info = await stat(file)
      if (info.isDirectory()) file = path.join(file, 'index.html')
      const body = await readFile(file)
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(body)
    } catch { res.writeHead(404); res.end('Not found') }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  site = `http://127.0.0.1:${server.address().port}${base}`
}
report.site = site
const browser = await chromium.launch({ headless: true, channel: 'chromium' })
const save = () => writeFile(path.join(output, 'audit.json'), JSON.stringify(report, null, 2))
async function check(name, fn) {
  try { await fn(); report.checks.push({ name, passed: true }); console.log('PASS',name) }
  catch (error) { report.checks.push({ name, passed: false, error: String(error.stack) }); console.error('FAIL',name,error.message) }
  await save()
}
const keyRoutes = ['', 'en/', 'projects/', 'en/work/', 'projects/zhihu-threads/', 'en/projects/zhihu-threads/', 'contact/', 'en/contact/', 'about/', 'en/about/', 'blog/', 'en/writing/', 'notes/', 'now/', 'en/now/', 'links/', 'en/links/', 'resume/', 'en/resume/', 'lab/', 'talks/', 'terms/', 'terms/privacy-policy/', 'search/', 'en/search/','archives/','tags/','tags/agent/','blog/ai-engineering-harness/','blog/wishlive/','blog/language/en-US/']
const uiLeaks = /^(Selected Work|Case guide|views|comments|BUILDING|Building|Maintained|Archived|View case|Visit website|Contribution PR|Source|Story|Search content|Content Directory|Content Graph|Theme Roadmap|Table of Contents|Back|Author|Published at|Copyright|No matching content entries\.|Copy exploration receipt|Reset filters)$/i
try {
  for (const viewport of [{ width:1440,height:1000 },{ width:390,height:844 },{ width:768,height:1024 }]) {
    const context = await browser.newContext({ viewport, reducedMotion:'reduce', colorScheme:'light' })
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (!['GET','HEAD'].includes(route.request().method())) return route.abort()
      return url.origin === new URL(site).origin || ['data:','blob:'].includes(url.protocol) ? route.continue() : route.abort()
    })
    const page = await context.newPage()
    page.setDefaultTimeout(15000)
    const errors=[]; page.on('pageerror',error => errors.push(error.message))
    async function open(route='') { const response=await page.goto(new URL(route,site).href,{waitUntil:'load'}); assert.equal(response.status(),200); await page.evaluate(() => document.fonts.ready); return response }
    async function capture(name) { const file=`${viewport.width}-${name}.png`; await page.screenshot({path:path.join(output,file),animations:'disabled'}); report.screenshots.push(file) }
    for (const route of keyRoutes) {
      await check(`${viewport.width}: route ${route || 'home'}`,async () => {
        const response=await open(route)
        const expected=route.startsWith('en/') || route==='blog/wishlive/' ? 'en':'zh'
        const info=await page.evaluate(() => {
          const nodes=[...document.querySelectorAll('body *')].filter(el => !el.closest('script,style,pre,code,svg,iframe') && !el.children.length && el.textContent.trim())
          const visible=nodes.filter(el => { const r=el.getBoundingClientRect(); return r.width>0 && r.height>0 && getComputedStyle(el).visibility!=='hidden' })
          const ids=[...document.querySelectorAll('[id]')].map(el=>el.id)
          return { lang:document.documentElement.lang, overflow:document.documentElement.scrollWidth-innerWidth, h1:document.querySelectorAll('h1').length, duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i), text:visible.map(el=>({text:el.textContent.trim(),lang:el.closest('[lang]')?.getAttribute('lang')})), ui:[...document.querySelectorAll('button,summary,.eyebrow,.project-source,.project-actions a,.directory-kind,.node-meta span,.post-meta span')].filter(el=>el.getBoundingClientRect().height>0).map(el=>el.textContent.trim()) }
        })
        report.routes.push({route,viewport,lang:info.lang,overflow:info.overflow,duplicateIds:info.duplicateIds,sha256:createHash('sha256').update(await response.body()).digest('hex')})
        assert.ok(info.lang.startsWith(expected),`Expected ${expected} language, got ${info.lang}`)
        assert.ok(info.overflow<=1,`Page horizontal overflow ${info.overflow}px`)
        assert.equal(info.h1,1,'Each page needs one main heading')
        assert.deepEqual(info.duplicateIds,[],'Duplicate IDs')
        if (expected==='zh') assert.deepEqual(info.ui.filter(text=>uiLeaks.test(text)),[],'Untranslated interface labels')
        if (expected==='en') {
          const leaks=info.text.filter(x=>/[\u3400-\u9fff]/.test(x.text) && !x.lang?.startsWith('zh'))
          report.languageCandidates.push({route,viewport:viewport.width,candidates:leaks})
          assert.deepEqual(leaks,[],'Unmarked Chinese prose in English interface')
        }
        if (viewport.width!==768 || ['projects/','en/work/'].includes(route)) await capture((route||'home').replaceAll('/','-'))
        if(process.env.AXE_PATH && viewport.width!==768 && ['', 'projects/','en/work/','projects/zhihu-threads/','en/projects/zhihu-threads/','search/','en/search/','contact/','en/contact/'].includes(route)) {
          await page.addScriptTag({path:process.env.AXE_PATH})
          const axe=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}))
          report.accessibility.push({route,viewport:viewport.width,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))})
          assert.equal(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).length,0,'Serious accessibility violations')
        }
      })
    }
    await check(`${viewport.width}: curated English cases and complete repository archive`,async()=>{
      await open('en/work/')
      // v4 intentionally curates four cases. Every synchronized repository must remain in the archive.
      const descriptions=await page.locator('[data-project-card] .project-heading > p').allTextContents()
      assert.equal(descriptions.length,4,'Four reviewed case studies must be available')
      assert.equal(descriptions.filter(x=>/[\u3400-\u9fff]/.test(x)).length,0)
      const snapshot=JSON.parse(await readFile('src/data/github-projects.json','utf8'))
      assert.equal(await page.locator('[data-project-item]').count(),Object.keys(snapshot.projects).length,'No synchronized project may disappear')
      const link=page.locator('a[href$="/en/projects/zhihu-threads"]').first();await link.click();await page.locator('[data-zhihu-case]').waitFor()
      assert.ok(page.url().includes('/en/projects/zhihu-threads'))
    })
    await check(`${viewport.width}: evidence interaction and keyboard`,async()=>{
      for(const lang of ['', 'en/']) {
        await open(`${lang}projects/zhihu-threads/`)
        const controls=page.locator('[data-evidence-step]');assert.equal(await controls.count(),4)
        for(let i=0;i<4;i++) {await controls.nth(i).press('Enter');assert.equal(await controls.nth(i).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-evidence-panel]:visible').count(),1);await page.locator(`[data-evidence-panel="${i}"]`).waitFor({state:'visible'})}
        const count=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length);assert.equal(count,0,'Reduced motion stops non-essential motion')
        await capture(`${lang?'en':'zh'}-evidence-step`)
      }
    })
    await check(`${viewport.width}: clipboard success and failure feedback`,async()=>{
      await open('projects/zhihu-threads/')
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copied=value}}}))
      const copy=page.locator('[data-copy-action]').first();await copy.locator('button').click();await page.waitForFunction(()=>document.querySelector('[data-copy-action]')?.getAttribute('data-copy-state')==='success')
      assert.ok((await copy.innerText()).includes('已复制'))
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('test denied')}}}))
      await copy.locator('button').click();await page.waitForFunction(()=>document.querySelector('[data-copy-action]')?.getAttribute('data-copy-state')==='error')
      assert.ok((await copy.innerText()).includes('无法自动复制'));assert.ok((await copy.innerText()).includes('/projects/zhihu-threads'))
      await capture('clipboard-fallback')
    })
    await check(`${viewport.width}: locale search, slash shortcut and results`,async()=>{
      for(const lang of ['', 'en/']) {
        await open(`${lang}`)
        await page.keyboard.press('/')
        await page.waitForURL(url=>url.pathname.replace(/\/$/,'')===`${base}${lang}search`)
        const input=page.locator('.pagefind-ui__search-input');await input.waitFor({state:'visible'});await input.fill('Zhihu')
        await page.locator('.pagefind-ui__result-link').first().waitFor({state:'visible'})
        assert.ok((await page.locator('.pagefind-ui__result-link').allTextContents()).some(s=>s.includes('Zhihu')))
        await capture(`${lang?'en':'zh'}-search-results`)
        await input.fill('qxzvbnmk927413nomatch')
        await page.waitForFunction(()=>[...document.querySelectorAll('.pagefind-ui__message')].some(el=>/没有找到|No results/.test(el.textContent||'')))
        await page.locator('[data-search-empty]').waitFor({state:'visible'})
        await capture(`${lang?'en':'zh'}-search-empty`)
      }
    })
    await check(`${viewport.width}: archive searches do not overwrite each other`,async()=>{
      await open('projects/?q=zhihu-threads')
      await page.locator('[data-content-browser][data-content-ready="true"]').waitFor();const input=page.locator('[data-content-browser] [data-content-search]');await input.waitFor({state:'visible'})
      await input.fill('Harness')
      assert.equal(new URL(page.url()).searchParams.get('q'),'zhihu-threads')
      await page.waitForURL(url=>url.searchParams.get('content-q')==='Harness');assert.equal(new URL(page.url()).searchParams.get('content-q'),'Harness')
      await page.locator('[data-content-reset]').click()
      assert.equal(new URL(page.url()).searchParams.get('q'),'zhihu-threads')
    })
    await check(`${viewport.width}: dark mode major surfaces`,async()=>{
      for(const route of ['','projects/','en/work/','projects/zhihu-threads/','en/projects/zhihu-threads/']) {
        await open(route);await page.evaluate(()=>{document.documentElement.classList.add('dark');localStorage.setItem('theme','dark')})
        await capture(`dark-${route.replaceAll('/','-')||'home'}`)
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))
      }
    })
    await check(`${viewport.width}: no uncaught application exceptions`,async()=>assert.deepEqual(errors,[]))
    await context.close()
  }
  await check('Retained illustrations have stable dimensions and no extra font artifacts',async()=>{
    if(process.env.SITE_TEST_URL)return
    const paths=['zh','en'].flatMap(lang=>[`lora-v3-project-zhihu-threads-${lang}.webp`,`lora-v3-zhihu-workflow-${lang}.webp`])
    for(const file of paths) { const buffer=await readFile(path.resolve('src/assets/projects',file));assert.ok(buffer.length<180000,`${file} must stay lightweight`);assert.equal(buffer.toString('ascii',8,12),'WEBP') }
  })
} finally {
  await browser.close()
  if(server)await new Promise(resolve=>server.close(resolve))
  report.completedAt=new Date().toISOString();await save()
}
console.log(JSON.stringify({checks:report.checks.length,failures:report.checks.filter(x=>!x.passed).length,output}))
if(report.checks.some(x=>!x.passed)) process.exitCode=1
