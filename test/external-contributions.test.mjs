import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { assertContributionSnapshot, collectExternalContributions, refreshExternalContributions } from '../scripts/lib/external-contributions.mjs'

const now = '2026-10-06T06:00:00.000Z'
const overrides = { 'example/curated': { priority: 1, label: 'Contribution', note: 'Public contribution.' } }
const makePr = (number = 1, repository = 'example/curated', flags = {}) => ({
  title: `PR ${number}`, url: `https://github.com/${repository}/pull/${number}`,
  state: 'OPEN', mergedAt: null, updatedAt: now,
  repository: { nameWithOwner: repository, url: `https://github.com/${repository}`, description: null, isPrivate: false, isArchived: false, isFork: false, ...flags }
})
const page = (nodes, hasNextPage = false, endCursor = null) => ({ data: { user: { pullRequests: { nodes, pageInfo: { hasNextPage, endCursor } } } } })
const fetchPages = (responses) => {
  let call = 0
  const cursors = []
  return Object.assign(async (_url, options) => {
    const request = JSON.parse(options.body)
    assert.match(request.query, /after: \$cursor/)
    assert.match(request.query, /pageInfo/)
    assert.equal(request.variables.login, 'tester')
    cursors.push(request.variables.cursor)
    assert.ok(call < responses.length, 'unexpected additional page')
    const value = responses[call++]
    if (value instanceof Error) throw value
    if (value.status) return { ok: false, status: value.status }
    return { ok: true, status: 200, json: async () => value }
  }, { cursors })
}
const previous = {
  syncVersion: 2, lastUpdated: '2026-09-09T00:00:00.000Z', source: 'GitHub GraphQL / user:tester',
  allowlist: Object.keys(overrides), warnings: [],
  contributions: [{ repository: 'example/curated', repositoryUrl: 'https://github.com/example/curated', description: '', label: 'Contribution', note: 'Public contribution.', priority: 1, prUrl: null, projectUrl: null, pullRequests: [{ title: 'Old PR', url: 'https://github.com/example/curated/pull/99', state: 'MERGED', mergedAt: '2026-09-08T00:00:00Z', updatedAt: '2026-09-08T00:00:00Z' }] }]
}
const collect = (fetchImpl, customOverrides = overrides) => collectExternalContributions({ token: 'fixture-token', login: 'tester', overrides: customOverrides, fetchImpl })
const refresh = (fetchImpl, stored = previous, token = 'fixture-token') => refreshExternalContributions({ token, login: 'tester', overrides, previous: stored, fetchImpl, now })

test('finds a curated contribution after the first 100 unrelated PRs', async () => {
  const request = fetchPages([page(Array.from({ length: 100 }, (_, i) => makePr(i + 1, 'other/repo')), true, 'page-2'), page([makePr(101)])])
  const result = await collect(request)
  assert.equal(result.contributions[0].repository, 'example/curated')
  assert.equal(result.pages, 2)
  assert.equal(result.fetchedPullRequests, 101)
  assert.deepEqual(request.cursors, [null, 'page-2'])
})

test('deduplicates overlap and retains only the three newest PRs', async () => {
  const result = await collect(fetchPages([page([makePr(4), makePr(3)], true, 'next'), page([makePr(3), makePr(2), makePr(1)])]))
  assert.deepEqual(result.contributions[0].pullRequests.map((pr) => pr.title), ['PR 4', 'PR 3', 'PR 2'])
})

test('excludes private, archived, forked and unlisted repositories', async () => {
  const result = await collect(fetchPages([page([makePr(1, 'other/repo'), makePr(2, 'example/curated', { isPrivate: true }), makePr(3, 'example/curated', { isArchived: true }), makePr(4, 'example/curated', { isFork: true })])]))
  assert.deepEqual(result.contributions, [])
})

test('matches normalized repository names and applies editorial priority', async () => {
  const config = { ...overrides, 'Example/Second': { priority: 2, label: 'Second', note: 'Second public contribution.' } }
  const result = await collect(fetchPages([page([makePr(1, 'example/second'), makePr(2, 'Example/Curated')])]), config)
  assert.deepEqual(result.contributions.map((item) => item.repository.toLowerCase()), ['example/curated', 'example/second'])
})

test('rejects missing page metadata rather than treating one page as complete', async () => {
  await assert.rejects(collect(fetchPages([{ data: { user: { pullRequests: { nodes: [] } } } }])), /pagination metadata/)
})

test('rejects missing or repeated cursors', async () => {
  await assert.rejects(collect(fetchPages([page([], true)])), /cursor/)
  await assert.rejects(collect(fetchPages([page([], true, 'same'), page([], true, 'same')])), /cursor/)
})

test('rejects partial GraphQL responses even when data is present', async () => {
  await assert.rejects(collect(fetchPages([{ ...page([makePr()]), errors: [{ message: 'partial response' }] }])), /partial data rejected/)
})

test('rejects unknown visibility and malformed selected PRs', async () => {
  const hidden = makePr()
  delete hidden.repository.isPrivate
  await assert.rejects(collect(fetchPages([page([hidden])])), /visibility/)
  await assert.rejects(collect(fetchPages([page([{ ...makePr(), state: 'INVALID' }])])), /state/)
  await assert.rejects(collect(fetchPages([page([null])])), /incomplete/)
})

test('failed second page retains the prior data and timestamp, not partial results', async () => {
  const copy = structuredClone(previous)
  const result = await refresh(fetchPages([page([makePr(5)], true, 'next'), { status: 403 }]))
  assert.equal(result.refreshed, false)
  assert.deepEqual(result.snapshot.contributions, previous.contributions)
  assert.equal(result.snapshot.lastUpdated, previous.lastUpdated)
  assert.match(result.snapshot.warnings[0], /403.*Stored snapshot retained/)
  assert.deepEqual(previous, copy)
})

test('network failures and missing token cannot silently produce a successful empty snapshot', async () => {
  for (const request of [fetchPages([new Error('network unavailable')]), fetchPages([{ status: 429 }])]) {
    const result = await refresh(request)
    assert.equal(result.refreshed, false)
    assert.equal(result.snapshot.contributions.length, 1)
  }
  const noRequest = async () => assert.fail('must not fetch without a token')
  assert.equal((await refresh(noRequest, previous, '')).refreshed, false)
})

test('a failed refresh without a valid stored snapshot fails closed', async () => {
  await assert.rejects(refresh(fetchPages([{ status: 500 }]), null), /snapshot version/)
  await assert.rejects(refresh(fetchPages([{ status: 500 }]), { ...previous, contributions: null }), /contributions must/)
})

test('fallback warnings are bounded and a later success clears stale refresh warnings', async () => {
  const first = await refresh(fetchPages([{ status: 503 }]))
  const second = await refresh(fetchPages([{ status: 503 }]), first.snapshot)
  assert.equal(second.snapshot.warnings.length, 1)
  const recovered = await refresh(fetchPages([page([makePr()])]), second.snapshot)
  assert.equal(recovered.refreshed, true)
  assert.deepEqual(recovered.snapshot.warnings, [])
  assert.equal(recovered.snapshot.lastUpdated, now)
})

test('complete empty results are allowed, but loss of a populated snapshot is warned', async () => {
  const empty = { ...previous, contributions: [] }
  const result = await refresh(fetchPages([page([])]), empty)
  assert.equal(result.refreshed, true)
  assert.deepEqual(result.snapshot.contributions, [])
  assert.deepEqual(result.snapshot.warnings, [])
  const lost = await refresh(fetchPages([page([])]))
  assert.equal(lost.refreshed, true)
  assert.match(lost.snapshot.warnings[0], /complete scan returned no eligible/)
})

test('snapshot validation handles legitimate empty lists and rejects malformed structures', () => {
  assertContributionSnapshot(previous)
  assertContributionSnapshot({ ...previous, contributions: [] })
  assertContributionSnapshot({ ...previous, contributions: [{ ...previous.contributions[0], pullRequests: [] }] })
  assert.throws(() => assertContributionSnapshot({ ...previous, contributions: {} }), /contributions must/)
  assert.throws(() => assertContributionSnapshot({ ...previous, contributions: [{ ...previous.contributions[0], pullRequests: null }] }), /pullRequests must/)
  assert.throws(() => assertContributionSnapshot({ ...previous, warnings: [123] }), /warnings must/)
})

test('typed adapter compiles populated, empty contribution and empty PR snapshots without any', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'lorasys-contribution-types-'))
  try {
    const adapter = await readFile(new URL('../src/data/external-contributions.ts', import.meta.url), 'utf8')
    const fixtures = [previous, { ...previous, contributions: [] }, { ...previous, contributions: [{ ...previous.contributions[0], pullRequests: [] }] }]
    const files = []
    for (const [index, snapshot] of fixtures.entries()) {
      const fixture = path.join(directory, String(index))
      await mkdir(fixture)
      await writeFile(path.join(fixture, 'external-contributions.json'), JSON.stringify(snapshot))
      await writeFile(path.join(fixture, 'external-contributions.ts'), adapter)
      const consumer = path.join(fixture, 'consumer.ts')
      await writeFile(consumer, `import snapshot from './external-contributions';\nsnapshot.contributions.filter(item => snapshot.allowlist.includes(item.repository)).map(item => ({ title: item.repository, href: item.repositoryUrl, label: item.label, note: item.note, project: item.projectUrl, prs: item.pullRequests.map(pr => pr.state + pr.url + pr.title + pr.updatedAt + pr.mergedAt) }));\n`)
      files.push(consumer)
    }
    const require = createRequire(import.meta.url)
    execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '--strict', '--noEmit', '--skipLibCheck', '--target', 'ES2022', '--module', 'ESNext', '--moduleResolution', 'Bundler', '--resolveJsonModule', ...files], { timeout: 30000, stdio: 'pipe' })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

async function fixtureRepository(run) {
  const directory = await mkdtemp(path.join(tmpdir(), 'lorasys-contribution-cli-'))
  try {
    await mkdir(path.join(directory, 'scripts/lib'), { recursive: true })
    await mkdir(path.join(directory, 'src/data'), { recursive: true })
    for (const name of ['scripts/fetch-external-contributions.mjs', 'scripts/validate-sync-data.mjs', 'scripts/lib/external-contributions.mjs']) {
      await writeFile(path.join(directory, name), await readFile(new URL(`../${name}`, import.meta.url)))
    }
    await writeFile(path.join(directory, 'scripts/contribution-overrides.json'), JSON.stringify(overrides))
    await writeFile(path.join(directory, 'src/data/external-contributions.json'), JSON.stringify(previous))
    await writeFile(path.join(directory, 'src/data/github-projects.json'), JSON.stringify({ projects: [] }))
    await writeFile(path.join(directory, 'src/data/contributions.json'), JSON.stringify({}))
    await run(directory)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

test('CLI persists a successful multi-page snapshot before validation', async () => {
  await fixtureRepository(async (directory) => {
    const responses = [page([makePr(1, 'other/repo')], true, 'next'), page([makePr(2)])]
    const mock = path.join(directory, 'mock-fetch.mjs')
    await writeFile(mock, `const pages = ${JSON.stringify(responses)}; globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => pages.shift() });`)
    const output = execFileSync(process.execPath, ['--import', mock, 'scripts/fetch-external-contributions.mjs'], { cwd: directory, env: { ...process.env, GITHUB_TOKEN: 'fixture-token' }, encoding: 'utf8', stdio: 'pipe' })
    assert.match(output, /after 2 pages/)
    const snapshot = JSON.parse(await readFile(path.join(directory, 'src/data/external-contributions.json'), 'utf8'))
    assert.equal(snapshot.contributions[0].pullRequests[0].title, 'PR 2')
    execFileSync(process.execPath, ['scripts/validate-sync-data.mjs'], { cwd: directory, stdio: 'pipe' })
  })
})

test('CLI persists fallback warnings without erasing data or advancing lastUpdated', async () => {
  await fixtureRepository(async (directory) => {
    execFileSync(process.execPath, ['scripts/fetch-external-contributions.mjs'], { cwd: directory, env: { ...process.env, GITHUB_TOKEN: '' }, stdio: 'pipe' })
    const snapshot = JSON.parse(await readFile(path.join(directory, 'src/data/external-contributions.json'), 'utf8'))
    assert.deepEqual(snapshot.contributions, previous.contributions)
    assert.equal(snapshot.lastUpdated, previous.lastUpdated)
    assert.match(snapshot.warnings[0], /GITHUB_TOKEN is unavailable/)
  })
})

test('sync validator rejects null and malformed contribution snapshots', async () => {
  await fixtureRepository(async (directory) => {
    for (const value of [null, { ...previous, contributions: {} }]) {
      await writeFile(path.join(directory, 'src/data/external-contributions.json'), JSON.stringify(value))
      assert.throws(() => execFileSync(process.execPath, ['scripts/validate-sync-data.mjs'], { cwd: directory, stdio: 'pipe' }), (error) => error.status === 1 && error.stderr.toString().includes('external-contributions.json'))
    }
  })
})
