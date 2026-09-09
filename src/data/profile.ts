export { projects } from './projects'
export type { Link, Project } from './projects'

export const profile = {
  name: 'Lora',
  role: 'AI Agent Developer & Full-stack Engineer',
  location: "Xi'an, China",
  email: 'lorasys@outlook.com',
  summary: [
    '我是一名学生开发者，主要关注 AI Agent、全栈应用和 Agent 基础设施。比起只讨论概念，我更享受从产品设计、系统架构到开发验证，把大胆想法一步步做成可运行、可体验的产品。',
    '在学校实验室，我负责把研究想法转化为可用的软件系统，也参与项目规划、技术协作和开发规范建设；在黑客松与开源社区中，我持续通过公开项目、短反馈循环和协作验证自己的工程实现。长期希望构建能理解用户习惯、目标和工作方式，并持续演化的可靠智能体。'
  ],
  skills: [
    'TypeScript',
    'Python',
    'JavaScript',
    'Java',
    'Solidity',
    'Next.js',
    'React',
    'Astro',
    'Node.js',
    'PostgreSQL',
    'Tailwind CSS',
    'Docker',
    'AI Agents',
    'Web3'
  ],
  education: [
    {
      school: "Xi'an Mingde Institute of Technology",
      degree: "Bachelor's Degree of Computer Science",
      period: '2023.07 — 2027.07',
      href: 'https://www.mdit.edu.cn',
      logo: '/images/mingde.svg'
    }
  ],
  social: [
    ['GitHub', 'https://github.com/lora-sys', 'github-circle'],
    ['LinkedIn', 'https://www.linkedin.com/in/lora-sys/', 'linkedin'],
    ['X', 'https://x.com/MierPiter33280', 'x'],
    ['PeerList', 'https://peerlist.io/mierpiter', 'earth'],
    ['YouTube', 'https://www.youtube.com/@MierPiter33280', 'youtube'],
    ['Bilibili', 'https://space.bilibili.com/431821023', 'video'],
    ['Zhihu', 'https://www.zhihu.com/people/lorry-23-28-30', 'document'],
    ['Email', 'mailto:lorasys@outlook.com', 'email']
  ] as const
} as const

export const hackathons = [
  {
    title: '知乎黑客松',
    date: 'September 13, 2026',
    location: 'Upcoming · venue pending',
    content: '计划参加。具体项目、协作信息与现场记录将在活动结束后补充。',
    href: '',
    status: 'planned'
  },
  {
    title: '世界人工智能开源大赛 · Agent Infra',
    date: 'August 22, 2026',
    location: 'Datawhale × 阿里云 · Online',
    content: '完成 2026 Datawhale AI 夏令营第二期全部学习，获得结营证书。',
    href: '',
    status: 'completed',
    certificateId: 'goai-agent-infra-2026'
  },
  {
    title: 'ETH Beijing 2026',
    date: 'June 5–7, 2026',
    location: 'Beijing · Kunlun Nest',
    content: 'Built an AI Agent × Blockchain project with a team of five.',
    href: 'https://github.com/lora-sys/Hackthon',
    status: 'completed'
  },
  {
    title: 'Monad Blitz Hackathon',
    date: '2026',
    location: 'Online',
    content: 'Shipped a working prototype in a 48-hour rapid iteration sprint.',
    href: '',
    status: 'completed'
  },
  {
    title: 'Monad Hackathon',
    date: 'January 2026',
    location: 'Online',
    content: 'Built a Web3 tarot prediction platform on Monad Testnet.',
    href: 'https://github.com/lora-sys/demo_monad_hackthon',
    status: 'completed'
  },
  {
    title: 'Online AI Agent Hackathon',
    date: 'February 2026',
    location: 'Online',
    content: 'Built Emergence, a resilient multi-agent collaboration protocol.',
    href: 'https://github.com/lora-sys/hackthon-agent',
    status: 'completed'
  },
  {
    title: 'Horizon Startup Hackathon',
    date: 'Planned · date pending',
    location: 'Beijing · Startup Hackathon',
    content: 'Built Agent Arena, an evidence-centered AI Agent team arena for proposal, attack, defense, verification, and replayable verdicts.',
    href: 'https://github.com/lora-sys/AgentArena',
    status: 'planned'
  },
  {
    title: 'AMD AI DevMaster Hackathon 2026',
    date: '2026 · PR open',
    location: 'Track 1 · Multimodal Content Creation Tools',
    content: 'Contributed to StagePoster, an AI-native music event poster engine running on AMD Radeon PRO W7900 + ROCm.',
    href: 'https://github.com/AMD-DEV-CONTEST/Radeon-hackathon-2026-07/pull/71',
    project: 'https://github.com/Ripped-sys/StagePoster',
    status: 'completed'
  }
]

const chineseProfileText: Record<string, string> = {
  "September 13, 2026": "2026 年 9 月 13 日",
  "August 22, 2026": "2026 年 8 月 22 日",
  "June 5–7, 2026": "2026 年 6 月 5 至 7 日",
  "January 2026": "2026 年 1 月",
  "February 2026": "2026 年 2 月",
  "Planned · date pending": "计划参加，日期待定",
  "2026 · PR open": "2026 年，贡献申请待审",
  "Upcoming · venue pending": "即将举行，地点待定",
  "Datawhale × 阿里云 · Online": "Datawhale 与阿里云 · 线上",
  "Beijing · Kunlun Nest": "北京 · 昆仑巢",
  "Online": "线上",
  "Beijing · Startup Hackathon": "北京 · 创业黑客松",
  "Track 1 · Multimodal Content Creation Tools": "赛道一 · 多模态内容创作工具",
  "Built an AI Agent × Blockchain project with a team of five.": "与五人团队构建智能体与区块链结合的项目。",
  "Shipped a working prototype in a 48-hour rapid iteration sprint.": "在 48 小时内完成可运行原型。",
  "Built a Web3 tarot prediction platform on Monad Testnet.": "在 Monad 测试网上构建 Web3 塔罗预测原型。",
  "Built Emergence, a resilient multi-agent collaboration protocol.": "构建多智能体协作协议 Emergence。",
  "Built Agent Arena, an evidence-centered AI Agent team arena for proposal, attack, defense, verification, and replayable verdicts.": "相关项目 Agent Arena 支持提案、攻击、防守、验证与裁决回放。",
  "Contributed to StagePoster, an AI-native music event poster engine running on AMD Radeon PRO W7900 + ROCm.": "参与 StagePoster 音乐活动海报引擎，使用 AMD Radeon PRO W7900 与 ROCm。",
  "Monad Blitz Hackathon": "Monad Blitz 黑客松",
  "Monad Hackathon": "Monad 黑客松",
  "Online AI Agent Hackathon": "线上智能体黑客松",
  "Horizon Startup Hackathon": "Horizon 创业黑客松"
}
export const profileZh = {
  ...profile, role: 'AI Agent 开发者与全栈工程师', location: '中国西安',
  education: profile.education.map((item) => ({ ...item, school: '西安明德理工学院', degree: '计算机科学本科', period: '2023.07 至 2027.07' }))
}
export const hackathonsZh = hackathons.map((item) => ({
  ...item, title: chineseProfileText[item.title] ?? item.title,
  date: chineseProfileText[item.date] ?? item.date, location: chineseProfileText[item.location] ?? item.location,
  content: chineseProfileText[item.content] ?? item.content
}))
