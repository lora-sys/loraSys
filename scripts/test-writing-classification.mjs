import assert from 'node:assert/strict'

import {
  mapSourceClassification,
  normalizeSourceTopics,
  readFrontmatter,
  validateClassification,
  validateSourceClassification
} from './lib/writing-classification.mjs'

const valid = { contentType: 'technical', topics: ['agents', 'evaluation'] }
assert.deepEqual(validateClassification(valid), [])
for (const data of [
  { topics: ['agents'] },
  { ...valid, contentType: 'AI' },
  { ...valid, topics: [] },
  { ...valid, topics: ['AI Agent'] },
  { ...valid, topics: ['agents', 'agents'] },
  { ...valid, series: 'unknown' },
  { ...valid, series: 'agent-engineering-reading' }
])
  assert.ok(validateClassification(data).length, JSON.stringify(data))
assert.deepEqual(validateClassification({ contentType: 'news', topics: ['agents'] }), [])
assert.deepEqual(mapSourceClassification('engineering-news', '增量补充'), {
  contentType: 'news',
  series: 'agent-engineering-reading'
})
assert.deepEqual(mapSourceClassification('editorial', '有趣项目介绍'), { contentType: 'projects' })
assert.throws(() => mapSourceClassification('editorial', '产品机会雷达'), /Unmapped/)
assert.throws(() => mapSourceClassification('unknown', '周报'), /Unmapped/)
const article =
  '---\ntitle: "News: a title"\ncontentType: news\ntopics:\n  - agents\n---\n# Body\n\n![Image](./unchanged.webp)\n'
const parsed = readFrontmatter(article)
assert.equal(parsed.data.title, 'News: a title')
assert.deepEqual(validateClassification(parsed.data), [])
assert.equal(parsed.prefix + parsed.body, article)
console.log('Writing classification regression checks passed.')

assert.deepEqual(normalizeSourceTopics(['AI Agent', 'MCP', 'Harness', 'AI 软件工程']), [
  'agents',
  'mcp-skills',
  'agent-harness'
])
assert.throws(() => normalizeSourceTopics(['unreviewed topic']), /Unmapped/)
assert.ok(
  validateSourceClassification('engineering-news', '周报', {
    contentType: 'news',
    topics: ['agents']
  }).length
)

assert.ok(
  validateSourceClassification('editorial', '有趣项目介绍', {
    contentType: 'technical',
    topics: ['agents']
  }).length
)
assert.deepEqual(
  validateSourceClassification('editorial', '有趣项目介绍', {
    contentType: 'projects',
    topics: ['agents']
  }),
  []
)
