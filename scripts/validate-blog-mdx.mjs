import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const BLOG_DIR = path.resolve('src/content/blog')
const allowedComponents = new Set(['ArchitectureStack', 'Callout', 'ComparePanel', 'DataChart', 'EvidenceFlow', 'InteractiveHtml', 'KeyPoints', 'MediaVideo', 'OptionTabs', 'ProcessSteps', 'StatStrip', 'TraceExplorer'])

async function collectMdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await collectMdxFiles(fullPath)))
    if (entry.isFile() && entry.name.endsWith('.mdx')) files.push(fullPath)
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
  const body = stripCode(source)
  const expressionScanBody = stripDisplayMath(body)
  const errors = []

  if (/^\s*(?:import|export)\b/m.test(body)) {
    errors.push('imports and exports are not allowed; route-level component injection owns the MDX surface')
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

const mdxFiles = await collectMdxFiles(BLOG_DIR)
const errors = []
for (const file of mdxFiles) {
  const source = await readFile(file, 'utf8')
  errors.push(...validateFile(path.relative(process.cwd(), file), source))
}

if (errors.length) {
  console.error('Unsafe blog MDX detected:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Validated ${mdxFiles.length} blog MDX file${mdxFiles.length === 1 ? '' : 's'}.`)
