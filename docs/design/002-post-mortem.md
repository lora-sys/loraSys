# Post-mortem — Round 1 Cinema (REDO)

## What was the original brief?

Personal portfolio redesign to Awwwards-grade. Theme: "Terminal Cinema" (custom). Preserve
existing CLI/terminal motifs, layer cinematic asymmetric composition + giant type + scene-driven
narrative. Stack: SvelteKit + svelte-motion + gsap + tailwind.

## What got shipped instead?

A Terminal-Cinema-styled page that:

- Kept terminal motifs but reduced them to **scene labels** (`scene=0X /path`) — texture, not subject.
- Centered "lora" hero in a 2-col split, with terminal as a sidekick panel.
- Applied `clamp(2-7rem)` display type to all section headings (Trained at, Tools I reach for, Things I've built, I like building things, Say hello).
- Added a CSS-keyframe scroll-reveal wrapper + a canvas grain/scanline overlay.
- Scored **52/60** on Awwwards self-review.

## Why the gap?

User said "重新推翻现在的" + "非常有大胆创意". The Cinema direction was incremental — it kept the
existing terminal aesthetic and **enhanced** composition within it. That fits "takeover" but not
"redo". The user wants the terminal motif **gone**, replaced by something genuinely different and
visually louder. Cinema still looks like a developer portfolio with extra polish. The user wants
a *spatial* / *generative* / *3D-first* experience — not a styled-up dashboard.

Constraint that led to wrong direction: I picked a theme that *respected* the existing site
instead of *answering* "what should this site look like if it had never been built". Theme A
(Cinema) was a defensive choice. Theme D (Future 3D Particle) is the offensive answer.

## Decision

**REDO** to **Theme D — Future 3D Particle** (Generative Spatial variant):

- 3D scene as the canvas for the page, not as decoration on a 2D page.
- Hero: floating 3D "lora" text with vertex-displacement shader. Mouse-orbit camera.
- Sections become scene transitions — scroll = camera dolly + scene swap.
- Particle field as continuous background.
- WebGL heavy on hero + 2-3 key sections; flat / cinematic-2D fallback elsewhere.
- Mobile fallback: skip 3D, use 2D giant-type composition (still asymmetric, still bold).

## Constraint decisions

- Old cinema code → archived on `archive/before-redo-1-cinema` branch.
- New theme uses the existing SvelteKit + Svelte 5 + Tailwind stack; Threlte replaces
  Framer Motion's role for 3D, GSAP + ScrollTrigger for scroll-driven camera.
- Cinematic tone (dark, gradient accent, grain-friendly typography) carries over.
  What changes is the **dimension** — depth becomes load-bearing.