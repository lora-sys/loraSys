export const profile = {
  name: 'Lora',
  role: 'AI Agent Developer & Full-stack Engineer',
  location: "Xi'an, China",
  email: 'lorasys@outlook.com',
  summary:
    '学生开发者，专注 AI Agent、全栈应用与 Agent 基础设施。我喜欢把大胆的想法快速做成可以运行、可以体验的产品，并探索能理解目标、规划任务、调用工具且持续进化的软件系统。',
  skills: ['TypeScript', 'Python', 'React', 'Astro', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AI Agents', 'Solidity'],
  education: [{ school: "Xi'an Mingde Institute of Technology", degree: 'BSc Computer Science', period: '2022 — 2026', href: 'https://www.mdit.edu.cn' }],
  social: [
    ['GitHub', 'https://github.com/lora-sys'],
    ['LinkedIn', 'https://www.linkedin.com/in/lora-sys/'],
    ['X', 'https://x.com/MierPiter33280'],
    ['PeerList', 'https://peerlist.io/mierpiter'],
    ['YouTube', 'https://www.youtube.com/@MierPiter33280'],
    ['Bilibili', 'https://space.bilibili.com/431821023'],
    ['Zhihu', 'https://www.zhihu.com/people/lorry-23-28-30'],
    ['Email', 'mailto:lorasys@outlook.com']
  ]
} as const

export const projects = [
  ['Newtube Clone', 'A full-stack YouTube clone with video upload, streaming, subscriptions and creator studio.', 'https://github.com/lora-sys/Newtube-clone', 'Next.js · tRPC · PostgreSQL'],
  ['Daily RSS', 'Daily AI news briefings aggregated from RSS feeds and delivered by email.', 'https://github.com/lora-sys/Daily-Rss', 'Next.js · Supabase · Inngest'],
  ['TradingOS', 'A personal AI-powered trading terminal with agent skills, backtests and a paper portfolio.', 'https://github.com/lora-sys/TrandingOs', 'React · Python · SQLite'],
  ['AI Company OS', 'A loop-driven AI execution harness with Planner, Generator, Evaluator and Evolution agents.', 'https://github.com/lora-sys/aicompanyos', 'TypeScript · Zod · MCP'],
  ['Nanochat Study', 'An end-to-end LLM training pipeline inspired by Karpathy’s nanochat.', 'https://github.com/lora-sys/nanochat-studay', 'Python · PyTorch · BPE'],
  ['Emergence', 'A multi-agent collaboration protocol with real-time debate, evidence chains and voting.', 'https://github.com/lora-sys/hackthon-agent', 'Next.js · SSE · AI'],
  ['Tarot Prediction DApp', 'A Web3 tarot prediction platform on Monad with interactive cards and prediction markets.', 'https://github.com/lora-sys/demo_monad_hackthon', 'Solidity · React · Three.js'],
  ['MOSS', 'Agent-callable Monad capabilities for discovering, simulating and verifying transactions.', 'https://github.com/lora-sys/moss', 'TypeScript · Monad · MCP'],
  ['Second Brain', 'A local-first Obsidian dashboard with knowledge graph, daily notes and tasks.', 'https://github.com/lora-sys/second-brain', 'JavaScript · Obsidian'],
  ['MonadMon', 'On-chain creature raising and PvP: Tamagotchi meets Monad.', 'https://github.com/lora-sys/monadmon', 'TypeScript · Web3 · GameFi'],
  ['Mianshiya Next', 'An interview platform with full-text search, authentication and practice history.', 'https://github.com/lora-sys/mianshiya-next', 'Next.js · Spring Boot · Elasticsearch']
] as const
export const hackathons = [
  ['ETH Beijing 2026', 'June 5–7, 2026 · Beijing', 'Built an AI Agent × Blockchain project with a team of five.', 'https://github.com/lora-sys/Hackthon'],
  ['Monad Blitz Hackathon', '2026 · Online', 'Shipped a working prototype in a 48-hour rapid iteration sprint.', ''],
  ['Monad Hackathon', 'January 2026 · Online', 'Built a Web3 tarot prediction platform on Monad Testnet.', 'https://github.com/lora-sys/demo_monad_hackthon'],
  ['Online AI Agent Hackathon', 'February 2026 · Online', 'Built Emergence, a resilient multi-agent collaboration protocol.', 'https://github.com/lora-sys/hackthon-agent']
] as const
