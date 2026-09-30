import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { readFrontmatter, validateClassification } from './lib/writing-classification.mjs'

// This one-time migration only adds reviewed metadata. It never rewrites a body,
// existing classification, slug, tag, date, media reference, or source ledger.
const apply = process.argv.includes('--apply')
const manifest = JSON.parse(await readFile('content-sync/writing-classification.json', 'utf8'))
const dir = 'src/content/blog'
const paths = await readdir(dir)
const writes = []
const seen = new Set()
for (const entry of manifest.entries) {
  if (seen.has(entry.slug) || !/^[a-z0-9-]+$/.test(entry.slug))
    throw new Error(`Invalid or repeated migration slug: ${entry.slug}`)
  seen.add(entry.slug)
  const file = paths.filter((name) => name === `${entry.slug}.md` || name === `${entry.slug}.mdx`)
  if (file.length !== 1) throw new Error(`Expected one current article for ${entry.slug}`)
  const errors = validateClassification(entry)
  if (errors.length) throw new Error(`${entry.slug}: ${errors.join('; ')}`)
  const filename = path.join(dir, file[0])
  const source = await readFile(filename, 'utf8')
  const { data } = readFrontmatter(source)
  const values = {
    contentType: entry.contentType,
    topics: entry.topics,
    ...(entry.series && { series: entry.series })
  }
  if (['contentType', 'topics', 'series'].some((key) => data[key] !== undefined)) {
    for (const key of ['contentType', 'topics', 'series']) {
      if (JSON.stringify(data[key]) !== JSON.stringify(values[key]))
        throw new Error(`${entry.slug}: existing ${key} differs; review rather than overwrite`)
    }
    continue
  }
  const addition = `contentType: ${entry.contentType}\ntopics: ${JSON.stringify(entry.topics)}\n${entry.series ? `series: ${entry.series}\n` : ''}`
  writes.push({ filename, source: source.replace(/^---\r?\n/, (opening) => opening + addition) })
}
// Validate the whole batch before the first write.
if (apply) for (const { filename, source } of writes) await writeFile(filename, source)
console.log(
  `${manifest.entries.length} reviewed classifications checked; ${writes.length} ${apply ? 'applied' : 'pending (use --apply)'}.`
)
