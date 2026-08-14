export { projects } from './projects'
export type { Link, Project } from './projects'

export const profile = {
  name: 'Lora',
  role: 'AI Agent Developer & Full-stack Engineer',
  location: "Xi'an, China",
  email: 'lorasys@outlook.com',
  summary: [
    '我是一名学生开发者，主要关注 AI Agent、全栈应用和 Agent 基础设施。比起只讨论概念，我更享受从产品设计、系统架构到开发验证，把大胆想法一步步变成可运行、可体验的产品。',
    '在学校实验室，我担任科研软件组负责人，负责把研究想法转化为可用的软件系统，也参与项目规划、技术协作和开发规范建设。实验室之外，我是一名活跃的 Builder，经常参加黑客松、参与开源社区，与不同背景的开发者交换想法。',
    '我喜欢黑客松文化：它不仅是一场比赛，也是快速学习、验证想法、认识优秀开发者并突破边界的环境。目前我在构建 AI Company OS、Multi-Agent Engineering Harness、Agent Arena，也在探索 AI Agent 与 Web3 的结合，包括 MOSS 和 MonadMon。',
    '我的长期目标，是构建真正与用户共同成长的智能体：它不止回答问题，也逐渐理解用户的习惯、目标和工作方式，成为可靠、可持续进化的数字伙伴。希望和更多热爱技术、产品、开源和创造的人合作，做出真正有趣且有价值的东西。'
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
      degree: "Bachelor's Degree of Computer Science (Third Year)",
      period: '2022 — 2026',
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
    title: 'ETH Beijing 2026',
    date: 'June 5–7, 2026',
    location: 'Beijing · Kunlun Nest',
    content: 'Built an AI Agent × Blockchain project with a team of five.',
    href: 'https://github.com/lora-sys/Hackthon'
  },
  {
    title: 'Monad Blitz Hackathon',
    date: '2026',
    location: 'Online',
    content: 'Shipped a working prototype in a 48-hour rapid iteration sprint.',
    href: ''
  },
  {
    title: 'Monad Hackathon',
    date: 'January 2026',
    location: 'Online',
    content: 'Built a Web3 tarot prediction platform on Monad Testnet.',
    href: 'https://github.com/lora-sys/demo_monad_hackthon'
  },
  {
    title: 'Online AI Agent Hackathon',
    date: 'February 2026',
    location: 'Online',
    content: 'Built Emergence, a resilient multi-agent collaboration protocol.',
    href: 'https://github.com/lora-sys/hackthon-agent'
  }
]
