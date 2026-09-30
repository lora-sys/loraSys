import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  readFrontmatter,
  validateClassification,
  validateSourceClassification
} from './lib/writing-classification.mjs'

const reviewed = JSON.parse(await readFile('content-sync/writing-classification.json', 'utf8'))
const reviewedSeries = new Map(
  reviewed.entries.filter((entry) => entry.series).map((entry) => [entry.slug, entry.series])
)
const reviewedSources = new Map(
  reviewed.entries.flatMap((entry) => {
    const metadata = entry.sourceMetadata
    if (metadata?.['类型'])
      return [[entry.slug, { source: 'engineering-news', type: metadata['类型'] }]]
    if (metadata?.['任务类型'])
      return [[entry.slug, { source: 'editorial', type: metadata['任务类型'] }]]
    return []
  })
)

const visualOverrides = JSON.parse(await readFile('content-sync/blog-visuals.json', 'utf8'))
const visualsBySlug = new Map(visualOverrides.entries.map((entry) => [entry.slug, entry]))
const BLOG_DIR = path.resolve('src/content/blog')
const allowedComponents = new Set([
  'ArchitectureStack',
  'Callout',
  'ComparePanel',
  'DataChart',
  'EvidenceFlow',
  'InteractiveHtml',
  'KeyPoints',
  'MediaVideo',
  'OptionTabs',
  'ProcessSteps',
  'StatStrip',
  'TraceExplorer'
])

async function collectBlogFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await collectBlogFiles(fullPath)))
    if (entry.isFile() && /\.mdx?$/.test(entry.name)) files.push(fullPath)
  }

  return files
}

function stripCode(source) {
  return source
    .replace(/^---[\s\S]*?^---\s*/m, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`\n]*`/g, '')
}

function stripDisplayMath(source) {
  return source.replace(/\$\$[\s\S]*?\$\$/g, '')
}

function validateFile(file, source) {
  let data
  try {
    data = readFrontmatter(source).data
  } catch (error) {
    return [`${file}: ${error.message}`]
  }
  const sourceMetadata = reviewedSources.get(path.basename(file).replace(/\.mdx?$/, ''))
  const classificationErrors = sourceMetadata
    ? validateSourceClassification(sourceMetadata.source, sourceMetadata.type, data)
    : validateClassification(data)
  const expectedSeries = reviewedSeries.get(path.basename(file).replace(/\.mdx?$/, ''))
  if (expectedSeries && data.series !== expectedSeries)
    classificationErrors.push(`reviewed installment requires series: ${expectedSeries}`)
  const visual = visualsBySlug.get(path.basename(file).replace(/\.mdx?$/, ''))
  if (visual) {
    const actual = data.heroImage?.src
    if (
      typeof actual !== 'string' ||
      path.resolve(path.dirname(file), actual) !== path.resolve(visual.replacement)
    ) {
      classificationErrors.push(
        'heroImage must preserve the reviewed site-side override in content-sync/blog-visuals.json'
      )
    }
    if (!data.heroImage?.alt?.trim())
      classificationErrors.push('reviewed heroImage requires descriptive alt text')
  }
  if (!file.endsWith('.mdx')) return classificationErrors.map((message) => `${file}: ${message}`)
  const body = stripCode(source)
  const expressionScanBody = stripDisplayMath(body)
  const errors = [...classificationErrors]

  if (/^\s*(?:import|export)\b/m.test(body)) {
    errors.push(
      'imports and exports are not allowed; route-level component injection owns the MDX surface'
    )
  }

  if (/[{}]/.test(expressionScanBody)) {
    errors.push('JavaScript expressions are not allowed in synchronized MDX')
  }

  const bannedPatterns = [
    [/<https?:\/\/[^>]+>/i, 'angle-bracket autolinks are not MDX-safe; use Markdown links'],
    [/<table_of_contents\b/i, 'Notion table_of_contents placeholders are not allowed'],
    [/<mention-page\b/i, 'Notion mention-page placeholders are not allowed'],
    [/<script\b/i, '<script>'],
    [/<style\b/i, '<style>'],
    [/<iframe\b/i, '<iframe>'],
    [/<object\b/i, '<object>'],
    [/<embed\b/i, '<embed>'],
    [/\bclient:[\w-]+/i, 'client directives'],
    [/\bset:html\b/i, 'set:html'],
    [/\bis:inline\b/i, 'is:inline'],
    [/\son[a-z]+\s*=/i, 'inline event handlers']
  ]

  for (const [pattern, label] of bannedPatterns) {
    if (pattern.test(body)) errors.push(`${label} is not allowed`)
  }

  for (const match of body.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) {
    if (!allowedComponents.has(match[1])) {
      errors.push(`component <${match[1]}> is not in the MDX allowlist`)
    }
  }

  return errors.map((message) => `${file}: ${message}`)
}

const blogFiles = await collectBlogFiles(BLOG_DIR)
const errors = []
for (const file of blogFiles) {
  const source = await readFile(file, 'utf8')
  errors.push(...validateFile(path.relative(process.cwd(), file), source))
}

for (const repair of visualOverrides.diagram_repairs ?? []) {
  if (!repair.repaired_blob_sha) continue
  if (!repair.path.startsWith('src/assets/blog/') || repair.path.includes('..')) {
    errors.push('reviewed diagram path must stay within src/assets/blog/')
    continue
  }
  const bytes = await readFile(repair.path)
  const sha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
  if (sha !== repair.repaired_blob_sha)
    errors.push(
      `${repair.path}: reviewed diagram changed; repeat image QA and update blog-visuals.json together`
    )
}

if (errors.length) {
  console.error('Invalid blog content detected:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(
  `Validated ${blogFiles.length} classified blog file${blogFiles.length === 1 ? '' : 's'}.`
)
