# Blog MDX content contract

`src/content/blog` accepts Markdown and MDX. New Notion-synchronized articles should use `.mdx`. Existing `.md` articles can stay unchanged until they need a content update.

## Security boundary

Synchronized MDX is declarative content, not executable application code.

- Do not add `import` or `export` statements inside an article.
- Do not add JavaScript expressions with `{}`.
- Do not add scripts, inline event handlers, client directives, iframes, objects, embeds, `set:html`, or `is:inline`.
- Custom article components are injected by `src/pages/blog/[...id].astro` and must stay on the allowlist enforced by `scripts/validate-blog-mdx.mjs`.
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
