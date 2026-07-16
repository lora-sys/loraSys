# Iteration Log — INK EDITION (墨刊) · redo #5

Direction: 長安 ink-editorial elegance × ZINE magazine impact. Paper base, single
vermilion accent, Fraunces + Noto Serif SC. Supersedes archived FIELD/agent/spatial/cinema.

| Round            | Date       | Commit                | Focus                                                                                        | Awwwards | Notes                                               |
| ---------------- | ---------- | --------------------- | -------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------- |
| 0 (baseline)     | 2026-07-14 | `before-redo-5-field` | Archived half-built FIELD (5 depth layers overlapped, illegible)                             | ~10/60   | Diagnosed: 4 prior redos all dark-tech + unfinished |
| 1.1 skeleton     | 2026-07-14 | 545153c               | 6 sections wired to real data + masthead/contents nav, INK tokens, paper base                | —        | Build ✓, 0 console errors                           |
| 1.2 tokens       | 2026-07-14 | 405560c               | Fraunces Variable + Noto Serif SC + Archivo; optical sizing; seal→`lora`; grain + ink-wash   | —        | Real serif live                                     |
| 1.3 motion       | 2026-07-14 | 121f098               | Seal stamp (GSAP), brush-underline titles (SVG), ink-wash canvas, scroll reveal              | 47/60    | Round 1 macro complete                              |
| 2.1 hero         | 2026-07-14 | (this)                | Hero only: `P.01` folio + hairline, vermilion bloom behind headline, bigger Fraunces display | 49/60    | Anti-drift ✓ (more distinct, not generic)           |
| 2.2 work+contact | 2026-07-14 | —                     | Work rows hover-expand (vermilion edge/index/title), Contact climax (ghost 聯 + bloom)       | 50/60    | Content stays visible (recruiter-friendly)          |
| reskin           | 2026-07-14 | —                     | /now, /error, /blog, /blog/[slug] → INK; drop Threlte 3D from /error                         | —        | All routes consistent                               |
| 3 perf           | 2026-07-14 | —                     | Font trim: Fraunces full→standard, drop Noto SC + legacy fonts, prose→bio                    | —        | Lighthouse mobile 62 → 81; layout CSS 336KB → 92KB  |
| 3 review         | 2026-07-14 | —                     | Awwwards self-review + regression                                                            | 52/60    | SHIP ≥48 ✓ (perf 81 simulated; real <600ms)         |

## Awwwards self-score — Round 1 (47/60)

| Category    | Score | Note                                                                |
| ----------- | ----- | ------------------------------------------------------------------- |
| Composition | 8     | Asymmetric masthead + hero + contents index; breaks dashboard grid  |
| Typography  | 9     | Fraunces high-contrast serif as the subject; huge hero              |
| Color       | 8     | Ink / paper / single vermilion + grain + wash; cohesive, distinct   |
| Motion      | 7     | Seal stamp, brush draw, reveals, drifting ink — present, can deepen |
| Originality | 8     | Ink-magazine hybrid + seal + CN section markers; not template       |
| Performance | 7     | Canvas gated + fonts self-hosted; Lighthouse pending (Round 3)      |

Below the 48 ship gate by design — Round 2 (local refinement) + Round 3 (regression) to clear it.
