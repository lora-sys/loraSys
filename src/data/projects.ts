import githubSnapshot from './github-projects.json'

export interface Link {
  type: 'source' | 'website'
  href: string
}

export type ProjectStatus = 'building' | 'active' | 'archived'

export interface Project {
  title: string
  dates: string
  active: boolean
  description: string
  technologies: string[]
  image: string
  links: Link[]
  featured?: boolean
  featuredRank?: number
  kind: 'owned'
  status: ProjectStatus
  categories: string[]
  posterFit: 'cover' | 'contain'
  objectPosition: string
  repository: string
  homepage?: string
  pushedAt: string
  language?: string
  stars: number
}

interface GitHubProjectRecord {
  name: string
  title: string
  summary: string
  homepage: string | null
  url: string
  stars: number
  archived: boolean
  languages: Record<string, number>
  topics: string[]
  createdAt: string
  pushedAt: string
  kind: 'owned'
  status: ProjectStatus
  categories: string[]
  featuredRank: number | null
  poster: {
    localFile: string
    fit: 'cover' | 'contain'
    objectPosition: string
  }
}

const topicLabels: Record<string, string> = {
  'agent-skill': 'Agent Skill',
  'ai-agent': 'AI Agent',
  'ai-agents': 'AI Agents',
  'claude-skill': 'Claude Skill',
  'github-pages': 'GitHub Pages',
  'image-generation': 'Image Generation',
  'multi-agent': 'Multi-Agent',
  'video-generation': 'Video Generation',
  nextjs: 'Next.js',
  nodejs: 'Node.js',
  threejs: 'Three.js',
  webgl: 'WebGL',
  web3: 'Web3',
  grpc: 'gRPC',
  llm: 'LLM'
}

const ignoredTopics = new Set([
  'open-source',
  'portfolio',
  'learning',
  'practice',
  'demo',
  'example',
  'examples',
  'project',
  'projects'
])

const formatDates = (createdAt: string, status: ProjectStatus) => {
  const created = new Date(createdAt)
  const start = new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(created)
  return status === 'building' ? `${start} — Present` : start
}

const technologiesFor = (project: GitHubProjectRecord) => {
  const languages = Object.entries(project.languages)
    .sort(([, left], [, right]) => right - left)
    .map(([language]) => language)
  const topics = project.topics
    .filter((topic) => !ignoredTopics.has(topic))
    .map(
      (topic) =>
        topicLabels[topic] ??
        topic.replace(
          /(^|-)([a-z])/g,
          (_, prefix, letter) => `${prefix ? ' ' : ''}${letter.toUpperCase()}`
        )
    )
  return [...new Set([...languages, ...topics])].slice(0, 6)
}

const records = Object.values(githubSnapshot.projects) as GitHubProjectRecord[]

export const projects: Project[] = records
  .sort((left, right) => {
    if (left.featuredRank && right.featuredRank) return left.featuredRank - right.featuredRank
    if (left.featuredRank) return -1
    if (right.featuredRank) return 1
    return new Date(right.pushedAt).getTime() - new Date(left.pushedAt).getTime()
  })
  .map((project) => ({
    title: project.title,
    dates: formatDates(project.createdAt, project.status),
    active: project.status !== 'archived',
    description: project.summary,
    technologies: technologiesFor(project),
    image: project.poster.localFile,
    featured: project.featuredRank !== null,
    featuredRank: project.featuredRank ?? undefined,
    kind: project.kind,
    status: project.status,
    categories: project.categories,
    posterFit: project.poster.fit,
    objectPosition: project.poster.objectPosition,
    repository: project.name,
    homepage: project.homepage ?? undefined,
    pushedAt: project.pushedAt,
    language: Object.keys(project.languages)[0],
    stars: project.stars,
    links: [
      { type: 'source', href: project.url },
      ...(project.homepage && project.homepage !== project.url
        ? [{ type: 'website' as const, href: project.homepage }]
        : [])
    ]
  }))
