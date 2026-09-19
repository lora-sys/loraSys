# Blog MDX content contract

`src/content/blog` accepts Markdown and MDX. New Notion-synchronized articles should use `.mdx`. Existing `.md` articles can stay unchanged until they need a content update.

## Security boundary

Synchronized MDX is declarative content, not executable application code.

- Do not add `import` or `export` statements inside an article.
- Do not add JavaScript expressions with `{}`.
- Do not add scripts, inline event handlers, client directives, iframes, objects, embeds, `set:html`, or `is:inline`.
- Custom article components are injected by `src/pages/blog/[...id].astro` and must stay on the allowlist enforced by `scripts/validate-blog-mdx.mjs`.
- Native Markdown blockquotes and tables are mapped to site-level renderers. Articles keep ordinary Markdown syntax while the route supplies the visual shell.
- Keep Mermaid in fenced `mermaid` code blocks. `BlogPost.astro` already renders those blocks with Mermaid's strict security level.

## Approved components

### Callout

Use for a source-backed warning, limitation, definition, or implementation note.

```mdx
<Callout tone="warning" title="边界">
这项机制减少凭据暴露面，但不会替代目标 API 的权限控制。
</Callout>
```

Allowed tones are `note`, `tip`, `warning`, and `data`.

### StatStrip

Use when the source already contains two to four compact headline values. Do not invent or estimate numbers just to fill the component.

```mdx
<StatStrip
  stats="55k::全部工具定义上下文|85%+::按需搜索减少量|3–5::建议常驻工具数"
  source="Source: Anthropic Tool Search documentation"
/>
```

Each item uses `value::label`; items are separated with `|`.

### KeyPoints

Use for three to five compact takeaways that are already supported by the article.

```mdx
<KeyPoints
  title="读完先记住"
  items="工具发现::先缩小候选范围|权限控制::搜索结果不等于调用权限|上下文预算::只加载当前任务需要的定义"
/>
```

### ProcessSteps

Use for a real ordered workflow. Each step uses `heading::body`, separated by `|`.

```mdx
<ProcessSteps
  title="一轮工具发现"
  steps="理解任务::判断需要哪类能力|搜索目录::只找相关工具|加载定义::把候选 Schema 放回上下文|执行校验::调用后检查结果与权限"
/>
```

### ComparePanel

Use when the article already contrasts two approaches or states.

```mdx
<ComparePanel
  title="两种凭据路径"
  leftTitle="Secret 进入 sandbox"
  left="原始值可读|日志可能泄露"
  rightTitle="Host boundary 注入"
  right="sandbox 不持有原始值|只对批准目标注入"
/>
```

### OptionTabs

Use when the article has two to four real alternatives, layers, modes, or framework choices that readers benefit from inspecting one at a time. This is progressive disclosure, not a scoring widget.

Each item uses `label::summary::detail one;;detail two`; items are separated with `|`.

```mdx
<OptionTabs
  title="Three architecture layers"
  items="tau_ai::Provider adaptation::Normalizes provider streams;;Does not know the UI|tau_agent::Agent core::Owns messages, tools and run events;;Does not render a terminal|tau_coding::Application layer::Adds coding tools, sessions and interfaces;;Consumes core events"
/>
```

Do not use `OptionTabs` when a normal list or table is easier to scan.

### DataChart

Use for a small numeric comparison or ordered series with values that are explicit in the source or are clearly labeled derived arithmetic.

```mdx
<DataChart
  title="每轮工具上下文"
  description="示意数据必须来自文章已核对的数据。"
  labels="方案 A|方案 B"
  values="55000|8200"
  suffix=" tokens"
  source="Source: cited benchmark or article data"
/>
```

`labels` and `values` use `|` as the separator. The component accepts at most 12 non-negative values and renders a compact interactive bar chart.

## Conversion rules for Notion

- Headings, paragraphs, lists, quotes, links, GFM tables, code blocks, equations, images, and `details` should stay native Markdown or HTML where possible.
- Remove Notion-only placeholders such as `<table_of_contents/>`; the site already generates its own table of contents.
- Copy source images into `src/assets/blog/<slug>/` and reference the local asset exactly as the current sync flow does.
- Use Mermaid only for a real flow, sequence, state model, or architecture already described by the article.
- Use `StatStrip` or `DataChart` only when the source provides suitable numbers. If the article has no suitable data, omit them.
- Do not change the author's factual claims or add unsupported numbers for presentation.


## Legacy article maintenance

- Existing published articles may move from `.md` to the same-slug `.mdx` file. The route and public URL must not change.
- Prefer Mermaid, local images, `Callout`, `StatStrip`, and `DataChart` over large hand-written inline SVG blocks.
- Editorial maintenance may shorten repetitive prose, split long paragraphs, remove promotional claims, and clarify whether numbers are measured, illustrative, or source-reported.
- Do not silently turn illustrative numbers into measured results. Remove unsupported precision or label the teaching example.
- Record completed reviews in `content-sync/editorial-maintenance.json`. Reopen an entry only for source changes, factual corrections, broken media, or a documented content-contract violation.
