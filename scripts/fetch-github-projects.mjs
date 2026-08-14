import { execFileSync } from 'node:child_process'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const owner = 'lora-sys'
const outputUrl = new URL('../src/data/github-projects.json', import.meta.url)
const posterDirectory = new URL('../src/assets/projects/', import.meta.url)
const token = process.env.GITHUB_TOKEN || readGhToken()

const explicitlyExcluded = new Map([
  ['lora-sys', 'GitHub profile README; identity metadata rather than a software project.'],
  [
    'development-rules',
    'Shared conventions and configuration only; no standalone software or experiment.'
  ],
  ['fastgithub', 'README-only placeholder with no committed implementation.']
])

const featuredRanks = new Map([
  ['glassbox-agent-harness', 1],
  ['free-vision-skill', 2],
  ['nano-vllm-interactive-guide', 3],
  ['trustops', 4],
  ['mulitimodal', 5],
  ['ai-engineering-harness', 6]
])

const buildingRepositories = new Set([
  'glassbox-agent-harness',
  'free-vision-skill',
  'nano-vllm-interactive-guide',
  'mulitimodal',
  'trandingos',
  'trustops'
])

const summaryOverrides = new Map([
  [
    'trustops',
    '面向成长型 B2B SaaS 的可信证据控制层，将政策、系统控制、历史承诺、风险审查与人工责任连接成可审计的承诺链。'
  ],
  [
    'mossguard',
    'A Monad on-chain AI Agent intent-verification layer with deterministic evidence checks and a fail-closed human signing gate.'
  ]
])

const titleOverrides = new Map([
  ['glassbox-agent-harness', 'Glassbox Agent Harness'],
  ['ai-engineering-harness', 'AI Engineering Harness'],
  ['nano-vllm-interactive-guide', 'nano-vLLM Interactive Guide'],
  ['trandingos', 'TradingOS'],
  ['mulitimodal', 'MultiModal Health Intelligence'],
  ['aicompanyos', 'AI Company OS'],
  ['daily-rss', 'Daily RSS'],
  ['newtube-clone', 'Newtube Clone'],
  ['trustops', 'TrustOps'],
  ['mossguard', 'MossGuard'],
  ['sysclean', 'SysClean'],
  ['teaching-html-story-deck', 'Teaching HTML Story Deck'],
  ['ui-aesthetic-improve', 'UI Aesthetic Improve'],
  ['init-codebase', 'Init Codebase'],
  ['neetcode-submissions', 'NeetCode Submissions'],
  ['lora-skills', 'Lora Skills'],
  ['research-assistant-skill', 'Research Assistant Skill'],
  ['humanize-write', 'Humanize Write'],
  ['node-base', 'Node Base'],
  ['zchat-demo', 'ZChat Demo'],
  ['hackthon-agent', 'Hackathon Agent'],
  ['hackthon', 'ETH Beijing Hackathon'],
  ['mianshihou-interview-website', 'Mianshihou Interview Website'],
  ['lora-website', 'Lora Website'],
  ['web3-frontend-ui-and-ux-reviewer', 'Web3 Frontend UI/UX Reviewer'],
  ['ui-design', 'UI Design'],
  ['better-auth-learn', 'Better Auth Learning'],
  ['go-project', 'Go Projects'],
  ['lora-bi', 'Lora BI'],
  ['note-app', 'Note App'],
  ['cpp-projects', 'C++ Projects'],
  ['automatic_compliments', 'Automatic Compliments'],
  ['demo_monad_hackthon', 'Monad Hackathon Demo'],
  ['hermes-stepfun-imagegen', 'Hermes StepFun Image Generation'],
  ['hermes-minimax-media', 'Hermes MiniMax Media'],
  ['mianshiya-next-lora', 'Mianshiya Next'],
  ['meme-vibe-casino', 'Meme Vibe Casino'],
  ['threejs-projects', 'Three.js Projects'],
  ['react-projects', 'React Projects'],
  ['react-praceise', 'React Practice'],
  ['miscroservice', 'Microservice Practice']
])

function displayTitle(name) {
  return (
    titleOverrides.get(name.toLowerCase()) ??
    name.replace(/[-_]+/g, ' ').replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
  )
}

function readGhToken() {
  try {
    return execFileSync('gh', ['auth', 'token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return ''
  }
}

const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'loraSys-pages',
  'x-github-api-version': '2022-11-28',
  ...(token ? { authorization: `Bearer ${token}` } : {})
}

const stored = await readStoredSnapshot()

async function readStoredSnapshot() {
  try {
    return JSON.parse(await readFile(outputUrl, 'utf8'))
  } catch {
    return { inventory: [], projects: {}, exclusions: [] }
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`GitHub returned ${response.status} for ${url}`)
  return response.json()
}

async function fetchPublicRepositories() {
  const repositories = []
  for (let page = 1; ; page += 1) {
    const batch = await fetchJson(
      `https://api.github.com/users/${owner}/repos?type=owner&sort=pushed&direction=desc&per_page=100&page=${page}`
    )
    repositories.push(...batch)
    if (batch.length < 100) break
  }
  return repositories
}

async function fetchLanguages(repository, fallback = {}) {
  try {
    return await fetchJson(repository.languages_url)
  } catch (error) {
    console.warn(`Languages unavailable for ${repository.name}; keeping cache: ${error.message}`)
    return fallback
  }
}

async function fetchReadme(repository) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${encodeURIComponent(repository.name)}/readme`,
      { headers }
    )
    if (!response.ok) return null
    const data = await response.json()
    return {
      text: Buffer.from(data.content.replaceAll('\n', ''), 'base64').toString('utf8'),
      path: data.path,
      downloadUrl: data.download_url
    }
  } catch {
    return null
  }
}

function extractReadmeSummary(markdown) {
  if (!markdown) return ''
  return (
    markdown
      .replace(/<!--[^]*?-->/g, '')
      .split(/\n{2,}/)
      .map((paragraph) =>
        paragraph
          .replace(/^#{1,6}\s+.*/gm, '')
          .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
          .replace(/[`*_>#|]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .find((paragraph) => paragraph.length >= 45 && paragraph.length <= 320) ?? ''
  )
}

function imageCandidates(markdown, repository, readmePath = 'README.md') {
  if (!markdown) return []
  const entries = []
  for (const match of markdown.matchAll(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+['"][^'"]*['"])?\)/g)) {
    entries.push({ alt: match[1], source: match[2] })
  }
  for (const match of markdown.matchAll(/<img[^>]+(?:src)=['"]([^'"]+)['"][^>]*>/gi)) {
    const tag = match[0]
    entries.push({
      alt: tag.match(/alt=['"]([^'"]*)['"]/i)?.[1] ?? '',
      source: match[1]
    })
  }

  return entries
    .map(({ alt, source }) => ({ alt, source: resolveImageUrl(source, repository, readmePath) }))
    .filter(({ source }) => source && !isBadgeOrTrackingImage(source))
    .map((entry) => ({ ...entry, score: scoreImage(entry) }))
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score)
}

function resolveImageUrl(source, repository, readmePath) {
  const cleaned = source.replaceAll('&amp;', '&').replace(/^<|>$/g, '')
  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned
      .replace('https://github.com/', 'https://raw.githubusercontent.com/')
      .replace(/\/blob\//, '/')
  }
  const directory = path.posix.dirname(readmePath)
  const relative = path.posix.normalize(path.posix.join(directory, decodeURIComponent(cleaned)))
  return `https://raw.githubusercontent.com/${owner}/${repository.name}/${repository.default_branch}/${relative}`
}

function isBadgeOrTrackingImage(url) {
  return /shields\.io|badge|badgen|github\.com\/.*\/actions\/workflows|coveralls|codecov|visitor|counter|hits\.seeyoufarm|api\.star-history|repobeats/i.test(
    url
  )
}

function scoreImage({ alt, source }) {
  const value = `${alt} ${source}`.toLowerCase()
  let score = 0
  if (
    /screenshot|preview|demo|showcase|dashboard|interface|overview|hero|cover|example|效果|截图|预览|演示/.test(
      value
    )
  )
    score += 8
  if (/docs?\/|assets?\/|images?\//.test(value)) score += 3
  if (/\.webp(?:\?|$)|\.png(?:\?|$)|\.jpe?g(?:\?|$)|\.avif(?:\?|$)/.test(value)) score += 2
  if (/logo|icon|avatar|qr|wechat|sponsor/.test(value)) score -= 5
  return score
}

async function download(url) {
  const rawMatch = url.match(
    /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/
  )
  const requestUrl = rawMatch
    ? `https://api.github.com/repos/${rawMatch[1]}/${rawMatch[2]}/contents/${rawMatch[4]
        .split('/')
        .map(encodeURIComponent)
        .join('/')}?ref=${encodeURIComponent(rawMatch[3])}`
    : url
  const response = await fetch(requestUrl, {
    headers: rawMatch
      ? { ...headers, accept: 'application/vnd.github.raw+json' }
      : {
          'user-agent': 'loraSys-pages',
          accept: 'image/avif,image/webp,image/png,image/jpeg,*/*'
        },
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000)
  })
  if (!response.ok) throw new Error(`Image returned ${response.status}`)
  const type = response.headers.get('content-type') ?? ''
  if (type.includes('text/html') || type.includes('application/json')) {
    throw new Error(`Unexpected image content type: ${type}`)
  }
  return Buffer.from(await response.arrayBuffer())
}

async function fetchOpenGraphImage(repository) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify({
      query:
        'query PortfolioOpenGraph($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { openGraphImageUrl } }',
      variables: { owner, name: repository.name }
    })
  })
  if (!response.ok) throw new Error(`GitHub GraphQL returned ${response.status}`)
  const data = await response.json()
  const url = data.data?.repository?.openGraphImageUrl
  if (!url) throw new Error('GitHub did not return an OpenGraph image')
  return url
}

async function fileExists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function renderPoster(buffer, outputPath, kind) {
  const input = sharp(buffer, { animated: false }).rotate()
  const foreground = await input
    .clone()
    .resize(1200, 675, {
      fit: kind === 'readme' ? 'contain' : 'cover',
      background: { r: 14, g: 17, b: 22, alpha: 1 }
    })
    .toBuffer()

  if (kind === 'readme') {
    const background = await input
      .clone()
      .resize(1200, 675, { fit: 'cover' })
      .blur(32)
      .modulate({ brightness: 0.42, saturation: 0.72 })
      .toBuffer()
    await sharp(background)
      .composite([{ input: foreground }])
      .webp({ quality: 82, effort: 5 })
      .toFile(outputPath)
  } else {
    await sharp(foreground).webp({ quality: 82, effort: 5 }).toFile(outputPath)
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function wrapText(value, maximum, lines) {
  const words = value.includes(' ') ? value.split(/\s+/) : [...value]
  const output = []
  let line = ''
  for (const word of words) {
    const separator = value.includes(' ') && line ? ' ' : ''
    if (`${line}${separator}${word}`.length <= maximum) {
      line = `${line}${separator}${word}`
    } else {
      if (line) output.push(line)
      line = word
      if (output.length === lines - 1) break
    }
  }
  if (line && output.length < lines) output.push(line)
  if (output.join(value.includes(' ') ? ' ' : '').length < value.length && output.length) {
    output[output.length - 1] = `${output.at(-1).replace(/[.,;:，。；：]?$/, '')}…`
  }
  return output
}

async function renderRepositoryCard(repository, outputPath) {
  const accents = ['#5eead4', '#67e8f9', '#a5b4fc', '#c4b5fd', '#f0abfc', '#fda4af']
  const hash = [...repository.name].reduce((total, character) => total + character.charCodeAt(0), 0)
  const accent = accents[hash % accents.length]
  const title = displayTitle(repository.name)
  const summary = repository.description || 'Open-source repository by lora-sys.'
  const titleLines = wrapText(title, 28, 2)
  const summaryLines = wrapText(summary, 72, 3)
  const labels = [repository.language, ...(repository.topics ?? [])]
    .filter(Boolean)
    .slice(0, 4)
    .join('  ·  ')
  const titleSvg = titleLines
    .map((line, index) => `<tspan x="72" dy="${index ? 72 : 0}">${escapeXml(line)}</tspan>`)
    .join('')
  const summarySvg = summaryLines
    .map((line, index) => `<tspan x="74" dy="${index ? 38 : 0}">${escapeXml(line)}</tspan>`)
    .join('')
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#090b10"/>
          <stop offset="1" stop-color="#151923"/>
        </linearGradient>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#ffffff" stroke-opacity="0.035"/>
        </pattern>
        <radialGradient id="glow" cx="85%" cy="10%" r="80%">
          <stop offset="0" stop-color="${accent}" stop-opacity="0.22"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#bg)"/>
      <rect width="1200" height="675" fill="url(#grid)"/>
      <rect width="1200" height="675" fill="url(#glow)"/>
      <rect x="72" y="66" width="42" height="5" rx="2.5" fill="${accent}"/>
      <text x="130" y="75" fill="#a4acb9" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="21" letter-spacing="3">LORA / OPEN SOURCE</text>
      <text x="72" y="198" fill="#f7f8fa" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="62" font-weight="700">${titleSvg}</text>
      <text x="74" y="${titleLines.length > 1 ? 376 : 312}" fill="#b8bfca" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="27">${summarySvg}</text>
      <text x="74" y="570" fill="${accent}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20">${escapeXml(labels || 'SOURCE AVAILABLE')}</text>
      <line x1="72" y1="603" x2="1128" y2="603" stroke="#ffffff" stroke-opacity="0.12"/>
      <text x="74" y="640" fill="#858e9d" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19">github.com/lora-sys/${escapeXml(repository.name)}</text>
      <circle cx="1108" cy="630" r="10" fill="${accent}"/>
    </svg>`
  await sharp(Buffer.from(svg)).webp({ quality: 84, effort: 5 }).toFile(outputPath)
}

async function ensurePoster(repository, readme, cachedPoster) {
  const slug = repository.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const localFile = `github-${slug}.webp`
  const outputPath = path.join(new URL(posterDirectory).pathname, localFile)
  if (
    cachedPoster?.kind !== 'repository-card' &&
    cachedPoster?.localFile === localFile &&
    (await fileExists(outputPath))
  ) {
    return cachedPoster
  }
  const candidates = imageCandidates(readme?.text, repository, readme?.path)

  for (const candidate of candidates) {
    try {
      await renderPoster(await download(candidate.source), outputPath, 'readme')
      return { kind: 'readme', sourceUrl: candidate.source, localFile }
    } catch (error) {
      console.warn(`README poster failed for ${repository.name}: ${error.message}`)
    }
  }

  try {
    const sourceUrl = await fetchOpenGraphImage(repository)
    await renderPoster(await download(sourceUrl), outputPath, 'github-opengraph')
    return { kind: 'github-opengraph', sourceUrl, localFile }
  } catch (error) {
    console.warn(`GitHub OpenGraph poster failed for ${repository.name}: ${error.message}`)
    await renderRepositoryCard(repository, outputPath)
    return { kind: 'repository-card', sourceUrl: repository.html_url, localFile }
  }
}

function exclusionReason(repository) {
  if (repository.fork) {
    return 'Forked repository; excluded to avoid presenting upstream work as original.'
  }
  if (repository.size === 0) {
    return 'Empty repository with no committed implementation.'
  }
  return explicitlyExcluded.get(repository.name.toLowerCase()) ?? null
}

function categoriesFor(repository) {
  const value =
    `${repository.name} ${repository.description ?? ''} ${(repository.topics ?? []).join(' ')}`.toLowerCase()
  const categories = ['Open Source']
  if (/agent|llm|ai-|artificial|prompt|vllm|multimodal/.test(value)) categories.push('AI Agents')
  if (/skill|tool|cli|tui|workflow|harness|manager|system|utility|clean|review/.test(value))
    categories.push('Tools')
  if (/web3|monad|blockchain|dapp|ethereum|crypto/.test(value)) categories.push('Web3')
  if (/learn|practice|course|tutorial|guide|example|study|submission|cs50/.test(value))
    categories.push('Learning')
  if (/app|dashboard|website|clone|game|reader|chat|casino|portfolio|frontend|three/.test(value))
    categories.push('Apps')
  if (featuredRanks.has(repository.name.toLowerCase())) categories.unshift('Featured')
  return [...new Set(categories)]
}

function normalizedRepository(repository, languages) {
  return {
    name: repository.name,
    description: repository.description || null,
    topics: repository.topics ?? [],
    homepage: repository.homepage || null,
    url: repository.html_url,
    stars: repository.stargazers_count,
    fork: repository.fork,
    archived: repository.archived,
    languages,
    language:
      Object.entries(languages).sort(([, left], [, right]) => right - left)[0]?.[0] ??
      repository.language ??
      null,
    createdAt: repository.created_at,
    pushedAt: repository.pushed_at,
    updatedAt: repository.pushed_at ?? repository.updated_at,
    defaultBranch: repository.default_branch,
    size: repository.size
  }
}

async function mapLimited(items, limit, callback) {
  const results = new Array(items.length)
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await callback(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

let repositories
try {
  repositories = await fetchPublicRepositories()
} catch (error) {
  console.warn(`GitHub inventory refresh failed; keeping stored snapshot: ${error.message}`)
  console.log(
    `GitHub project metadata: cached ${Object.keys(stored.projects ?? {}).length} projects from ${stored.lastUpdated ?? 'unknown date'}.`
  )
  process.exit(0)
}

await mkdir(posterDirectory, { recursive: true })

const inventory = []
const exclusions = []
let posterRecords = 0

const enrichedRepositories = await mapLimited(repositories, 8, async (repository) => {
  const key = repository.name.toLowerCase()
  const cached =
    stored.projects?.[key] ?? stored.inventory?.find((item) => item.name.toLowerCase() === key)
  const languages = await fetchLanguages(repository, cached?.languages ?? {})
  const normalized = normalizedRepository(repository, languages)
  const reason = exclusionReason(repository)
  inventory.push({ ...normalized, included: !reason, exclusionReason: reason })

  if (reason) {
    exclusions.push({ name: repository.name, reason })
    return null
  }

  return { repository, key, cached, normalized }
})

const projectEntries = await mapLimited(enrichedRepositories.filter(Boolean), 4, async (entry) => {
  const { repository, key, cached, normalized } = entry
  const readme = await fetchReadme(repository)
  let poster = cached?.poster
  try {
    poster = await ensurePoster(repository, readme, poster)
    posterRecords += 1
  } catch (error) {
    console.warn(`Poster refresh failed for ${repository.name}: ${error.message}`)
    if (!poster) throw new Error(`No cached poster for ${repository.name}`)
  }

  const featuredRank = featuredRanks.get(key) ?? null
  return [
    key,
    {
      ...normalized,
      title: displayTitle(repository.name),
      summary:
        summaryOverrides.get(key) ||
        repository.description ||
        extractReadmeSummary(readme?.text) ||
        'Repository documentation and source are available on GitHub.',
      kind: 'owned',
      status: repository.archived
        ? 'archived'
        : buildingRepositories.has(key)
          ? 'building'
          : 'active',
      categories: categoriesFor(repository),
      featuredRank,
      poster: {
        ...poster,
        fit: poster.kind === 'readme' ? 'contain' : 'cover',
        objectPosition: 'center'
      }
    }
  ]
})

const projects = Object.fromEntries(projectEntries)

inventory.sort((a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime())

const snapshot = {
  lastUpdated: new Date().toISOString(),
  account: owner,
  totals: {
    publicRepositories: inventory.length,
    includedProjects: Object.keys(projects).length,
    excludedRepositories: exclusions.length,
    forks: inventory.filter((repository) => repository.fork).length
  },
  mediaPolicy:
    'README screenshot or project preview first; otherwise GitHub official OpenGraph. All portfolio posters are stored locally as optimized WebP.',
  exclusions,
  inventory,
  projects
}

await writeFile(outputUrl, `${JSON.stringify(snapshot, null, 2)}\n`)

console.log(
  `GitHub project metadata: ${inventory.length} public repos, ${Object.keys(projects).length} included, ${exclusions.length} excluded, ${posterRecords} local poster records verified.`
)
