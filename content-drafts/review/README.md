# 本地文章候选

此目录是 **HTML/网页文章转换后的本地候选区**，不属于 Astro 的 `src/content` 集合，且候选 `.md` / `.mdx` 已被 Git 忽略。因此，运行转换脚本**不会**发布文章、提交原文或触发线上部署。

## 从 HTML 创建候选

将导出的 HTML 或保存的网页正文文件放在仓库外任意位置，再执行：

```bash
bun run article:import --input /absolute/path/to/article.html --title "文章标题" --source-url "https://example.com/article"
```

需要 MDX 扩展名时：

```bash
bun run article:import --input /absolute/path/to/article.html --title "文章标题" --format mdx
```

可选参数还包括 `--ownership`、`--content-type`、`--project` 与 `--output`。运行 `bun run article:import --help` 查看完整说明。

## 人工审核门槛

候选文件会带有 `status: needs-review`、来源 URL、归属、导入时间和审核说明。审核时必须确认标题、版权与归属、外部图片是否可用、链接、代码块与最终 frontmatter。只有人工将审核后的文件**显式复制或移动**到 `src/content/blog/` 后，它才会进入静态网站构建。

> HTML 输入只做本地转换；脚本不会抓取受限页面、下载第三方图片、修改公开文章或执行自动发布。
