# Blog Writer Reference

## Frontmatter Schema

所有 `src/content/*.md` 文件必须包含以下 frontmatter：

```yaml
---
title: string # 文章标题（必需）
description: string # 摘要，用于 SEO / Open Graph（必需）
date: 'YYYY-MM-DD' # 发布日期（必需）
categories: # 分类数组（必需）
  - category-name
published: boolean # 是否发布（必需）
image: '/images/...' # 封面图路径（可选）
---
```

### 字段规则

| 字段          | 规则                                                      |
| ------------- | --------------------------------------------------------- |
| `title`       | 中英混排，技术术语保留英文。不超过 80 字符                |
| `description` | 1-2 句话摘要，不超过 160 字符。用于 SEO description 和 OG |
| `date`        | ISO 格式 `YYYY-MM-DD`，用单引号包裹                       |
| `categories`  | 数组形式，每项一个词/短语。必须来自分类词表               |
| `published`   | `true` 或 `false`。草稿设为 `false`                       |
| `image`       | 以 `/images/` 开头，相对站点根路径。可选                  |

## Markdown 内容规范

### 标题层级

- frontmatter 的 `title` 提供 H1
- 正文从 `##` (H2) 开始
- 不允许跳过层级（H2 → H4 是错误）
- 标题后留一个空行

### 代码块

- 必须标注语言：` ```typescript ` ` ```python ` 等
- 行内代码用单反引号
- 代码块前后各留一个空行

### 列表

- 无序列表用 `-`
- 有序列表用 `1.`
- 列表项内换行需要缩进 2 空格

### 链接

- 外部链接用完整 URL 或相对路径
- 不允许空链接 `[]()` 或仅标题 `[](url)`

## 写作风格

- **中英混排**：技术术语保留英文（SvelteKit, TypeScript, GSAP 等）
- **语气**：第一人称 "我"，技术博客偏实践导向
- **段落**：中文段落之间空一行，英文段落之间也空一行
- **长度**：博客正文建议 1500-4000 字
- **结构**：先讲问题/背景，再给解决方案，最后实践步骤

## 文件命名

- 小写字母、数字、连字符
- 对应 slug，如 `ai-engineering-harness.md`
- 不含空格、中文、下划线
