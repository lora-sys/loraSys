import type { Project } from '@/data/projects'

export interface ThemeDefinition {
  slug: string
  title: string
  description: string
  repositoryNames: string[]
  writingIds: string[]
  channelNames: string[]
  nextFormat: string
}

export interface ThemeWriting {
  id: string
  title: string
}

export interface ThemeRoadmapItem extends ThemeDefinition {
  projects: Project[]
  writings: ThemeWriting[]
}

/**
 * Editorial theme routes are intentionally explicit. Project categories and
 * article tags are useful signals, but they are not consistent enough to
 * infer a durable personal-brand theme without human curation.
 */
export const themeDefinitions: ThemeDefinition[] = [
  {
    slug: 'agent-infrastructure',
    title: 'AI Agent 基础设施',
    description: '可观察、可评测、可迭代的 Agent 运行时与工程基础设施。',
    repositoryNames: [
      'Glassbox-Agent-Harness',
      'nano-vllm-interactive-guide',
      'nano-vLLM',
      'trustops',
      'AgentArena'
    ],
    writingIds: ['ai-engineering-harness', 'loop-engineering-harness', 'sandbox'],
    channelNames: ['Bilibili', '知乎'],
    nextFormat: '附带证据的构建笔记'
  },
  {
    slug: 'multimodal-vision',
    title: '多模态与视觉',
    description: '视觉证据、图片生成与视频生成能力的低成本实践。',
    repositoryNames: ['free-vision-skill', 'hermes-stepfun-imagegen', 'hermes-minimax-media'],
    writingIds: ['free-vision-skill', 'hermes-stepfun-imagegen', 'hermes-minimax-media'],
    channelNames: ['小红书', 'Bilibili', '知乎'],
    nextFormat: '技术文章'
  },
  {
    slug: 'full-stack-products',
    title: '全栈产品',
    description: '从产品设计、系统架构到可运行体验的全栈产品构建。',
    repositoryNames: ['Newtube-clone', 'WishLive', 'second-brain', 'zhihu-threads'],
    writingIds: ['newtube', 'wishlive'],
    channelNames: ['YouTube', 'Bilibili'],
    nextFormat: '产品进展'
  },
  {
    slug: 'developer-tools',
    title: '开发者工具与实验',
    description: '面向开发者的工具、教程与快速验证型实验。',
    repositoryNames: ['free-vision-skill', 'nano-vllm-interactive-guide', 'trustops'],
    writingIds: ['eve-agent', 'sandbox', 'loop-engineering-harness'],
    channelNames: ['知乎', '小红书'],
    nextFormat: '实现分析'
  }
]

export const getThemeRoadmap = (
  projects: Project[],
  posts: ThemeWriting[]
): ThemeRoadmapItem[] => {
  const availablePosts = new Map(posts.map((post) => [post.id, post]))

  return themeDefinitions.map((theme) => ({
    ...theme,
    projects: projects.filter((project) => theme.repositoryNames.includes(project.repository)),
    writings: theme.writingIds.flatMap((id) => {
      const post = availablePosts.get(id)
      return post ? [post] : []
    })
  }))
}
