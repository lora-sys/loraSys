# 展示选择与示例

使用前核对 `docs/mdx-content-contract.md`、路由组件映射和 `src/components/blog/mdx/`。下表说明选择依据，具体参数与数量限制以当前源码为准。

| 读者需要 | 优先形式 | 使用条件 |
| --- | --- | --- |
| 阅读解释、代码、引用或简单对照 | Markdown 段落、代码块、引用、表格 | 能直接读懂就不加组件 |
| 注意限制、定义或操作提醒 | Callout | tone 为 note、tip、warning 或 data，有具体内容 |
| 看几个有来源的关键数字 | StatStrip | 来源已有 2 至 4 个适合并列的数值，不凑数 |
| 回看文章要点 | KeyPoints | 3 至 5 个已被正文支持的要点，少于 3 个用普通列表 |
| 按顺序执行操作 | ProcessSteps | 有真实顺序，不把并列特征画成流程 |
| 比较两种方式或状态 | ComparePanel | 两侧比较同一组条件，需要多列时用表格 |
| 分别查看几个方案或层级 | OptionTabs | 2 至 4 个真实选项，普通表格更方便对照时用表格 |
| 比较数值 | DataChart | 最多 12 个非负值，labels 与 values 一一对应，量纲相同 |
| 看流程、状态、调用顺序或架构 | Mermaid fenced block | 正文已解释节点和关系，不为装饰加图 |
| 看已有架构层、证据流程或 trace 示例 | ArchitectureStack、EvidenceFlow、TraceExplorer | 先读对应组件 props 和当前文章用例，示例不能写成真实运行记录 |
| 看本地视频 | MediaVideo | src 在 /media/blog/ 下，原生控件，无自动播放 |
| 操作本地独立 HTML | InteractiveHtml | src 在 /artifacts/blog/ 下，有文本回退，资源自包含 |

不按篇幅或统一指标强制插入组件。同一信息不同时重复为摘要卡、数字条、图表与正文。图前说明要读什么，图后只解释关键差异与限制。标题、图例、单位、说明和交互提示使用文章语言。

## 静态参数

这些片段展示语法，不是可直接发表的事实。替换示例内容并补来源后再使用。`|`、`::`、`;;` 是组件分隔符，内容需要这些字符时改用 Markdown，不猜测组件未实现的转义。

```mdx
<Callout tone="warning" title="适用条件">
这段指南要求目标服务支持幂等键。先检查服务文档。
</Callout>

<ProcessSteps
  title="验证顺序"
  steps="确认输入::记录测试条件|执行操作::保留输出|核对结果::对照预期状态"
/>

<ComparePanel
  title="是否保留执行记录"
  leftTitle="只保存最终文本"
  left="可阅读回答|无法核对工具执行过程"
  rightTitle="保存执行记录"
  right="可阅读回答|可核对记录中已有的工具输入与输出"
/>

<DataChart
  title="教学示例中的耗时"
  description="人为设定的示例，用于演示相同单位的比较。"
  labels="方案 A|方案 B"
  values="10|15"
  suffix=" ms"
  source="教学示例，非实测结果"
/>
```

正文中的教学数字同样要注明示例属性。实际稿没有合适数值时省略 DataChart。

## Mermaid

使用 fenced `mermaid`，不 import Mermaid，不写初始化指令或点击脚本。图的每条关系都要能在正文或来源中找到依据。控制节点数量，检查移动端是否可读。复杂图拆成对应正文小节的几张图，不把整篇文章压成一张图。

## 初稿元数据

新稿按实际主题填写分类与日期，不复制别人的来源身份。下面是审核候选的语法示例。

```yaml
---
title: 工具执行记录如何帮助核对结果
description: 说明执行记录需要保存哪些信息，以及哪些结论仍需单独验证。
publishDate: 2026-10-08
contentType: technical
topics: [agents, evaluation]
language: zh-CN
tags: []
draft: true
---
```

`draft: true` 不代替导入审核目录，也不授权把普通导入稿移动到公开目录。
