import { readFile, writeFile, rename, rm } from 'node:fs/promises'
import { refreshExternalContributions } from './lib/external-contributions.mjs'

const output = new URL('../src/data/external-contributions.json', import.meta.url)
const overridesUrl = new URL('./contribution-overrides.json', import.meta.url)
const login = 'lora-sys'
const overrides = JSON.parse(await readFile(overridesUrl, 'utf8'))
let previous = null
try {
  previous = JSON.parse(await readFile(output, 'utf8'))
} catch {
  // A successful complete refresh may recover a missing snapshot. A failed one must fail CI.
}

const result = await refreshExternalContributions({ token: process.env.GITHUB_TOKEN, login, overrides, previous })
const temporary = new URL(`./external-contributions.json.${process.pid}.tmp`, output)
try {
  await writeFile(temporary, `${JSON.stringify(result.snapshot, null, 2)}\n`)
  await rename(temporary, output)
} finally {
  await rm(temporary, { force: true })
}
for (const warning of result.snapshot.warnings) console.warn(warning)
if (result.refreshed) {
  console.log(`Stored ${result.snapshot.contributions.length} curated external contribution projects after ${result.pages} pages / ${result.fetchedPullRequests} PRs.`)
} else {
  console.warn('External contribution refresh incomplete; retained the stored snapshot with a warning.')
}
