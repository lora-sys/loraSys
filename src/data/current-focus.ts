export type FocusLocale = 'zh-CN' | 'en-US'

export interface FocusSummaryItem {
  title: string
  description: string
  href?: string
}

export interface FocusSection {
  id: string
  category: string
  title: string
  status: string
  frequency: string
  items: string[]
}

const focusCopy = {
  reviewedAt: '2026-09-20',
  summary: {
    'zh-CN': [
      {
        title: 'Glassbox · 个人 Agent 系统',
        description: '继续推进长期运行的个人 Agent 基础，同时用 Lora Pi Kit 固定可复现的运行环境、Skills 与权限边界。',
        href: '/projects#Glassbox-Agent-Harness'
      },
      {
        title: 'Lora Skills',
        description: '维护一组可安装的 Agent Skills，把个人站发布、AI 工程、视觉与内容工作流沉淀成可复用能力。',
        href: '/projects#skills'
      },
      {
        title: 'Zhihu Threads',
        description: '把用户自己选择的知乎摘录整理成可以继续追问、自测和回看的学习线。',
        href: '/projects/zhihu-threads'
      }
    ],
    'en-US': [
      {
        title: 'Glassbox · Personal Agent',
        description: 'Building the foundation for a long-running personal agent, with Lora Pi Kit keeping its runtime, Skills and permission boundaries reproducible.',
        href: '/en/work#Glassbox-Agent-Harness'
      },
      {
        title: 'Lora Skills',
        description: 'Maintaining installable Agent Skills for publishing, AI engineering, visual work and repeatable content workflows.',
        href: '/en/work#skills'
      },
      {
        title: 'Zhihu Threads',
        description: 'Turning excerpts selected by the reader into a learning thread that can be questioned, tested and revisited.',
        href: '/en/projects/zhihu-threads'
      }
    ]
  },
  sections: {
    'zh-CN': [
      {
        id: 'building',
        category: 'Building',
        title: '最近在做',
        status: 'In progress',
        frequency: '有明显进展时更新',
        items: [
          'Glassbox：继续做个人 Agent 的身份、授权、会话和可追溯执行基础。',
          'Lora Pi Kit：把 Pi、Skills、MCP、运行配置和不同使用场景整理成可复现的个人发行版。',
          'Lora Skills：继续整理、验证并发布可安装的 Agent Skills。',
          'Zhihu Threads：优化来源选择、学习线、自测和评测记录之间的关系。'
        ]
      },
      {
        id: 'learning',
        category: 'Learning',
        title: '最近在学',
        status: 'Exploring',
        frequency: '形成可复用结论时更新',
        items: ['长期运行 Agent 的授权、记忆与任务恢复', '怎样让 Agent 的运行过程更容易观察、评测和复盘']
      },
      {
        id: 'reading',
        category: 'Reading',
        title: '最近在读',
        status: 'On my desk',
        frequency: '随阅读进展更新',
        items: ['Designing Data-Intensive Applications']
      },
      {
        id: 'listening',
        category: 'Listening',
        title: '最近在听',
        status: 'On repeat',
        frequency: '不定期更新',
        items: ['Tame Impala — Currents']
      }
    ],
    'en-US': [
      {
        id: 'building',
        category: 'Building',
        title: 'Building',
        status: 'In progress',
        frequency: 'Updated when the work meaningfully changes',
        items: [
          'Glassbox: identity, authorization, conversation and traceable execution for a personal agent.',
          'Lora Pi Kit: a reproducible Pi distribution that packages Skills, MCP, profiles and runtime configuration.',
          'Lora Skills: keep validating and publishing reusable Agent Skills.',
          'Zhihu Threads: improve the connection between selected sources, learning threads, self-tests and evaluation records.'
        ]
      },
      {
        id: 'learning',
        category: 'Learning',
        title: 'Learning',
        status: 'Exploring',
        frequency: 'Updated when the learning becomes reusable',
        items: ['Authorization, memory and recovery for long-running agents', 'Observable and evaluable agent runs and tool use']
      },
      {
        id: 'reading',
        category: 'Reading',
        title: 'Reading',
        status: 'On my desk',
        frequency: 'Updated with reading progress',
        items: ['Designing Data-Intensive Applications']
      },
      {
        id: 'listening',
        category: 'Listening',
        title: 'Listening',
        status: 'On repeat',
        frequency: 'Updated occasionally',
        items: ['Tame Impala — Currents']
      }
    ]
  }
} as const

export const currentFocus = {
  reviewedAt: focusCopy.reviewedAt,
  eyebrow: 'Current focus',
  title: 'Building useful AI tools and writing down what I learn.',
  description: '最近主要在做个人 Agent、可复用 Skills 和学习工具，也继续把构建过程写成可以公开检查的记录。',
  themeTitle: 'AI Agent Infrastructure',
  themeHref: '/projects#theme-roadmap',
  projectTitle: 'Glassbox',
  projectHref: '/projects#Glassbox-Agent-Harness',
  writingTitle: 'Agent Demo 不难，难的是 Harness',
  writingHref: '/blog/agent-demo-harness-control-layer',
  primaryLabel: 'Explore Glassbox',
  primaryHref: '/projects#Glassbox-Agent-Harness'
} as const

export const getCurrentFocusSummary = (locale: FocusLocale): FocusSummaryItem[] =>
  focusCopy.summary[locale].map((item) => ({ ...item }))

export const getCurrentFocusSections = (locale: FocusLocale): FocusSection[] =>
  focusCopy.sections[locale].map((section) => ({ ...section, items: [...section.items] }))
