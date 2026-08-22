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
