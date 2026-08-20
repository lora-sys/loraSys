#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const valueFor = (flag) => {
  const index = args.indexOf(flag)
  return index >= 0 ? args[index + 1] : undefined
}

const inputPath = valueFor('--input')
const sourceUrl = valueFor('--url')
const outputPath = valueFor('--output')

if (!inputPath || !sourceUrl) {
  console.error('Usage: bun scripts/import-public-notion.mjs --url <public-notion-url> --input <mcp-result.json> [--output <candidate.md>]')
  process.exit(1)
}

const raw = await fs.readFile(inputPath, 'utf8')
let payload
try {
  payload = JSON.parse(raw)
} catch {
  payload = { text: raw }
}

const enhanced = String(payload.text ?? payload.content ?? raw)
const title = String(payload.title ?? enhanced.match(/<properties>\s*\{"title":"([^"]+)"\}/)?.[1] ?? 'Untitled Notion candidate')
const contentMatch = enhanced.match(/<content>([\s\S]*?)<\/content>/)
const content = (contentMatch?.[1] ?? enhanced)
  .replace(/<notice[\s\S]*?<\/notice>\s*/g, '')
  .replace(/<ancestor-path>[\s\S]*?<\/ancestor-path>/g, '')
  .replace(/<properties>[\s\S]*?<\/properties>/g, '')
  .replace(/<empty-block\s*\/?>/g, '')
  .replace(/<page\s+url="([^"]+)"[^>]*>([\s\S]*?)<\/page>/g, (_, url, label) => `[${label.replace(/<[^>]+>/g, '').trim()}](${url})`)
  .replace(/<file\s+src="([^"]+)"[^>]*>\s*<\/file>/g, (_, src) => `\n> Attachment reference: ${decodeURIComponent(src)}\n`)
  .replace(/<span[^>]*>([\s\S]*?)<\/span>/g, '$1')
  .replace(/\{color="[^"]+"\}/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim()

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
  .replace(/^-|-$/g, '') || 'notion-candidate'
const destination = outputPath ?? path.join('content-inbox', 'review', `${slug}.md`)
const createdAt = new Date().toISOString().slice(0, 10)
const reviewNote = '公开 Notion 只读导入候选；人工确认版权、归属、附件和发布形态后再迁移。'
const markdown = `---
title: "${title.replaceAll('"', '\\"')}"
sourceUrl: "${sourceUrl}"
sourceType: "notion"
contentType: "note"
status: "needs-review"
ownership: "External"
migrationTarget: "src/content/notes"
reviewNote: "${reviewNote}"
createdAt: "${createdAt}"
---

${content || `Source page: ${sourceUrl}`}
`

await fs.mkdir(path.dirname(destination), { recursive: true })
await fs.writeFile(destination, markdown)
console.log(JSON.stringify({ title, sourceUrl, status: 'needs-review', ownership: 'External', output: destination }, null, 2))
