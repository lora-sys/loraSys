import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

const args = process.argv.slice(2)
const option = (name) => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}
const has = (name) => args.includes(name)

const inputPath = option('--input')
const title = option('--title')
const sourceUrl = option('--source-url')
const format = option('--format') ?? 'md'
const outputPath = option('--output')
const ownership = option('--ownership') ?? 'lora-sys'
const contentType = option('--content-type') ?? 'blog'
const project = option('--project') ?? ''

if (has('--help') || !inputPath || !title) {
  console.log(`Usage:
  bun scripts/import-article-html.mjs --input <article.html> --title <title> [options]

Required:
  --input <file>           Local HTML file exported or pasted from an article source
  --title <title>          Candidate title

Options:
  --source-url <url>       Original public URL, if available
  --format <md|mdx>        Output extension (default: md)
  --output <path>          Override local candidate path
  --ownership <value>      Default: lora-sys
  --content-type <value>   Default: blog
  --project <name>         Related project or series

The script only creates a local candidate under content-drafts/review/. It never writes to src/content, commits, or deploys.`)
  process.exit(has('--help') ? 0 : 1)
}

if (!['md', 'mdx'].includes(format)) {
  throw new Error('--format must be md or mdx')
}

const escapeYaml = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')
const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '') || 'article-candidate'

const html = await readFile(inputPath, 'utf8')
const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined'
})

turndown.use(gfm)
turndown.remove(['head', 'title', 'meta', 'link', 'script', 'style', 'noscript', 'template', 'nav', 'footer', 'form', 'button', 'svg', 'iframe', 'canvas', 'video', 'audio'])
turndown.addRule('figure-caption', {
  filter: 'figcaption',
  replacement: (content) => (content.trim() ? `\n\n*${content.trim()}*\n\n` : '')
})
turndown.addRule('clean-image', {
  filter: 'img',
  replacement: (_content, node) => {
    const src = node.getAttribute('src')?.trim()
    if (!src || src.startsWith('data:')) return ''
    const alt = node.getAttribute('alt')?.trim() ?? ''
    return `![${alt}](${src})`
  }
})
turndown.addRule('code-language', {
  filter: (node) => node.nodeName === 'PRE' && Boolean(node.querySelector('code[class*="language-"]')),
  replacement: (_content, node) => {
    const code = node.querySelector('code')
    const className = code?.getAttribute('class') ?? ''
    const language = className.match(/language-([\w+-]+)/)?.[1] ?? ''
    const value = code?.textContent?.replace(/\n$/, '') ?? ''
    return `\n\n\`\`\`${language}\n${value}\n\`\`\`\n\n`
  }
})

const markdown = turndown
  .turndown(html)
  .replace(/\n{3,}/g, '\n\n')
  .replace(/^\s+|\s+$/g, '')

if (!markdown) {
  throw new Error('No publishable article content was found after removing non-content HTML.')
}

const now = new Date().toISOString()
const destination = outputPath ?? path.join('content-drafts', 'review', `${slugify(title)}-candidate.${format}`)
const frontmatter = [
  '---',
  `title: "${escapeYaml(title)}"`,
  `sourceType: "html-import"`,
  `sourceUrl: "${escapeYaml(sourceUrl ?? '')}"`,
  `status: "needs-review"`,
  `ownership: "${escapeYaml(ownership)}"`,
  `contentType: "${escapeYaml(contentType)}"`,
  `project: "${escapeYaml(project)}"`,
  `migrationTarget: "src/content/blog"`,
  `importedAt: "${now}"`,
  `reviewNote: "HTML conversion candidate. Verify title, ownership, source rights, external assets, links, code blocks, and final frontmatter before moving into src/content/blog."`,
  '---',
  ''
].join('\n')

await mkdir(path.dirname(destination), { recursive: true })
await writeFile(destination, `${frontmatter}${markdown}\n`)
console.log(`Created local candidate: ${destination}`)
console.log('Review gate: this file is ignored by Git and is not part of the published Astro content collection.')
