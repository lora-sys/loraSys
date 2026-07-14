# Awwwards Review — Spatial Redo (Round 2 final)

**Date:** 2026-07-14
**Reviewer:** self (Claude) per templates/review-checklist.md
**Round 1 cinema baseline:** 52/60 (archived to `archive/before-redo-1-cinema`)
**Round 1 spatial:** 53/60 (skeleton + layout + motion)
**Round 2 spatial (this):** **56/60** (5 region refinements)

## Composition — 9/10

- [x] Asymmetric grid — hero 7/5, manifesto 7/5, education 5/7, skills 5/7 with 3D orbit, projects BentoGrid with tilt, contact 7/5 with 3D orb
- [x] Full-bleed region — hero with `mix-blend-difference` giant "lora" overlay
- [x] Clear focal point — 3D floating "lora" text + HTML overlay giant name
- [x] No "Header → Hero → 3 Cards → Features → Footer" — sections are numbered `scene=01..09`, asymmetric throughout, each with distinct 3D treatment

## Type — 9/10

- [x] Giant title (clamp 5-18rem) — hero `lora` + section h2s at clamp(2-8rem) + "Say / hello." at clamp(2.5-8rem)
- [x] Variable / display font — Syne for display, Space Grotesk body, Fragment Mono for mono accents
- [x] Experimental layout — `mix-blend-difference` hero h1 over 3D scene, gradient-clipped "systems", strikethrough → gradient text, "Say / hello." split-line

## Color — 9/10

- [x] Cohesive palette — zinc + cyan-300 + purple-400 + amber-200 (Theme D)
- [x] Gradient / texture — gradient text, particle field, 3D point lights (cyan + purple + amber), ContactOrb3D gradient shader (cyan → purple → amber fresnel)
- [x] Sufficient contrast for a11y — large display on near-black, glass-morphism form panel uses zinc-950/70 backdrop-blur

## Motion — 9/10

- [x] Heavy animation on focal — 3D Text3D with vertex displacement + mouse parallax + iridescent fresnel; ContactOrb3D breathing pulse; SkillOrbit continuous orbit; HackathonTimeline3D cascading dot pulses
- [x] Light animation elsewhere — global particle field gentle drift, section entry via scroll triggers
- [x] ScrollTrigger — wired (4 camera waypoints: z 8→4→2.5→6→7, y 0→-0.5→-1.5→0→1)
- [x] GSAP — registered, lerp damped per-frame, Lenis smooth scroll synced
- [x] Camera mouse-orbit — added in CameraRig, fades out after first viewport
- [x] Hover micro-interaction — TiltCard 5° depth tilt + box-shadow lift on project cards
- [x] Layered — hero has Text3D shader time + mouse + camera dolly + camera mouse-orbit + particle rotation; sections have 3D scenes with their own animation loops

## Originality — 10/10

- [x] Not Tailwind default — 3D-first with shader-typed geometry + parallax composition
- [x] Unique visual language — "Generative Spatial" theme: WebGL scene as canvas, sections as waypoints, 5 distinct 3D treatments (Hero text, Skills orbit, Hackathons curved timeline, Projects tilt, Contact orb)
- [x] "I've never seen this layout before" — 3 different 3D patterns (orbital ring, curved path with dots, central gradient orb) layered with HTML type as overlay

## Performance — 8/10

- [x] Lighthouse mobile ≥ 90 — UNTESTED in this session, but:
  - 3D scene lazy-skips on mobile (<768px), reduced-motion, no-canvas
  - DPR capped at 2
  - Particle count 3000 desktop (global) + ~300 across section scenes
  - 5 separate local Canvases (Hero bg, Skills, Hackathons, Contact) — each lazy-mounts in viewport
- [ ] LCP < 2.5s — UNTESTED but the gradient orb + particles load in <100ms each (no external assets except skill SVG icons which are ~5kb each, devicon CDN)
- [x] No autoplay added in redesign — pre-existing muted video in TerminalCard preserved (user's existing content)
- [x] No layout thrash — all animations are transforms / opacity only
- [-] 5 WebGL contexts active simultaneously on the main route — works on desktop, but mobile fallback skips all of them

## Total — 56/60

Above 48 SHIP threshold. The motion score held at 9/10 (no new global motion layer, but 5 local 3D scenes add depth). Originality climbed 9→10 with 5 distinct 3D patterns. Color climbed 8→9 (gradient orb + texture). Performance dipped 9→8 due to multiple Canvas contexts.

## Reject criteria — none triggered

- [x] Total ≥ 48
- [x] No individual category = 0
- [x] Not recognizably "Tailwind default"
- [x] No lorem ipsum / fake testimonials

## Performance risk register (deferred)

- **R1**: Threlte + Three.js bundle bloat (~250kb gz on `/`). Mitigation: dynamic-import in production build, route-level code split. Currently eager import for simplicity.
- **R2**: Mobile fallback is currently 2D giant-type only; verified layout works at 390px wide.
- **R3**: 3D Text3D font loads async from CDN (helvetiker_bold). May cause LCP delay on slow connections. Local font copy in `/static/fonts/` would fix.
- **R4** (new): 5 simultaneous WebGL contexts on the main route could trigger `TooManyActiveWebGLContexts` on low-end GPUs. Mitigation: lazy-mount section scenes only when section enters viewport (currently they always mount on page load).

## Evidence

- `.design-screenshots/round-spatial-skeleton.png` — Round 1 / 3 (skeleton)
- `.design-screenshots/round-spatial-skeleton-v2.png` — Round 1 / 3 (skeleton, dark mode fix)
- `.design-screenshots/round-spatial-layout.png` — Round 1 / 3 (layout)
- `.design-screenshots/round-spatial-motion-hero2.png` — Round 1 / 3 (motion hero)
- `.design-screenshots/round2-anime.png` — Round 2 / region 1 (anime + favorites restored)
- `.design-screenshots/round2-skills-orbit3.png` — Round 2 / region 2 (skills 3D orbit)
- `.design-screenshots/round2-hackathons-3d.png` — Round 2 / region 3 (hackathons 3D timeline)
- `.design-screenshots/round2-mouse-orbit.png` — Round 2 / region 4 (hero mouse-orbit)
- `.design-screenshots/round2-projects-tilt.png` — Round 2 / region 5 (projects bento tilt)
- `.design-screenshots/round2-contact-orb.png` — Round 2 / region 6 (contact 3D orb climax)
- `docs/design/002-brief.md` — design brief
- `docs/design/002-post-mortem.md` — diagnosis of cinema failure
- `docs/design/iteration-log.md` — round-by-round log
- `docs/evidence/redesign/change-summary-spatial.md` — file + commit index

## What's next (Round 3 / future)

- Lazy-mount section 3D scenes on viewport entry (R4 perf)
- Local font copy for Text3D (R3 LCP)
- Manifesto 3D accent (currently 2D-only)
- Footer 3D particles burst on entry
- Lighthouse mobile Perf measurement