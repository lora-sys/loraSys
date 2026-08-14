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
    date: 'June 5–7, 2026',
    location: 'Beijing · Kunlun Nest',
    role: 'Hackathon builder',
    description: 'Built an AI Agent × Blockchain project with a team of five.',
    project: 'AI Agent × Blockchain prototype',
    source: 'https://github.com/lora-sys/Hackthon'
  },
  {
    title: 'Online AI Agent Hackathon',
    date: 'February 2026',
    location: 'Online',
    role: 'Hackathon builder',
    description: 'Built Emergence, a resilient multi-agent collaboration protocol.',
    project: 'Emergence',
    source: 'https://github.com/lora-sys/hackthon-agent'
  },
  {
    title: 'Monad Hackathon',
    date: 'January 2026',
    location: 'Online',
    role: 'Hackathon builder',
    description: 'Built a Web3 tarot prediction platform on Monad Testnet.',
    project: 'Tarot Prediction DApp',
    source: 'https://github.com/lora-sys/demo_monad_hackthon'
  },
  {
    title: 'Monad Blitz Hackathon',
    date: '2026',
    location: 'Online',
    role: 'Hackathon builder',
    description: 'Shipped a working prototype during a 48-hour rapid iteration sprint.',
    project: 'Prototype sprint'
  }
]
