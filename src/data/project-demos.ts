// 首页与作品页共用的产品微演示映射；键是同步快照里的仓库名。
export const demoByRepo: Record<string, 'timeline' | 'pipeline' | 'terminal'> = {
  AgentArena: 'timeline',
  'ai-engineering-harness': 'pipeline',
  'Glassbox-Agent-Harness': 'terminal'
}
