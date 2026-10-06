// Standalone functions can run both in Playwright's page and in Node regression tests.
export async function readSearchIndex({ base, query, filters = {}, origin = location.origin }, engine) {
  const pagefind = engine ?? await import(`${origin}${base}pagefind/pagefind.js`)
  await pagefind.filters()
  const found = await pagefind.search(query, { filters })
  const indexed = []
  // Keep complete coverage without sending an unbounded fragment burst to the CDN.
  // A corrupt or missing fragment still fails; nothing is retried or discarded.
  for (let offset = 0; offset < found.results.length; offset += 8) {
    indexed.push(...await Promise.all(found.results.slice(offset, offset + 8).map(async (item) => {
      const data = await item.data()
      return { title: data.meta.title, href: new URL(data.url, origin).href, kind: data.filters['search-kind']?.[0] }
    })))
  }
  return indexed
}

export function searchResultsReady({ query, kind, expected }, root = document) {
  const results = [...root.querySelectorAll('.pagefind-ui__result')]
  const message = root.querySelector('.pagefind-ui__message')?.textContent ?? ''
  const total = Number(message.match(/\d+/)?.[0])
  return message.includes(query) && total > 0 && (expected === undefined || total === expected)
    && results.length === Math.min(total, 5)
    && results.every((result) => (!kind || result.dataset.searchKind === kind)
      && Boolean(result.querySelector('.pagefind-ui__result-link')))
}

export async function followReadingLink(page, link) {
  const target = new URL(await link.getAttribute('href'), page.url()).href
  await link.click({ noWaitAfter: true })
  // Wait for the destination DOM, not unrelated media delaying the load event.
  await page.waitForURL(target, { waitUntil: 'domcontentloaded' })
  // Cross-document transitions can still intercept the next real click after DOM ready.
  // Observe completion instead of clicking through the overlay or disabling animation.
  await page.waitForFunction(() => !document.activeViewTransition, null, { timeout: 5000 })
}

export function automaticViewTransitionsEnabled(root = document, matches = query => matchMedia(query).matches) {
  const walk = rules => [...rules].some(rule => {
    if (rule.media && !matches(rule.conditionText)) return false
    if (/^@view-transition\b/.test(rule.cssText)) return /navigation:\s*auto\b/.test(rule.cssText)
    return rule.cssRules ? walk(rule.cssRules) : false
  })
  return [...root.styleSheets].some(sheet => {
    try { return walk(sheet.cssRules) } catch { return false }
  })
}
