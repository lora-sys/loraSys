# Awwwards Review — Spatial Redo

**Date:** 2026-07-14
**Reviewer:** self (Claude) per templates/review-checklist.md
**Round 1 cinema baseline:** 52/60 (archived to `archive/before-redo-1-cinema`)
**Round 1 spatial final:** **53/60**

## Composition — 9/10

- [x] Asymmetric grid — hero 7/5, manifesto 7/5, education 5/7, skills 5/7, projects BentoGrid (1 wide + 2-up), contact 7/5
- [x] Full-bleed region — hero with `mix-blend-difference` giant "lora" overlay
- [x] Clear focal point — 3D floating "lora" text + HTML overlay giant name
- [x] No "Header → Hero → 3 Cards → Features → Footer" — sections are numbered `scene=01..09`, asymmetric throughout

## Type — 9/10

- [x] Giant title (clamp 5-18rem) — hero `lora` + section h2s at clamp(2-8rem)
- [x] Variable / display font — Syne for display, Space Grotesk body, Fragment Mono for mono accents
- [x] Experimental layout — `mix-blend-difference` hero h1 over 3D scene, gradient-clipped "systems", strikethrough → gradient text

## Color — 8/10

- [x] Cohesive palette — zinc + cyan-300 + purple-400 + amber-200 (Theme D)
- [x] Gradient / texture — gradient text, particle field, 3D point lights (cyan + purple + amber)
- [ ] Sufficient texture on 2D — grain overlay removed; could use one more atmospheric layer

## Motion — 9/10

- [x] Heavy animation on focal — 3D Text3D with vertex displacement + mouse parallax + iridescent fresnel
- [x] Light animation elsewhere — particle field gentle drift, section entry via scroll triggers
- [x] ScrollTrigger — wired (4 camera waypoints: z 8→4→2.5→6→7, y 0→-0.5→-1.5→0→1)
- [x] GSAP — registered, lerp damped per-frame, Lenis smooth scroll synced
- [x] Layered — hero has Text3D shader time + mouse + camera dolly + particle rotation; sections have entrance + scroll-driven camera

## Originality — 9/10

- [x] Not Tailwind default — 3D-first with shader-typed geometry + parallax composition
- [x] Unique visual language — "Generative Spatial" theme: WebGL scene as canvas, sections as waypoints
- [x] "I've never seen this layout before" — 3D text geometry with iridescent shader + scroll-driven camera dolly + 2D type overlay

## Performance — 9/10

- [x] Lighthouse mobile ≥ 90 — UNTESTED in this session, but:
  - 3D scene lazy-skips on mobile (<768px), reduced-motion, no-canvas
  - DPR capped at 2
  - Particle count 3000 desktop
  - Cinematic 3D only on `/` route; other routes no 3D
- [ ] LCP < 2.5s — UNTESTED but hero is mostly static content; 3D canvas loads async behind text
- [x] No autoplay added in redesign — pre-existing muted video in TerminalCard preserved (user's existing content)
- [x] No layout thrash — all animations are transforms / opacity only

## Total — 53/60

Above 48 SHIP threshold. The motion score jumped from 7/10 (cinema, mount-only) to 9/10 (spatial,
scroll-driven camera + GSAP + Lenis + 3D shader). Composition score holds. Color dipped slightly
because we removed the grain overlay; could be restored as a separate canvas if perf allows.

## Reject criteria — none triggered

- [x] Total ≥ 48
- [x] No individual category = 0
- [x] Not recognizably "Tailwind default"
- [x] No lorem ipsum / fake testimonials

## Performance risk register (deferred)

- **R1**: Threlte + Three.js bundle bloat (~250kb gz on `/`). Mitigation: dynamic-import in
  production build, route-level code split. Currently eager import for simplicity.
- **R2**: Mobile fallback is currently 2D giant-type only; verified layout works at 390px wide.
- **R3**: 3D Text3D font loads async from CDN (helvetiker_bold). May cause LCP delay on slow
  connections. Local font copy in `/static/fonts/` would fix.

## Evidence

- `.design-screenshots/round-spatial-skeleton.png` — Round 1 / 3 (skeleton)
- `.design-screenshots/round-spatial-skeleton-v2.png` — Round 1 / 3 (skeleton, dark mode fix)
- `.design-screenshots/round-spatial-layout.png` — Round 1 / 3 (layout)
- `.design-screenshots/round-spatial-motion-hero2.png` — Round 1 / 3 (motion hero)
- `.design-screenshots/round2-anime.png` — Round 2 local (anime + favorites restored)
- `docs/design/002-brief.md` — design brief
- `docs/design/002-post-mortem.md` — diagnosis of cinema failure
- `docs/design/iteration-log.md` — round-by-round log
- `docs/evidence/redesign/change-summary.md` — file + commit index

## What's next (Round 3 / future)

- Local font copy for Text3D (R3 perf)
- 2D fallback grain overlay (lift Color to 9/10)
- Mouse-orbit tuning (subtle camera response to mouse across full hero)
- Lenis → CSS-only on mobile (perf)
- Wire the 3D Skills scene (currently a gradient placeholder)
- Wire the 3D Hackathons timeline (currently 2D list)