export const homepageFeaturedRepositories = [
  'Glassbox-Agent-Harness',
  'zhihu-threads',
  'skills',
  'AgentArena'
] as const

/**
 * Editorial rank overrides belong to the site, not the GitHub snapshot.
 * The snapshot records repository facts; this file decides what the portfolio should foreground.
 */
const featuredRankOverrides = new Map<string, number>([['skills', 2.5]])

export const featuredRankFor = (repository: string, snapshotRank: number | null) =>
  featuredRankOverrides.get(repository.toLowerCase()) ?? snapshotRank

export const homepageFeatured = <T extends { repository: string }>(projects: T[]) => {
  const byRepository = new Map(projects.map((project) => [project.repository, project]))
  return homepageFeaturedRepositories
    .map((repository) => byRepository.get(repository))
    .filter((project): project is T => Boolean(project))
}
