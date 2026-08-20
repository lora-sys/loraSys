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
const projectBreakdown = github.projectBreakdown ?? {}
const allowlistCount = github.contributionAllowlist ?? contributionSnapshot.allowlist?.length ?? github.contributions
const curatedCount = github.contributions ?? contributionSnapshot.contributions?.length ?? 0
const coverage = allowlistCount ? `${curatedCount}/${allowlistCount}` : 'n/a'
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
  `| lora-sys projects | ${projectBreakdown['lora-sys'] ?? 'n/a'} |`,
  `| ACAMLab projects | ${projectBreakdown.ACAMLab ?? 'n/a'} |`,
  `| Allowlisted contribution repos | ${allowlistCount} |`,
  `| Curated contribution repos in snapshot | ${curatedCount} |`,
  `| Allowlist coverage | ${coverage} |`,
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
