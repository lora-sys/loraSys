# Field Notes v4 implementation

## Scope

This change is a redesign candidate for maintainer review. It does not authorize an automatic merge or deployment.

The site keeps Astro and its original Lora and Mochi character artwork. It replaces repeated decorative route banners with content-specific layouts. No runtime framework, animation dependency or model API is added.

## Layouts and routes

| Template | Chinese | English |
| --- | --- | --- |
| Home | `/` | `/en` |
| Work | `/projects` | `/en/work` |
| Glassbox | `/projects/glassbox` | `/en/projects/glassbox` |
| Zhihu Threads | `/projects/zhihu-threads` | `/en/projects/zhihu-threads` |
| Engineering harness | `/projects/ai-engineering-harness` | `/en/projects/ai-engineering-harness` |
| AgentArena | `/projects/agentarena` | `/en/projects/agentarena` |
| Lab | `/lab` | `/en/lab` |
| Source experiment | `/lab/evidence-selection` | `/en/lab/evidence-selection` |
| Evaluation experiment | `/lab/evaluation-rules` | `/en/lab/evaluation-rules` |
| Writing | `/blog` | `/en/writing` |
| Shelf | `/collections` | `/en/collections` |
| Reading | `/reading` | `/en/reading` |
| About | `/about` | `/en/about` |
| Contact | `/contact` | `/en/contact` |
| Now | `/now` | `/en/now` |

All routes inherit the configured deployment prefix. Old article URLs, aliases, project fragments, notes, tag pages, search, résumé and the five repository lab records remain available. There is only one physical English writing index.

## Component boundaries

`src/components/studio` contains shared page templates and narrowly scoped browser widgets. `src/data/studio/curation.ts` holds editorial bilingual case notes separately from GitHub snapshots. `studio.css` supplies the shared presentation rules. Original article and résumé behavior is retained, with quieter article typography and a responsive table of contents.

The archive uses stable repository IDs. A deep link opens the archive, clears conflicting filters, scrolls to the target and moves keyboard focus to it. Article-directory and project filters keep their own URL parameters.

## Teaching fixtures

Source selection uses authored example excerpts A, B and C. Four nodes depend on A, B, A+B and C. Every one of the eight source combinations is checked. No source is presented as real Zhihu content.

Evaluation uses four fixed records. Completion-only accepts three, strict checks accept one. Outputs are unchanged when the rule changes. This is not a representative model benchmark.

The trace viewer is a teaching replay. It has no real timestamps, latency metrics or hidden model calls. Live provider integrations and real product-run captures are not part of this static-site change.

## Visual assets

Existing original character WebPs and the four bilingual Zhihu Threads illustrations are reused. The four case previews are localized HTML/CSS interface studies. They are labeled as diagrams, not product screenshots. Personal collection images keep their existing attribution and external destinations.

New language pairs do not require duplicate image text. Visible interface text stays in DOM content. Paper tones and amber signals keep separate light and dark contrast values. Unsupported evidence uses a dashed marker and text rather than reduced text opacity alone.

## Interaction review

Keyboard, focus, previous/next boundaries, checkbox combinations, filter reset, browser history, old fragments, clipboard success and clipboard failure are testable states. No automatic playback, pointer-following cursor, forced animation sequence or model request is introduced. Reduced motion disables non-essential transitions while preserving all controls.

The article table of contents uses one 767px boundary for CSS and behavior. Resizing into desktop clears mobile overlay state. Escape returns focus only when the panel is open. Tab stays inside the open mobile panel.

## Audit evidence

The existing 50 functional and reading regressions remain. The older language check for thirteen featured cards is updated to match the approved four-case design, paired with an exact assertion that all synchronized archive records remain. Language leak detection, original article URLs and all other language checks are preserved.

The new redesign test covers 360, 390, 768 and 1440px widths, both languages, source combinations, rule changes, trace controls, shelf filters and archive retention. Existing axe and Lighthouse checks continue. Reports must state failures and measurements without presenting automated checks as full accessibility certification.

Screenshots, full-page captures and reports are uploaded as workflow artifacts and delivered outside the repository. They are PR production previews, not screenshots of an already deployed redesign. Never include font files or private workspace content in evidence bundles.

## Content limits

The reading page contains references selected for this redesign, not an invented personal reading history. The Now page retains the original manual review date. A repository push is displayed separately and is not labeled as completed work. Article body translations, external account integration and real model evaluation are not fabricated to fill pages.
