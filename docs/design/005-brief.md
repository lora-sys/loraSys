# Design Brief — 005 FIELD

## 1. What

Personal portfolio for `lora` (Sikandar Bhide). Single infinite canvas.
**5 depth layers replace 5 sections.** Theme is **FIELD** (custom).

## 2. Audience

- Creative-technical hiring managers (recognize the bold move)
- Open-source peers (Monad / ETH Beijing crowd)
- Anons from X / GitHub (need the "what the fuck is this" reaction)

## 3. Primary Action

- Move the mouse → feel the parallax
- Click a node → see it expand
- Scroll → travel through depth
- Secondary: click through to project / blog / mailto

## 4. References

1. Active Theory — single immersive scene, mouse-reactive
2. Refik Anadol — generative depth + atmosphere
3. Pentagram — typographic restraint, art-direction-first
4. Bruno Simon — 3D world navigation
5. Apartamento / Wallpaper — editorial type restraint

## 5. Theme

- [ ] A — Cyberpunk
- [ ] B — Minimal Gallery
- [ ] C — Retro Acid
- [ ] D — Future 3D Particle
- [x] Custom — **FIELD**

> The page is one infinite dark canvas. No chrome. No nav. No section
> titles. Portfolio content lives as ~12 typographic nodes scattered
> across 5 depth layers. Scroll = travel through depth. Click a node =
> it explodes into the center; everything else fades to 10%.

## 6. Constraints

- **Stack**: SvelteKit 2 + Svelte 5 runes + Threlte + GSAP + Tailwind v3.
  No Lenis (we write the depth tween). No BentoGrid. No card grids.
- **3D budget**: 1 Three.js scene. ≤50 particles. Background only.
- **Type**: 5 depth-token sizes (25vw / 8vw / 4vw / 3vw / 6vw).
- **Cursor**: custom. 4px dot. Magnify on hover over node.
- **Audio**: Web Audio API, gated behind user gesture. No autoplay.
- **Mobile**: vertical scroll. Each layer becomes a full-width section.
  Static depth, no 3D. Node click still works.
- **Perf**: Lighthouse mobile ≥ 80. `/` JS gz ≤ 200kb.

## 7. Out of scope

- Blog content edits
- Auth, search, i18n
- New sections beyond 5 depth layers
- BentoGrid, card grids, badges, ribbons
- Multiple Three.js scenes
- Auto-playing audio / video
- Section headers / navigation menus

## 8. Per-depth-layer plan

### Layer 0 — MANIFEST (closest, sharpest)
- Single hero claim, 25vw, white: `I BUILD SYSTEMS THAT LEARN.`
- 1 secondary node: `READ →` (links to a "primer" or stays blank)
- Subtle scroll cue bottom-right: `↓ enter field`

### Layer 1 — SELF (mid-distance)
- 4 nodes:
  - `LORA · XI'AN · 2026` (8vw)
  - `BUILDING SYSTEMS · AGENTS · DX` (mono)
  - `STACK: TS · SVELTE · THREE · AGENTS · ZK` (mono)
  - `103 PUBLIC REPOS` (mono)

### Layer 2 — WORK (distant, drifting)
- 7 nodes, one per project:
  - `01 · MONADHACK-AGENTS →`
  - `02 · NEW-TUBE →`
  - ... (one line per project from DATA.projects)
- Click any → node explodes → reveals 3-line project blurb + link

### Layer 3 — IDEAS (deepest, faintest)
- 4 nodes: blog posts + /now
  - `ON BUILDING AGENTS →`
  - `/NOW →`
  - `READING: REFİK ANADOL →`
  - `VIBING: HANIA RANI →`

### Layer 4 — REACH (deepest, but slightly sharper)
- 3 nodes:
  - `WRITE ME.` (6vw)
  - `LORASYS@OUTLOOK.COM →` (mailto)
  - `@LORA_SYS →` (X link)

## 9. Interaction model

| Input | Result |
|-------|--------|
| Move mouse | Whole field tilts ±4° (parallax) |
| Scroll | Z-axis travel through 5 layers (depth = scroll progress) |
| Hover node | Node grows 1.04x, kerning tightens, cursor magnifies |
| Click node | Node explodes to center; siblings fade to 10% opacity |
| ESC / click again | Node folds back; siblings return |
| Spacebar | Cycle through 3 closest-layer nodes in sequence |

## 10. Performance budget

| Route | 3D | JS gz | Lighthouse mobile |
|-------|----|----|-------------------|
| `/` | 1 scene, ≤50 particles | ≤200kb | ≥80 |
| `/blog` | 0 | ≤80kb | ≥95 |
| `/blog/[slug]` | 0 | ≤80kb | ≥95 |
| `/now` | 0 | ≤60kb | ≥95 |
| 404 | 0 | ≤60kb | ≥95 |

## 11. Reject criteria

- Looks like "another 3D floating portfolio" → fail
- Has nav menu, chrome, or section headers visible → fail
- Type is decoration, not the content → fail
- Nodes are buttons / cards / badges → fail
- Scroll feels like vertical section scrolling (not depth travel) → fail
- Mouse parallax imperceptible → fail
- Mobile fallback is just a desktop scaled-down → fail
- Lighthouse mobile < 80 → fail
- Total Awwwards checklist < 48 → fail