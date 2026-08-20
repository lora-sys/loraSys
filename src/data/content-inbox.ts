export type ContentSource = 'public-url' | 'notion' | 'social' | 'local-file'
export type ContentKind = 'blog' | 'note' | 'project-update' | 'lab-note'
export type ContentStatus = 'candidate' | 'needs-review' | 'approved' | 'published'

export interface ContentInboxItem {
  id: string
  title: string
  source: ContentSource
  sourceUrl?: string
  sourceLabel: string
  kind: ContentKind
  status: ContentStatus
  project?: string
  track?: string
  tags: string[]
  summary: string
  createdAt: string
  publishTarget?: string
}

export const contentSourceLabels: Record<ContentSource, string> = {
  'public-url': 'Public URL',
  notion: 'Notion',
  social: 'Social media',
  'local-file': 'Local file'
}

export const contentKindLabels: Record<ContentKind, string> = {
  blog: 'Blog',
  note: 'Note',
  'project-update': 'Project update',
  'lab-note': 'Lab note'
}

export const contentStatusLabels: Record<ContentStatus, string> = {
  candidate: 'Candidate',
  'needs-review': 'Needs review',
  approved: 'Approved',
  published: 'Published'
}

export const seededInboxItems: ContentInboxItem[] = [
  {
    id: 'agentarena-public-import',
    title: 'Agent Arena：让智能体在证据链中竞争',
    source: 'public-url',
    sourceUrl: 'https://github.com/lora-sys/AgentArena',
    sourceLabel: 'AgentArena README',
    kind: 'note',
    status: 'candidate',
    project: 'lora-sys/AgentArena',
    track: 'Horizon Startup Hackathon',
    tags: ['ai-agents', 'evaluation', 'multi-agent', 'hackathon'],
    summary: '把 Agent Arena 的证据绑定评分、Battle Replay、Champion Passport 和诚实降级整理为一篇项目笔记。',
    createdAt: '2026-08-20',
    publishTarget: '/notes'
  },
  {
    id: 'notion-agent-loop-pending',
    title: 'Agent Loop（待连接器读取）',
    source: 'notion',
    sourceUrl: 'https://app.notion.com/p/Agent-30-Agent-Loop-3c15f184f7be81108993c3d78a48bb16',
    sourceLabel: 'User-provided Notion page',
    kind: 'note',
    status: 'needs-review',
    tags: ['agent-loop', 'notion-import'],
    summary: '页面链接已登记，但 Notion 连接器当前返回 403/连接超时；恢复后先做只读提取，再决定 Blog 或 Note 映射。',
    createdAt: '2026-08-20',
    publishTarget: '/notes'
  }
]

export const socialMapping = [
  { source: '知乎', target: 'blog', reason: '适合完整技术文章、长文复盘和观点解释。' },
  { source: '小红书', target: 'note', reason: '适合短项目记录、视觉卡片和进展切片。' },
  { source: 'Bilibili', target: 'project-update', reason: '适合演示、录屏和项目发布节点。' },
  { source: 'YouTube', target: 'project-update', reason: '适合英文演示、实验过程和完整视频说明。' }
] as const
