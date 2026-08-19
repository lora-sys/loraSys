import type { Project } from './projects'

export type ContentOpportunityPriority = 'High' | 'Medium'
export type ContentOpportunityFormat = 'Build note' | 'Project update' | 'Lab note'

export interface ContentOpportunity {
  repository: string
  title: string
  source: string
  status: Project['status']
  pushedAt: string
  priority: ContentOpportunityPriority
  format: ContentOpportunityFormat
  reason: string
}

export interface ContentIntelligenceSummary {
  linkedProjectCount: number
  storyGapCount: number
  storyCoveragePercent: number
  latestWritingDate: Date | null
  latestProjectDate: Date | null
  topOpportunity: ContentOpportunity | null
}

interface ContentIntelligenceInput {
  projects: Pick<Project, 'repository' | 'title' | 'pushedAt' | 'source' | 'status' | 'featuredRank'>[]
  writingDates: Date[]
  linkedRepositories: Set<string>
}

export const getContentOpportunities = ({
  projects,
  linkedRepositories
}: Pick<ContentIntelligenceInput, 'projects' | 'linkedRepositories'>): ContentOpportunity[] =>
  projects
    .filter((project) => project.status !== 'archived' && !linkedRepositories.has(project.repository))
    .map((project) => {
      const priority: ContentOpportunityPriority = project.featuredRank !== undefined || project.status === 'building' ? 'High' : 'Medium'
      const format: ContentOpportunityFormat =
        project.source === 'ACAMLab' ? 'Lab note' : project.status === 'building' ? 'Build note' : 'Project update'
      const reason =
        project.featuredRank !== undefined
          ? 'Featured work without a Story'
          : project.status === 'building'
            ? 'Active build needs context'
            : 'Recent repository push'
      return { ...project, priority, format, reason }
    })
    .sort((left, right) => {
      const priorityDelta = left.priority === right.priority ? 0 : left.priority === 'High' ? -1 : 1
      return priorityDelta || new Date(right.pushedAt).getTime() - new Date(left.pushedAt).getTime()
    })

export const getContentIntelligenceSummary = ({
  projects,
  writingDates,
  linkedRepositories
}: ContentIntelligenceInput): ContentIntelligenceSummary => {
  const linkedProjectCount = projects.filter((project) => linkedRepositories.has(project.repository)).length
  const opportunities = getContentOpportunities({ projects, linkedRepositories })
  const storyGapCount = opportunities.length
  const storyCoveragePercent = projects.length
    ? Math.round((linkedProjectCount / projects.length) * 100)
    : 0
  const latestProjectDate = projects.reduce<Date | null>((latest, project) => {
    const pushedAt = new Date(project.pushedAt)
    if (Number.isNaN(pushedAt.getTime())) return latest
    return !latest || pushedAt > latest ? pushedAt : latest
  }, null)
  const latestWritingDate = writingDates.reduce<Date | null>(
    (latest, date) => (!latest || date > latest ? date : latest),
    null
  )

  return {
    linkedProjectCount,
    storyGapCount,
    storyCoveragePercent,
    latestWritingDate,
    latestProjectDate,
    topOpportunity: opportunities[0] ?? null
  }
}
