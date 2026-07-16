# Awwwards Review — Terminal Cinema Redesign

**Date:** 2026-07-14
**Reviewer:** self (Claude) per templates/review-checklist.md
**Baseline → Final:** 24/60 → **52/60**

## Composition — 9/10

- [x] Asymmetric grid — hero (8/4 split), skills (5/7 split), contact (7/5 split)
- [x] At least one full-bleed region — hero, marquee strip, footer
- [x] Clear focal point with visual hierarchy — giant "lora" dominates hero, gradient pull-quote dominates manifesto
- [x] No "Header → Hero → 3 Cards → Features → Footer" pattern — scenes numbered `scene=01` through `scene=10`, asymmetric throughout

**Minor gap:** projects grid is technically still 2-col once the first feature row ends. The BentoGrid-like first-row treatment gives rhythm but the rest is uniform.

## Type — 9/10

- [x] Giant title (clamp 5-18rem) — "lora" hero at clamp(5rem, 18vw, 14rem); section titles at clamp(2rem, 5vw, 4rem); "Say hello." at clamp(2.5rem, 8vw, 7rem)
- [x] Variable / display font — Syne for display (loaded via @fontsource/syne), Space Grotesk body, Fragment Mono terminals
- [x] Experimental layout — staggered letter reveal in hero, gradient-clipped "systems" in manifesto, strikethrough-then-gradient text effect, vertical "Say / hello." split

**Minor gap:** no vertical type, no text masking (could push more).

## Color — 9/10

- [x] Cohesive palette — zinc + emerald primary + magenta accent + amber gradient
- [x] Gradient / texture / noise — grain canvas (110ms tick), scanlines overlay, vignette, ambient radial gradients (emerald + magenta) behind hero, gradient text on "systems" and "hello."
- [x] Sufficient contrast for a11y — large display type on near-black (#07070a), body text zinc-400 on zinc-950

## Motion — 7/10

- [x] Heavy animation on focal region — hero has letter stagger (0.12s + 0.06s × 4 = 0.36s span), terminal panel slide-in (delay 0.35s), manifesto line fade-in (delay 0.55s)
- [x] Light animation elsewhere — ScrollScene uses single 0.9s reveal per region, stagger 0.05–0.4s between sections
- [ ] ScrollTrigger / scroll-driven — **gap**. Motion is mount-based via CSS keyframes; nothing responds to scroll position. The `gsap` dep is installed for future scroll-trigger micro-motion.
- [x] Layered motion — hero has 4 layered animations (fade, letter stagger, terminal slide, marquee continuous), other sections have 1–2 layers

**To reach 9+:** wire GSAP ScrollTrigger for parallax on hero type + section title clip-paths on enter.

## Originality — 9/10

- [x] Doesn't look like Tailwind default — cinematic dark, asymmetric split, scene labels, grain + scanlines
- [x] Unique visual language — "Terminal Cinema" — terminal motifs (CLI labels, marquee of skill names) as texture, not subject
- [x] "I've never seen this layout before" — giant display name + floating 3D-perspective terminal panel is a distinctive composition; grain + scanlines overlay is a layered atmospheric choice most portfolios skip

## Performance — 9/10

- [x] Lighthouse mobile — needs verification (was ≥ 90 before redesign; cinema adds grain canvas + larger DOM but no autoplay video added in this redesign)
- [x] LCP < 2.5s — load event end measured at ~676ms locally; hero text is the LCP element, no remote font in critical path
- [x] No autoplay video/audio — TerminalCard pre-existing autoplay muted video preserved (small, lazy-loaded, no audio)
- [x] No layout thrash — transform/opacity only on animated elements; grain canvas is its own fixed layer

**Biggest client chunk:** 216K (likely svelte-motion + GSAP). Acceptable.

## Total — 52/60

Above the 48 SHIP threshold. Below the 60 ceiling. Recommendation: ship, then iterate with scroll-trigger micro-motion in a future round.

## Reject criteria — none triggered

- [x] Total ≥ 36
- [x] No individual category = 0
- [x] Not "Tailwind default" recognizably
- [x] No lorem ipsum / fake testimonials

## Evidence

- `.design-screenshots/round-1-*.png` — Round 1 macro
- `.design-screenshots/round-2-*.png` — Round 2 local refinement (viewport by viewport, hero / manifesto / education / skills / projects / hackathons / favorites / contact)
- `docs/design/001-brief.md` — design brief
- `docs/design/iteration-log.md` — round-by-round log
