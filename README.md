<p align="center">
  <a href="https://lora-sys.github.io/loraSys/">
    <img src="./assets/readme/hero.webp" width="100%" alt="Lora — personal site, projects, writing, current work, and experiments">
  </a>
</p>

<p align="center">
  <a href="https://lora-sys.github.io/loraSys/">Live site</a> ·
  <a href="https://lora-sys.github.io/loraSys/projects">Projects</a> ·
  <a href="https://lora-sys.github.io/loraSys/blog">Writing</a> ·
  <a href="https://lora-sys.github.io/loraSys/now">Now</a> ·
  <a href="https://github.com/lora-sys">GitHub</a> ·
  <a href="./README-zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/lora-sys/loraSys/deploy.yml?branch=main&label=Pages" alt="GitHub Pages deployment status">
  <img src="https://img.shields.io/badge/Astro-5.17.3-FF5D01?logo=astro&logoColor=white" alt="Astro 5.17.3">
  <img src="https://img.shields.io/badge/Bun-1.3.5-fbf0df?logo=bun&logoColor=14151a" alt="Bun 1.3.5">
  <img src="https://img.shields.io/github/license/lora-sys/loraSys" alt="License">
</p>

`loraSys` is the source repository for Lora's bilingual personal site and public build log. It brings representative projects, long-form writing, short notes, current focus, experiments, and public activity into one static Astro site.

The current representative work is **Glassbox**, **AgentArena**, **Lora Skills**, and **Zhihu Threads**. Project facts come from verified GitHub snapshots; editorial ranking and copy stay explicit in the repository so the homepage does not drift when new repositories appear.

> Build systems that learn.

## Start here

| Surface | What it is for |
| --- | --- |
| [Projects](https://lora-sys.github.io/loraSys/projects) | Curated public work, source links, status, technologies, evidence, and the full project archive. |
| [Writing](https://lora-sys.github.io/loraSys/blog) | Longer technical notes on agent infrastructure, developer tooling, model integrations, and shipping. |
| [Now](https://lora-sys.github.io/loraSys/now) | One current-focus snapshot shared with the homepage instead of duplicated hand-written status. |
| [Lab](https://lora-sys.github.io/loraSys/lab) | Project-native explainers and experiments that show how a system behaves. |
| [Notes](https://lora-sys.github.io/loraSys/notes) | Short engineering observations with stable shareable anchors. |

## Representative work

| Project | Current focus |
| --- | --- |
| [Glassbox](https://github.com/lora-sys/Glassbox-Agent-Harness) | A long-lived Personal Agent workbench. The current foundation includes Codex and Claude Code adapters, local sessions, replay, approvals, trace inspection, and canvas views; identity, authorization, durable conversation, memory, long tasks, and remote channels are developed as explicit later stages. |
| [AgentArena](https://github.com/lora-sys/AgentArena) | An evaluation platform where agents perform tasks, receive judge review, and keep match records, evidence, and reputation. |
| [Lora Skills](https://github.com/lora-sys/skills) | An installable collection of personal Agent Skills for static-site release work, AI engineering, writing, open-source workflows, media tooling, and other repeatable tasks. |
| [Zhihu Threads](https://github.com/lora-sys/zhihu-threads) | Turns user-selected Zhihu excerpts into a learning thread with follow-up questions, self-tests, and exportable study material. |

The homepage shows a small curated set. The full project page is broader and uses build-time GitHub data without pretending every public repository is equally important.

## How the site is assembled

<p align="center">
  <img src="./assets/readme/system-map.svg" width="100%" alt="Content and curated project data flow through Astro and verified GitHub snapshots into a static GitHub Pages site">
</p>

- **Content:** Markdown articles, short notes, profile data, project stories, current-focus data, and local media.
- **Project curation:** verified repository snapshots provide facts; a separate curation layer chooses representative work and presentation order.
- **Composition:** Astro with the pinned [Pure theme](https://github.com/cworld1/astro-theme-pure) foundation plus project-specific components and visual assets.
- **Build-time sync:** GitHub project and contribution data are refreshed and validated before the verified production build.
- **Delivery:** static `dist/`, Pagefind search, RSS, sitemap, bilingual routes, and GitHub Pages at [`/loraSys`](https://lora-sys.github.io/loraSys/).

The browser does not depend on a portfolio API or runtime database. If a data refresh fails, the repository keeps the last verified local snapshot instead of making the site unavailable.

## Quality and release gates

A pull request is expected to pass the same things the published site depends on:

- Astro type/content checks and the production build.
- sync-data validation and ownership checks.
- route, language, internal-link, and browser interaction audits.
- desktop and 390×844 browser regression coverage.
- release output checks for required routes, local assets, a real document title, a non-empty description, and exactly one `h1` per generated HTML page.

The deploy workflow then refreshes verified GitHub snapshots again, builds from those artifacts, and publishes the exact Pages artifact produced by CI.

## Run locally

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
bun run build       # static build + base-path handling + release audit
bun run sync:github # refresh and validate public GitHub snapshots
bun preview         # preview production output
```

## Repository map

```text
src/content/              published essays
src/data/                 profile, notes, project curation, snapshots, current focus
src/pages/                home, blog, projects, lab, notes, now, talks, links, resume
src/components/           personal sections layered on Pure
packages/pure/            pinned Astro Theme Pure source
assets/readme/            README-native visual assets
scripts/                  sync, validation, release, and audit tooling
.github/workflows/        PR verification and GitHub Pages deployment
```

## Design decisions

- The site is a personal space first, not a generic portfolio template.
- Projects are curated by evidence and relevance, while the full archive remains available.
- Current work has one source of truth shared by the homepage and Now pages.
- Chinese and English routes share structure and facts where possible, while copy remains localized.
- Static assets and build-time data keep the published site stable without a runtime backend.
- Reduced motion, keyboard behavior, mobile touch targets, language metadata, and release-time HTML checks are treated as part of the product rather than optional polish.

## Links

- [Live website](https://lora-sys.github.io/loraSys/)
- [Projects](https://lora-sys.github.io/loraSys/projects)
- [Writing](https://lora-sys.github.io/loraSys/blog)
- [Contact Lora](https://lora-sys.github.io/loraSys/contact)
- [RSS feed](https://lora-sys.github.io/loraSys/rss.xml)
- [GitHub profile](https://github.com/lora-sys)

## License

The repository and the pinned Pure theme foundation are distributed under [Apache-2.0](./LICENSE). Individual articles, project screenshots, logos, generated illustrations, and third-party media may carry their own attribution or license terms.
