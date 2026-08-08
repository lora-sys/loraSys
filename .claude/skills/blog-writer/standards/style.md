# 写作风格指南

## 语言

- **中英混排**：技术术语保留英文，技术术语列表见 [REFERENCE.md](../REFERENCE.md)
- 术语示例：SvelteKit, TypeScript, GSAP, TailwindCSS, mdsvex, MCP, LangGraph, EVM, TPS, L1, L2, Vercel, Node.js, React, Next.js, Python, Rust, Solidity, JavaScript, PostgreSQL, Docker, AI Agents, Web3

## 语气

- 第一人称 "我"
- 技术博客偏实践导向：先讲问题/背景，再给解决方案，最后实践步骤
- 避免：教程式教条，过度推销语气，术语堆砌
- 允许：个人经验分享，踩坑记录，对比分析

## 段落

- 中文段落之间空一行
- 英文段落之间空一行
- 中英混排时，中英文之间不加额外空格（如："使用 mdsvex 将 .md 编译为 Svelte 组件" — 正确；"使用 mdsvex 将 .md 编译为 Svelte 组件" — 错误）

## 标题

- 一级标题由 frontmatter `title` 提供
- 正文从 `##` (H2) 开始
- 标题层级不跳级（H2 → H3 → H4，不能 H2 → H4）

## 代码

- 行内代码用单反引号：`vite build`
- 代码块必须标注语言：` ```typescript `、` ```bash `、` ```svelte ` 等
- 代码块前后各空一行

## 列表

- 无序用 `-`，有序用 `1.`
- 列表项内换行需缩进 2 空格
- 列表项不超过 4 项时可用短句；超过 4 项建议用表格或段落描述

## 链接

- 外部链接用完整 URL：`https://svelte.dev`
- 站内链接用 `{base}/path` 格式
- 不允许空链接 `[]()` 或仅标题 `[](url)`

## 图片

- 路径以 `/images/` 开头
- 代码示例图片可用 Mermaid 替代

## 长度

- 博客正文建议 1500-4000 中英混合字符
- 速记（笔记）不超过 200 字符摘要
