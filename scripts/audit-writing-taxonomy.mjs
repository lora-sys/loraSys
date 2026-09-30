import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import taxonomy from '../src/data/writing-taxonomy.json' with { type: 'json' }

const dist = path.resolve('dist')
const read = (route) => readFile(path.join(dist, route, 'index.html'), 'utf8')
const canonicalIds = (html) =>
  new Set(
    [...html.matchAll(/href=["'][^"']*\/blog\/([^/"'?#]+)\/?["']/g)]
      .map((match) => match[1])
      .filter((id) => !/^\d+$/.test(id) && id !== 'language')
  )
const allEnglish = await read('en/writing')
const allIds = canonicalIds(allEnglish)
assert.ok(allIds.size > 0, 'Writing archive must contain canonical articles')
const rss = await readFile(path.join(dist, 'rss.xml'), 'utf8')
const rssLinks = new Set(
  [...rss.matchAll(/<link>[^<]*\/blog\/([^/<]+)\/?<\/link>/g)].map((match) => match[1])
)
assert.deepEqual(
  [...rssLinks].sort(),
  [...allIds].sort(),
  'RSS keeps exactly one entry per canonical article'
)
const seenTypes = new Set()
for (const [kind, values] of Object.entries({
  type: taxonomy.contentTypes,
  topic: taxonomy.topics,
  series: taxonomy.series
})) {
  for (const value of Object.keys(values)) {
    const english = await read(`en/writing/${kind}/${value}`)
    assert.match(
      english,
      /data-pagefind-ignore="all"/,
      'Filtered archives must not duplicate article search results'
    )
    const englishIds = canonicalIds(english)
    const directory = path.join(dist, 'blog', kind, value)
    const pages = [
      'index.html',
      ...(await readdir(directory, { withFileTypes: true }))
        .filter((item) => item.isDirectory() && /^\d+$/.test(item.name))
        .map((item) => `${item.name}/index.html`)
    ]
    const chineseIds = new Set()
    for (const page of pages) {
      const html = await readFile(path.join(directory, page), 'utf8')
      for (const id of canonicalIds(html)) chineseIds.add(id)
      if (kind === 'type') {
        const markers = [...html.matchAll(/data-content-type="([^"]+)"/g)].map((match) => match[1])
        assert.ok(
          markers.every((type) => type === value),
          `${value}: Chinese archive contains another type`
        )
      }
    }
    assert.deepEqual(
      [...chineseIds].sort(),
      [...englishIds].sort(),
      `${kind}/${value}: Chinese pagination and English archive must contain the same articles`
    )
    for (const id of englishIds) {
      assert.ok(allIds.has(id), `${kind}/${value}: unknown canonical article ${id}`)
      if (kind === 'type') {
        assert.ok(!seenTypes.has(id), `Article appears in multiple content types: ${id}`)
        seenTypes.add(id)
      }
    }
    for (const language of ['zh-CN', 'en-US'])
      await read(`blog/${kind}/${value}/language/${language}`)
  }
}
assert.deepEqual(
  [...seenTypes].sort(),
  [...allIds].sort(),
  'Every article belongs to exactly one type'
)
console.log(
  `Writing archive audit passed: ${allIds.size} canonical articles, matching RSS, bilingual categories and all language routes.`
)
