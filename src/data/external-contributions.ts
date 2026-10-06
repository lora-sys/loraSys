import snapshot from './external-contributions.json'

export interface ContributionPullRequest {
  title: string
  url: string
  state: string
  mergedAt: string | null
  updatedAt: string
}

export interface ExternalContribution {
  repository: string
  repositoryUrl: string
  description: string
  label: string
  note: string
  priority: number
  prUrl: string | null
  projectUrl: string | null
  pullRequests: ContributionPullRequest[]
}

export interface ExternalContributionSnapshot {
  syncVersion: number
  lastUpdated: string | null
  source: string
  allowlist: string[]
  contributions: ExternalContribution[]
  warnings: string[]
}

// CI replaces this JSON before Astro checks it. Empty arrays must keep the same contract.
const contributionSnapshot: ExternalContributionSnapshot = snapshot
export default contributionSnapshot
