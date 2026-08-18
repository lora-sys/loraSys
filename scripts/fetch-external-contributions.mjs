import { readFile, writeFile } from 'node:fs/promises'

const output = new URL('../src/data/external-contributions.json', import.meta.url)
const overridesUrl = new URL('./contribution-overrides.json', import.meta.url)
const token = process.env.GITHUB_TOKEN
const login = 'lora-sys'

const overrides = JSON.parse(await readFile(overridesUrl, 'utf8'))

async function readSnapshot() {
  try {
    return JSON.parse(await readFile(output, 'utf8'))
  } catch {
    return { syncVersion: 1, lastUpdated: null, contributions: [], warnings: [] }
  }
}

if (!token) {
  console.warn('GITHUB_TOKEN is unavailable; keeping the stored external contribution snapshot.')
  process.exit(0)
}

const query = `
  query($login: String!) {
    user(login: $login) {
      pullRequests(first: 100, states: [OPEN, CLOSED, MERGED], orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          title
          url
          state
          mergedAt
          updatedAt
          repository {
            nameWithOwner
            url
            description
            isFork
            isArchived
          }
        }
      }
    }
  }
`

try {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'loraSys-pages'
    },
    body: JSON.stringify({ query, variables: { login } })
  })
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
  const json = await response.json()
  if (json.errors?.length || !json.data?.user) {
    throw new Error(json.errors?.[0]?.message ?? 'GitHub user missing')
  }

  const selected = new Map()
  for (const pr of json.data.user.pullRequests.nodes ?? []) {
    if (!pr?.repository?.nameWithOwner) continue
    const key = pr.repository.nameWithOwner.toLowerCase()
    const override = overrides[key]
    if (!override || pr.repository.isFork || pr.repository.isArchived) continue
    const current = selected.get(key) ?? {
      repository: pr.repository.nameWithOwner,
      repositoryUrl: pr.repository.url,
      description: pr.repository.description ?? '',
      label: override.label,
      note: override.note,
      priority: override.priority,
      pullRequests: []
    }
    current.pullRequests.push({
      title: pr.title,
      url: pr.url,
      state: pr.state,
      mergedAt: pr.mergedAt,
      updatedAt: pr.updatedAt
    })
    selected.set(key, current)
  }

  const contributions = [...selected.values()]
    .map((item) => ({ ...item, pullRequests: item.pullRequests.slice(0, 3) }))
    .sort((left, right) => left.priority - right.priority)
  const snapshot = {
    syncVersion: 1,
    lastUpdated: new Date().toISOString(),
    source: `GitHub GraphQL / user:${login}`,
    contributions,
    warnings: []
  }
  await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`Stored ${contributions.length} curated external contribution projects.`)
} catch (error) {
  const snapshot = await readSnapshot()
  if (!Array.isArray(snapshot.contributions)) throw error
  console.warn(`External contribution refresh failed; using stored snapshot: ${error.message}`)
}
