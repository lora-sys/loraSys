import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';

async function runPerformanceTest() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    console.log('🚀 Starting performance analysis...\n');

    // Basic page load test
    const page = await browser.newPage();
    const startTime = Date.now();

    console.log('📊 Testing page load performance...');
    await page.goto('http://localhost:4174/', { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    console.log(`✅ Page loaded in ${loadTime}ms\n`);

    // Get page metrics
    const metrics = await page.metrics();
    console.log('📈 Page Metrics:');
    console.log(`   - JS Heap Used: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - JS Heap Total: ${(metrics.JSHeapTotalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Page Layout Count: ${metrics.LayoutCount}`);
    console.log(`   - Page Recalc Style Count: ${metrics.RecalcStyleCount}\n`);

    // Lighthouse audit
    console.log('🔍 Running Lighthouse audit...');
    const runnerResult = await lighthouse('http://localhost:4174/', {
      logLevel: 'info',
      output: 'json',
      port: new URL(browser.wsEndpoint()).port,
    });

    const { lhr } = runnerResult;
    console.log('📋 Lighthouse Scores:');
    console.log(`   - Performance: ${Math.round(lhr.categories.performance.score * 100)}/100`);
    console.log(`   - Accessibility: ${Math.round(lhr.categories.accessibility.score * 100)}/100`);
    console.log(`   - Best Practices: ${Math.round(lhr.categories['best-practices'].score * 100)}/100`);
    console.log(`   - SEO: ${Math.round(lhr.categories.seo.score * 100)}/100\n`);

    // Performance metrics
    console.log('⚡ Key Performance Metrics:');
    const audits = lhr.audits;
    console.log(`   - First Contentful Paint: ${audits['first-contentful-paint'].displayValue}`);
    console.log(`   - Largest Contentful Paint: ${audits['largest-contentful-paint'].displayValue}`);
    console.log(`   - Cumulative Layout Shift: ${audits['cumulative-layout-shift'].displayValue}`);
    console.log(`   - Total Blocking Time: ${audits['total-blocking-time'].displayValue}`);
    console.log(`   - Speed Index: ${audits['speed-index'].displayValue}\n`);

    // Bundle size analysis
    console.log('📦 Bundle Analysis:');
    const bundleRequests = lhr.audits['resource-summary'].details.items.filter(item =>
      item.resourceType === 'Script' || item.resourceType === 'Stylesheet'
    );

    let totalBundleSize = 0;
    bundleRequests.forEach(item => {
      totalBundleSize += item.transferSize;
      console.log(`   - ${item.url.split('/').pop()}: ${(item.transferSize / 1024).toFixed(1)} KB`);
    });
    console.log(`   - Total bundle size: ${(totalBundleSize / 1024 / 1024).toFixed(2)} MB\n`);

    // Recommendations
    console.log('💡 Performance Recommendations:');

    if (lhr.categories.performance.score < 0.9) {
      console.log('   ⚠️  Performance score below 90. Consider:');
      if (audits['unused-javascript'].score < 1) {
        console.log('      - Remove unused JavaScript');
      }
      if (audits['unused-css-rules'].score < 1) {
        console.log('      - Remove unused CSS rules');
      }
      if (audits['render-blocking-resources'].score < 1) {
        console.log('      - Eliminate render-blocking resources');
      }
      if (audits['largest-contentful-paint'].score < 0.75) {
        console.log('      - Optimize Largest Contentful Paint');
      }
    }

    if (totalBundleSize > 1024 * 1024) { // > 1MB
      console.log('   ⚠️  Bundle size is large. Consider code splitting or lazy loading.');
    }

    await page.close();

  } catch (error) {
    console.error('❌ Error during performance test:', error.message);
  } finally {
    await browser.close();
  }
}

runPerformanceTest();