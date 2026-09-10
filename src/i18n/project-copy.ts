import type { Project } from '@/data/projects'
import type { SiteLocale } from './site'

// Reviewed translations of repository summaries, not translated source documents.
const descriptions: Record<string, Record<SiteLocale, string>> = {
  "packify-skill": {
    "zh-CN": "将输入图片中的主体转成带包装的实体收藏品概念图的智能体技能。",
    "en-US": "An image-to-collectible skill that turns a supplied subject into a faithful, commercially believable packaged object."
  },
  "nano-sglang-interactive-guide": {
    "zh-CN": "SGLang 推理与服务流程的交互式学习指南。",
    "en-US": "An interactive learning guide to SGLang inference and serving workflows."
  },
  "nano-vllm-interactive-guide": {
    "zh-CN": "面向中文读者的大模型推理源码指南，用 13 个浏览器实验解释连续批处理、KV 缓存、分页注意力与调度。",
    "en-US": "An interactive Chinese source-code guide to LLM inference: 13 browser experiments make continuous batching, KV cache, paged attention and scheduling visible."
  },
  "free-vision-skill": {
    "zh-CN": "将图片编译为紧凑视觉证据包，供未接通视觉输入的编程智能体使用。",
    "en-US": "Compiles images into compact visual evidence packets for coding agents without a connected vision input."
  },
  "glassbox-agent-harness": {
    "zh-CN": "正在演进为长期运行的个人 Agent 工作台。当前支持 Codex、Claude Code、本地会话、运行回放、审批与画布检查；微信、QQ、长期任务和学习沉淀仍在规划。",
    "en-US": "Evolving into a long-lived personal agent workbench. Available today: Codex, Claude Code, local sessions, replay, approvals and canvas inspection. WeChat, QQ, long tasks and learning remain planned."
  },
  "ai-engineering-harness": {
    "zh-CN": "用 18 类智能体和 9 条工作流组织需求、规划、构建、审查、证据与合并。",
    "en-US": "Organizes requirements, planning, implementation, review, evidence and merging with 18 agent roles and 9 workflows."
  },
  "skills": {
    "zh-CN": "可安装的个人智能体技能集合，覆盖个人站发布、AI 工程、内容表达与开源工作流。",
    "en-US": "An installable collection of personal agent skills for publishing, AI engineering, writing and open-source work."
  },
  "lorasys": {
    "zh-CN": "基于 Astro 的个人站，收录项目、构建笔记和公开贡献，通过 GitHub Pages 发布。",
    "en-US": "An Astro personal site for projects, build notes and public contributions, deployed on GitHub Pages."
  },
  "mulitimodal": {
    "zh-CN": "结合人体状态感知、中医体质分析与脑电模型的多模态实验，提供 Gradio 演示。",
    "en-US": "A multimodal experiment connecting human-state sensing, TCM constitution analysis and EEG models, with a Gradio demo."
  },
  "trandingos": {
    "zh-CN": "在一个 TypeScript 工作台中查看市场数据、持仓、回测与执行检查的个人交易管理工具。",
    "en-US": "A personal trading operations dashboard that brings market data, positions, backtests and execution checks into one TypeScript workspace."
  },
  "teaching-html-story-deck": {
    "zh-CN": "生成独立教学 HTML 页面、内容相关示意图与克制动效的智能体技能。",
    "en-US": "A reusable Agent Skill for producing polished standalone teaching HTML pages with content-specific SVG diagrams and advanced but restrained motion."
  },
  "mossguard": {
    "zh-CN": "Monad 黑客松中的链上智能体意图验证实验。先检查证据，验证失败时阻止进入人工签名环节。",
    "en-US": "On-chain agent intent verification for a Monad hackathon: deterministic evidence checks followed by a fail-closed human signing gate."
  },
  "shape-up-project-shaping": {
    "zh-CN": "基于 Shape Up 方法，将模糊想法整理为范围明确、可验证的项目方案。",
    "en-US": "A Shape Up skill for turning an unclear idea into a bounded, testable project proposal."
  },
  "trustops": {
    "zh-CN": "连接 B2B SaaS 政策、系统控制、历史承诺、风险审查与人工责任的证据管理层。",
    "en-US": "An evidence layer connecting B2B SaaS policies, system controls, prior commitments, risk review and human responsibility."
  },
  "agentarena": {
    "zh-CN": "让智能体执行任务、接受裁判审查，并保留比赛记录、证据与声誉的评测平台。",
    "en-US": "An evaluation platform where agents perform tasks, receive judge review and retain match records, evidence and reputation."
  },
  "second-brain": {
    "zh-CN": "本地优先的知识工作台，整合 Obsidian 同步、知识图谱、每日笔记与任务追踪。",
    "en-US": "Personal second-brain dashboard — Obsidian vault sync, knowledge graph, daily notes, and task tracking in one local-first UI."
  },
  "ecomatrix": {
    "zh-CN": "多智能体经济沙盒，包含竞争、交易与治理模拟，并提供运行观察面板。",
    "en-US": "Autonomous multi-agent economic sandbox — A2A protocol agents compete, trade, and govern inside a simulated economy with a God's Eye observability dashboard."
  },
  "monadmon": {
    "zh-CN": "Monad 上的链上生物养成与玩家对战实验。",
    "en-US": "MonadMon — the first living creatures on Monad. On-chain creature-raising + PvP battle. Tamagotchi meets crypto."
  },
  "hermes-stepfun-imagegen": {
    "zh-CN": "为 Hermes Agent 接入阶跃星辰图像生成模型的可插拔后端。",
    "en-US": "StepFun image generation backend for Hermes Agent — step-image-edit-2, step-2x-large, step-1x-medium with pluggable API."
  },
  "hermes-minimax-media": {
    "zh-CN": "为 Hermes Agent 接入 MiniMax 图片与海螺视频生成的后端。",
    "en-US": "MiniMax image and Hailuo video generation backends for Hermes Agent."
  },
  "sysclean": {
    "zh-CN": "Linux 终端中的系统清理工具，整合服务、Docker、Flatpak、磁盘占用与启动项检查。",
    "en-US": "Global system cleanup and management TUI for Linux — services, Docker, Flatpak, disk usage, startup audit, all from one terminal."
  },
  "skills-manager": {
    "zh-CN": "用于浏览、安装、版本管理与审计智能体技能的管理面板。",
    "en-US": "Skills management dashboard for AI workflows — browse, install, version, and audit Claude/agent skills across projects."
  },
  "ui-aesthetic-improve": {
    "zh-CN": "改进界面视觉质量的 Claude 技能，检查组件、版式和展示细节。",
    "en-US": "UI aesthetic improvement workflow — opinionated Claude skill for taking functional UIs to portfolio-grade visual quality."
  },
  "aicompanyos": {
    "zh-CN": "探索智能体承担经营、产品交付与用户服务的公司操作系统概念项目。",
    "en-US": "AI Company Operating System — concept for an autonomous org where agents own P&L, ship product, and serve users end-to-end."
  },
  "init-codebase": {
    "zh-CN": "为仓库配置规则、智能体与技能，建立可供 Claude Code 使用的开发环境。",
    "en-US": "Init-codebase Claude skill — bootstraps any repo into a Claude-Code-ready workspace with rules, agents, and skills wired up."
  },
  "neetcode-submissions": {
    "zh-CN": "NeetCode 算法题的 Python 解答，记录说明、复杂度与测试。",
    "en-US": "My NeetCode.io algorithm problem submissions — Python solutions with explanations, complexity, and test runs."
  },
  "hackthon": {
    "zh-CN": "ETH Beijing 黑客松参赛项目档案，包含代码、演示与说明。",
    "en-US": "ETH Beijing hackathon entry — original submission archive with code, demo, and write-up."
  },
  "jonlinker": {
    "zh-CN": "探索由智能体执行简历投递、招聘对话与后续跟进的求职工作流。",
    "en-US": "Agent-to-agent job search — autonomous resume delivery, recruiter conversation, and follow-up across LinkedIn / email / IM."
  },
  "lora-skills": {
    "zh-CN": "围绕具体任务整理的个人 Claude 技能集合。",
    "en-US": "Distilled Claude skills for Marvis — my personal toolbox of focused agent capabilities."
  },
  "recruitdraft": {
    "zh-CN": "根据公司文化和职位描述生成 STAR 面试问题与 LinkedIn 职位帖的招聘辅助工具。",
    "en-US": "Creates STAR interview questions and LinkedIn job posts from company culture and a job description."
  },
  "miscroservice": {
    "zh-CN": "微服务练习项目，涉及服务拆分、gRPC、REST 网关、可观测性与部署。",
    "en-US": "Microservice practice project — service decomposition, gRPC + REST gateways, observability, and deployment."
  },
  "research-assistant-skill": {
    "zh-CN": "覆盖文献检索、研究脉络整理、论文润色和技术路线图的科研辅助技能。",
    "en-US": "A research skill covering literature search, research context, manuscript editing and technical roadmaps."
  },
  "humanize-write": {
    "zh-CN": "删除生成文本中的空泛表达，保留作者语气的写作编辑技能。",
    "en-US": "Humanize-write Claude skill — strips AI tells from generated text, returning natural, voice-preserving prose."
  },
  "newtube-clone": {
    "zh-CN": "使用 Next.js 构建的视频网站练习，包含视频界面与推荐流程。",
    "en-US": "YouTube-style video clone with AI recommendations — full-stack Next.js + recommendation pipeline."
  },
  "node-base": {
    "zh-CN": "带有节点编辑器和执行引擎的工作流构建练习，参考 n8n 的操作方式。",
    "en-US": "node-base — n8n-style AI workflow builder clone with node-graph editor and execution engine."
  },
  "zchat-demo": {
    "zh-CN": "基于 Next.js 的聊天界面演示，包含流式响应与多模型接入。",
    "en-US": "zchat-demo — modern chat UI demo built with Next.js, streaming responses, multi-model support."
  },
  "hackthon-agent": {
    "zh-CN": "面向限时黑客松开发的智能体辅助项目。",
    "en-US": "Hackathon-tuned AI agent helper — optimized for time-boxed builds: scaffold fast, ship features, win."
  },
  "mianshihou-interview-website": {
    "zh-CN": "面试准备网站后端，包含题库、模拟面试与进度记录。",
    "en-US": "An interview preparation backend with question banks, mock interviews and progress tracking."
  },
  "lora-website": {
    "zh-CN": "个人作品网站的早期版本。",
    "en-US": "Personal website — early version of lora-sys portfolio."
  },
  "meme-vibe-casino": {
    "zh-CN": "黑客松中的模因主题小游戏原型。",
    "en-US": "Meme Vibe Casino — vibe-coded casino game for hackathon, meme-token themed slots and mini-games."
  },
  "demo_monad_hackthon": {
    "zh-CN": "探索 Monad 并行执行的黑客松原型。",
    "en-US": "Monad hackathon demo project — quick prototype exploring Monad's parallel execution."
  },
  "web3-frontend-ui-and-ux-reviewer": {
    "zh-CN": "审查去中心化应用中的钱包连接、签名流程与链上状态说明的技能。",
    "en-US": "Web3 frontend UI/UX reviewer Claude skill — audits dApp interfaces for wallet flow, signing UX, and on-chain clarity."
  },
  "ui-design": {
    "zh-CN": "根据需求说明生成组件系统、色彩变量与字号层级的界面设计技能。",
    "en-US": "ui-design Claude skill — generates component systems, color tokens, and typography scales from brief."
  },
  "better-auth-learn": {
    "zh-CN": "学习 Better Auth 的认证、会话管理与 OAuth 流程。",
    "en-US": "Better-auth library learning project — auth patterns, session management, OAuth flows."
  },
  "go-project": {
    "zh-CN": "学习 Go 协程、通道、接口和标准库的小项目集合。",
    "en-US": "Go learning sandbox — small projects exploring goroutines, channels, interfaces, and std lib."
  },
  "mianshiya-next-lora": {
    "zh-CN": "面试练习平台的复刻项目，使用 Java 后端。",
    "en-US": "Mianshiya-next — interview practice platform clone (Java backend)."
  },
  "daily-rss": {
    "zh-CN": "包含摘要和主题聚类的日常 RSS 阅读器。",
    "en-US": "Daily RSS — minimal daily RSS reader with smart summarization and topic clustering."
  },
  "threejs-projects": {
    "zh-CN": "基于 Three.js 的交互界面、着色器与场景构建实验。",
    "en-US": "Interactive Sci-Fi Control Interface built with Three.js — WebGL experiments, shader work, scene composition."
  },
  "lora-bi": {
    "zh-CN": "数据看板、指标处理与可视化实验。",
    "en-US": "BI project — dashboards, metrics pipelines, and visualization experiments."
  },
  "demo": {
    "zh-CN": "用于验证想法的通用原型模板。",
    "en-US": "Generic demo project — template for prototypes."
  },
  "note-app": {
    "zh-CN": "包含 Markdown、标签和快速记录功能的个人笔记应用。",
    "en-US": "Note-app — personal note-taking app with markdown, tags, and quick capture."
  },
  "dream-prop-generator": {
    "zh-CN": "随机生成桌面角色扮演道具、人物与场景的工具。",
    "en-US": "Dream-prop random generator — spin up random D&D-style props, characters, and scenarios."
  },
  "react-praceise": {
    "zh-CN": "React 组件、钩子、状态管理与小应用练习。",
    "en-US": "React practice — components, hooks, state patterns, and small apps."
  },
  "cpp-projects": {
    "zh-CN": "C++ 算法、系统编程与小工具练习。",
    "en-US": "C++ practice projects — algorithms, systems, and small utilities."
  },
  "automatic_compliments": {
    "zh-CN": "生成中英文个性化赞美语句的小工具。",
    "en-US": "Generates personalized compliments in Chinese and English."
  },
  "react-projects": {
    "zh-CN": "React 应用与组件练习集合。",
    "en-US": "React projects — collection of React apps and components."
  },
  "snake": {
    "zh-CN": "使用 C++ 编写的贪吃蛇游戏。",
    "en-US": "Snake — a very interesting snake game in C++."
  },
  "repostwin": {
    "zh-CN": "将 GitHub 仓库呈现为交互式三维代码视图，并提供智能体侧栏。",
    "en-US": "Convert GitHub repos into interactive 3D code galaxies with an AI agent sidebar"
  },
  "pixel-heart-os-": {
    "zh-CN": "通过角色配置、Git 式记忆管理与 AI 协作编辑构建社会模拟实验。",
    "en-US": "A social simulation experiment combining character configuration, Git-style memory and AI-assisted editing."
  },
  "defect-supervised": {
    "zh-CN": "监督学习缺陷检测实验。",
    "en-US": "Supervised defect-detection experiments"
  },
  "defect-semi-supervised": {
    "zh-CN": "半监督学习缺陷检测实验。",
    "en-US": "Semi-supervised defect-detection experiments"
  },
  "nanoagent": {
    "zh-CN": "可定制的智能体框架实验。",
    "en-US": "Custom Your Agent!!"
  },
  "demo-repository": {
    "zh-CN": "用于演示 GitHub 仓库功能的示例项目。",
    "en-US": "A code repository designed to show the best GitHub has to offer."
  },
  "resumegenerator": {
    "zh-CN": "基于 LaTeX 与 KaTeX 的简历生成器。",
    "en-US": "LaTeX + KaTeX-based resume generator"
  },
  "scidraft.ai": {
    "zh-CN": "科研论文写作平台。",
    "en-US": "Science-paper writing platform"
  },
  "redis-go": {
    "zh-CN": "实现 RESP 协议和数据持久化的 Redis 客户端与服务端练习。",
    "en-US": "Redis client/server implementation with RESP protocol and data persistence"
  },
  "git-opilot": {
    "zh-CN": "集成本地 Git 仓库的命令行代码协作助手。",
    "en-US": "git-copilot is an intelligent CLI code collaboration assistant that integrates deeply with local Git repositories."
  },
  "nanochat-studay": {
    "zh-CN": "学习 nanochat 概念与实现的实验项目。",
    "en-US": "This project is for learning the nanochat concept"
  },
  "stageposter": {
    "zh-CN": "参与 AMD 黑客松的外部项目，探索音乐节奏、舞台灯光与实时海报构图。",
    "en-US": "AMD Hackathon contribution: an AI-native live-event poster engine that combines music rhythm, stage lighting, and real-time visual composition."
  },
  "zhihu-threads": {
    "zh-CN": "从知乎回答与专栏摘录中选择来源，生成可追问、自测和导出的学习线。",
    "en-US": "Choose excerpts from Zhihu answers and articles, then build a learning thread with follow-up questions, self-tests and exports."
  }
}

export const localizeProject = (project: Project, locale: SiteLocale): Project => ({
  ...project,
  title: project.repository.toLowerCase() === 'glassbox-agent-harness' ? 'Glassbox' : project.title,
  description: descriptions[project.repository.toLowerCase()]?.[locale] ?? project.description,
  image: project.repository.toLowerCase() === 'zhihu-threads' ? `lora-v3-project-zhihu-threads-${locale === 'en-US' ? 'en' : 'zh'}.webp` : project.image
})
