# loraSys 体验升级计划（2026-08）

本计划基于 2026-08-26 的全站审计（本地生产构建 + 浏览器实测 + Lighthouse）整理，作为后续实施的唯一依据。所有"已完成/待做"判断均对照当前代码核实过，与 `docs/interaction-matrix.md`（交互约束矩阵）互补：矩阵管边界，本文档管任务。

## 基线事实（已核实）

- `bun run check` 0 errors / 0 warnings；生产构建 75 页通过，发布审计通过。
- Lighthouse 首页：performance 97 / accessibility 100 / TBT 0ms / CLS 0 / LCP 2.4s。**LCP 归因已实测（本地预览，桌面与移动视口一致）：LCP 元素是 header 品牌文字链接，不是 hero 图**。LCP 时间受渲染阻塞 CSS 与 Satoshi 字体（已 preload）门控；hero 图影响的是总传输量（928 KiB）。另注：全局 `.animate` 类（`src/assets/styles/global.css:12`）让 hero 区初始 `opacity: 0`、300ms 入场，首屏主内容首绘被延后。
- 审计页面控制台零报错；首页 29 张图片全部有 CSS `aspect-ratio`；非首屏图全部 lazy。
- 简历对话框：原生 `<dialog>`、焦点进入、Esc 关闭、焦点归还，全部正确。
- "开启体感"在 `prefers-reduced-motion: reduce` 下按设计自动隐藏，状态持久化 localStorage。

**以下能力已经存在，后续不得重复实现（此前对话计划中的误判，已修正）：**

| 能力 | 现状位置 |
| --- | --- |
| 项目卡片最近活动时间 | `ProjectCard.astro` 已显示 `Updated {pushedAt}`（标签硬编码英文） |
| 外部贡献展示 | `/projects` 页已直接导入快照渲染：归档目录显示仓库、PR 数量与同步日期；但 PR 级状态（Merged/Open/Closed）与 PR 链接只在未被任何页面挂载的孤儿组件 `ExternalContributions.astro` 中实现，访客实际看不到（见阶段 2.4） |
| 文章阅读进度条 | `blog/[...id].astro` 与 `en/writing/[...id].astro` 均有固定顶部进度条 |
| 文章下一篇导航 | `BlogPost.astro` 已有 nextPost 链接 |
| 相关文章推荐 | `RelatedReading.astro` 按标签共现 + 语言加权（标题硬编码英文） |
| 文章 TOC 概览折叠 | `BlogPost.astro` 已实现 h2 级概览 + 展开全文 |
| 首页区块导航编号 | `HomeSectionNav.astro` 已有 01–05 索引与琥珀活动态 |
| 404 页 Mochi 文案 | `404.astro` 已有"路的尽头没有东西"场景 |
| 短笔记 related 字段 | `notes/index.astro` 已用 related 链接到文章（方向：笔记→文章） |
| 阅读书签资产使用 | `reading-marker` 已用于首页写作区与 `BlogListing` |
| 轮播交互完整度 | 手动暂停、键盘方向键、hover 暂停、reduced-motion 禁用均已有 |

## 升级方向

三个主轴：把真实变成看得见的界面（证据层）、把 Field Notes 从皮肤变成结构、把访客动线修顺。语言切换流利度是已确认的最高优先级痛点。

## 阶段 0 · 工作区整理（已完成 ✅）

实际提交：`771692c` `chore(repo)`、`75fecde` `docs(plan)`。

1. `git rm` 已被追踪的 22 个审查截图（6 个 `review-screenshots*` 目录），原件移至仓库外 `~/.local/share/lora-sys-review/`。依据 AGENTS"审查材料只能放在仓库外"。
2. 完成根目录 3 个 review md 的删除提交（已在暂存区）。
3. **将当前未提交改动按主题拆分提交**：`feat(home)`（首页精简与新区块组件）、`feat(projects)`（ProjectDemo 等）、`feat(contact)`（SocialLedger）、`feat(data)`（notes.ts / featured-posts.ts）、`fix(i18n)`（robots、页面标题）。本计划文档与 `docs/interaction-matrix.md` 以 `docs(plan)` 单独提交。拆分前逐文件核对归属，不确定的单独列出询问维护者。
4. 本文档与 `docs/interaction-matrix.md` 保留在 `docs/`，作为本轮验收依据。

## 阶段 1 · 语言切换流利度（P0，已完成 ✅）

实际提交：`9ebe12f` fix(i18n)、`d8fcd38` perf(home)（原生 VT 修正）、`33af8e5` feat(home)（区块标签 + 轮播默认暂停）。

### 1a. 尾斜杠修复

`trailingSlash: 'never'` 与 `'/en/'` 链接冲突，本地预览 404，且与 Astro 生成的 canonical `/en` 不一致。生产 GitHub Pages 目前能靠 `en/index.html` 兜底，但 canonical 与站内链接应统一。

修改点（两处即可，`BaseHead` 的 hreflang alternate 走 `localizedPath`，会自动跟随）：

- `src/i18n/site.ts`：`zhToEn` 的 `'/': '/en/'` 改为 `'/': '/en'`；`localizedPath` 中唯一的 `/en/` 回退（第 33 行 `return '/en/'`）同步改 `/en`（另一处回退返回 `'/'`，不涉及）。
- `src/components/layout/SiteHeader.astro:10`：`home` 的 `'/en/'` 改 `'/en'`。

注意：`src/data/lora-visual.ts` 与 `lora-visual-manifest.ts` 中的 `pages: ['/', '/en/']` 是纯清单字段（已核实 `LoraVisual.astro` 组件完全不读取 `pages` 做匹配），不生成链接、不参与渲染判断，无需修改，也不存在 `/en` 改动导致首页插画失配的风险。

### 1b. 路由回退修复

分两类处理：

- **无对应页**（中文独有，EN 侧无路由）：`/notes`、`/lab`、`/lab/[slug]`、`/archives`、`/tags`、`/tags/[tag]`、`/talks`、`/terms`。
- **双语共用页**（同一页面服务两个 locale）：`/search`（已核实 `SiteHeader.astro:11` 两个 locale 都指向 `/search`）。

当前 `localizedPath` 把以上路径的 EN 切换一律回退到 `/en/` 首页，访客位置感丢失。共用页同理（从 `/search` 切 EN 被丢到英文首页）。

方案：两类页面都隐藏 locale 切换（诚实优于跳转），实现集中在 `SiteHeader.astro` 与 `BaseLayout.astro`。**实现要点：不能比较 `localizedPath` 的返回值是否等于 `/en`**——中文首页 `/` 的合法映射结果也是 `/en`，值比较会把首页的切换按钮也误隐藏。正确做法是在 `src/i18n/site.ts` 新增 `hasAlternate(pathname, target)` 辅助函数：显式判断 pathname 是否命中映射表或 `/blog/` ↔ `/en/writing/` 前缀规则，只有命中才渲染 toggle 与 `BaseHead` 的 hreflang alternate（避免给搜索引擎错误的替代页信号）。不采用"跳最近对应页"：静默跳页本身就是一种迷路。

**潜在分页陷阱（一并由 `hasAlternate` 覆盖）**：`blogPageSize: 12`，当前 9 篇文章只有第 1 页；一旦文章超过 12 篇，`/blog/2` 会被现有前缀规则映射到 `/en/writing/2`，而 `en/writing/index.astro` 没有分页路由，会 404。`hasAlternate` 对映射表未覆盖的分页路径返回 false，随修复自动免疫。

### 1c. 站内文案语言统一

中文页面出现英文文案的位置（全部已核实）：

- `src/pages/index.astro:163`：`All writing` → `全部写作`。
- `src/pages/index.astro:187`：`See the full now page` → `查看完整的正在构建`。
- `src/pages/projects/index.astro`：h2 `Selected Work` 等区块标题。eyebrow 双语（`Selected Work · 精选作品`）是有意风格，保留；h2 改为中文（`精选作品`），与 h1 中文一致。
- `src/components/projects/ProjectCard.astro:209`：`Updated {date}` → 中文页 `最近活动 {date}`。卡片已接收 `compactLocale` prop，沿用该通道。
- `src/components/blog/RelatedReading.astro:39-40`：`Continue exploring` / `Related reading` → 中文文章显示 `继续探索` / `相关阅读`（按 `post.data.language` 判断，写法参照 `LanguageBadge` 已有模式）。
- 中文独有页标题：`/notes`、`/links`、`/about`、`/contact`、`/search`、`/archives`、`/lab`、`/talks`、`/terms` 的 `<title>` 与 h1 目前是英文单词（已逐页核实：Notes/Links/About/Contact/Search/Archives/Lab/Appearances & Hackathons/Site Policy）。统一规则：标题栏保留页面名（导航一致性），正文 h1 与页面内文案中文化。逐页核对，改动集中提交为 `fix(i18n)`。

英文页不做反向要求（已核实：英文页中的中文均为刻意的跨语言链接，如"查看中文联系页 ↗"、带 `lang='zh-CN'` 的双语宣言，属正确 i18n 实践，保留）。唯一不一致点：`src/pages/en/work.astro:49` 的 `查看完整项目档案 ↗` 未遵循其余页面的"查看中文…"命名模式，读起来像文案泄漏而非语言指向链接；统一为该模式（如`查看中文项目档案 ↗`）。

### 1d. 页面过渡（实施修正：保留原生跨文档 View Transitions，不引入 ClientRouter）

实施时发现：`app.css` 已启用原生 `@view-transition { navigation: auto }`（140/190ms 淡入淡出 + reduced-motion 门控 + 主题切换专用 clip-path 动画），架构上零 JS、无 observer 重绑与 script 重执行风险。引入 Astro ClientRouter 反而是重复建设。实际摩擦源是全局 `.animate`（`global.css:12`）：每次导航新文档重播 300ms `opacity:0` 入场，叠加在 VT 淡入上形成双重动画迟滞，且延迟首屏主内容首绘（LCP 元素被推给 header 品牌文字）。

实施方案：

- `.animate` 改为 transform-only 入场（初始可见，仅 translateY 位移），保留编辑器物质感但消除首绘延迟与双重动画。
- 原生 VT 保持现状；主题跨页一致性由 `ThemeProvider`（已监听 `astro:page-load`，内联在 head）保障。
- 验收（非 MVP）：中英切换无白屏无迟滞；深浅主题互切后导航不闪色；reduced-motion 下 VT 动画被抑制（已有媒体查询门控）；页内锚点与 pagefind 搜索页导航正常；滚动位置语义合理。

## 阶段 2 · 证据层与现场感（P1，部分完成 ✅）

实际提交：`a7d3433` feat(now)（同步事实区 + demoByRepo 共享模块）。

差异化主轴：让"真实"可见。数据全部现成，只做展示层。前提：尊重 `src/data/current-focus.ts` 的既有设计注释（"Keep this explicit so the homepage does not infer a personal priority from sync noise"）——人工策展是主渠道，同步数据作为独立标注区块补充，不替代策展内容。

1. **`/now` 页工作台化**。现状已核实：中文 `/now` 页为手写静态文案（"最近完成：…"），而英文 `/en/now` 页已经用 `currentFocus` 数据驱动——两个语言页现状不一致。注意 `current-focus.ts` 现为单语言混合体（标题/eyebrow/primaryLabel 是英文，description 是中文），直接接入中文页会出现中英混杂；需先为该文件补齐双语字段（与 `ProjectDemo` 的 `meta: Record<kind, Record<locale, …>>` 模式一致）。改造方案：
   - 人工策展区统一走 `current-focus.ts`（补齐中文字段后中文页接入，英文页保持），文案与链接由维护者编辑，不从同步数据推断。
   - 同步事实区新增：`github-projects.json` 按 `pushedAt` 取最近 3 个仓库 + `sync-report.json` 的 `syncedAt`（"档案同步于 Aug 23"），明确标注"来自 GitHub 同步"。
   - 展示保持 Field Notes 工作台隐喻（`now-workbench` 资产已有）。
   - UI 不撒谎：数据旧就如实显示旧，不伪造"刚刚"。
2. **项目卡最近活动标签中文化**（并入阶段 1c）。
3. **首页"正在构建"区块接入 `current-focus.ts`**：现状为 `index.astro` 内联手写的 `focusSummary` 数组（已核实不在 `src/data/` 中），与 `/now` 页两处手写漂移。改为与 `/now` 页共用同一数据模块与组件（双语 props，参照 `current-focus.ts` 现有字段），首页展示精简版。英文首页 now 区现为内联标记，一并迁移。
4. **作品页佐证区**（服务求职/合作访客）：`/projects` 页已直接导入 `external-contributions.json` 渲染归档目录（仓库、PR 数量、同步日期，已核实），但 PR 级证据（Merged/Open/Closed 状态、PR 链接）只在孤儿组件 `ExternalContributions.astro` 里实现、未挂载。本项工作：优先直接采用孤儿组件（它已渲染 PR 状态与链接，正合佐证区目标）替换页内简化标记，与同步时间 + 简历入口组成"为什么信我"闭环区块；若不采用则删除孤儿组件，避免双实现漂移。不新增数据。

## 阶段 3 · Field Notes 结构化（P1，部分完成 ✅）

实际提交：`7f6c372` feat(projects)（ProjectDemo 可见 + 单次播放 + 触觉震动）、`558ad06` feat(visual)（精选封面 + 搜索空态）、`869f06d` feat(reading)（文章尾部 Mochi 书签 + 写作统计）。

1. **区块编号从导航延伸到区块标题**：`HomeSectionNav` 已有 01–05 编号，但各区块 `<section>` 标题本身没有。首页五个区块标题加统一档案标签行：编号 + 档案类型（作品=已验证章 / 正在构建=实验中章 / 笔记=现场记录）+ 最近更新时间戳。时间戳只给有真实数据的区块：作品（同步的 `pushedAt`）、正在构建（`syncedAt`）、笔记（最新文章发布日期）；收藏与联系区块的数据源（`showcase.ts` 等）没有日期字段（已核实），不显示时间戳，也不得虚构。印章资产 `lora-v1-stamp-verified/experiment` 已存在，直接复用。
2. **ProjectDemo 默认可见**（体感提升最大项）：现 `display:none`，仅 `html[data-haptics='on']` 可见。改为：
   - 默认可见；进入视口单次播放（IntersectionObserver，播放一次即停，已有单次有限播放逻辑）。
   - 重播按钮保留（已有 `重播 ↻`）。
   - "开启体感"只控制额外触觉反馈（vibrate），不再控制可见性。
   - `prefers-reduced-motion: reduce` 下显示静态终态帧（步骤全部点亮），不播放。
   - 涉及文件：`ProjectDemo.astro` 样式门控（第 88–102 行区域）与可见性注释、四个使用页面的插槽不变。
   - 附带重构：`demoByRepo` 映射目前在 `index.astro` 与 `projects/index.astro` 各写一份（后者注释自述"与首页同一份体感 demo 映射"），迁入共享数据模块，避免双份漂移。
3. **Mochi 决策点补齐**（404 已有，补两处）：
   - 搜索空结果：pagefind UI 自带空态文案，覆盖方式需在实施时二选一：CSS 隐藏默认消息 + 监听 pagefind 结果事件（`pagefind` instance 的 `search()` 返回空时）显示自定义区块；或用 pagefind 官方的 message 自定义选项。展示 Mochi 翻本子场景 + "换个词试试"引导。资产用 lora-visual 生成（规格见"资产生成"节）。
   - 文章结尾：`reading-marker` 资产已存在且用于列表页，扩展到 `BlogPost.astro` 文章尾部（"读完了，Mochi 帮你夹了书签" + 下一步去向：下一篇 + 相关短笔记）。纯复用现有资产，不新生成。
4. **精选文章封面**：范围收敛为中文写作页 `featuredPostIds`（4 篇：ai-engineering-harness、free-vision-skill、eve-agent、wishlive），使用位置为 `blog/[...page].astro` 与 `blog/language/[language]/[...page].astro` 两处列表（已核实 EN 写作页 `en/writing/index.astro` 无 featured 区块，英文页不加，避免范围蔓延）。首页最近文章列表保持纯文字（性能预算与信息密度考虑，首页不加载封面）。封面用 lora-visual 按 Field Notes 风格生成（规格见"资产生成"节），WebP 接入，声明尺寸。注意 `featuredPostIds` 注释说明 ID 失效会静默跳过——封面按 ID 映射，同样静默跳过并保留文字卡兜底。

## 阶段 4 · 微交互与动线收尾（P2）

1. **移动菜单 Esc 焦点归还**：`SiteHeader.astro` 菜单关闭后焦点回菜单按钮（参照简历对话框已有模式）。
2. **轮播自动巡游对齐规则**：当前实现为进入视口自动开始 drift。与 AGENTS"不引入自动播放"存在张力。两个选项，实施前与维护者确认：
   - A（保守）：默认暂停，首次访客交互后才可巡游（按钮从"暂停巡游"变"开始巡游"）。
   - B（现状+声明）：保留进入视口自动巡游，但在 AGENTS.md 中记录该例外及理由（已有人工暂停、hover/focus/触摸暂停、reduced-motion 禁用三重约束）。
   - 未确认前不改代码。
3. **站点统计条**：写作页底部静态计数（文章数、短笔记数、项目数），全部来自本地集合与快照，构建期生成，不做浏览量（无真实数据源，违背"UI 不能撒谎"）。
4. **仓库链接 hover 摘要**：项目卡仓库链接 hover/focus 显示一行项目摘要（`summary` 字段已有）。注意桌面 hover 不得是唯一途径：摘要同时通过 `title`/`aria-describedby` 提供。

## 阶段 5 · 性能与质量门（发布条件）

1. **首页 LCP 修复**（目标 Lighthouse ≥ 98；注意：LCP 元素已实测为 header 品牌文字，不是 hero 图，图片压缩不足是总传输量问题而非 LCP 主因）：
   - 实施时先在 Lighthouse 限速环境下复测 LCP 元素归因（本地未限速实测与限速环境可能不同），以实测为准再动手。
   - LCP 主修复方向：检查 Satoshi 字体的 preload 与 `font-display`（`BaseHead.astro:84` 的 `<Font>` 未显式传 fontDisplay，需确认生效值为 swap）；评估 hero 区 `.animate` 的 `opacity: 0` 初始态——首屏主内容首绘被 300ms 入场动画延后，可改为初始可见、仅用 transform 入场，或首次加载免动画（与 interaction-matrix"页面进入淡入"的意图一致）。
   - 总传输量优化（次要，服务带宽受限访客）：`src/data/lora-visual.ts` 的 `heroLora` quality 92 → 80–84，评估 1536 宽度是否必要（桌面显示尺寸 42rem）；`projectsMap` 已 lazy，不动。
   - `heroLora` 加 `fetchpriority="high"` 作为保险（若上述修复后 LCP 元素变为 hero 图则直接生效；LoraVisual 组件需透传该属性）。
   - 每次调整后重跑 Lighthouse，以实测为准，不做无依据的激进压缩。
2. 每阶段完成后的标准验收（依据 AGENTS"如何验证"）：
   - `bun run check` 0 errors 0 warnings。
   - `NODE_OPTIONS=--max-old-space-size=3072 bun run build` 通过。
   - 浏览器实测：桌面、移动 390px、键盘路径、`prefers-reduced-motion`。
   - 首页/作品页改动复测 Lighthouse 性能与无障碍。
   - 截图与报告存 `~/.local/share/lora-sys-review/`，不进仓库。

## 资产生成规范（lora-visual）

本会话无 `step_image` skill；全部视觉资产用 `lora-visual`（Lora Field Notes 原生体系）。每项资产生成前按 AGENTS"额外提醒"写清以下字段：

1. **搜索空结果 Mochi 场景**
   - 用途：搜索页无结果时的空态插画。
   - 构图：Mochi 伏在一摞纸上翻找，旁边散落几张空卡片；视线朝向搜索框方向留白。
   - 安全区：主体居中偏右，左侧 30% 留文案区。
   - 风格：暖白纸张、石墨轮廓、低饱和苔绿/陶土橙，与 `lora-v2-reading-marker` 同系。
   - 禁止元素：放大镜 cliché、问号符号、AI 大脑/芯片类泛科技元素。
   - 目标尺寸：960×640 原始稿，输出 WebP ≤ 40KB（显示尺寸约 20rem）。
2. **精选文章封面 ×4**
   - 用途：写作页 featured 区块封面，表达文章真实主题。
   - 构图：每张对应文章核心概念（harness 工程化闭环 / 视觉按需调用 / EVE Agent / WishLive），工作台物件隐喻，不放文字。
   - 风格：同上，横幅构图。
   - 禁止元素：文章标题文字、代码截图、终端窗口拟物。
   - 目标尺寸：原始 1600×900，输出 WebP，声明 width/height，lazy 加载。

## 明确不做

- 浏览量/访客计数：无真实数据源，伪造违背"UI 不能撒谎"。
- joyehuang 式终端彩蛋：与 Field Notes 气质不符。
- 更多轮播、全页鼠标跟随、WebGL、持续循环动画。
- 数据库、后端服务、第三方评论系统。
- 首页加载封面图（性能预算优先）。
- 英文站补齐 notes/lab/archives 等页面（工作量与收益不匹配，阶段 1b 的隐藏切换已诚实处理；未来如需要另立计划）。

## 实施顺序与提交拆分

阶段 0 → 1a → 1b → 1c → 1d → 2 → 3 → 4 → 5。每项独立 Conventional Commit：`docs(plan)`、`chore(repo)`、`fix(i18n)`、`feat(i18n)`、`feat(now)`、`feat(home)`、`feat(visual)`、`perf(home)`，阶段 0 拆分清单见上文。阶段 4.2 需维护者确认后再排期。推送与部署仅在维护者明确指令后执行。
