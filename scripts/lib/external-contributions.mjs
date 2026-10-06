const warningPrefix = 'External contribution refresh:'
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value))
const isRepository = (value) => typeof value === 'string' && /^[\w.-]+\/[\w.-]+$/.test(value)
const isGithubUrl = (value) => typeof value === 'string' && /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\/.*)?$/.test(value)
const isPullRequestUrl = (value) => isGithubUrl(value) && /\/pull\/\d+$/.test(value)

function requireValue(condition, message) {
  if (!condition) throw new Error(message)
}

function assertPullRequest(pr) {
  requireValue(isRecord(pr), 'Invalid pull request record')
  requireValue(typeof pr.title === 'string' && isPullRequestUrl(pr.url), 'Invalid pull request title or URL')
  requireValue(['OPEN', 'CLOSED', 'MERGED'].includes(pr.state), 'Invalid pull request state')
  requireValue(pr.mergedAt === null || isDate(pr.mergedAt), 'Invalid pull request merge date')
  requireValue(isDate(pr.updatedAt), 'Invalid pull request update date')
}

export function assertContributionSnapshot(snapshot) {
  requireValue(isRecord(snapshot) && snapshot.syncVersion === 2, 'Invalid contribution snapshot version')
  requireValue(snapshot.lastUpdated === null || isDate(snapshot.lastUpdated), 'Invalid contribution snapshot date')
  requireValue(typeof snapshot.source === 'string', 'Invalid contribution snapshot source')
  requireValue(Array.isArray(snapshot.allowlist) && snapshot.allowlist.every(isRepository), 'Invalid contribution allowlist')
  requireValue(Array.isArray(snapshot.contributions), 'contributions must be an array')
  requireValue(Array.isArray(snapshot.warnings) && snapshot.warnings.every((item) => typeof item === 'string'), 'warnings must be a string array')
  const allowed = new Set(snapshot.allowlist.map((key) => key.toLowerCase()))
  requireValue(allowed.size === snapshot.allowlist.length, 'Duplicate contribution allowlist repository')
  const seen = new Set()
  for (const item of snapshot.contributions) {
    requireValue(isRecord(item) && isRepository(item.repository), 'Invalid contribution repository')
    const key = item.repository.toLowerCase()
    requireValue(allowed.has(key) && !seen.has(key), 'Unlisted or duplicate contribution repository')
    seen.add(key)
    requireValue(isGithubUrl(item.repositoryUrl), 'Invalid contribution repository URL')
    requireValue(['description', 'label', 'note'].every((field) => typeof item[field] === 'string'), 'Invalid contribution text')
    requireValue(Number.isFinite(item.priority), 'Invalid contribution priority')
    requireValue(item.prUrl === null || isPullRequestUrl(item.prUrl), 'Invalid featured pull request URL')
    requireValue(item.projectUrl === null || isGithubUrl(item.projectUrl), 'Invalid related project URL')
    requireValue(Array.isArray(item.pullRequests), 'pullRequests must be an array')
    item.pullRequests.forEach(assertPullRequest)
    requireValue(new Set(item.pullRequests.map((pr) => pr.url)).size === item.pullRequests.length, 'Duplicate pull request URL')
  }
}

export const contributionQuery = `
  query($login: String!, $cursor: String) {
    user(login: $login) {
      pullRequests(first: 100, after: $cursor, states: [OPEN, CLOSED, MERGED], orderBy: { field: UPDATED_AT, direction: DESC }) {
        pageInfo { endCursor hasNextPage }
        nodes {
          title url state mergedAt updatedAt
          repository { nameWithOwner url description isFork isArchived isPrivate }
        }
      }
    }
  }
`

export async function collectExternalContributions({ token, login, overrides, fetchImpl = fetch }) {
  requireValue(isRecord(overrides), 'Invalid contribution overrides')
  const allowed = new Map(Object.entries(overrides).map(([key, value]) => [key.toLowerCase(), value]))
  requireValue(allowed.size === Object.keys(overrides).length, 'Duplicate normalized override repository')
  for (const [key, value] of allowed) {
    requireValue(isRepository(key) && isRecord(value), 'Invalid contribution override')
    requireValue(Number.isFinite(value.priority) && typeof value.label === 'string' && typeof value.note === 'string', 'Invalid contribution override fields')
  }
  const selected = new Map()
  const cursors = new Set()
  let cursor = null
  let pages = 0
  let fetchedPullRequests = 0
  do {
    const response = await fetchImpl('https://api.github.com/graphql', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'loraSys-pages' },
      body: JSON.stringify({ query: contributionQuery, variables: { login, cursor } }),
      signal: AbortSignal.timeout(30000)
    })
    requireValue(response.ok, `GitHub returned ${response.status}`)
    const json = await response.json()
    requireValue(!json.errors?.length, 'GitHub GraphQL returned errors; partial data rejected')
    const connection = json.data?.user?.pullRequests
    requireValue(isRecord(connection) && Array.isArray(connection.nodes), 'GitHub pull request connection is missing')
    const info = connection.pageInfo
    requireValue(isRecord(info) && typeof info.hasNextPage === 'boolean', 'GitHub pagination metadata is missing')
    if (info.hasNextPage) {
      requireValue(typeof info.endCursor === 'string' && info.endCursor.length > 0 && !cursors.has(info.endCursor), 'GitHub pagination cursor is missing or repeated')
      cursors.add(info.endCursor)
    }
    pages += 1
    fetchedPullRequests += connection.nodes.length
    for (const pr of connection.nodes) {
      requireValue(isRecord(pr) && isRecord(pr.repository) && isRepository(pr.repository.nameWithOwner), 'GitHub returned an incomplete pull request')
      const repository = pr.repository
      const key = repository.nameWithOwner.toLowerCase()
      const override = allowed.get(key)
      if (!override) continue
      requireValue(['isPrivate', 'isFork', 'isArchived'].every((field) => typeof repository[field] === 'boolean'), 'GitHub repository visibility is missing')
      if (repository.isPrivate || repository.isFork || repository.isArchived) continue
      assertPullRequest(pr)
      requireValue(isGithubUrl(repository.url), 'Invalid GitHub repository URL')
      requireValue(repository.description === null || typeof repository.description === 'string', 'Invalid GitHub repository description')
      const current = selected.get(key) ?? {
        repository: repository.nameWithOwner,
        repositoryUrl: repository.url,
        description: repository.description ?? '',
        label: override.label,
        note: override.note,
        priority: override.priority,
        prUrl: override.prUrl ?? null,
        projectUrl: override.projectUrl ?? null,
        pullRequests: []
      }
      // The API sorts newest first. Deduplicate page overlap without retaining all PRs.
      if (current.pullRequests.length < 3 && !current.pullRequests.some((item) => item.url === pr.url)) {
        current.pullRequests.push({ title: pr.title, url: pr.url, state: pr.state, mergedAt: pr.mergedAt, updatedAt: pr.updatedAt })
      }
      selected.set(key, current)
    }
    cursor = info.hasNextPage ? info.endCursor : null
  } while (cursor !== null)
  return { contributions: [...selected.values()].sort((left, right) => left.priority - right.priority), pages, fetchedPullRequests }
}

export async function refreshExternalContributions({ token, login, overrides, previous, fetchImpl = fetch, now = new Date().toISOString() }) {
  try {
    requireValue(typeof token === 'string' && token.length > 0, 'GITHUB_TOKEN is unavailable')
    const result = await collectExternalContributions({ token, login, overrides, fetchImpl })
    const warnings = previous?.contributions?.length > 0 && result.contributions.length === 0
      ? [`${warningPrefix} complete scan returned no eligible public contributions; review the allowlist and repository visibility.`]
      : []
    const snapshot = {
      syncVersion: 2,
      lastUpdated: now,
      source: `GitHub GraphQL / user:${login}`,
      allowlist: Object.keys(overrides),
      contributions: result.contributions,
      warnings
    }
    assertContributionSnapshot(snapshot)
    return { snapshot, refreshed: true, pages: result.pages, fetchedPullRequests: result.fetchedPullRequests }
  } catch (error) {
    // Never overwrite good data with the prefix of a failed paginated request.
    assertContributionSnapshot(previous)
    const message = error instanceof Error ? error.message : 'Unknown refresh failure'
    return {
      snapshot: {
        ...previous,
        warnings: [...previous.warnings.filter((item) => !item.startsWith(warningPrefix)), `${warningPrefix} ${message}. Stored snapshot retained; lastUpdated is unchanged.`]
      },
      refreshed: false,
      pages: 0,
      fetchedPullRequests: 0
    }
  }
}
