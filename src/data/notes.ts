// 短笔记策展数据：从 notes 页面迁出，便于维护与后续扩充。
// 条目按新到旧排列；slug 是公开固定链接的一部分，发布后不要修改。
export interface FieldNote {
  slug: string
  title: string
  date: string
  dateLabel: string
  summary: string
  tags: string[]
  related: {
    href: string
    label: string
    title: string
  }
}

export const fieldNotes: FieldNote[] = [
  {
    slug: 'multi-agent-emergent-behavior',
    title: '多智能体系统的涌现行为',
    date: '2025-12-01',
    dateLabel: 'Dec 2025',
    summary:
      '当多个 LLM 实例协作解决同一任务时，简单规则会产生复杂群体行为。记录 swarm intelligence 在工程系统中的潜在应用。',
    tags: ['AI Agents', 'Research'],
    related: {
      href: '/blog/ai-engineering-harness',
      label: '关联长文',
      title: 'AI Engineering Harness'
    }
  },
  {
    slug: 'monad-parallel-evm-benchmark',
    title: 'Monad 并行 EVM 性能基准',
    date: '2025-11-01',
    dateLabel: 'Nov 2025',
    summary: '测试 Monad 的并行交易执行性能。相较以太坊 L1，关键提升与瓶颈都集中在状态依赖分析。',
    tags: ['Web3', 'Monad', 'Benchmark'],
    related: { href: '/blog/wishlive', label: '关联构建', title: 'WishLive Multi-Agent Runtime' }
  },
  {
    slug: 'vercel-ai-sdk-v3-migration',
    title: 'Vercel AI SDK v3 迁移经验',
    date: '2025-10-01',
    dateLabel: 'Oct 2025',
    summary: 'useChat 重构、流式传输 API 与 tool calling 语法变化。迁移成本中等，文档仍在完善。',
    tags: ['Frontend', 'AI', 'Vercel'],
    related: { href: '/blog/eve-agent', label: '关联长文', title: 'Vercel Eve Agent Framework' }
  },
  {
    slug: 'rust-for-ai-agents',
    title: 'Rust for AI Agents：值得吗？',
    date: '2025-09-01',
    dateLabel: 'Sep 2025',
    summary: '用 Rust 重写 agent runtime 的利弊：内存安全和高并发是优势，生态与开发速度是瓶颈。',
    tags: ['Rust', 'AI Agents', 'Architecture'],
    related: {
      href: '/blog/loop-engineering-harness',
      label: '关联架构',
      title: 'Loop Engineering Harness'
    }
  }
]
