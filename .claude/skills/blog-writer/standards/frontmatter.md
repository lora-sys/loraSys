# Frontmatter 规范

## 字段顺序

Frontmatter 字段必须按以下顺序排列：

```yaml
---
title: string
description: string
date: 'YYYY-MM-DD'
categories:
  - tag1
  - tag2
published: boolean
image: '/images/...'
---
```

## 日期格式

- 使用 ISO 格式：`YYYY-MM-DD`
- 值用单引号包裹
- 正确：`date: '2026-08-08'`
- 错误：`date: 2026-8-8`（缺少引号，月份不是两位）

## 分类格式

- 使用数组语法，每项一行，缩进 2 空格
- 正确：
  ```yaml
  categories:
    - AI
    - Agent
  ```
- 错误：`categories: [AI, Agent]`（内联数组，可读性差）
- 错误：`categories: "AI, Agent"`（字符串，不是数组）

## 布尔值

- `published` 必须是 `true` 或 `false`（小写）
- 错误：`published: "true"`（字符串）

## 图片路径

- 以 `/images/` 开头
- 文件必须真实存在于 `static/images/` 目录
- 可选字段，不写则不包含
