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
    slug: 'personal-agents',
    title: '个人 Agent 与基础设施',
    description: '长期运行的个人 Agent、评测、运行环境与工程基础。',
    repositoryNames: [
      'Glassbox-Agent-Harness',
      'lora-pi-kit',
      'AgentArena',
      'trustops',
      'nano-vllm-interactive-guide'
    ],
    writingIds: ['agent-demo-harness-control-layer', 'ai-engineering-harness', 'loop-engineering-harness'],
    channelNames: ['Bilibili', '知乎'],
    nextFormat: '构建记录'
  },
  {
    slug: 'trust-evaluation',
    title: '可信执行与评测',
    description: '让 Agent 的动作、证据、风险和结果能够被检查，而不是只看最终回答。',
    repositoryNames: ['mossguard', 'trustops', 'AgentArena', 'ecomatrix'],
    writingIds: ['agent-eval-monitor-coverage', 'coding-agent-supply-chain-security', 'sandbox'],
    channelNames: ['知乎', 'Bilibili'],
    nextFormat: '案例复盘'
  },
  {
    slug: 'skills-tools',
    title: 'Skills 与开发者工具',
    description: '把重复工作整理成能安装、能复用、能验证的小工具和 Skills。',
    repositoryNames: ['skills', 'shape-up-project-shaping', 'sysclean', 'free-vision-skill'],
    writingIds: ['free-vision-skill', 'skills-manager-multi-agent-skill-sync', 'opencompany-versioned-agent-config'],
    channelNames: ['小红书', '知乎'],
    nextFormat: '工具说明'
  },
  {
    slug: 'learning-products',
    title: '学习与内容产品',
    description: '把复杂材料整理成更容易理解、追问、练习和回看的产品体验。',
    repositoryNames: ['zhihu-threads', 'nano-vllm-interactive-guide', 'second-brain', 'teaching-html-story-deck'],
    writingIds: ['tau-agent-architecture', 'newtube'],
    channelNames: ['YouTube', 'Bilibili', '知乎'],
    nextFormat: '产品进展'
  },
  {
    slug: 'multimodal-visual',
    title: '多模态与视觉',
    description: '图片、视频、视觉理解和可复用视觉工作流。',
    repositoryNames: ['packify-skill', 'free-vision-skill', 'hermes-stepfun-imagegen', 'hermes-minimax-media'],
    writingIds: ['free-vision-skill', 'hermes-stepfun-imagegen', 'hermes-minimax-media'],
    channelNames: ['小红书', 'Bilibili', '知乎'],
    nextFormat: '视觉实验'
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
