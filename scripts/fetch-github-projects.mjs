import { readFile, writeFile } from 'node:fs/promises'

const profileUrl = new URL('../src/data/profile.ts', import.meta.url)
const outputUrl = new URL('../src/data/github-projects.json', import.meta.url)
const token = process.env.GITHUB_TOKEN

const profile = (await readFile(profileUrl, 'utf8')).split('export const hackathons=')[0]
const repositories = [
  ...new Set(
    [...profile.matchAll(/https:\/\/github\.com\/lora-sys\/([A-Za-z0-9_.-]+)/g)].map(
      ([, repository]) => repository
    )
  )
]

const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'loraSys-pages',
  'x-github-api-version': '2022-11-28',
  ...(token ? { authorization: `Bearer ${token}` } : {})
}

const stored = JSON.parse(await readFile(outputUrl, 'utf8'))
const projects = { ...(stored.projects ?? {}) }
let refreshed = 0

for (const repository of repositories) {
  try {
    const response = await fetch(`https://api.github.com/repos/lora-sys/${repository}`, { headers })
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
    const data = await response.json()
    projects[repository.toLowerCase()] = {
      stars: data.stargazers_count,
      updatedAt: data.pushed_at ?? data.updated_at,
      language: data.language,
      archived: data.archived,
      url: data.html_url
    }
    refreshed += 1
  } catch (error) {
    if (!projects[repository.toLowerCase()]) {
      console.warn(`No stored metadata for ${repository}: ${error.message}`)
    } else {
      console.warn(`Refresh failed for ${repository}; keeping stored metadata: ${error.message}`)
    }
  }
}

if (refreshed > 0) {
  await writeFile(
    outputUrl,
    `${JSON.stringify({ lastUpdated: new Date().toISOString(), projects }, null, 2)}\n`
  )
}

console.log(
  `GitHub project metadata: refreshed ${refreshed}/${repositories.length}; stored ${Object.keys(projects).length}.`
)
