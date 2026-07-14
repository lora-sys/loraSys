# Round 3 — Visual Regression Review · INK EDITION (墨刊)

Date: 2026-07-14 · Build: production (`pnpm run build` ✓) · 0 console errors on all routes.

## Awwwards self-review (6 × 10 = 52/60 → SHIP ≥ 48 ✓)

| Category | Score | Notes |
|----------|-------|-------|
| Composition | 9 | Masthead + asymmetric hero + contents-as-nav + editorial sections. No dashboard grid. |
| Typography | 9 | Fraunces high-contrast serif as the subject; huge display; CN section markers. |
| Color | 9 | Ink `#1A1815` / paper `#F3EFE6` / single vermilion `#C6412C` + grain + ink wash. Cohesive, distinct. |
| Motion | 8 | Seal stamp (GSAP), brush-underline titles (SVG), drifting ink canvas, scroll reveal, hover. |
| Originality | 9 | Ink-magazine hybrid (長安×ZINE): seal, edition system, folio, brush. Not a template. |
| Performance | 8 | Lighthouse mobile 81 (simulated); real load < 600 ms; canvas gated; fonts trimmed. |

## Judge questions

1. Breaks the dashboard layout? **Yes** — masthead + asymmetric hero + magazine contents.
2. Visual narrative? **Yes** — cover → self → work → hackathons → off-hours → contact, as a magazine issue.
3. Spatial layers? **Yes** — paper grain, ink-wash canvas behind editorial content, folio system.
4. Original visual language? **Yes** — ink + single vermilion + serif + seal + CN markers.
5. Meets art/editorial web bar? **Yes** for editorial; not a 3D showcase (by design — that path failed 4× before).
6. Templating risk? **Low** — nothing here reads as a Tailwind/SaaS starter.

## Reject-criteria pass

- Dark background / dark-tech look → **avoided** (paper base, mandatory).
- Xi'an/location theme in copy → **absent** (school name kept as factual bio only).
- Generic SaaS/template → **no**.
- Type as decoration → **no** (type is the subject).
- Work findable in 5s → **yes** (contents index + Selected Work section).
- Nav hidden → **no** (masthead + contents always present).
- CN font unsubset huge payload → **fixed** (system CJK serif; no webfont CJK).

## Performance detail (Lighthouse mobile, `/`)

| Metric | Value | Gate |
|--------|-------|------|
| Performance | 81 | ≥90 (see note) |
| FCP | 3.4 s | — |
| LCP | 3.9 s | < 2.5 s (see note) |
| TBT | ~10 ms | ✓ |
| CLS | 0.015 | ✓ |

**Note:** Numbers are Lighthouse *simulated 4× mobile throttle*. Actual network load
finishes < 600 ms; TBT ~0; the heavy `three`/Threlte bundle was removed. Lighthouse
flags **no significant opportunities** (only 110 ms unused CSS). Closing the last ~9
points to hit a literal 90 would need critical-CSS inlining or dropping
`@tailwindcss/typography` (used by /blog) — diminishing real-world return. Flagged for
a decision rather than force-fixed.

## Status

Design mandate complete: bold, original, recruiter-usable, consistent across all routes
(`/`, `/blog`, `/blog/[slug]`, `/now`, `/error`). Not pushed — awaiting go.
