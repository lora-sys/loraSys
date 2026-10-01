import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  readSearchState,
  SEARCH_KIND_FILTER,
  searchKindFilters,
  searchKindForPath,
  searchType,
  writeSearchState
} from '../src/utils/search.ts'

for (const base of ['/', '/website/']) {
  for (const [route, kind] of [
    ['/projects', 'project'], ['/projects/glassbox/', 'project'], ['/en/work', 'project'],
    ['/blog/agent-harness', 'article'], ['/en/writing', 'article'],
    ['/notes/release', 'note'], ['/lab/agent', 'lab'], ['/talks', 'talk'],
    ['/archives', 'archive'], ['/tags/agents', 'archive'], ['/about', 'page'],
    ['/blogger', 'page'], ['/projects-other', 'page'], ['/', 'page']
  ]) {
    assert.equal(searchKindForPath(`${base.replace(/\/$/, '')}${route}`, base), kind)
  }
}
assert.equal(searchKindForPath('/website-other/projects', '/website/'), 'page', 'Base path must match a complete segment')
assert.equal(searchType('article'), 'article')
assert.equal(searchType('bogus'), 'all')
assert.equal(searchType(null), 'all')
assert.deepEqual(searchKindFilters('project'), { [SEARCH_KIND_FILTER]: ['project'] })
assert.deepEqual(searchKindFilters('all'), { [SEARCH_KIND_FILTER]: [] })

const state = {
  query: 'Glassbox 中文',
  type: 'article',
  filters: { Topics: ['Agents', 'Memory: context'], '内容类型': ['技术文章'] }
}
const original = new URL('https://example.com/website/search?utm_source=test#search')
const next = writeSearchState(original, state)
assert.deepEqual(readSearchState(next.searchParams), state, 'Shareable search state must round-trip')
assert.equal(next.searchParams.get('utm_source'), 'test')
assert.equal(next.hash, '#search')
assert.equal(original.searchParams.has('q'), false, 'Serialization must not mutate the original URL')
const reset = writeSearchState(next, { query: '', type: 'all', filters: {} })
assert.equal(reset.searchParams.has('q'), false)
assert.equal(reset.searchParams.has('type'), false)
assert.equal(reset.searchParams.has('filter'), false)
assert.deepEqual(readSearchState(new URLSearchParams('type=invalid&filter=search-kind:project&filter=Topics:Agents&filter=Topics:Agents')), {
  query: '', type: 'all', filters: { Topics: ['Agents'] }
})

const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8')
assert.match(layout, /data-pagefind-filter=.*SEARCH_KIND_FILTER.*searchKindForPath/)
const search = await readFile(new URL('../src/components/search/LocalSearch.astro', import.meta.url), 'utf8')
assert.match(search, /triggerFilters\(\{ \.\.\.state\.filters, \.\.\.searchKindFilters\(state\.type\) \}\)/)
assert.doesNotMatch(search, /result\.hidden\s*=/, 'Search filtering must happen in the index, not on loaded cards')
const taxonomy = await readFile(new URL('../src/components/blog/WritingTaxonomy.astro', import.meta.url), 'utf8')
assert.match(taxonomy, /<details class='taxonomy-filter'>/, 'Filters stay collapsed on initial load, including selected category pages')
assert.match(taxonomy, /data-writing-selection/)
assert.match(taxonomy, /data-writing-reset/)
assert.match(taxonomy, /withBasePath\(home\)/, 'Reset retains the locale, language and deployment base')
console.log('Search URL, index classification and compact taxonomy regression checks passed.')
