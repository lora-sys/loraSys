# E2E 测试报告 — 2026-04-18

## 测试范围

- Homepage `/`
- Blog Listing `/blog`
- Blog Post `/blog/newtube`
- API `/api/content`

---

## 发现的问题

### 🔴 P0 — Critical (影响功能)

#### 1. newtube.md 未出现在博客列表

- **症状**: API 返回 2 篇博客 (first-post, second-post)，但 `src/content/` 有 3 个 .md 文件，newtube.md 的 `published: true` 被忽略
- **根因**: API (`+server.ts`) 和 Blog Listing (`+page.server.ts`) 使用 `import.meta.glob` 动态导入，newtube.md 可能被错误解析
- **影响**: 用户无法通过列表访问 newtube 博客文章
- **状态**: 已验证 — `curl http://localhost:5175/api/content` 仅返回 2 篇

---

### 🟡 P1 — High (影响体验)

#### 2. 外部 CDN 资源加载极慢

- hackathon.app canitake.com 图片: **578ms ~ 2580ms**
- CDN 视频资源: **864ms ~ 1369ms**
- Google Fonts: **400 ~ 500ms**
- **根因**: 依赖第三方 CDN，无缓存，无本地 fallback
- **影响**: 首屏加载慢，用户看到空白/占位符

#### 3. 视频资源 ERR_ABORTED

- 4 个视频请求被 abort (`net::ERR_ABORTED`)
  - `cdn.magicui.design/bento-grid.mp4`
  - `cdn.llm.report/openai-demo.mp4`
  - `pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4`
  - `pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4`
- **根因**: `preload="none"` + Chromium preload scanner 行为
- **影响**: 视频首次播放时可能闪烁/延迟

---

### 🟠 P2 — Medium (运行时警告)

#### 4. Hydration Mismatch (blog listing + blog post)

```
Hydration failed because the initial UI does not match what was rendered on the server
font-weight: bold font-weight: normal
```

- **仅发生在 blog listing 和 blog post 页**，homepage 无此问题
- **根因**: `BlurFade` 组件使用 `svelte-inview`，SSR 渲染 `opacity-0`，客户端 hydration 后立即触发 `isVisible=true`
- **影响**: 浏览器 re-render，内容闪烁（但最终正常显示）
- **状态**: homepage 无此问题，Page 直接渲染无 BlurFade

#### 5. Button 嵌套 HTML 错误

```
`<button>` cannot be a descendant of `<button>`
```

- **根因**: `ModeToggle` 渲染 `<button>`，被包裹在 Navbar 的 bits-ui `<button>` (Tooltip.Trigger) 内
- **位置**: `src/lib/components/portfolio/ModeToggle.svelte` 嵌套在 Navbar 的 `<Tooltip.Trigger>`
- **影响**: HTML 规范违反，SSR hydration 警告

#### 6. `app.html` body 警告

```html
Placing %sveltekit.body% directly inside
<body>
	is not recommended
</body>
```

- **根因**: `app.html` 直接将 `%sveltekit.body%` 放在 `<body>` 内，缺少 `<div style="display: contents">` 包裹

---

### 🟢 P3 — Low (优化项)

#### 7. DOM 节点过多

- Homepage: **1117 nodes**
- Blog Post: **1529 nodes**
- **根因**: BentoGrid 每个项目有 header/icon snippet，Shiki 代码高亮生成大量 span

#### 8. 187 个 Script 资源

- **根因**: Vite dev 模式 HMR chunk 拆分，187 个模块
- **生产环境**: 构建后应该 bundle 成 1-2 个大 chunk

#### 9. 博客标题为空

```json
titleText: ""
```

- blog post h1 渲染正常但 textContent 为空
- **根因**: `data.meta?.title` 可能为 undefined 或被 `{@html}` 覆盖

---

## 性能基准

| 页面         | TTFB  | DOM Interactive | DOM Nodes | Resources | Slow Requests    |
| ------------ | ----- | --------------- | --------- | --------- | ---------------- |
| Homepage     | 128ms | 622ms           | 1117      | 220       | 14               |
| Blog Listing | 46ms  | 589ms           | 133       | 135       | 1 (Google Fonts) |
| Blog Post    | 74ms  | 630ms           | 1529      | 138       | 1 (Google Fonts) |

**Google Fonts TTFB: ~400-500ms** (跨所有页面)

---

## 修复计划

### Phase 1: Critical Fix — newtube.md 博客发现

- 调查 `import.meta.glob` 解析 newtube.md frontmatter 的问题
- 验证 mdsvex 处理 `published: true` 的方式
- 修复后确保 API 返回全部 3 篇博客

### Phase 2: High Priority — CDN 资源优化

- 预下载 hackathon 图片到 `static/` 目录
- 评估视频是否内联/base64 或使用 `<video preload="metadata">`
- 实现图片 lazy loading + blur placeholder

### Phase 3: Hydration Fix

- 为 BlurFade 添加 `onMount` 延迟初始化 isVisible
- 或在 blog 页面用 CSS-only animation 替代 BlurFade
- 或在服务器端使用 `{#if browser}` 条件渲染

### Phase 4: HTML 规范修复

- 修复 ModeToggle button 嵌套问题（使用 `<div>` 替代外层 button）
- 修复 `app.html` body 包裹问题

### Phase 5: Fonts & Performance

- 自托管 Google Fonts (下载 woff2 到 static/)
- 或使用 `@fontsource` 包内联字体
- 测量 Lighthouse / Core Web Vitals

### Phase 6: Video Reliability

- 调查 `ERR_ABORTED` 根因，调整 preload 属性
- 添加 `<video>` error 处理和 fallback 静态图
