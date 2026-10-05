import assert from 'node:assert/strict'
import test from 'node:test'
import { readSearchIndex, searchResultsReady, followReadingLink } from './reading-quality.mjs'

test('complete index hydration retains lower-ranked articles with bounded concurrency', async () => {
  let active = 0
  let peak = 0
  const engine = {
    filters: async () => {},
    search: async () => ({ results: Array.from({ length: 25 }, (_, index) => ({
      data: async () => {
        peak = Math.max(peak, ++active)
        await new Promise(resolve => setImmediate(resolve))
        active--
        return { url: `/base/${index < 5 ? 'tags' : 'blog'}/${index}`, meta: { title: `${index}` }, filters: { 'search-kind': [index < 5 ? 'archive' : 'article'] } }
      }
    })) })
  }
  const result = await readSearchIndex({ base: '/base/', query: 'Harness', origin: 'https://example.test' }, engine)
  assert.equal(result.length, 25)
  assert.equal(result.filter(item => item.kind === 'article').length, 20)
  assert.deepEqual(result.map(item => item.title), Array.from({ length: 25 }, (_, index) => `${index}`))
  assert.equal(peak, 8)
})

test('a corrupt fragment is a failure, never an empty or partial success', async () => {
  const engine = { filters: async () => {}, search: async () => ({ results: [{ data: async () => { throw new Error('invalid gzip data') } }] }) }
  await assert.rejects(readSearchIndex({ base: '/', query: 'Harness', origin: 'https://example.test' }, engine), /invalid gzip data/)
})

function resultsDOM(kinds, { query = 'Harness', total = 9, incomplete = -1 } = {}) {
  return {
    querySelector: () => ({ textContent: `找到 ${total} 条与 ${query} 匹配的结果` }),
    querySelectorAll: () => kinds.map((kind, index) => ({ dataset: { searchKind: kind }, querySelector: () => index === incomplete ? null : {} }))
  }
}

test('article readiness rejects the first result, old filters and incomplete hydration', () => {
  const target = { query: 'Harness', kind: 'article' }
  assert.equal(searchResultsReady(target, resultsDOM(['article'])), false)
  assert.equal(searchResultsReady(target, resultsDOM(Array(5).fill('archive'))), false)
  assert.equal(searchResultsReady(target, resultsDOM(Array(5).fill('article'), { incomplete: 4 })), false)
  assert.equal(searchResultsReady(target, resultsDOM(Array(5).fill('article'), { query: 'Agent' })), false)
  assert.equal(searchResultsReady(target, resultsDOM(Array(5).fill('article'))), true)
  assert.equal(searchResultsReady(target, resultsDOM(['article'], { total: 1 })), true)
})


test('reading navigation waits for destination DOM even when media never reaches load', async () => {
  const calls = []
  const page = {
    url: () => 'https://example.test/base/blog',
    waitForURL: async (url, options) => {
      assert.equal(url, 'https://example.test/base/blog/series/example')
      assert.equal(options.waitUntil, 'domcontentloaded')
      calls.push('destination-dom')
    },
    waitForFunction: async (predicate, argument, options) => {
      assert.match(predicate.toString(), /activeViewTransition/)
      assert.equal(options.timeout, 5000)
      calls.push('transition-finished')
    }
  }
  const link = {
    getAttribute: async () => '/base/blog/series/example',
    click: async options => {
      assert.equal(options.noWaitAfter, true)
      calls.push('real-click')
    }
  }
  await followReadingLink(page, link)
  assert.deepEqual(calls, ['real-click', 'destination-dom', 'transition-finished'])
})

test('a stuck view transition fails navigation instead of being clicked through', async () => {
  const page = {
    url: () => 'https://example.test/base/blog',
    waitForURL: async () => {},
    waitForFunction: async () => { throw new Error('View transition did not finish') }
  }
  const link = { getAttribute: async () => '/base/blog/article', click: async () => {} }
  await assert.rejects(followReadingLink(page, link), /View transition did not finish/)
})
