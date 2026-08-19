import { appendFile, readFile } from 'node:fs/promises'

const report = JSON.parse(await readFile(new URL('../src/data/sync-report.json', import.meta.url), 'utf8'))
const contributionSnapshot = JSON.parse(await readFile(new URL('../src/data/external-contributions.json', import.meta.url), 'utf8'))
const summaryPath = process.env.GITHUB_STEP_SUMMARY

if (!summaryPath) {
  console.log(JSON.stringify(report, null, 2))
  process.exit(0)
}

const github = report.sources.github
const warnings = report.warnings ?? []
const snapshotRows = [
  ['Projects', report.snapshots.projects],
  ['External contributions', report.snapshots.contributions],
  ['Contribution calendar', report.snapshots.contributionCalendar]
]

const lines = [
  '## Sync audit summary',
  '',
  `| Field | Value |`,
  `| --- | --- |`,
  `| Status | **${report.status}** |`,
  `| Sync version | ${report.syncVersion} |`,
  `| Latest sync | ${report.syncedAt ?? 'n/a'} |`,
  `| Projects | ${github.projects} |`,
  `| Allowlisted contribution repos | ${github.contributionAllowlist ?? contributionSnapshot.allowlist?.length ?? github.contributions} |`,
  `| Curated contribution repos in snapshot | ${github.contributions} |`,
  `| Pull requests | ${github.pullRequests} |`,
  '',
  '### Snapshot sources',
  '',
  '| Snapshot | Last updated |',
  '| --- | --- |',
  ...snapshotRows.map(([name, timestamp]) => `| ${name} | ${timestamp ?? 'n/a'} |`),
  '',
  `### Quality gate: ${warnings.length ? 'warnings present' : 'passed without warnings'}`,
  ''
]

if (warnings.length) {
  lines.push(...warnings.map((warning) => `- ${warning}`))
} else {
  lines.push('- No sync warnings reported.')
}

await appendFile(summaryPath, `${lines.join('\n')}\n`)
