import { readFile, writeFile } from 'node:fs/promises'

const dataRoot = new URL('../src/data/', import.meta.url)
const output = new URL('../src/data/sync-report.json', import.meta.url)

async function load(name) {
  try {
    return JSON.parse(await readFile(new URL(name, dataRoot), 'utf8'))
  } catch {
    return null
  }
}

function projectList(snapshot) {
  if (!snapshot) return []
  return Array.isArray(snapshot.projects) ? snapshot.projects : Object.values(snapshot.projects ?? {})
}

const projects = await load('github-projects.json')
const contributions = await load('external-contributions.json')
const calendar = await load('contributions.json')
const projectItems = projectList(projects)
const contributionItems = contributions?.contributions ?? []
const warnings = [
  ...(projects?.warnings ?? []),
  ...(contributions?.warnings ?? []),
  ...(calendar?.warnings ?? [])
].filter(Boolean)

const sourceCounts = {}
for (const project of projectItems) {
  const source = project.source ?? project.owner ?? 'unknown'
  sourceCounts[source] = (sourceCounts[source] ?? 0) + 1
}

const timestamps = [projects?.lastUpdated, contributions?.lastUpdated, calendar?.lastUpdated]
  .filter(Boolean)
  .map((value) => new Date(value).getTime())
  .filter(Number.isFinite)

const report = {
  syncVersion: 2,
  status: warnings.length ? 'warning' : 'ok',
  syncedAt: timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null,
  sources: {
    github: {
      projects: projectItems.length,
      projectBreakdown: sourceCounts,
      contributions: contributionItems.length,
      pullRequests: contributionItems.reduce((total, item) => total + (item.pullRequests?.length ?? 0), 0)
    }
  },
  warnings,
  snapshots: {
    projects: projects?.lastUpdated ?? null,
    contributions: contributions?.lastUpdated ?? null,
    contributionCalendar: calendar?.lastUpdated ?? null
  }
}

await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
