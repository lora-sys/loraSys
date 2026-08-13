import { readFile, writeFile } from 'node:fs/promises'

const output = new URL('../src/data/contributions.json', import.meta.url)
const token = process.env.GITHUB_TOKEN
if (!token) {
  console.warn('GITHUB_TOKEN is unavailable; keeping the stored contribution snapshot.')
  process.exit(0)
}

const query = `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`
try {
  const response = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'loraSys-pages' }, body: JSON.stringify({ query, variables: { login: 'lora-sys' } }) })
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
  const json = await response.json()
  if (json.errors?.length || !json.data?.user) throw new Error(json.errors?.[0]?.message ?? 'GitHub user missing')
  const calendar = json.data.user.contributionsCollection.contributionCalendar
  await writeFile(output, `${JSON.stringify({ ...calendar, lastUpdated: new Date().toISOString() }, null, 2)}\n`)
  console.log(`Stored ${calendar.totalContributions} contributions.`)
} catch (error) {
  // API outages must not break the static deployment when a valid snapshot exists.
  const snapshot = JSON.parse(await readFile(output, 'utf8'))
  if (!Array.isArray(snapshot.weeks)) throw error
  console.warn(`Contribution refresh failed; using stored snapshot: ${error.message}`)
}
