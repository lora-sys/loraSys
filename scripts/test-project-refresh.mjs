import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const out = path.resolve(process.env.SITE_TEST_OUTPUT || '/tmp/lorasys-project-refresh', 'project-refresh')
await mkdir(out, { recursive: true })
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.avif':'image/avif', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.woff':'font/woff', '.wasm':'application/wasm' }
const basePath = '/loraSys/'
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    if (!['GET','HEAD'].includes(req.method) || !url.pathname.startsWith(basePath)) { res.writeHead(404); res.end(); return }
    let file = path.resolve(dist, decodeURIComponent(url.pathname.slice(basePath.length)))
    if (file !== dist && !file.startsWith(`${dist}${path.sep}`)) { res.writeHead(403); res.end(); return }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
    res.end(req.method === 'HEAD' ? undefined : await readFile(file))
  } catch { res.writeHead(404); res.end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}${basePath}`
const browser = await chromium.launch({ headless:true, channel:'chromium' })
const report = { startedAt:new Date().toISOString(), browser:browser.version(), site:base, checks:[], screenshots:[], pages:[] }
const glassboxReadme = 'https://github.com/lora-sys/Glassbox-Agent-Harness/blob/c19140104b0eba3451aebcd27334161e5ffb6d8d/README.md'
async function check(name, run) {
  try { await run(); report.checks.push({ name, passed:true }); console.log('PASS', name) }
  catch (error) { report.checks.push({ name, passed:false, error:String(error.stack) }); console.error('FAIL', name, error.message) }
}
try {
  for (const width of [1440,390]) for (const locale of ['zh','en']) for (const theme of ['light','dark']) {
    const prefix = locale === 'en' ? 'en/' : ''
    const reducedMotion = theme === 'light' ? 'reduce' : 'no-preference'
    const context = await browser.newContext({ viewport:{width,height:width === 1440 ? 1000 : 844}, reducedMotion, colorScheme:theme })
    await context.addInitScript(value => localStorage.setItem('theme', value), theme)
    await context.route('**/*', route => ['GET','HEAD'].includes(route.request().method()) && new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort())
    const page = await context.newPage()
    page.setDefaultTimeout(15000)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const label = `${width}-${locale}-${theme}`
    const card = repo => page.locator('[data-project-card]').filter({has:page.locator(`[data-destination="${repo}"]`)}).first()
    async function open(route) {
      const response = await page.goto(new URL(route,base).href, {waitUntil:'load'})
      assert.equal(response.status(),200)
      await page.evaluate(() => document.fonts.ready)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No whole-page horizontal overflow')
      report.pages.push({route,width,locale,theme,sha256:createHash('sha256').update(await response.body()).digest('hex')})
    }
    async function capture(name, target) {
      if (target) {
        await target.scrollIntoViewIfNeeded()
        for (const image of await target.locator('img').all()) {
          // A tall card can be visible while its lazy image is still outside the viewport.
          await image.scrollIntoViewIfNeeded()
          await page.waitForFunction(img => img.complete && img.naturalWidth > 0, await image.elementHandle())
          await image.evaluate(img => img.decode())
          assert.equal(await image.evaluate(img => img.naturalWidth > 0),true)
        }
      }
      const file = `${label}-${name}.png`
      if (target) await target.screenshot({path:path.join(out,file),animations:'disabled'})
      else await page.screenshot({path:path.join(out,file),animations:'disabled'})
      report.screenshots.push({file,width,locale,theme,reducedMotion,route:new URL(page.url()).pathname,state:name})
    }
    await check(`${label}: homepage keeps original design and features four projects`, async () => {
      await open(prefix)
      assert.equal(await page.locator(locale === 'en' ? '.en-home' : '.v2-home').count(),1)
      const cards = page.locator('#work [data-project-card]')
      assert.equal(await cards.count(),4)
      for (const repo of ['Glassbox-Agent-Harness','AgentArena','ai-engineering-harness','zhihu-threads']) assert.equal(await cards.filter({has:page.locator(`[data-destination="${repo}"]`)}).count(),1,repo)
      await capture('home')
      const glassbox = card('Glassbox-Agent-Harness')
      assert.equal((await glassbox.locator('h3').textContent()).trim(),'Glassbox')
      const text = await glassbox.locator('.project-body > p').textContent()
      assert.match(text,locale === 'zh' ? /个人 Agent 工作台/ : /personal agent workbench/)
      assert.match(text,/Codex/); assert.match(text,/Claude Code/)
      assert.match(text,locale === 'zh' ? /微信、QQ、长期任务和学习沉淀仍在规划/ : /WeChat, QQ, long tasks and learning remain planned/)
      const lines = await glassbox.locator('[data-line]').allTextContents()
      assert.equal(lines.length,3)
      assert.match(lines[2],locale === 'zh' ? /规划/ : /Planned/)
      assert.doesNotMatch(lines.join(' '),/glassbox attach|verdict: pass/)
      await capture('glassbox-home-card',glassbox)
      await capture('zhihu-home-card',card('zhihu-threads'))
    })
    await check(`${label}: Zhihu homepage link opens existing localized case`, async () => {
      await open(prefix)
      const link = card('zhihu-threads').locator('[data-interaction="project_website"]')
      await link.click()
      assert.equal(new URL(page.url()).pathname.replace(/\/$/,''),`${basePath}${prefix}projects/zhihu-threads`)
      await page.locator('[data-zhihu-case]').waitFor()
      await capture('zhihu-case')
    })
    await check(`${label}: works retain matching artwork and pinned Glassbox source`, async () => {
      await open(locale === 'en' ? 'en/work/' : 'projects/')
      const glassbox = card('Glassbox-Agent-Harness')
      assert.equal((await glassbox.locator('h3').textContent()).trim(),'Glassbox')
      const source = glassbox.locator(`a[href="${glassboxReadme}"]`)
      assert.equal(await source.count(),1)
      assert.equal(await source.getAttribute('target'),'_blank')
      assert.match(await source.getAttribute('rel'),/noopener/)
      assert.equal(await page.locator('a[href*="/enhttps:"]').count(),0)
      await capture('glassbox-work-card',glassbox)
      const zhihu = card('zhihu-threads')
      assert.equal((await zhihu.locator('h3').textContent()).trim(),'Zhihu Threads')
      const image = zhihu.locator('[data-project-poster]')
      assert.match(await image.getAttribute('src'),new RegExp(`lora-v3-project-zhihu-threads-${locale}`))
      await capture('zhihu-work-card',zhihu)
    })
    await check(`${label}: updated capability text copies after keyboard activation`, async () => {
      await open(prefix)
      await page.evaluate(() => Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value => {window.__copiedCapability=value}}}))
      const glassbox = card('Glassbox-Agent-Harness')
      const planned = glassbox.locator('[data-line="2"]')
      await planned.press('Enter')
      await page.waitForFunction(() => typeof window.__copiedCapability === 'string')
      assert.equal(await page.evaluate(() => window.__copiedCapability),await planned.getAttribute('data-text'))
      await capture('glassbox-copy-feedback',glassbox)
      assert.deepEqual(errors,[])
    })
    await context.close()
  }
  await check('Existing Lora and Mochi cover assets remain byte-identical', async () => {
    const assets = {
      'lora-v1-project-glassbox.webp':'f1fc0f97c4f7c50bacff41f9d98d89eb2835c549f1fd4855f18a3f158c7337d1',
      'lora-v3-project-zhihu-threads-zh.webp':'005d49a036e3b9900a916aea1d6824a7a62ffa19b98297506dc7dad3a96be30b',
      'lora-v3-project-zhihu-threads-en.webp':'129e397fd6fa44b282e847542467dfead9ee7f02fee088b0b81a252394ac109c'
    }
    for (const [file, hash] of Object.entries(assets)) assert.equal(createHash('sha256').update(await readFile(path.join('src/assets/projects',file))).digest('hex'),hash,file)
  })
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
  report.completedAt = new Date().toISOString()
  await writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2))
}
console.log(JSON.stringify({checks:report.checks.length,failed:report.checks.filter(item=>!item.passed).length,out}))
if (report.checks.some(item=>!item.passed)) process.exitCode=1
