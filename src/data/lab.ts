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
    eyebrow: 'Multi-agent protocol',
    title: 'Evidence-led agent collaboration',
    summary:
      'A working collaboration protocol that lets agents debate, retain evidence and reach a vote over a real-time stream.',
    question:
      'Can several agents disagree without losing the reasoning that led to the final decision?',
    result:
      'Emergence keeps the debate, evidence chain and vote visible as one inspectable flow. The experiment lives inside the shipped project repository.',
    technologies: ['Next.js', 'TypeScript', 'SSE', 'OpenAI'],
    project: 'Emergence',
    source: 'https://github.com/lora-sys/hackthon-agent'
  },
  {
    slug: 'moss-agent-capabilities',
    eyebrow: 'Agent × Web3',
    title: 'Safe, agent-callable Monad actions',
    summary:
      'A capability layer for discovery, simulation and unsigned transaction verification on Monad.',
    question: 'How can an agent inspect an on-chain action before asking a person to sign it?',
    result:
      'MOSS separates discovery, simulation and verification from signing. The repository is the source of truth for the current experiment.',
    technologies: ['TypeScript', 'Monad', 'MCP', 'Web3'],
    project: 'MOSS',
    source: 'https://github.com/lora-sys/moss'
  },
  {
    slug: 'ai-company-os-feedback-loops',
    eyebrow: 'Agent infrastructure',
    title: 'Writer–Critic execution loops',
    summary:
      'A loop-driven execution harness that explores how specialized agents can produce, critique and refine work without hiding state.',
    question: 'What is the smallest repeatable loop that improves an agent-produced artifact?',
    result:
      'AI Company OS organizes execution as an explicit eight-layer system with Writer–Critic feedback. Implementation details remain inspectable in source.',
    technologies: ['TypeScript', 'Zod', 'MCP', 'CLI/TUI'],
    project: 'AI Company OS',
    source: 'https://github.com/lora-sys/aicompanyos'
  },
  {
    slug: 'nanochat-training-pipeline',
    eyebrow: 'LLM systems',
    title: 'A small end-to-end LLM pipeline',
    summary:
      'A study implementation spanning tokenizer training, pretraining, supervised fine-tuning and reinforcement learning.',
    question:
      'Which parts of an LLM training pipeline become clearer when the whole path is kept small enough to inspect?',
    result:
      'The repository connects BPE, pretraining, SFT and RL as one learning-oriented pipeline rather than isolated notebooks.',
    technologies: ['Python', 'PyTorch', 'BPE', 'LLM'],
    project: 'Nanochat Study',
    source: 'https://github.com/lora-sys/nanochat-studay'
  },
  {
    slug: 'tarot-three-dimensional-cards',
    eyebrow: 'Interaction study',
    title: 'Three-dimensional tarot interactions',
    summary:
      'A shipped Web3 tarot prototype combining tactile 3D cards, prediction flows and Monad Testnet rewards.',
    question: 'Can a transaction flow feel playful without obscuring what the user is doing?',
    result:
      'The prototype pairs spatial card interactions with a working testnet application. Both the live build and source are available.',
    technologies: ['Solidity', 'React', 'Three.js', 'Hardhat'],
    project: 'Tarot Prediction DApp',
    source: 'https://github.com/lora-sys/demo_monad_hackthon',
    website: 'https://demo-monad-hackthon.vercel.app'
  }
]
