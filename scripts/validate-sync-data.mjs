import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = new URL('../src/data/', import.meta.url)
const failures = []
const warnings = []

async function load(name) {
  try {
    return JSON.parse(await readFile(new URL(name, root), 'utf8'))
  } catch (error) {
    failures.push(`${name}: unable to read JSON (${error.message})`)
    return null
  }
}

function listProjects(snapshot) {
  if (!snapshot) return []
  return Array.isArray(snapshot.projects) ? snapshot.projects : Object.values(snapshot.projects ?? {})
}

function isDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

function isGithubUrl(value) {
  return typeof value === 'string' && /^https:\/\/github\.com\/[^/]+\/[^/]+(?:\/.*)?$/.test(value)
}

const projectsSnapshot = await load('github-projects.json')
const contributionsSnapshot = await load('external-contributions.json')
const contributionCalendar = await load('contributions.json')

const projects = listProjects(projectsSnapshot)
const projectKeys = new Set()
for (const project of projects) {
  const key = project.fullName ?? project.repository ?? `${project.owner ?? ''}/${project.name ?? ''}`
  if (!key || key === '/') failures.push('project: missing repository key')
  if (projectKeys.has(key)) failures.push(`project: duplicate repository key ${key}`)
  projectKeys.add(key)
  if (!project.name && !project.title) failures.push(`project ${key}: missing name/title`)
  if (!project.owner && !project.source) warnings.push(`project ${key}: missing source/owner label`)
  const url = project.repositoryUrl ?? project.links?.github ?? project.url
  if (!isGithubUrl(url)) failures.push(`project ${key}: invalid GitHub URL`)
  if (project.updatedAt && !isDate(project.updatedAt)) failures.push(`project ${key}: invalid updatedAt`)
}

const contributions = contributionsSnapshot?.contributions ?? []
const allowlist = contributionsSnapshot?.allowlist ?? []
const allowlistKeys = new Set(allowlist.map((key) => String(key).toLowerCase()))
if (!Array.isArray(contributionsSnapshot?.allowlist)) warnings.push('external-contributions.json: missing explicit allowlist')
if (allowlistKeys.size !== allowlist.length) failures.push('external-contributions.json: duplicate allowlist repository')
const contributionKeys = new Set()
for (const contribution of contributions) {
  const key = contribution.repository
  if (!key) failures.push('contribution: missing repository')
  if (allowlistKeys.size && !allowlistKeys.has(String(key).toLowerCase())) failures.push(`contribution ${key}: repository is not in allowlist`)
  if (contributionKeys.has(key)) failures.push(`contribution: duplicate repository ${key}`)
  contributionKeys.add(key)
  if (!isGithubUrl(contribution.repositoryUrl)) failures.push(`contribution ${key}: invalid repository URL`)
  if (!contribution.note) warnings.push(`contribution ${key}: missing editorial note`)
  for (const pr of contribution.pullRequests ?? []) {
    if (!isGithubUrl(pr.url) || !/\/pull\/\d+$/.test(pr.url)) failures.push(`contribution ${key}: invalid PR URL`)
    if (!['OPEN', 'CLOSED', 'MERGED'].includes(pr.state)) warnings.push(`contribution ${key}: unknown PR state ${pr.state}`)
    if (pr.updatedAt && !isDate(pr.updatedAt)) failures.push(`contribution ${key}: invalid PR updatedAt`)
  }
}

if (projectsSnapshot?.lastUpdated && !isDate(projectsSnapshot.lastUpdated)) failures.push('github-projects.json: invalid lastUpdated')
if (contributionsSnapshot?.lastUpdated && !isDate(contributionsSnapshot.lastUpdated)) failures.push('external-contributions.json: invalid lastUpdated')
if (contributionCalendar?.lastUpdated && !isDate(contributionCalendar.lastUpdated)) failures.push('contributions.json: invalid lastUpdated')

const existingWarnings = [
  ...(projectsSnapshot?.warnings ?? []),
  ...(contributionsSnapshot?.warnings ?? []),
  ...(contributionCalendar?.warnings ?? [])
]
for (const warning of existingWarnings) warnings.push(String(warning))

const summary = {
  projects: projects.length,
  contributions: contributions.length,
  contributionPullRequests: contributions.reduce((total, item) => total + (item.pullRequests?.length ?? 0), 0),
  failures: failures.length,
  warnings: warnings.length
}
console.log(JSON.stringify({ ok: failures.length === 0, ...summary }, null, 2))

if (failures.length) {
  console.error(failures.map((item) => `ERROR ${item}`).join('\n'))
  process.exit(1)
}
if (warnings.length) console.warn(warnings.map((item) => `WARN ${item}`).join('\n'))

void path
