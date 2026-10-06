import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

// Use the same source that supplies server-side Pagefind metadata and client-side badges.
const require = createRequire(import.meta.url)
const ts = require('typescript')
const source = await readFile(new URL('../src/utils/search.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
})
const { searchKindForPath, searchKindFilters, readSearchState, writeSearchState } =
  await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)

const archiveRoutes = [
  '/blog', '/blog/2', '/blog/20', '/blog/language', '/blog/language/en-US',
  '/blog/type', '/blog/type/news', '/blog/type/news/2',
  '/blog/topic', '/blog/topic/security', '/blog/series',
  '/blog/series/agent-engineering-reading', '/en/writing',
  '/en/writing/type/news', '/en/writing/topic/security',
  '/en/writing/series/agent-engineering-reading',
  '/en/writing/loop-engineering-harness', '/tags', '/tags/harness', '/archives'
]
for (const base of ['/', '/loraSys/']) {
  test(`writing listings and legacy aliases are archives, not articles, under ${base}`, () => {
    for (const route of archiveRoutes) {
      for (const suffix of ['', '/']) {
        assert.equal(searchKindForPath(`${base.slice(0, -1)}${route}${suffix}`, base), 'archive', route)
      }
    }
  })
  test(`canonical originals and translations stay articles under ${base}`, () => {
    for (const slug of ['loop-engineering-harness', 'loop-engineering-harness-en', 'ai-agent-engineering-news-2026-10-05-06']) {
      for (const suffix of ['', '/']) {
        assert.equal(searchKindForPath(`${base}blog/${slug}${suffix}`, base), 'article', slug)
      }
    }
  })
  test(`other search categories remain stable under ${base}`, () => {
    for (const [route, kind] of [
      ['projects', 'project'], ['en/work', 'project'], ['en/projects/example', 'project'],
      ['notes', 'note'], ['lab', 'lab'], ['talks', 'talk'], ['about', 'page']
    ]) assert.equal(searchKindForPath(`${base}${route}`, base), kind, route)
  })
}

test('deployment prefix removal requires a complete path segment', () => {
  assert.equal(searchKindForPath('/loraSys-extra/blog/example', '/loraSys/'), 'page')
  assert.equal(searchKindForPath('/blogger/example'), 'page')
})

test('article filter is an index filter and survives a shareable URL round trip', () => {
  const state = { query: 'Harness', type: 'article', filters: { Topics: ['agents'] } }
  assert.deepEqual(searchKindFilters(state.type), { 'search-kind': ['article'] })
  const url = writeSearchState(new URL('https://example.test/loraSys/search'), state)
  assert.deepEqual(readSearchState(url.searchParams), state)
  assert.deepEqual(searchKindFilters('all'), { 'search-kind': [] })
})
