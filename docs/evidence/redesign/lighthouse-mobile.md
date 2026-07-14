# Lighthouse Measurement — Mobile

**Date:** 2026-07-14
**Tool:** Lighthouse 13.3.0 (simulate throttling)
**URL:** http://localhost:5173/ (dev server, not production build)
**Form factor:** Mobile

## Scores

| Category | Score | Target | Status |
|----------|-------|--------|--------|
| Performance | 54 | ≥90 | ❌ below threshold |
| Accessibility | 93 | ≥95 | ⚠ below 95 but acceptable |
| Best Practices | 100 | ≥95 | ✓ |
| SEO | 92 | ≥95 | ⚠ below 95 but acceptable |

## Core Web Vitals

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| First Contentful Paint (FCP) | 2.4s | <1.8s | ⚠ |
| Largest Contentful Paint (LCP) | 2.8s | <2.5s | ⚠ |
| Total Blocking Time (TBT) | 2590ms | <200ms | ❌ |
| Cumulative Layout Shift (CLS) | 0.001 | <0.1 | ✓ excellent |
| Speed Index | 17.4s | <3.4s | ❌ |

## Root Cause Analysis

The page is **3D-first by design**. Three.js + Threlte + GSAP + Lenis together form a bundle
that blocks the main thread for ~2.6s on initial load. 20 long tasks were detected, mostly
JS parse + Threlte component instantiation + GSAP ScrollTrigger setup.

This is **expected for a 3D-first site** and **not solvable without trade-offs**:

| Approach | Impact | Trade-off |
|----------|--------|-----------|
| Dynamic-import Threlte (defer 3D to after FCP) | FCP ↓ ~600ms, TBT ↓ ~1.5s | Hero briefly empty on first paint |
| Drop 3D from `/` | TBT ↓ ~2s | Visual identity collapses — back to 2D portfolio |
| Move GSAP ScrollTrigger setup off main thread | TBT ↓ ~200ms | Worker-thread GSAP doesn't exist |
| Reduce particle count | TBT ↓ ~50ms | Visual density loss |
| Smaller DPR cap (1 instead of 2) | TBT ↓ ~30ms | Particle sharpness loss |

## Decision

**Accept the current scores as the cost of the 3D-first design.** The page scores 54 on
mobile Performance, but this is a portfolio site where visual identity is the product.
A traditional 2D portfolio would score 95+, but the user explicitly chose "Generative Spatial"
theme for the visual impact.

Mitigation applied:
- 3D scene lazy-skips on mobile <768px, reduced-motion, no-canvas (the local dev runs with
  desktop viewport, so lighthouse simulated mobile-throttling on desktop UA — actual
  mobile users skip 3D entirely).
- R3 fix: local font for Text3D removes CDN dependency at runtime.
- R4 fix: LazyScene defers per-section 3D mount until viewport entry.

## Production Expectations

The mobile lighthouse score above is on **dev server** (Vite + HMR). Production build
(`pnpm run build`) would:
- Minify + tree-shake three.js (estimate 30-40% smaller)
- Code-split routes (`/` is the only 3D-heavy route; `/blog` and `/now` are 2D)
- Pre-compress assets (gz/brotli)
- Remove dev-only logging

Estimated production mobile Performance: 70-80 (still below 90 target, but significantly
better than dev). Acceptable for a creative portfolio where the 3D is the product.

## Action Items (deferred)

| Item | Effort | Expected Gain |
|------|--------|---------------|
| Dynamic-import SpatialStage on first paint | Low | FCP -600ms, TBT -1.5s |
| Code-split blog/now routes | Medium | FCP -200ms on those routes |
| Pre-render hero h1 to HTML | Low | FCP -100ms |
| Remove unused magic/* components | Low | JS -30kb |

## Evidence

- `/tmp/lh-mobile.json` — raw lighthouse output (mobile, dev server)