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
  reviewedAt: '2026-09-14',
  summary: {
    'zh-CN': [
      {
        title: 'Glassbox · Personal Agent 工作台',
        description: '推进身份、授权、会话与可追溯执行地基，同时保留现有 Coding Agent Harness 能力。',
        href: '/projects#Glassbox-Agent-Harness'
      },
      {
        title: 'Lora Skills',
        description: '维护一组可安装的 Agent Skills，把个人站发布、AI 工程和内容工作流沉淀成可复用能力。',
        href: '/projects#skills'
      },
      {
        title: 'Zhihu Threads',
        description: '从用户选择的知乎摘录构建可追问、自测、可检查证据边界的学习线。',
        href: '/projects/zhihu-threads'
      }
    ],
    'en-US': [
      {
        title: 'Glassbox · Personal Agent workbench',
        description: 'Building the identity, authorization, conversation and traceable execution foundation while keeping the existing coding-agent harness useful.',
        href: '/en/work#Glassbox-Agent-Harness'
      },
      {
        title: 'Lora Skills',
        description: 'Maintaining installable Agent Skills that turn publishing, AI engineering and content workflows into reusable capabilities.',
        href: '/en/work#skills'
      },
      {
        title: 'Zhihu Threads',
        description: 'Building evidence-bounded learning threads from excerpts the user explicitly selects.',
        href: '/en/projects/zhihu-threads'
      }
    ]
  },
  sections: {
    'zh-CN': [
      {
        id: 'building',
        category: 'Building',
        title: '营造中',
        status: 'In progress',
        frequency: '随项目里程碑更新',
        items: [
          'Glassbox：Personal Agent Foundation，优先推进身份、授权、会话和可追溯执行。',
          'Lora Skills：继续整理、验证并发布可安装的 Agent Skills。',
          'Zhihu Threads：收紧来源选择、学习线与评测记录之间的证据边界。'
        ]
      },
      {
        id: 'learning',
        category: 'Learning',
        title: '学习中',
        status: 'Exploring',
        frequency: '有可复用结论时更新',
        items: ['Agent 授权与长期记忆边界', '可观测、可评测的 Agent 运行与工具调用']
      },
      {
        id: 'reading',
        category: 'Reading',
        title: '阅读中',
        status: 'On my desk',
        frequency: '随阅读进展更新',
        items: ['Designing Data-Intensive Applications']
      },
      {
        id: 'listening',
        category: 'Listening',
        title: '共鸣中',
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
        frequency: 'Updated at meaningful project milestones',
        items: [
          'Glassbox: Personal Agent Foundation with identity, authorization, conversation and traceable execution first.',
          'Lora Skills: keep validating and publishing reusable Agent Skills.',
          'Zhihu Threads: tighten the evidence boundary between selected excerpts, learning threads and evaluation records.'
        ]
      },
      {
        id: 'learning',
        category: 'Learning',
        title: 'Learning',
        status: 'Exploring',
        frequency: 'Updated when the learning becomes reusable',
        items: ['Agent authorization and long-term memory boundaries', 'Observable and evaluable runs and tool use']
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
  title: 'Building reliable personal-agent infrastructure.',
  description: '从身份、授权、会话和可观察执行开始，把真实构建沉淀成可复用的系统、技能和公开记录。',
  themeTitle: 'AI Agent Infrastructure',
  themeHref: '/projects#theme-roadmap',
  projectTitle: 'Glassbox',
  projectHref: '/projects#Glassbox-Agent-Harness',
  writingTitle: 'AI Engineering Harness: 从 Vibe Coding 到工程化',
  writingHref: '/blog/ai-engineering-harness',
  primaryLabel: 'Explore Glassbox',
  primaryHref: '/projects#Glassbox-Agent-Harness'
} as const

export const getCurrentFocusSummary = (locale: FocusLocale): FocusSummaryItem[] =>
  focusCopy.summary[locale].map((item) => ({ ...item }))

export const getCurrentFocusSections = (locale: FocusLocale): FocusSection[] =>
  focusCopy.sections[locale].map((section) => ({ ...section, items: [...section.items] }))
