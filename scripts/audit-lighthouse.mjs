import { gzipSync } from 'node:zlib'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, readdir, mkdir, writeFile, stat } from 'node:fs/promises'
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
      const textual = /\.(html|css|js|json|svg|xml)$/.test(file)
      const compressed = textual && /gzip/.test(req.headers['accept-encoding'] || '')
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', ...(compressed ? { 'Content-Encoding':'gzip', Vary:'Accept-Encoding' } : {}) }); res.end(compressed ? gzipSync(body) : body)
    } catch { res.writeHead(404); res.end('Not found') }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  site = `http://127.0.0.1:${server.address().port}${base}`
}
report.site = site
report.transport = 'Gzip for text resources, matching static production delivery. Simulated mobile throttling remains enabled.'
const modules = process.env.QUALITY_TOOLS
const { default: lighthouse } = await import(pathToFileURL(path.join(modules,'lighthouse/core/index.js')).href)
const chromeLauncher = await import(pathToFileURL(path.join(modules,'chrome-launcher/dist/index.js')).href)
const chrome = await chromeLauncher.launch({ chromePath:chromium.executablePath(), chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage'] })
try {
 for(const route of ['', 'projects/', 'en/work/', 'projects/zhihu-threads/']) for(let sample=1;sample<=3;sample++) {
  const result=await lighthouse(new URL(route,site).href, { port:chrome.port, output:'json', logLevel:'error', onlyCategories:['performance','accessibility','best-practices','seo'] })
  const name=route.replaceAll('/','-')||'home'
  await writeFile(path.join(output,`${name}-${sample}.json`),result.report)
  report.checks.push({route,sample,scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,v.score])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift'].map(k=>[k,result.lhr.audits[k]?.numericValue]))})
 }
 await writeFile(path.join(output,'summary.json'),JSON.stringify(report,null,2))
}finally{
 await chrome.kill()
 if(server)await new Promise(resolve=>server.close(resolve))
}
