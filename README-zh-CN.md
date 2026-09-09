# loraSys

Lora 的双语作品站与构建笔记。Astro 将项目案例、文章、短笔记和浏览器实验输出为静态网站。

[已发布网站](https://lora-sys.github.io/loraSys/) · [English](./README.md) · [改版实现说明](./docs/redesign-v4.md)

<p align="center"><img src="./src/assets/lora-visual/v2/lora-v2-hero-lora.webp" width="440" alt="Lora 在工作台前的原创角色插画"></p>

## 页面分工

主导航为作品、写作、实验室、关于。正在构建、收藏、阅读、友链、短笔记、简历与 RSS 留在补充导航。联系、搜索、语言和主题使用独立工具入口。

| 页面 | 内容 |
| --- | --- |
| 首页 | 三个代表案例、原始语言写作、一个实验入口和紧凑收藏。 |
| 作品 | 四个项目案例与完整同步项目档案。保留关键词、来源、状态、方向筛选和稳定锚点。 |
| 项目案例 | Glassbox、Zhihu Threads、AI Engineering Harness、AgentArena，分别说明用途、实现选择和边界。 |
| 写作 | 文章列表默认展开，保留原文语言、永久地址与分页。 |
| 实验室 | 来源选择与验收规则两个可操作实验，并保留原有五篇仓库实验记录。 |
| 关于与正在构建 | 保留真实教育、证书、活动和有日期的人工记录。自动推送时间不等于人工确认的新进展。 |
| 联系与简历 | 邮箱优先，复制失败有恢复提示，网页简历优先阅读，PDF 按需打开。 |

新增页面提供中英文版本。已有文章正文和旧地址跳转保留，不把中文原文复制后称为英文翻译。

## 项目插画与机制示意

![Lora 与 Mochi 整理来源的项目插画](./src/assets/projects/lora-v3-project-zhihu-threads-zh.webp)

![用户选源后组织学习线的流程图](./src/assets/projects/lora-v3-zhihu-workflow-zh.webp)

项目插画沿用现有 Lora 与 Mochi，不是产品截图。四种项目卡片机制示意使用可本地化的 HTML 与 CSS，不将标题烧进图片。机制图不冒充真实执行过程。

## 两个可操作实验

来源选择实验包含三条本站编写的材料和四个有来源依赖的节点。每次选择都在浏览器内重算。取消所需来源后，节点继续显示，但会标明证据缺口。

验收规则实验包含四条固定教学记录。只检查完成情况时通过三条，同时检查工具和证据时通过一条。切换规则不会重新运行 Agent，也不是任何真实模型的性能结果。

步骤查看器支持直接选择、上一步、下一步、键盘和边界状态，并标为教学回放。以上交互不需要模型密钥、账号或后端服务。

## 本地开发

使用 Bun 1.3.5 和仓库锁文件。

```sh
bun install --frozen-lockfile
bun run dev
```

访问 Astro 实际输出的地址，不假设固定端口。

```sh
bun run validate:sync
bun run check
NODE_OPTIONS=--max-old-space-size=3072 bun run build
bun run preview --host 0.0.0.0
```

生产构建会执行 Astro 检查、静态生成、部署路径补全和已有发布审计。部署前缀为 `/loraSys`。

## 内容与数据

文章在 `src/content/blog`。GitHub 同步快照在 `src/data`，仍由原有同步脚本维护。项目案例说明在 `src/data/studio/curation.ts`，与同步事实分开维护。

```sh
bun run sync:github
bun run validate:sync
```

不要手工修改快照来伪造项目状态。原创插画、公开产品截图和个人收藏图片分别保留归属。原始图、审计截图、报告和字体放在仓库外。

## 验证方式

PR 继续运行原有功能与阅读回归、全部页面静态检查、国际化审计，并增加 `scripts/test-studio-v4.mjs`。新增检查覆盖四个视口宽度、双语路由、所有来源组合、规则切换、步骤查看、收藏筛选和完整项目保留。

通过 `PLAYWRIGHT_MODULE`、`AXE_PATH` 和 `SITE_TEST_OUTPUT` 指定隔离测试工具与报告目录。新增脚本只服务本地生产构建，拒绝非读取请求。构建成功不代表外部服务全部可用。

Lighthouse 沿用模拟手机网络和 CPU 限速，每页测量三次，保留所有样本。分数和截图应放在 PR 的审计记录中，不写成永久不变的宣传数字。

PR 用于审查。维护者合并后，仍按原有同步、质量检查、构建与 GitHub Pages 流程发布。

## 许可证

参见 [LICENSE](./LICENSE) 及仓库已有归属说明。
