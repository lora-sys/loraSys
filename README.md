<p align="center">
  <img src="assets/readme/hero.svg" alt="lora — 进化建造者 · AI Agent 开发者 & 全栈工程师 · INK EDITION 墨刊" width="100%"/>
</p>

<p align="center">
  <a href="https://lora-sys.github.io/loraSys"><img src="https://img.shields.io/badge/LIVE-在建造中记录-c6412c?style=flat-square" alt="Live Site"/></a>
  <a href="https://github.com/lora-sys"><img src="https://img.shields.io/badge/GITHUB-lora--sys-181717?style=flat-square&logo=github" alt="GitHub"/></a>
  <a href="https://svelte.dev"><img src="https://img.shields.io/badge/Svelte-5-FF3E00?style=flat-square&logo=svelte" alt="Svelte"/></a>
  <a href="https://kit.svelte.dev"><img src="https://img.shields.io/badge/SvelteKit-2-FF3E00?style=flat-square&logo=svelte" alt="SvelteKit"/></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/></a>
</p>

---

> **构建系统，让它进化。**
> AI Agent 开发者 &amp; 全栈工程师。西安 Mingde · 2022–2026
> 在建造中记录 · [lora-sys.github.io/loraSys](https://lora-sys.github.io/loraSys)

---

## 关于

个人数字花园。以建造者视角记录过往工作、技术栈、项目和想法。网站本身就是最好的证明 — **SvelteKit 5 + 墨刊设计系统**、贡献热力图、博客系统、闯关记录、番剧与收藏，全部驱动自 [`resume.ts`](src/lib/data/resume.ts) 单一数据源。

**03 年 · AI Agent · 全栈 · Web3** — 从聊天工具到能理解目标、规划任务、持续进化的数字伙伴。

---

## 精选作品

| # | 项目 | 描述 | 技术栈 |
|---|------|------|--------|
| 01 | **[TrandingOs](https://github.com/lora-sys/TrandingOs)** | AI 交易终端 · 40+ Agent 技能 · 记忆系统 · 玻璃拟态 UI | React · TypeScript · SQLite · Zustand |
| 02 | **[ai-company-os](https://github.com/lora-sys/aicompanyos)** | 8 层 AI 执行引擎 · Writer-Critic 反馈循环 · 78 E2E 测试 | TypeScript · MCP · Zod · pnpm |
| 03 | **[Daily-Rss](https://github.com/lora-sys/Daily-Rss)** | AI 新闻简报平台 · 多 RSS 聚合 · 邮件推送 | Next.js · Supabase · Inngest |
| 04 | **[Newtube-clone](https://github.com/lora-sys/Newtube-clone)** | 全栈 YouTube 克隆 · 视频上传与流媒体 | Next.js · tRPC · Prisma · Clerk · Mux |
| 05 | **[Moss](https://github.com/lora-sys/moss)** | Monad 协议 Agent 调用层 · discover → load → action → simulate | TypeScript · MCP · Web3 |
| 06 | **[Emergence](https://github.com/lora-sys/hackthon-agent)** | 多 Agent 协作协议 · 实时辩论 · 证据链 · 投票系统 | TypeScript · Next.js · SSE |
| 07 | **[Tarot Prediction DApp](https://github.com/lora-sys/demo_monad_hackthon)** | Web3 塔罗牌预测平台 · 3D 卡片 · TRGL 代币 | Solidity · React · Three.js · Hardhat |
| 08 | **[MonadMon](https://github.com/lora-sys/monadmon)** | Monad 链上养成游戏 · Tamagotchi × Crypto | TypeScript · Monad · GameFi |
| 09 | **[Second Brain](https://github.com/lora-sys/second-brain)** | 本地优先第二大脑 · Obsidian 同步 · 知识图谱 | JavaScript · Obsidian · Markdown |
| 10 | **[Mianshiya-Next](https://github.com/lora-sys/mianshiya-next)** | 企业级刷题平台 · 全文搜索 · 日历追踪 | Next.js · Spring Boot · Elasticsearch |
| 11 | **[nanochat-studay](https://github.com/lora-sys/nanochat-studay)** | LLM 训练流水线 · BPE 分词器 · Pretrain → SFT → RL | Python · PyTorch |

> [103 个公开仓库 →](https://github.com/lora-sys?tab=repositories)

---

## 闯关记录

| 赛事 | 时间 · 地点 | 成果 |
|------|-----------|------|
| **ETH Beijing 2026** | 2026.06 · 北京 | AI Agent × Blockchain · 5 人团队 |
| **Monad Hackathon** | 2026.01 · 线上 | Tarot Prediction DApp · 3D 卡片 + 代币经济 |
| **Online AI Agent Hackathon** | 2026.02 · 线上 | Emergence · 多 Agent 辩论协议 |
| **Monad Blitz Hackathon** | 2026 · 线上 | 48 小时原型冲刺 |

---

## 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | SvelteKit 2 · Svelte 5 · Next.js · React |
| **样式** | TailwindCSS 4 · shadcn-svelte (bits-ui) |
| **动画** | svelte-motion · svelte-inview · embla-carousel |
| **内容** | mdsvex · Shiki (vesper) · marked |
| **图标** | Lucide Svelte · 自定义 SVG |
| **部署** | Vercel (adapter-auto) |
| **包管理** | pnpm |

---

## 快速开始

```bash
pnpm install       # 安装依赖
pnpm run dev       # 开发服务器
pnpm run build     # 生产构建
pnpm run preview   # 预览构建
pnpm run check     # 类型检查
pnpm run lint      # 代码检查 + 格式化
```

---

## 项目结构

```
src/
├── content/              # 博客文章 (*.md)
├── lib/
│   ├── data/resume.ts    # 单一内容源
│   ├── components/
│   │   ├── aceternity/   # Aceternity UI 效果
│   │   ├── magic/        # Magic UI 动画 (Dock, BlurFade, BentoGrid, ...)
│   │   ├── portfolio/    # 页面组件 (Navbar, ProjectCard, AnimeSection)
│   │   └── ui/           # shadcn-svelte 组件
│   └── imgs/             # SVG 图标 · Logo
└── routes/
    ├── +page.svelte      # 主页
    ├── +layout.svelte    # 布局 (Navbar · Tooltip)
    └── blog/             # 博客列表 · 文章
```

---

## 自定义内容

编辑 [`src/lib/data/resume.ts`](src/lib/data/resume.ts) 修改全部内容：

| 字段 | 说明 |
|------|------|
| `name`, `description` | 个人资料 |
| `summary` | 关于我 (Markdown) |
| `skills` | 技能标签 |
| `projects` | 项目卡片 (11 个) |
| `anime` | 番剧收藏 (8 部) |
| `favorites` | 精选收藏 (电影/音乐/游戏) |
| `hackathons` | 闯关记录 (4 场) |
| `social` | 社交链接 (GitHub / LinkedIn / X / Bilibili / YouTube / 知乎) |
| `education` | 教育背景 |

---

## 博客系统

Markdown 文件置于 [`src/content/`](src/content/)，YAML frontmatter 控制元数据。添加 `published: true` 即自动上线。

- [Free Vision Skill](src/content/free-vision-skill.md) — 视觉证据编译器，90% Token 节省
- [Building WishLive](src/content/WishLIve.md) — Multi-Agent Runtime + Solidity 合约
- [Building a Full-Stack YouTube Clone](src/content/newtube.md) — Next.js 15 · tRPC · Prisma

---

<p align="center">
  <img src="https://img.shields.io/badge/墨-INK_EDITION-c6412c?style=flat-square" alt="INK EDITION"/>
  <br/>
  <a href="https://lora-sys.github.io/loraSys">在建造中记录</a> · <a href="https://github.com/lora-sys/loraSys">Source</a> · <a href="mailto:lorasys@outlook.com">lorasys@outlook.com</a>
</p>
