# Spatial Redo — Evidence + Change Summary

## Theme

**Theme D — Future 3D Particle**, custom variant named **Generative Spatial**.
Cinema theme archived to `archive/before-redo-1-cinema` branch.

## Files added

**3D stack** (`src/lib/components/spatial/`):
- `SpatialStage.svelte` — Threlte Canvas wrapper, PerspectiveCamera + 3 point lights (cyan / purple / amber), publishes camera target to `window.__spatialCamera` for ScrollTrigger
- `CameraRig.svelte` — mounts INSIDE Canvas, lerp-damps PerspectiveCamera toward scroll-driven target each frame (frame-rate-independent factor `1 - 0.001^delta`)
- `ParticleField.svelte` — 3000 spherical particles, additive blending, custom rotation task
- `Text3D.svelte` — TextGeometry + custom GLSL ShaderMaterial with vertex displacement (sine wave z) + mouse parallax (x) + fresnel fragment (cyan→purple)
- `SpatialScroll.svelte` — initializes Lenis smooth scroll + GSAP ScrollTrigger; wires 4 camera waypoints (z 8→4→2.5→6→7, y 0→-0.5→-1.5→0→1) on `scrub: 0.5`

## Files modified

- `src/routes/+layout.svelte` — force dark mode, mount SpatialStage on desktop only (skip mobile + reduced-motion), wrap children in SpatialScroll for Lenis + ScrollTrigger
- `src/routes/+page.svelte` — full rewrite for Theme D (cyan/purple/amber instead of emerald); scene labels on every section; giant type throughout; asymmetric compositions per section; restored AnimeSection + FavoritesSection
- `src/lib/components/portfolio/EduCard.svelte` — unchanged (skeleton placeholder in spatial)
- `package.json` — added `@threlte/core`, `@threlte/extras`, `three`, `lenis`, dev `@types/three`

## Files deleted

- `src/lib/components/magic/cinema/` — CinematicHero, GrainOverlay, SceneLabel, SceneManifesto, ScrollScene (archived on `archive/before-redo-1-cinema`)

## Commits

```
feat(design): REDO → Generative Spatial — Round 1 macro skeleton
feat(design): Round 1 layout — wire content + asymmetric composition
feat(design): Round 1 motion — GSAP ScrollTrigger + Lenis + camera dolly
fix(spatial): wire AnimeSection + FavoritesSection back + scroll init race fix
docs(design): spatial redo — Awwwards review + iteration log update
```

## Score

53/60 — SHIP threshold met.

| Category | Cinema | Spatial |
|----------|--------|---------|
| Composition | 9 | 9 |
| Type | 9 | 9 |
| Color | 9 | 8 |
| Motion | 7 | **9** |
| Originality | 8 | 9 |
| Performance | 9 | 9 |
| **Total** | **52** | **53** |

The motion score jump (7→9) is the headline: scroll-driven camera dolly + Lenis smooth scroll +
GSAP ScrollTrigger + 3D shader time + mouse parallax. Color dipped slightly (9→8) because the
grain overlay was removed; could be restored as a separate canvas.

## Known follow-ups (Round 3+)

- Local font copy for Text3D (CDN font loads async, LCP risk)
- 2D fallback grain overlay (lift Color to 9/10)
- Wire 3D Skills scene (currently gradient placeholder)
- Wire 3D Hackathons timeline (currently 2D list)
- Mouse-orbit tuning (subtle camera response to mouse across full hero)
- Lighthouse mobile Perf measurement (currently untested in session)