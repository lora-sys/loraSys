export interface CurrentFocus {
  eyebrow: string
  title: string
  description: string
  themeTitle: string
  themeHref: string
  projectTitle: string
  projectHref: string
  writingTitle: string
  writingHref: string
  primaryLabel: string
  primaryHref: string
}

/** Editorially curated focus. Keep this explicit so the homepage does not infer a personal priority from sync noise. */
export const currentFocus: CurrentFocus = {
  eyebrow: 'Current focus',
  title: 'Building reliable AI Agent infrastructure.',
  description: '从可观察的 Agent 工程基础设施开始，把实验沉淀成可复用的系统、文章和公开构建记录。',
  themeTitle: 'AI Agent Infrastructure',
  themeHref: '/projects#theme-roadmap',
  projectTitle: 'Glassbox Agent Harness',
  projectHref: '/projects#Glassbox-Agent-Harness',
  writingTitle: 'AI Engineering Harness: 从 Vibe 到 Vibe 的 AI 工程化',
  writingHref: '/blog/ai-engineering-harness',
  primaryLabel: 'Explore the project',
  primaryHref: '/projects#Glassbox-Agent-Harness'
}
