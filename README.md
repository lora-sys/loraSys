<p align="center">
  <a href="https://lora-sys.github.io/loraSys/">
    <img src="./assets/readme/hero.svg" width="100%" alt="loraSys — Lora's personal engineering notebook for AI agents, tools, products, and experiments">
  </a>
</p>

<p align="center">
  <a href="https://lora-sys.github.io/loraSys/">Live site</a> ·
  <a href="https://lora-sys.github.io/loraSys/projects">Projects</a> ·
  <a href="https://lora-sys.github.io/loraSys/blog">Writing</a> ·
  <a href="https://github.com/lora-sys">GitHub</a> ·
  <a href="./README-zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/lora-sys/loraSys/deploy.yml?branch=main&label=Pages" alt="GitHub Pages deployment status">
  <img src="https://img.shields.io/badge/Astro-5.17-FF5D01?logo=astro&logoColor=white" alt="Astro 5.17">
  <img src="https://img.shields.io/badge/Bun-1.3.5-fbf0df?logo=bun&logoColor=14151a" alt="Bun 1.3.5">
  <img src="https://img.shields.io/github/license/lora-sys/loraSys" alt="License">
</p>

`loraSys` is Lora's personal engineering notebook: a static, editorial site for building in public across AI agents, full-stack products, developer tools, and Web3 experiments.

The site is intentionally **content-first and build-time driven**. Articles live beside structured project data; GitHub project metadata and contribution activity are snapshotted during the build; the result is published as a fast static site on GitHub Pages.

> Build systems that learn.

## What to look at first

| Start here | What it contains |
| --- | --- |
| [Projects](https://lora-sys.github.io/loraSys/projects) | 52 owned public repositories, with curated posters, status, technologies, stars, and source/live links. |
| [Writing](https://lora-sys.github.io/loraSys/blog) | Technical essays on agent infrastructure, visual evidence, model APIs, and shipping experiments. |
| [Lab](https://lora-sys.github.io/loraSys/lab) | Five project-native explainers for the systems behind the work. |
| [Notes](https://lora-sys.github.io/loraSys/notes) | Short observations on agents, frontend systems, Web3, and research. |

## Selected work

<table>
  <tr>
    <td width="50%" valign="top">
      <a href="https://github.com/lora-sys/Glassbox-Agent-Harness"><img src="./src/assets/projects/github-glassbox-agent-harness.webp" alt="Glassbox Agent Harness project poster"></a>
      <h3><a href="https://github.com/lora-sys/Glassbox-Agent-Harness">Glassbox Agent Harness</a></h3>
      <p>An observability and evaluation lab for AI agents: actions become inspectable traces, contexts stay reproducible, and iteration has evidence.</p>
    </td>
    <td width="50%" valign="top">
      <a href="https://github.com/lora-sys/free-vision-skill"><img src="./src/assets/projects/github-free-vision-skill.webp" alt="Free Vision Skill project poster"></a>
      <h3><a href="https://github.com/lora-sys/free-vision-skill">Free Vision Skill</a></h3>
      <p>A low-token visual evidence compiler that turns images into compact packets for text-only coding agents.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <a href="https://github.com/lora-sys/nano-vllm-interactive-guide"><img src="./src/assets/projects/github-nano-vllm-interactive-guide.webp" alt="nano-vLLM Interactive Guide project poster"></a>
      <h3><a href="https://github.com/lora-sys/nano-vllm-interactive-guide">nano-vLLM Interactive Guide</a></h3>
      <p>Thirteen interactive experiments and a Chinese tutorial for understanding the moving parts of an LLM inference engine.</p>
    </td>
    <td width="50%" valign="top">
      <a href="https://github.com/lora-sys/trustops"><img src="./src/assets/projects/github-trustops.webp" alt="TrustOps project poster"></a>
      <h3><a href="https://github.com/lora-sys/trustops">TrustOps</a></h3>
      <p>An auditable commitment layer for growing B2B SaaS teams, connecting policies, controls, reviews, and accountable decisions.</p>
    </td>
  </tr>
</table>

## How the site is assembled

<p align="center">
  <img src="./assets/readme/system-map.svg" width="100%" alt="Content flows through Astro Theme Pure and build-time GitHub snapshots into a static GitHub Pages site">
</p>

### The model

- **Content:** Markdown articles, short notes, profile data, project records, and local media.
- **Composition:** Astro with the [Pure theme](https://github.com/cworld1/astro-theme-pure) as the visual and interaction foundation.
- **Build-time snapshots:** GitHub REST/GraphQL data refreshes project metadata, posters, and contribution activity before publishing.
- **Delivery:** Static `dist/` output, Pagefind search, RSS, sitemap, and GitHub Pages at [`/loraSys`](https://lora-sys.github.io/loraSys/).

The browser does not need a portfolio API or a database. A failed refresh keeps the last known local snapshot, so the site can still build and deploy.

## Run it locally

Requirements: [Bun 1.3.5](https://bun.sh/) and Git.

```bash
git clone https://github.com/lora-sys/loraSys.git
cd loraSys
bun install --frozen-lockfile
bun dev
```

Useful checks:

```bash
bun run check       # Astro type/content diagnostics
bun run build       # static build + base-path + release audit
bun preview         # preview the production output
```

The GitHub Actions workflow additionally refreshes the cached GitHub project and contribution snapshots before building:

```bash
bun scripts/fetch-contributions.mjs
bun scripts/fetch-github-projects.mjs
```

## Repository map

```text
src/content/              published essays
src/data/                 profile, notes, projects, snapshots
src/pages/                blog, projects, lab, notes, now, talks, links
src/components/           personal sections layered on Pure
packages/pure/             pinned Astro Theme Pure source
assets/readme/             README-native visual system
.github/workflows/        GitHub Pages deployment and data refresh
```

## Design decisions

- Pure remains the primary UI system; personal details are layered into its editorial structure.
- Projects are curated by evidence, not by pretending every public repository is equally important.
- Posters are local WebP assets sourced from README screenshots or GitHub previews, so the portfolio remains stable offline.
- Anime, favorites, contributions, and friend links are static content with small accessible interactions; there is no runtime database.
- The old Svelte/Wayfinder surface is archived, not kept as a compatibility layer.

## Links

- [Live website](https://lora-sys.github.io/loraSys/)
- [Contact Lora](https://lora-sys.github.io/loraSys/contact)
- [RSS feed](https://lora-sys.github.io/loraSys/rss.xml)
- [GitHub profile](https://github.com/lora-sys)

## License

The repository and the pinned Pure theme foundation are distributed under [Apache-2.0](./LICENSE). Individual articles, project screenshots, logos, and third-party media may carry their own attribution or license terms.
