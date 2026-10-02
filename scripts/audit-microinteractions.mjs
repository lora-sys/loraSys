import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const output = path.resolve(process.env.SITE_TEST_OUTPUT || '/tmp/lorasys-interactions')
await mkdir(output, { recursive: true })
const dist = path.resolve('dist')
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.wasm':'application/wasm', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' }
let server
let site = process.env.SITE_TEST_URL
if (!site) {
  const home = await readFile(path.join(dist, 'index.html'), 'utf8')
  const match = home.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)
  assert.ok(match, 'Production homepage must declare a canonical URL')
  const base = `${new URL(match[1]).pathname.replace(/\/$/, '')}/`
  server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost')
      if (!url.pathname.startsWith(base)) { response.writeHead(404); response.end(); return }
      let file = path.resolve(dist, decodeURIComponent(url.pathname.slice(base.length)))
      if (file !== dist && !file.startsWith(`${dist}${path.sep}`)) { response.writeHead(403); response.end(); return }
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
      response.writeHead(200, { 'Content-Type':mime[path.extname(file)] || 'application/octet-stream' })
      response.end(await readFile(file))
    } catch { response.writeHead(404); response.end('Not found') }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  site = `http://127.0.0.1:${server.address().port}${base}`
}
const report = { site, startedAt:new Date().toISOString(), checks:[], screenshots:[] }
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chromium' })
const save = () => writeFile(path.join(output, 'interactions.json'), JSON.stringify(report, null, 2))
async function check(name, fn) {
  try { await fn(); report.checks.push({name, passed:true}); console.log('PASS',name) }
  catch(error) { report.checks.push({name, passed:false, error:String(error.stack)}); console.error('FAIL',name,error.message) }
  await save()
}
try {
  for (const width of [1440,390]) for (const reducedMotion of ['no-preference','reduce']) {
    const label = `${width}-${reducedMotion}`
    const context = await browser.newContext({viewport:{width,height:width===390?844:1000},hasTouch:width===390,isMobile:width===390,reducedMotion})
    await context.route('**/*', route => {
      const request=route.request(), url=new URL(request.url())
      return ['GET','HEAD'].includes(request.method()) && (url.origin===new URL(site).origin || ['data:','blob:'].includes(url.protocol)) ? route.continue() : route.abort()
    })
    const page=await context.newPage();page.setDefaultTimeout(12000)
    const errors=[];page.on('pageerror',error=>errors.push(error.message))
    const open=async route=> { const response=await page.goto(new URL(route,site).href,{waitUntil:'load'});assert.equal(response.status(),200) }
    const capture=async name=> { const file=`${label}-${name}.png`;await page.screenshot({path:path.join(output,file),animations:'disabled'});report.screenshots.push(file) }
    await check(`${label}: code copy waits for completion and reports denial`,async()=>{
      await open('blog/ai-engineering-harness/')
      const copy=page.locator('[data-code-copy]').first();await copy.waitFor()
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:value=>new Promise(resolve=>{window.__codeValue=value;window.__resolveCopy=resolve})}}))
      await copy.press('Enter')
      assert.equal(await copy.isDisabled(),true)
      assert.equal(await copy.getAttribute('aria-label'),'复制代码')
      assert.ok(await page.evaluate(()=>typeof window.__codeValue==='string' && window.__codeValue.length>0))
      await page.evaluate(()=>window.__resolveCopy())
      await page.waitForFunction(()=>document.querySelector('[data-code-copy]')?.getAttribute('aria-label')==='代码已复制')
      const successContent=await copy.evaluate(el=>getComputedStyle(el.querySelector('.success'),'::before').content)
      assert.ok(['none','normal','\"\"'].includes(successContent),'Copy confirmation must not append a hard-coded English tooltip')
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Permission denied in test')}}}))
      await copy.press('Enter')
      await page.waitForFunction(()=>document.querySelector('[data-code-feedback]')?.textContent.includes('复制失败'))
      assert.equal(await copy.isDisabled(),false)
      assert.equal(await copy.getAttribute('aria-label'),'复制代码')
      const collapse=page.locator('[data-code-collapse]').first();assert.ok(await collapse.count())
      const before=await collapse.getAttribute('aria-expanded')
      await collapse.press('Enter');assert.notEqual(await collapse.getAttribute('aria-expanded'),before)
      await collapse.press('Enter');assert.equal(await collapse.getAttribute('aria-expanded'),before)
      await capture('code-controls')
    })
    await check(`${label}: workflow keyboard selection and finite motion`,async()=>{
      for(const prefix of ['','en/']) {
        await open(`${prefix}projects/zhihu-threads/`)
        const buttons=page.locator('[data-evidence-step]')
        for(let i=0;i<4;i++) {
          await buttons.nth(i).press('Enter')
          assert.equal(await buttons.nth(i).getAttribute('aria-pressed'),'true')
          assert.equal(await page.locator('[data-evidence-panel]:visible').count(),1)
          assert.equal(await buttons.nth(i).evaluate(el=>el===document.activeElement),true)
        }
        if(reducedMotion==='reduce') assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0)
        else await page.waitForFunction(()=>document.getAnimations().every(a=>a.playState!=='running'))
        await capture(`${prefix?'en':'zh'}-workflow`)
      }
    })
    await check(`${label}: typing a slash never triggers page navigation`,async()=>{
      await open('en/search/')
      const input=page.locator('.pagefind-ui__search-input');await input.waitFor()
      await input.fill('Zhihu');await input.press('/')
      assert.equal(await input.inputValue(),'Zhihu/')
      assert.ok(new URL(page.url()).pathname.includes('/en/search'))
    })
    await check(`${label}: localized filter status and stable category history`,async()=>{
      await open('projects/?category=Tools')
      const category=page.locator('[data-category-filter="Tools"]')
      await category.waitFor({state:'visible'})
      assert.equal(await category.getAttribute('aria-pressed'),'true')
      assert.match(await page.locator('[data-filter-status]').textContent(),/开发工具/)
      assert.doesNotMatch(await page.locator('[data-filter-status]').textContent(),/Tools/)
      await page.locator('[data-category-filter="all"]').click()
      await page.waitForURL(url=>!url.searchParams.has('category'))
      await page.goBack()
      await page.waitForFunction(()=>document.querySelector('[data-category-filter="Tools"]')?.getAttribute('aria-pressed')==='true')
      assert.equal(new URL(page.url()).searchParams.get('category'),'Tools')
      assert.match(await page.locator('[data-filter-status]').textContent(),/开发工具/)
      await capture('localized-category')
    })
    await check(`${label}: IME composition and unrelated Escape retain focus`,async()=>{
      await open('projects/zhihu-threads/')
      const initial=page.url()
      const unhandled=await page.evaluate(()=>document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'/',isComposing:true,bubbles:true,cancelable:true})))
      assert.equal(unhandled,true,'Composition keystrokes must not be intercepted')
      assert.equal(page.url(),initial)
      const menu=page.locator('[data-menu-toggle]')
      if(await menu.isVisible()) {
        await menu.press('Enter')
        await page.waitForFunction(()=>document.querySelector('[data-menu-toggle]')?.getAttribute('aria-expanded')==='true')
        await page.keyboard.press('Escape')
        assert.equal(await menu.getAttribute('aria-expanded'),'false')
        assert.equal(await menu.evaluate(el=>document.activeElement===el),true)
      }
      const theme=page.locator('#toggleDarkMode')
      await theme.focus();await theme.press('Escape')
      assert.equal(await theme.evaluate(el=>document.activeElement===el),true,'Closed menu must not steal Escape from other controls')
    })
    await check(`${label}: disabled statistics do not load or show empty counts`,async()=>{
      await open('lab/')
      assert.equal(await page.locator('.waline-pageview-count,.waline-comment-count').count(),0)
      assert.equal(await page.evaluate(()=>[...document.scripts].some(s=>s.textContent.includes('loadPageview'))),false)
    })
    await check(`${label}: dark-mode accessibility`,async()=>{
      if(!process.env.AXE_PATH) return
      for(const route of ['projects/','en/work/','projects/zhihu-threads/','en/projects/zhihu-threads/']) {
        await page.evaluate(()=>localStorage.setItem('theme','dark'));await open(route);await page.waitForFunction(()=>document.documentElement.classList.contains('dark') && document.getAnimations().every(a=>a.playState!=='running'))
        await page.addScriptTag({path:process.env.AXE_PATH})
        const violations=await page.evaluate(async()=>{const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return result.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))})
        assert.deepEqual(violations,[],route)
      }
    })
    await check(`${label}: visible code labels have no generated English duplicates`,async()=>{
      for(const [route,expand,collapse] of [['blog/ai-engineering-harness/','展开代码','收起代码'],['blog/eve-agent/','Expand code','Collapse code']]) {
        await open(route)
        const button=page.locator('[data-code-collapse]').first()
        await button.waitFor()
        const state=()=>button.evaluate(el=>{const desc=el.querySelector('.desc');return {text:desc.textContent.trim(),before:getComputedStyle(desc,'::before').content,after:getComputedStyle(desc,'::after').content}})
        let value=await state()
        assert.equal(value.text,expand)
        assert.ok(['none','normal','""'].includes(value.before),JSON.stringify(value))
        assert.ok(['none','normal','""'].includes(value.after),JSON.stringify(value))
        await button.press('Enter')
        value=await state();assert.equal(value.text,collapse)
        assert.ok(['none','normal','""'].includes(value.before),JSON.stringify(value))
        await button.press('Enter')
        assert.equal((await state()).text,expand)
        await capture(route.includes('eve-agent')?'en-code-labels':'zh-code-labels')
      }
    })
    await check(`${label}: localized search filter labels retain selection`,async()=>{
      for(const [route,labels] of [['search/',['主题','内容类型']],['en/search/',['Topics','Content type']]]) {
        await open(route)
        const input=page.locator('.pagefind-ui__search-input');await input.waitFor();await input.fill('Agent')
        await page.locator('.pagefind-ui__result-link').first().waitFor()
        await page.locator('.pagefind-ui__filter-block:visible').first().waitFor()
        const names=await page.locator('.pagefind-ui__filter-block:visible .pagefind-ui__filter-name').allTextContents()
        assert.deepEqual(names.map(s=>s.trim()).sort(),[...labels].sort())
        for(const name of labels) {
          const filter=page.locator('.pagefind-ui__filter-block').filter({has:page.locator('.pagefind-ui__filter-name',{hasText:name})})
          assert.equal(await filter.count(),1,`One localized filter for ${name}`)
          if(!await filter.evaluate(el=>el.open)) await filter.locator('summary').click()
          const option=filter.locator('input[type="checkbox"]').first()
          await option.check();assert.equal(await option.isChecked(),true)
          await option.uncheck();assert.equal(await option.isChecked(),false)
        }
        await page.locator('.pagefind-ui__result-link').first().waitFor()
        await capture(route.startsWith('en/')?'en-filter-label':'zh-filter-label')
      }
    })
    await check(`${label}: menus respond immediately and interrupted openings retain focus`,async()=>{
      await open('en/')
      const toggle=page.locator(width===390?'[data-menu-toggle]':'[data-more-toggle]')
      const panel=page.locator(width===390?'[data-mobile-nav]':'[data-more-nav]')
      await toggle.focus()
      await toggle.evaluate(el=>{el.click();el.click()})
      assert.equal(await toggle.getAttribute('aria-expanded'),'false')
      assert.equal(await panel.isVisible(),false)
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)))
      assert.equal(await toggle.evaluate(el=>document.activeElement===el),true,'Cancelled opening cannot focus a hidden link')
      await toggle.press('Enter')
      assert.equal(await toggle.getAttribute('aria-expanded'),'true')
      assert.equal(await panel.isVisible(),true)
      assert.equal(await panel.locator('a').first().evaluate(el=>document.activeElement===el),true)
      if(reducedMotion==='reduce') assert.equal(await panel.evaluate(el=>el.getAnimations().length),0)
      else await page.waitForFunction(selector=>document.querySelector(selector).getAnimations().length===0,width===390?'[data-mobile-nav]':'[data-more-nav]')
      await capture('navigation-feedback')
      await page.keyboard.press('Escape')
      assert.equal(await panel.isVisible(),false)
      assert.equal(await toggle.evaluate(el=>document.activeElement===el),true)
    })
    await check(`${label}: project copy feedback follows the clipboard result`,async()=>{
      await open('projects/?category=Tools')
      const root=page.locator('[data-project-item]:visible [data-copy-action]').first()
      const button=root.locator('[data-copy-button]')
      await button.scrollIntoViewIfNeeded()
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:value=>new Promise(resolve=>{window.__linkValue=value;window.__resolveLink=resolve})}}))
      await button.press('Enter')
      assert.equal(await button.isDisabled(),true)
      assert.equal(await root.getAttribute('data-copy-state'),'pending')
      assert.equal(await button.getAttribute('aria-busy'),'true')
      await page.evaluate(()=>window.__resolveLink())
      await page.waitForFunction(()=>document.querySelector('[data-copy-state="success"]'))
      assert.equal(await root.getAttribute('data-copy-state'),'success')
      assert.equal(await button.isDisabled(),false)
      assert.equal(await button.getAttribute('aria-busy'),null)
      assert.ok(await page.evaluate(()=>window.__linkValue.startsWith(location.origin)&&new URL(window.__linkValue).hash.length>1))
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Permission denied in test')}}}))
      await button.press('Enter')
      await page.waitForFunction(()=>document.querySelector('[data-copy-state="error"]'))
      assert.match(await root.locator('[data-copy-feedback]').textContent(),/无法自动复制/)
      assert.equal(await root.getAttribute('data-copy-state'),'error')
      assert.equal(await button.isDisabled(),false)
      await capture('copy-feedback')
    })
    await check(`${label}: one reading progress follows scroll, code expansion, resize, and pageshow`,async()=>{
      await open('blog/ai-engineering-harness/')
      const progress=page.locator('[data-reading-progress]')
      assert.equal(await progress.count(),1,'Each article has one reading-progress source')
      assert.equal(await page.locator('#content [data-reading-progress]').count(),0,'Progress stays outside the transformed content container')
      await progress.waitFor({state:'visible'})
      assert.equal(await progress.getAttribute('aria-label'),'阅读进度')
      assert.equal(await progress.getAttribute('aria-valuenow'),'0')
      await page.evaluate(()=>{
        const content=document.getElementById('content'),rect=content.getBoundingClientRect()
        window.scrollTo({top:scrollY+rect.top+rect.height*.35,behavior:'instant'})
      })
      await page.waitForFunction(()=>Number(document.querySelector('[data-reading-progress]').getAttribute('aria-valuenow'))>10)
      const midway=Number(await progress.getAttribute('aria-valuenow'))
      assert.ok(midway<100)
      const matchesReadingLayout=()=>{
        const content=document.getElementById('content'),rect=content.getBoundingClientRect()
        const readingTop=Math.max(0,document.querySelector('[data-site-header]').getBoundingClientRect().bottom)+16
        const range=Math.max(0,rect.height-(innerHeight-readingTop))
        const ratio=range>0?Math.max(0,Math.min(1,(readingTop-rect.top)/range)):(rect.bottom<=innerHeight?1:0)
        return Number(document.querySelector('[data-reading-progress]').getAttribute('aria-valuenow'))===Math.round(ratio*100)
      }
      await page.waitForFunction(matchesReadingLayout)
      const backToTop=page.locator('#to-top-btn')
      await backToTop.waitFor({state:'visible'})
      assert.equal(await page.locator('#action-buttons').evaluate(el=>el.classList.contains('ended')),true,'Article navigation has one progress calculation; the floating control is only Back to top')
      assert.equal(await backToTop.locator('.top-text').evaluate(el=>getComputedStyle(el).opacity),'0','The stale percentage is not displayed')
      assert.equal(await backToTop.locator('.top-icon').evaluate(el=>getComputedStyle(el).opacity),'1')
      const rail=await progress.boundingBox();assert.ok(Math.abs(rail.y)<1,'Reading rail stays attached to the viewport')
      await page.evaluate(()=>{
        const fixture=document.createElement('div');fixture.id='reading-resize-fixture';fixture.style.height='2400px'
        document.getElementById('content').append(fixture)
      })
      await page.waitForFunction(before=>Number(document.querySelector('[data-reading-progress]').getAttribute('aria-valuenow'))<before,midway)
      await page.waitForFunction(matchesReadingLayout)
      await page.setViewportSize({width,height:width===390?724:880})
      await page.waitForFunction(matchesReadingLayout)
      await page.setViewportSize({width,height:width===390?844:1000})
      const collapse=page.locator('[data-code-collapse]').first()
      await collapse.scrollIntoViewIfNeeded()
      await collapse.press('Enter')
      assert.equal(await collapse.getAttribute('aria-expanded'),'true')
      await page.waitForFunction(matchesReadingLayout)
      await collapse.press('Enter')
      assert.equal(await collapse.getAttribute('aria-expanded'),'false')
      await page.waitForFunction(matchesReadingLayout)
      assert.equal(await backToTop.locator('.top-text').evaluate(el=>getComputedStyle(el).opacity),'0')
      await page.evaluate(()=>{
        document.getElementById('reading-resize-fixture').remove()
        document.getElementById('content').scrollIntoView({block:'end',behavior:'instant'})
      })
      await page.waitForFunction(()=>document.querySelector('[data-reading-progress]').getAttribute('aria-valuenow')==='100')
      assert.equal(await progress.locator('span').evaluate(el=>getComputedStyle(el).transitionProperty),'none','A global reduced-motion duration must not create progress transitions')
      assert.equal(await progress.locator('span').evaluate(el=>el.getAnimations().length),0,'Progress tracks real scroll directly, including reduced motion')
      await capture('reading-progress')
      await backToTop.click()
      await page.waitForFunction(()=>scrollY===0 && document.querySelector('[data-reading-progress]').getAttribute('aria-valuenow')==='0')
      await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})))
      await page.waitForFunction(()=>document.querySelector('[data-reading-progress]').getAttribute('aria-valuenow')==='0')
      await open('blog/eve-agent/')
      assert.equal(await page.locator('[data-reading-progress]').getAttribute('aria-label'),'Reading progress')
    })
    await check(`${label}: rapid filters keep truthful empty and restored states`,async()=>{
      await open('projects/?category=Tools')
      const search=page.locator('[data-project-search]')
      await search.fill('this-query-has-no-project-match')
      assert.equal(await page.locator('[data-project-item]:visible').count(),0)
      assert.equal(await page.locator('[data-empty-state]').isVisible(),true)
      await page.locator('[data-filter-reset]').click()
      assert.equal(await search.inputValue(),'')
      assert.equal(await search.evaluate(el=>document.activeElement===el),true)
      assert.ok(await page.locator('[data-project-item]:visible').count()>0)
      await page.locator('[data-category-filter="Tools"]').evaluate(el=>{el.click();document.querySelector('[data-category-filter="all"]').click();el.click()})
      assert.equal(await page.locator('[data-category-filter="Tools"]').getAttribute('aria-pressed'),'true')
      assert.equal(new URL(page.url()).searchParams.get('category'),'Tools')
      await page.waitForFunction(()=>document.getAnimations().every(a=>a.playState!=='running'))
      assert.equal(await page.locator('[data-empty-state]').isVisible(),false)
      if(width===390) {
        await open('blog/ai-engineering-harness/')
        const copy=page.locator('[data-code-copy]').first()
        await copy.scrollIntoViewIfNeeded()
        assert.equal(await copy.evaluate(el=>getComputedStyle(el).opacity),'1','Touch users can discover code copy without hover')
      }
    })
    await check(`${label}: no uncaught script errors`,async()=>assert.deepEqual(errors,[]))
    await context.close()
  }
} finally {
  await browser.close()
  if(server) await new Promise(resolve=>server.close(resolve))
  report.completedAt=new Date().toISOString();await save()
}
console.log(JSON.stringify({checks:report.checks.length,failed:report.checks.filter(c=>!c.passed).length}))
if(report.checks.some(c=>!c.passed)) process.exitCode=1
