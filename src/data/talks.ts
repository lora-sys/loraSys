export interface Appearance {
  title: string
  date: string
  location: string
  role: string
  description: string
  project: string
  source?: string
}

/** Real build appearances only; no video, talk or slides are claimed. */
export const appearances: Appearance[] = [
  {
    title: 'ETH Beijing 2026',
    date: '2026 年 6 月 5 日至 7 日',
    location: '北京 · 昆仑巢',
    role: '项目开发者',
    description: '与五人团队开发 AI Agent 与区块链结合的项目。',
    project: 'AI Agent 与区块链原型',
    source: 'https://github.com/lora-sys/Hackthon'
  },
  {
    title: '线上 AI Agent 黑客松',
    date: '2026 年 2 月',
    location: '线上',
    role: '项目开发者',
    description: '开发 Emergence 多 Agent 协作协议。',
    project: 'Emergence',
    source: 'https://github.com/lora-sys/hackthon-agent'
  },
  {
    title: 'Monad Hackathon',
    date: '2026 年 1 月',
    location: '线上',
    role: '项目开发者',
    description: '在 Monad 测试网上开发卡牌预测应用原型。',
    project: 'Tarot Prediction DApp',
    source: 'https://github.com/lora-sys/demo_monad_hackthon'
  },
  {
    title: 'Monad Blitz Hackathon',
    date: '2026',
    location: '线上',
    role: '项目开发者',
    description: '在 48 小时内迭代并交付可运行原型。',
    project: '限时原型开发'
  }
]
