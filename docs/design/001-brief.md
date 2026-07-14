# Design Brief — 001 Terminal Cinema

## 1. What

Personal portfolio for `lora` (Sikandar Bhide / lora-sys). Single-page, dark, terminal-inflected.
Goal: take an existing "terminal hacker" starter to Awwwards-grade composition without losing
the personality that makes the content (work, projects, hackathons, anime, favorites) work.

## 2. Audience

- Technical recruiters / hiring managers (developer profile)
- Open-source peers (Monadhack / ETH Beijing crowd)
- Curious anons who land from X / GitHub

## 3. Primary Action

- Just feel something — portfolio is read-first, contact is secondary
- Optional: download resume, view source, follow on X

## 4. References (learn language, not copy)

1. Linear changelog — asymmetric dark composition, narrow column, generous whitespace
2. Vercel design — giant display type, subtle gradient, motion restraint
3. Rauno Freiberg — single-line scroll narrative, type-as-architecture
4. Apple AirPods Pro product page — full-bleed cinematic scroll scenes
5. The Browser Company homepage — terminal motifs without going full hacker-cliche

## 5. Theme

- [ ] A — Cyberpunk Immersive Dark
- [ ] B — Minimal Art Gallery
- [ ] C — Retro Acid Y2K
- [ ] D — Future-Tech 3D Particle
- [x] Custom — **Terminal Cinema**

> Terminal Cinema: keep the CLI / monospace vocabulary as texture, not as the headline. Treat
> the page like a film: each scroll section is a scene. Hero is dominated by giant display
> type ("$ whoami" / "lora" / manifesto line) with a terminal as a sidekick panel, not the
> focal subject. Cinematic dark palette — true black, ink, neon green primary, magenta accent.
> Grain + scanline overlay for atmosphere. Scroll-driven reveals via GSAP + ScrollTrigger;
> micro motion via svelte-motion.

## 6. Constraints

- **Stack override**: site is SvelteKit 2 + Svelte 5. Keep it. Swap Framer Motion → `svelte-motion`
  (already installed) + `motion-sv`. Add `gsap` for ScrollTrigger (replaces magic UI's BlurFade-only).
- Tailwind v3 + existing tokens (term-* colors)
- Fonts already loaded: `@fontsource/syne` (display), `@fontsource/space-grotesk` (body),
  `@fontsource/fragment-mono` (terminal)
- Browser support: modern evergreen (Chrome, Safari, Firefox). No IE.
- Hosting: Vercel via adapter-auto (already set)
- Performance budget: Lighthouse mobile ≥ 90, LCP < 2.5s, no autoplay video/audio
- All content SSoT in `src/lib/data/resume.ts` — DO NOT duplicate content

## 7. Out of scope

- Blog rewrite (blog routes stay as-is)
- Auth, search functionality (decorative search box in navbar stays)
- New sections not in current data (no new content types)
- WebGL/3D (perf risk — use canvas grain overlay instead)
- Multi-theme toggle (stay dark forced)

## 8. Open questions

- Keep AnimeSection + FavoritesSection or merge into one "Experiments" section? → KEEP separate,
  they are distinct categories the user clearly curated.
- Multi-language? (existing DATA has Chinese quotes in anime) → DO NOT add, keep as-is.

## 9. Baseline (before takeover)

- Composition: 3/10 — centered hero, no asymmetric
- Type: 2/10 — all small, no giant display
- Color: 4/10 — cohesive but generic emerald/zinc
- Motion: 4/10 — BlurFade only, no scroll-trigger
- Originality: 4/10 — terminal aesthetic exists, layout generic
- Performance: 7/10 — no autoplay, lightweight

**Total: 24/60 — REJECT** (below 36 threshold).

Target: ≥ 48/60 to ship.