import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'

const root = path.resolve(process.argv[2] || 'dist')
const out = path.resolve(process.env.IMAGE_TEST_OUTPUT || '/tmp/image-delivery')
const basePath = '/loraSys/'
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.wasm':'application/wasm','.pdf':'application/pdf'}
await mkdir(out,{recursive:true})
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
let server
let site = process.env.IMAGE_TEST_URL
if (!site) {
 server = createServer(async(req,res)=>{
  try {
   const url = new URL(req.url,'http://localhost')
   if(!['GET','HEAD'].includes(req.method)||!url.pathname.startsWith(basePath)){res.writeHead(404);res.end();return}
   let file = path.resolve(root, decodeURIComponent(url.pathname.slice(basePath.length)))
   if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
   if((await stat(file)).isDirectory())file=path.join(file,'index.html')
   let body=await readFile(file);const ext=path.extname(file)
   const headers={'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'public, max-age=600'}
   if(['.html','.js','.css','.json','.svg'].includes(ext)&&req.headers['accept-encoding']?.includes('gzip')){body=gzipSync(body);headers['Content-Encoding']='gzip'}
   headers['Content-Length']=String(body.length);res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:body)
  }catch{res.writeHead(404);res.end()}
 })
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
 site=`http://127.0.0.1:${server.address().port}${basePath}`
}
const report={version:1,site,commit:process.env.IMAGE_TEST_COMMIT||null,label:process.env.IMAGE_TEST_LABEL||'measurement',startedAt:new Date().toISOString(),environment:{downloadBitsPerSecond:1600000,uploadBitsPerSecond:768000,latencyMs:150,cpuSlowdown:4,cache:'disabled',reducedMotion:'reduce'},samples:[],checks:[],screenshots:[]}
const browser=await chromium.launch({headless:true,channel:'chromium'})
report.environment.browser=browser.version()
const save=()=>writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2))
const checks=async(name,fn)=>{try{await fn();report.checks.push({name,passed:true})}catch(e){report.checks.push({name,passed:false,error:String(e.stack)});console.error(name,e.message)}await save()}
const rounds=Number(process.env.IMAGE_TEST_ROUNDS||'1')
const routes=(process.env.IMAGE_TEST_ROUTES||',en/,projects/,en/work/').split(',')
try {
 for(let round=1;round<=rounds;round++)for(const width of [390,1440])for(const route of routes){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},deviceScaleFactor:width===390?2:1,isMobile:width===390,hasTouch:width===390,reducedMotion:'reduce',serviceWorkers:'block'})
  const page=await context.newPage();page.setDefaultTimeout(15000)
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  const cdp=await context.newCDPSession(page)
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true})
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:768000/8,connectionType:'cellular4g'})
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4})
  const net=new Map()
  cdp.on('Network.requestWillBeSent',e=>net.set(e.requestId,{url:e.request.url,type:e.type,priority:e.request.initialPriority,start:e.timestamp,initiator:e.initiator.type}))
  cdp.on('Network.responseReceived',e=>Object.assign(net.get(e.requestId)||{},{status:e.response.status,mime:e.response.mimeType,cache:e.response.fromDiskCache||false}))
  cdp.on('Network.loadingFinished',e=>Object.assign(net.get(e.requestId)||{},{bytes:e.encodedDataLength,end:e.timestamp}))
  cdp.on('Network.loadingFailed',e=>Object.assign(net.get(e.requestId)||{},{error:e.errorText}))
  await page.addInitScript(()=>{
   window.__imageMetrics={lcp:0,cls:0,lcpUrl:'',lcpTag:''}
   new PerformanceObserver(list=>{for(const e of list.getEntries()){window.__imageMetrics.lcp=e.startTime;window.__imageMetrics.lcpUrl=e.url||'';window.__imageMetrics.lcpTag=e.element?.tagName||''}}).observe({type:'largest-contentful-paint',buffered:true})
   new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__imageMetrics.cls+=e.value}).observe({type:'layout-shift',buffered:true})
  })
  const name=`${width}-${route.replaceAll('/','-')||'home'}-${round}`
  await checks(name,async()=>{
   const response=await page.goto(new URL(route,site).href,{waitUntil:'load',timeout:60000});assert.equal(response.status(),200)
   await page.evaluate(()=>document.fonts.ready)
   await page.waitForLoadState('networkidle',{timeout:30000})
   const info=await page.evaluate(()=>({metrics:window.__imageMetrics,elapsed:performance.now(),overflow:document.documentElement.scrollWidth-innerWidth,images:[...document.images].map(img=>{const r=img.getBoundingClientRect();return {src:img.getAttribute('src'),url:img.currentSrc,srcset:img.srcset,sizes:img.sizes,loading:img.loading,priority:img.fetchPriority,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,width:r.width,height:r.height,top:r.top,visible:r.width>0&&r.height>0,fold:r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0,alt:img.alt}})}))
   const requests=[...net.values()];const images=requests.filter(n=>n.type==='Image'||n.mime?.startsWith('image/'))
   report.samples.push({name,route,width,dpr:width===390?2:1,round,documentSha256:createHash('sha256').update(await response.body()).digest('hex'),...info,imageBytes:images.reduce((s,n)=>s+(n.bytes||0),0),imageRequests:images.length,totalBytes:requests.reduce((s,n)=>s+(n.bytes||0),0),requests,errors})
   await save();console.log('MEASURED',name,images.reduce((sum,n)=>sum+(n.bytes||0),0))
   assert.ok(info.overflow<=1,`Horizontal overflow ${info.overflow}`)
   assert.deepEqual(errors,[],'Uncaught browser errors')
   assert.ok(info.images.filter(i=>i.fold).every(i=>i.complete&&i.naturalWidth>0),'All first-screen images must decode')
   if(round===1){
    const screen=`${name}.png`;await page.screenshot({path:path.join(out,screen),animations:'disabled'});report.screenshots.push({file:screen,route,width,state:'initial'})
    const target=page.locator('[data-project-card]').first()
    if(await target.count()){
     await target.scrollIntoViewIfNeeded()
     const image=target.locator('img').first()
     if(await image.count()){
      await image.scrollIntoViewIfNeeded()
      await page.waitForFunction(img=>img.complete&&img.naturalWidth>0,await image.elementHandle(),{timeout:15000})
      await image.evaluate(img=>img.decode())
     }
     const file=`${name}-project.png`;await page.screenshot({path:path.join(out,file),animations:'disabled'});report.screenshots.push({file,route,width,state:'project'})
    }
   }
  })
  await context.close();await save()
 }
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));report.completedAt=new Date().toISOString();await save()}
console.log(JSON.stringify({label:report.label,samples:report.samples.map(({name,imageBytes,imageRequests,metrics})=>({name,imageBytes,imageRequests,metrics})),failed:report.checks.filter(c=>!c.passed)},null,2))
if(report.checks.some(c=>!c.passed))process.exitCode=1
