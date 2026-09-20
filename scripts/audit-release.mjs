import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const base = '/loraSys'

const required = [
  'index.html',
  'blog/index.html',
  'notes/index.html',
  'projects/index.html',
  'projects/zhihu-threads/index.html',
  'lab/index.html',
  'talks/index.html',
  'about/index.html',
  'contact/index.html',
  'now/index.html',
  'links/index.html',
  'search/index.html',
  'archives/index.html',
  'tags/index.html',
  'guestbook/index.html',
  'resume/index.html',
  'terms/index.html',
  'en/index.html',
  'en/work/index.html',
  'en/writing/index.html',
  'en/now/index.html',
  'en/links/index.html',
  'en/about/index.html',
  'en/contact/index.html',
  'en/search/index.html',
  'en/guestbook/index.html',
  'en/resume/index.html',
  'en/projects/zhihu-threads/index.html',
  '404.html',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml'
]

const failures = []

const workflowsDir = join(root, '.github', 'workflows')
if (existsSync(workflowsDir)) {
  for (const name of readdirSync(workflowsDir)) {
    if (!/\.ya?ml$/i.test(name)) continue
    const workflow = readFileSync(join(workflowsDir, name), 'utf8')
    if (/^verify-notion-sync-\d{8}\.ya?ml$/i.test(name)) {
      failures.push(`.github/workflows/${name}: date-specific Notion verification workflows are not allowed`)
    }
    if (/^\s*name:\s*Verify Notion article \d{4}-\d{2}-\d{2}\s*$/im.test(workflow)) {
      failures.push(`.github/workflows/${name}: use the repository's existing CI instead of a per-article workflow`)
    }
  }
}

if (!existsSync(dist)) failures.push('dist/ does not exist; run the production build first')

for (const output of required) {
  if (!existsSync(join(dist, output))) failures.push(`missing required output: ${output}`)
}

const files = []
const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) walk(path)
    else files.push(path)
  }
}

if (existsSync(dist)) walk(dist)

const textExtensions = new Set(['.html', '.xml', '.txt', '.webmanifest', '.css', '.js'])
const assetPattern = /(?:href|src|content)=["']([^"']+)["']/g
const htmlTagText = (value = '') => value.replace(/<[^>]*>/g, '').trim()
const attributeValue = (tag, name) =>
  tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1]?.trim() ?? ''

for (const file of files.filter((path) => textExtensions.has(extname(path)))) {
  const source = readFileSync(file, 'utf8')
  const label = relative(dist, file)

  if (source.includes(`${base}${base}`)) failures.push(`${label}: duplicated Pages base path`)
  if (
    ['.html', '.xml', '.webmanifest'].includes(extname(file)) &&
    /=["']undefined(?:["'])/.test(source)
  ) failures.push(`${label}: undefined HTML attribute`)

  if (extname(file) !== '.html') continue

  const title = source.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i)?.[1]
  if (!htmlTagText(title)) failures.push(`${label}: missing document title`)

  const descriptionTag = [...source.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .find((tag) => attributeValue(tag, 'name').toLowerCase() === 'description')
  if (!descriptionTag || !attributeValue(descriptionTag, 'content')) {
    failures.push(`${label}: missing meta description`)
  }

  const h1Count = [...source.matchAll(/<h1\b/gi)].length
  if (h1Count !== 1) failures.push(`${label}: expected exactly one h1, found ${h1Count}`)

  for (const match of source.matchAll(assetPattern)) {
    const url = match[1]
    if (
      !url.startsWith(`${base}/`) ||
      url.startsWith(`${base}/blog/`) ||
      url.startsWith(`${base}/notes/`) ||
      url.startsWith(`${base}/projects/`) ||
      url.startsWith(`${base}/lab/`) ||
      url.startsWith(`${base}/talks/`) ||
      url.startsWith(`${base}/about`) ||
      url.startsWith(`${base}/contact`) ||
      url.startsWith(`${base}/now`) ||
      url.startsWith(`${base}/links`) ||
      url.startsWith(`${base}/search`) ||
      url.startsWith(`${base}/tags/`) ||
      url.startsWith(`${base}/archives`) ||
      url.startsWith(`${base}/terms`) ||
      url.startsWith(`${base}/guestbook`) ||
      url.startsWith(`${base}/resume`) ||
      url.startsWith(`${base}/en/`) ||
      url.startsWith(`${base}/404`)
    ) continue

    const clean = url.slice(base.length + 1).split(/[?#]/, 1)[0]
    if (clean && !existsSync(join(dist, clean))) failures.push(`${label}: missing local asset ${url}`)
  }
}

if (failures.length) {
  console.error(`Release audit failed (${failures.length})`)
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Release audit passed: ${files.length} generated files and ${required.length} required outputs`)
