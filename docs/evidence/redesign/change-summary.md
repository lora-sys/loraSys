# Redesign Evidence — Terminal Cinema

## Files changed

**New cinema components:**
- `src/lib/components/magic/cinema/CinematicHero.svelte` — split hero with giant display type + terminal sidekick
- `src/lib/components/magic/cinema/SceneManifesto.svelte` — giant pull-quote + meta dl sidebar
- `src/lib/components/magic/cinema/SceneLabel.svelte` — CLI-style section labels
- `src/lib/components/magic/cinema/ScrollScene.svelte` — CSS-keyframe scene reveal wrapper
- `src/lib/components/magic/cinema/GrainOverlay.svelte` — canvas grain + scanlines + vignette

**Modified:**
- `src/routes/+layout.svelte` — drop GridPattern + Meteors, mount GrainOverlay, drop max-w-5xl
- `src/routes/+page.svelte` — use CinematicHero, SceneManifesto, ScrollScene wrappers; bento projects; hackathons timeline
- `src/lib/components/portfolio/EduCard.svelte` — column width fix
- `package.json` / `pnpm-lock.yaml` — add `gsap`

## Screenshots

Pre-redesign baseline:
- `.design-screenshots/before-takeover/desktop-viewport.png`
- `.design-screenshots/before-takeover/desktop-full.png`

Round 1 (macro):
- `.design-screenshots/round-1-hero-desktop.png`
- `.design-screenshots/round-1-full-desktop.png`

Round 2 (local refinement):
- `.design-screenshots/round-2-manifesto-viewport.png`
- `.design-screenshots/round-2-edu.png`
- `.design-screenshots/round-2-skills.png`
- `.design-screenshots/round-2-projects2.png`
- `.design-screenshots/round-2-projects-bento.png`
- `.design-screenshots/round-2-hackathons-timeline3.png`
- `.design-screenshots/round-2-hackathons-timeline4.png`
- `.design-screenshots/round-2-contact2.png`
- `.design-screenshots/round-2-mobile-hero.png`

## Score

52/60 — SHIP threshold met. See `review-checklist.md` for category breakdown.

## Known follow-ups

- Wire `gsap` ScrollTrigger for hero type parallax + section title clip-path reveals
  (motion score gap: 7/10 → could hit 9/10 with this)
- Replace `drwxr-xr-x` static labels with dynamic permission display
- Add a "now playing" / live status widget to hero (current Spotify track or build status)
- Consider Lenis smooth scroll if Lighthouse perf score leaves room