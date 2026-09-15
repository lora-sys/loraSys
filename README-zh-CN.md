<p align="center">
  <a href="https://lora-sys.github.io/loraSys/">
    <img src="./assets/readme/hero.webp" width="100%" alt="Lora：个人网站、项目、写作、当前工作与实验">
  </a>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="https://lora-sys.github.io/loraSys/">在线网站</a> ·
  <a href="https://lora-sys.github.io/loraSys/projects">项目集</a> ·
  <a href="https://lora-sys.github.io/loraSys/blog">写作</a> ·
  <a href="https://lora-sys.github.io/loraSys/now">正在构建</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/lora-sys/loraSys/deploy.yml?branch=main&label=Pages" alt="GitHub Pages 部署状态">
  <img src="https://img.shields.io/badge/Astro-5.17.3-FF5D01?logo=astro&logoColor=white" alt="Astro 5.17.3">
  <img src="https://img.shields.io/badge/Bun-1.3.5-fbf0df?logo=bun&logoColor=14151a" alt="Bun 1.3.5">
  <img src="https://img.shields.io/github/license/lora-sys/loraSys" alt="许可证">
</p>

`loraSys` 是 Lora 的双语个人网站与公开构建记录源码。这里把代表作品、长文、短笔记、当前关注、实验和公开活动放进同一个 Astro 静态站点里。

目前首页的四个代表作品是 **Glassbox**、**AgentArena**、**Lora Skills** 和 **Zhihu Threads**。项目事实来自经过验证的 GitHub 快照；首页排序和展示文案单独策展，避免新增仓库后代表作品被自动排序带偏。

> Build systems that learn.

## 建议从这里开始

| 页面 | 用途 |
| --- | --- |
| [作品](https://lora-sys.github.io/loraSys/projects) | 精选项目、源码、状态、技术栈、证据与完整项目档案。 |
| [写作](https://lora-sys.github.io/loraSys/blog) | Agent 基础设施、开发者工具、模型接入与工程实践的长文。 |
| [正在构建](https://lora-sys.github.io/loraSys/now) | 与首页共享同一份 Current Focus，不再维护多套“最近在做什么”。 |
| [实验室](https://lora-sys.github.io/loraSys/lab) | 围绕真实项目做的解释页与实验记录。 |
| [短笔记](https://lora-sys.github.io/loraSys/notes) | 更短的工程观察，并为每条笔记提供稳定可分享锚点。 |

## 代表作品

| 项目 | 当前方向 |
| --- | --- |
| [Glassbox](https://github.com/lora-sys/Glassbox-Agent-Harness) | 长期存在的 Personal Agent 工作台。当前基础包括 Codex / Claude Code 适配、本地会话、回放、审批、Trace 检查和 Canvas 视图；身份、授权、持久 Conversation、Memory、LongTask 与远程渠道按阶段继续建设。 |
| [AgentArena](https://github.com/lora-sys/AgentArena) | 让智能体执行任务、接受裁判审查，并保留比赛记录、证据与声誉的评测平台。 |
| [Lora Skills](https://github.com/lora-sys/skills) | 可安装的个人 Agent Skills 集合，覆盖静态站发布、AI 工程、写作、开源工作流、媒体工具等可重复任务。 |
| [Zhihu Threads](https://github.com/lora-sys/zhihu-threads) | 将用户自己选择的知乎摘录整理成可追问、自测和导出的学习线。 |

首页只展示少量代表作品。完整作品页保留更广的项目档案，并使用构建期 GitHub 数据，而不是把每一个公开仓库都包装成同等重要。

## 网站是怎样构建的

<p align="center">
  <img src="./assets/readme/system-map.svg" width="100%" alt="内容与项目策展数据经过 Astro 和 GitHub 验证快照，最终发布为 GitHub Pages 静态站点">
</p>

- **内容：** Markdown 长文、短笔记、个人资料、项目故事、Current Focus 与本地媒体。
- **项目策展：** GitHub 快照负责事实，单独的策展层负责代表作品和展示顺序。
- **组合：** Astro + 锁定版本的 [Pure 主题](https://github.com/cworld1/astro-theme-pure)，再叠加本站自己的组件与视觉资产。
- **构建期同步：** 发布前刷新并验证 GitHub 项目、贡献与归属数据。
- **交付：** 静态 `dist/`、Pagefind、RSS、sitemap、中英文路由，以及 `/loraSys` GitHub Pages 项目站。

浏览器不依赖作品集 API 或运行时数据库。数据刷新失败时会继续使用上一份已经验证的本地快照，不让网站因为外部 API 暂时不可用而失效。

## 质量与发布门禁

PR 需要覆盖网站真正依赖的质量检查：

- Astro 类型 / 内容检查与生产构建。
- GitHub 同步数据和归属验证。
- 路由、语言、站内链接和浏览器交互审计。
- 桌面端与 390×844 移动宽度回归。
- 发布产物检查 required routes、本地资源、有效 title、非空 description，以及每个 HTML 恰好一个 `h1`。

正式部署会再次刷新 GitHub 验证快照，再从这些 artifact 构建并发布最终 GitHub Pages 产物。

## 本地运行

环境要求：[Bun 1.3.5](https://bun.sh/) 和 Git。

```bash
git clone https://github.com/lora-sys/loraSys.git
cd loraSys
bun install --frozen-lockfile
bun dev
```

常用命令：

```bash
bun run check       # Astro 类型和内容诊断
bun run build       # 静态构建 + base 路径处理 + 发布审计
bun run sync:github # 刷新并验证公开 GitHub 快照
bun preview         # 预览生产构建
```

## 仓库结构

```text
src/content/              已发布长文
src/data/                 个人资料、短笔记、项目策展、快照、当前关注
src/pages/                首页、blog、projects、lab、notes、now、talks、links、resume
src/components/           建立在 Pure 之上的个人组件
packages/pure/            锁定版本的 Astro Theme Pure 源码
assets/readme/             README 专用视觉资产
scripts/                  同步、验证、发布和审计脚本
.github/workflows/        PR 验证与 GitHub Pages 部署
```

## 设计取舍

- 这是个人空间优先的网站，不把它改成通用作品集模板。
- 代表作品按证据和当前相关性策展，完整项目档案仍然保留。
- “现在在做什么”只维护一个事实源，由首页和 Now 页面共同读取。
- 中英文尽量共享结构与事实，只把真正需要本地化的文案分开维护。
- 静态资源和构建期数据让正式网站不需要运行时后端。
- Reduced motion、键盘操作、移动端点击面积、语言 metadata 与发布产物 HTML 检查都属于产品质量，而不是上线后的附加优化。

## 链接

- [在线网站](https://lora-sys.github.io/loraSys/)
- [作品](https://lora-sys.github.io/loraSys/projects)
- [写作](https://lora-sys.github.io/loraSys/blog)
- [联系 Lora](https://lora-sys.github.io/loraSys/contact)
- [RSS](https://lora-sys.github.io/loraSys/rss.xml)
- [GitHub](https://github.com/lora-sys)

## 许可证

仓库和锁定的 Pure 主题基础采用 [Apache-2.0](./LICENSE)。文章、项目截图、Logo、生成插画和第三方媒体可能有单独的署名或许可证要求。
