import type { Project } from './projects'

export interface ContentIntelligenceSummary {
  linkedProjectCount: number
  storyCoveragePercent: number
  latestWritingDate: Date | null
  latestProjectDate: Date | null
}

interface ContentIntelligenceInput {
  projects: Pick<Project, 'repository' | 'pushedAt'>[]
  writingDates: Date[]
  linkedRepositories: Set<string>
}

export const getContentIntelligenceSummary = ({
  projects,
  writingDates,
  linkedRepositories
}: ContentIntelligenceInput): ContentIntelligenceSummary => {
  const linkedProjectCount = projects.filter((project) => linkedRepositories.has(project.repository)).length
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
    storyCoveragePercent,
    latestWritingDate,
    latestProjectDate
  }
}
