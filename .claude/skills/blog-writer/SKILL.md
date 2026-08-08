---
name: blog-writer
description: Blog content creation, validation, and formatting skill for loraSys. Use when creating new blog posts (blog new), validating content against project standards (blog check), formatting Markdown (blog format), or listing drafts (blog list). Triggered when user mentions "blog", "文章", "写文章", "笔记", "写笔记", "校验", "格式化", or when content is added to src/content/.
---

# Blog Writer

项目专用的博客内容管理 Skill。负责创建、校验、格式化博客文章，以及维护笔记数据。

## 命令速查

| 命令                  | 功能       | 用法                                                  |
| --------------------- | ---------- | ----------------------------------------------------- |
| `blog new <title>`    | 创建新文章 | 在 `src/content/` 生成 .md 文件，自动填充 frontmatter |
| `blog check <path>`   | 校验内容   | 运行 validate.mjs 检查规范合规性                      |
| `blog format <path>`  | 格式化     | 修正 frontmatter、标题层级、代码块标注                |
| `blog list`           | 列出草稿   | 扫描 `published: false` 的文章                        |
| `blog draft <path>`   | 标记草稿   | 设置 `published: false`                               |
| `blog publish <path>` | 发布文章   | 设置 `published: true`                                |

## 执行流程

### blog new

1. 读取 [REFERENCE.md](REFERENCE.md) 获取 frontmatter 规范和分类词表
2. 从标题推导 slug（小写、连字符、去掉特殊字符）
3. 检查 `src/content/<slug>.md` 是否已存在
4. 读取 [templates/new-post.md](../templates/new-post.md)
5. 填充 frontmatter（日期自动填今天，slug 从标题推导）
6. 在 `src/content/` 创建文件
7. 告知用户文件路径和下一步

### blog check

1. 运行校验脚本：`node .claude/skills/blog-writer/scripts/validate.mjs <path>`
2. 读取脚本输出，分类为 errors / warnings
3. 对每个问题给出修复建议
4. 如果用户要求，自动修复可修复的问题（frontmatter 格式、标题层级等）

### blog format

1. 读取 [standards/frontmatter.md](standards/frontmatter.md) 获取字段排序规则
2. 读取 [standards/style.md](standards/style.md) 获取格式规范
3. 修正 frontmatter 字段顺序和日期格式
4. 修正标题层级（确保从 ## 开始，不乱跳）
5. 确保代码块有语言标注
6. 写入文件

### blog list

1. 运行校验脚本的 list 模式：`node .claude/skills/blog-writer/scripts/validate.mjs --list`
2. 展示草稿列表和已发布列表

### 写入后的标准流程

在任何 `src/content/*.md` 文件被创建或修改后：

1. **立即** 运行 `blog check` 校验
2. 根据校验结果修复所有 errors
3. 根据校验结果修复 warnings（或确认忽略）
4. 确认 frontmatter 完整且格式正确
5. 告知用户文件已就绪

## 相关规范

- [REFERENCE.md](REFERENCE.md) — frontmatter schema、分类词表、写作风格指南
- [standards/frontmatter.md](standards/frontmatter.md) — frontmatter 详细规范
- [standards/categories.md](standards/categories.md) — 分类词表与添加规则
- [standards/style.md](standards/style.md) — Markdown 写作风格规范
