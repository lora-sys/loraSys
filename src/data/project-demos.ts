// 首页与作品页共用的产品微演示映射；键是同步快照里的仓库名。
export type ProjectDemoKind =
  | 'timeline'
  | 'pipeline'
  | 'terminal'
  | 'learning'
  | 'gate'
  | 'economy'
  | 'evidence'

export const demoByRepo: Record<string, ProjectDemoKind> = {
  AgentArena: 'timeline',
  'ai-engineering-harness': 'pipeline',
  'Glassbox-Agent-Harness': 'terminal',
  'zhihu-threads': 'learning',
  mossguard: 'gate',
  ecomatrix: 'economy',
  trustops: 'evidence'
}
