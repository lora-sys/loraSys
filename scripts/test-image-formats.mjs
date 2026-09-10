import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(process.argv[2] || 'dist')
const output = path.resolve(process.env.IMAGE_TEST_OUTPUT || '/tmp/image-formats')
const baseline = path.resolve(process.env.IMAGE_BASELINE_ROOT || '.image-baseline')
await mkdir(output, { recursive: true })
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.avif':'image/avif', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.woff':'font/woff', '.wasm':'application/wasm' }
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    if (!['GET', 'HEAD'].includes(req.method) || !url.pathname.startsWith('/loraSys/')) { res.writeHead(404); res.end(); return }
    let file = path.resolve(root, decodeURIComponent(url.pathname.slice('/loraSys/'.length)))
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' })
    res.end(req.method === 'HEAD' ? undefined : data)
  } catch { res.writeHead(404); res.end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const site = `http://127.0.0.1:${server.address().port}/loraSys/`
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const browser = await chromium.launch({ headless:true, channel:'chromium' })
const report = { commit:process.env.IMAGE_TEST_COMMIT, browser:browser.version(), startedAt:new Date().toISOString(), checks:[], images:[], comparisons:[], screenshots:[], originalAssets:[] }
async function check(name, fn) {
  try { await fn(); report.checks.push({ name, passed:true }); console.log('PASS', name) }
  catch (error) { report.checks.push({ name, passed:false, error:String(error.stack) }); console.error('FAIL', name, error.message) }
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
}
async function inventory(directory, relative = '') {
  const entries = await readdir(path.join(directory, relative), { withFileTypes:true })
  const result = []
  for (const entry of entries) {
    const name = path.join(relative, entry.name)
    if (entry.isDirectory()) result.push(...await inventory(directory, name))
    else result.push({ path:name, sha256:createHash('sha256').update(await readFile(path.join(directory, name))).digest('hex') })
  }
  return result.sort((a,b) => a.path.localeCompare(b.path))
}
const median = values => [...values].sort((a,b) => a-b)[Math.floor(values.length/2)]
try {
  await check('Original illustration and project assets are unchanged', async () => {
    for (const directory of ['src/assets/lora-visual', 'src/assets/projects']) {
      const before = await inventory(path.join(baseline, directory))
      const after = await inventory(path.resolve(directory))
      assert.deepEqual(after, before, directory)
      report.originalAssets.push({ directory, files:after })
    }
  })
  for (const route of ['', 'en/', 'projects/', 'en/work/']) for (const width of [390,1440]) {
    await check(`${width} ${route || 'home'}: no image payload or fold geometry regression`, async () => {
      const runs = { before:[], after:[] }
      for (const phase of ['before','after']) for (let sample=1;sample<=3;sample++) {
        const data=JSON.parse(await readFile(path.join(path.dirname(output),`${phase}-${sample}`,'report.json'),'utf8'))
        assert.ok(data.checks.length && data.checks.every(item=>item.passed))
        const row=data.samples.find(item=>item.route===route && item.width===width)
        assert.ok(row,'Each comparison requires all three samples')
        runs[phase].push(row)
      }
      const before=median(runs.before.map(row=>row.imageBytes)),after=median(runs.after.map(row=>row.imageBytes))
      const result={route,width,beforeImageBytes:before,afterImageBytes:after,beforeLcpMs:median(runs.before.map(row=>row.metrics.lcp)),afterLcpMs:median(runs.after.map(row=>row.metrics.lcp))}
      report.comparisons.push(result)
      assert.ok(after<=before*1.02,`Image payload regression: ${before} -> ${after}`)
      assert.ok(runs.after.every(row=>row.metrics.cls<=0.03),'Layout shift exceeds the existing budget')
      assert.equal(runs.before[0].images.length,runs.after[0].images.length,'Do not save bandwidth by deleting images')
      runs.before[0].images.forEach((image,index)=>{
        const next=runs.after[0].images[index]
        if(!image.fold && !next.fold)return
        for(const key of ['width','height','top'])assert.ok(Math.abs(image[key]-next[key])<=1,`First-screen image ${index} changed ${key}`)
      })
    })
  }
  for (const format of ['avif', 'webp']) for (const width of [390,1440]) for (const lang of ['zh','en']) {
    const context = await browser.newContext({ viewport:{width,height:width === 390 ? 844 : 1000}, deviceScaleFactor:width === 390 ? 2 : 1, reducedMotion:'reduce', colorScheme:format === 'webp' ? 'dark' : 'light', serviceWorkers:'block' })
    await context.route('**/*', route => ['GET','HEAD'].includes(route.request().method()) && new URL(route.request().url()).origin === new URL(site).origin ? route.continue() : route.abort())
    const page = await context.newPage()
    page.setDefaultTimeout(15000)
    const errors = []; page.on('pageerror', error => errors.push(error.message))
    const cdp = await context.newCDPSession(page)
    if (format === 'webp') await cdp.send('Emulation.setDisabledImageTypes', { imageTypes:['avif'] })
    for (const route of lang === 'zh' ? ['', 'projects/'] : ['en/', 'en/work/']) {
      const name = `${format}-${width}-${route.replaceAll('/','-') || 'home'}`
      await check(name, async () => {
        assert.equal((await page.goto(new URL(route, site).href, {waitUntil:'load'})).status(), 200)
        await page.evaluate(() => document.fonts.ready)
        const heroImages = await page.locator('.hero-scene picture img').all()
        const project = page.locator('[data-project-card]').first()
        const targets = [...heroImages, ...await page.locator('main img.lora-visual--projectsMap').all(), ...await project.locator('img[data-project-poster]').all()]
        assert.ok(targets.length > 0, 'Changed image components must be present')
        for (const image of targets) {
          await image.scrollIntoViewIfNeeded()
          await page.waitForFunction(img => img.complete && img.naturalWidth > 0, await image.elementHandle())
          await image.evaluate(img => img.decode())
          const data = await image.evaluate(img => ({ url:img.currentSrc, fallback:img.src, isProject:img.hasAttribute('data-project-poster'), width:img.getBoundingClientRect().width, height:img.getBoundingClientRect().height, alt:img.alt, loading:img.loading, sizes:img.sizes, avifSource:img.closest('picture')?.querySelector('source[type="image/avif"]')?.srcset, hasDimensions:Number(img.getAttribute('width')) > 0 && Number(img.getAttribute('height')) > 0 }))
          const expectedFormat=data.isProject ? 'webp' : format
          assert.ok(new URL(data.url).pathname.endsWith(`.${expectedFormat}`), data.url)
          assert.ok(new URL(data.fallback).pathname.endsWith('.webp'), data.fallback)
          assert.ok(data.isProject || data.avifSource)
          assert.ok(data.hasDimensions && data.width > 0 && data.height > 0)
          report.images.push({ name, ...data })
        }
        assert.deepEqual(errors, [])
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        await project.scrollIntoViewIfNeeded()
        const cardFile = `${name}-card.png`
        await page.screenshot({path:path.join(output, cardFile), animations:'disabled'})
        report.screenshots.push({file:cardFile, width, lang, format, state:'project', route})
        await page.evaluate(() => window.scrollTo({ top:0, behavior:'instant' }))
        await page.waitForFunction(() => window.scrollY === 0)
        const file = `${name}.png`
        await page.screenshot({path:path.join(output,file), animations:'disabled'})
        report.screenshots.push({file, width, lang, format, state:'top', route})
      })
    }
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
  report.completedAt = new Date().toISOString()
  await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2))
}
if (report.checks.some(check => !check.passed)) process.exitCode = 1
