import assert from 'node:assert/strict'

// Uses the complete index as the oracle, then checks each UI page against that set.
export async function assertSearchPagination(page, base, open, route = 'search') {
  await open(route)
  const input = page.locator('.pagefind-ui__search-input')
  await input.waitFor({ state: 'visible' })
  const query = route.startsWith('en/') ? 'Agent' : 'Glassbox'
  await input.fill(query)
  const indexed = await page.evaluate(async ({ base, query }) => {
    const pagefind = await import(`${location.origin}${base}pagefind/pagefind.js`)
    await pagefind.filters()
    const read = async (filters) => {
      const found = await pagefind.search(query, { filters })
      return Promise.all(found.results.map(async (item) => {
        const data = await item.data()
        return { url: new URL(data.url, location.origin).pathname.replace(/\/$/, ''), kind: data.filters['search-kind']?.[0] }
      }))
    }
    return { all: await read({}), articles: await read({ 'search-kind': ['article'] }), projects: await read({ 'search-kind': ['project'] }) }
  }, { base, query })
  assert.ok(indexed.all.length > 5, `${route}: query must exercise pagination`)
  assert.ok(indexed.all.every((item) => item.kind), 'Every indexed result needs stable type metadata')
  assert.deepEqual(indexed.articles.map((item) => item.url).sort(), indexed.all.filter((item) => item.kind === 'article').map((item) => item.url).sort())
  assert.deepEqual(indexed.projects.map((item) => item.url).sort(), indexed.all.filter((item) => item.kind === 'project').map((item) => item.url).sort())

  const waitForResults = async (expected, kind = 'all') => {
    await page.waitForFunction(({ expected, kind, query }) => {
      const results = [...document.querySelectorAll('.pagefind-ui__result')]
      const loaded = results.filter((item) => item.querySelector('.pagefind-ui__result-link'))
      const message = document.querySelector('.pagefind-ui__message')?.textContent ?? ''
      return message.includes(query) && Number(message.match(/\d+/)?.[0]) === expected
        && loaded.length === Math.min(expected, 5)
        && (kind === 'all' || loaded.every((item) => item.dataset.searchKind === kind))
    }, { expected, kind, query })
  }
  await waitForResults(indexed.all.length)
  assert.match(await page.locator('[data-filter-count]').textContent(), /(?:已加载 5 条|5 matching results loaded)/)
  assert.doesNotMatch(await page.locator('[data-filter-count]').textContent(), /共 5 条|5 total|Showing all 5/)
  await page.locator('.pagefind-ui__button').click()
  const nextPageSize = Math.min(10, indexed.all.length)
  await page.waitForFunction((count) => [...document.querySelectorAll('.pagefind-ui__result')].filter((item) => item.querySelector('.pagefind-ui__result-link')).length === count, nextPageSize)
  assert.match(await page.locator('[data-filter-count]').textContent(), new RegExp(`(?:已加载 ${nextPageSize} 条|${nextPageSize} matching results loaded)`))

  for (const [kind, expected] of [['article', indexed.articles], ['project', indexed.projects]]) {
    assert.ok(expected.length > 0, `${route}: ${query} should include ${kind} results`)
    await page.locator(`[data-search-type="${kind}"]`).click()
    await waitForResults(expected.length, kind)
    assert.equal(new URL(page.url()).searchParams.get('type'), kind)
    let loaded = Math.min(expected.length, 5)
    while (loaded < expected.length) {
      await page.locator('.pagefind-ui__button').click()
      loaded = Math.min(loaded + 5, expected.length)
      await page.waitForFunction((loaded) => [...document.querySelectorAll('.pagefind-ui__result')].filter((item) => item.querySelector('.pagefind-ui__result-link')).length === loaded, loaded)
    }
    const actual = await page.locator('.pagefind-ui__result').evaluateAll((items) => items.map((item) => new URL(item.querySelector('.pagefind-ui__result-link').href).pathname.replace(/\/$/, '')))
    assert.deepEqual(actual.sort(), expected.map((item) => item.url).sort(), 'Filtered pagination must expose every match, including items outside the unfiltered first page')
    assert.equal(await page.locator('.pagefind-ui__result[hidden]').count(), 0, 'No DOM-only filtering')
    assert.equal(await page.locator('.pagefind-ui__button').count(), 0, 'Pagination finishes at the actual filtered total')
  }

  await page.reload()
  await waitForResults(indexed.projects.length, 'project')
  assert.equal(await input.inputValue(), query, 'Reload preserves the shareable query')
  assert.equal(await page.locator('[data-search-type="project"]').getAttribute('aria-pressed'), 'true')
  await page.locator('[data-search-reset]').click()
  await waitForResults(indexed.all.length)
  assert.equal(new URL(page.url()).searchParams.has('type'), false)
  assert.equal(await page.locator('[data-search-reset]').isVisible(), false)
  assert.equal(await input.inputValue(), query, 'Clear filters retains the query')

  // A type with no matches must reach Pagefind's empty state and offer a reset.
  const emptyKind = ['note', 'lab', 'talk', 'archive', 'page'].find((kind) => !indexed.all.some((item) => item.kind === kind))
  assert.ok(emptyKind, 'Fixture needs an empty filter')
  await page.locator(`[data-search-type="${emptyKind}"]`).click()
  await page.waitForFunction(() => document.querySelector('.pagefind-ui__results')
    && document.querySelectorAll('.pagefind-ui__result').length === 0
    && /没有找到|No results/.test(document.querySelector('.pagefind-ui__message')?.textContent ?? ''))
  assert.equal(await page.locator('[data-search-reset]').isVisible(), true)
  assert.equal(await page.locator('[data-filter-count]').isVisible(), false)
  await page.locator('[data-search-reset]').click()
  await waitForResults(indexed.all.length)
  return { route, total: indexed.all.length, articles: indexed.articles.length, projects: indexed.projects.length }
}
