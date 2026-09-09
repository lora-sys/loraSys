export interface LabEntry {
  slug: string
  eyebrow: string
  title: string
  summary: string
  question: string
  result: string
  technologies: string[]
  project: string
  source: string
  website?: string
}

/**
 * Lab entries are documented slices of shipped repositories. They intentionally
 * do not claim to be standalone demos when no independent deployment exists.
 */
export const labEntries: LabEntry[] = [
  {
    slug: 'emergence-collaboration-protocol',
    eyebrow: '多 Agent 协作协议',
    title: '保留证据的 Agent 协作',
    summary:
      '围绕多 Agent 讨论、证据记录和投票结果的实时协作实验。',
    question:
      '多个 Agent 出现分歧时，怎样保留各自的证据与最终决策记录？',
    result:
      'Emergence 将讨论、证据链和投票记录组织为可查看的流程。具体实现以项目仓库为准。',
    technologies: ['Next.js', 'TypeScript', 'SSE', 'OpenAI'],
    project: 'Emergence',
    source: 'https://github.com/lora-sys/hackthon-agent'
  },
  {
    slug: 'moss-agent-capabilities',
    eyebrow: 'Agent 与 Web3',
    title: '签名前检查 Monad 操作',
    summary:
      '研究 Monad 操作的发现、模拟与未签名交易检查。',
    question: '怎样让 Agent 在请求用户签名前，先检查链上操作？',
    result:
      'MOSS 将操作发现、模拟和检查与签名分开。这里保留已归档仓库作为历史实现，当前能力和使用限制以仓库说明为准。',
    technologies: ['TypeScript', 'Monad', 'MCP', 'Web3'],
    project: 'MOSS',
    source: 'https://github.com/lora-sys/moss'
  },
  {
    slug: 'ai-company-os-feedback-loops',
    eyebrow: 'Agent 基础设施',
    title: '生成与审查的执行循环',
    summary:
      '用显式状态记录探索 Agent 的生成、审查和修改流程。',
    question: '改进 Agent 产物需要哪些可以重复执行的最小步骤？',
    result:
      'AI Company OS 的设计将执行过程分层，并加入生成与审查反馈。实现细节可在源码中查看。',
    technologies: ['TypeScript', 'Zod', 'MCP', 'CLI/TUI'],
    project: 'AI Company OS',
    source: 'https://github.com/lora-sys/aicompanyos'
  },
  {
    slug: 'nanochat-training-pipeline',
    eyebrow: '语言模型系统',
    title: '小规模语言模型训练流程',
    summary:
      '学习分词器训练、预训练、监督微调和强化学习之间的关系。',
    question:
      '把训练规模缩小后，哪些环节更容易独立检查和理解？',
    result:
      '仓库将 BPE、预训练、监督微调和强化学习组织在同一套学习流程中。',
    technologies: ['Python', 'PyTorch', 'BPE', 'LLM'],
    project: 'Nanochat Study',
    source: 'https://github.com/ACAMLab/nanochat-studay'
  },
  {
    slug: 'tarot-three-dimensional-cards',
    eyebrow: '交互实验',
    title: '三维卡牌交互',
    summary:
      '结合三维卡牌、预测流程和 Monad 测试网的应用原型。',
    question: '卡牌交互怎样在保留趣味的同时，让用户看清交易操作？',
    result:
      '原型将空间卡牌交互接入测试网应用。源码与部署入口保留在下方，测试网资产没有真实货币价值。',
    technologies: ['Solidity', 'React', 'Three.js', 'Hardhat'],
    project: 'Tarot Prediction DApp',
    source: 'https://github.com/lora-sys/demo_monad_hackthon',
    website: 'https://demo-monad-hackthon.vercel.app'
  }
]
