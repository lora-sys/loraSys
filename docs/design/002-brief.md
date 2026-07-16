# Design Brief — 002 Generative Spatial

## 1. What

Personal portfolio for `lora` (Sikandar Bhide). WebGL-first redesign: the page is a 3D scene
the user navigates, not a 2D page with effects on top. Theme D — Future 3D Particle.

## 2. Audience

- Technical recruiters / hiring managers (developer profile)
- Open-source peers (Monad / ETH Beijing crowd)
- Curious anons who land from X / GitHub

## 3. Primary Action

- Just feel something — portfolio is read-first, contact is secondary
- Optional: download resume, follow on X, view source

## 4. References

1. Linear changelog hero — 3D gradient mesh, restrained type
2. Vercel design — giant display, gradient accents
3. Rauno Freiberg — single-line scroll narrative, type-as-architecture
4. Apple Vision Pro product page — cinematic scroll, 3D model on canvas
5. Resend homepage — particle field, technical taste

## 5. Theme

- [ ] A — Cyberpunk Immersive Dark
- [ ] B — Minimal Art Gallery
- [ ] C — Retro Acid Y2K
- [x] D — Future-Tech 3D Particle _(adapted: "Generative Spatial")_

> Generative Spatial: the page is a 3D scene. Hero floats a giant "lora" text in space, lit by
> a moving volumetric light. Mouse moves the camera. Scroll pulls the camera forward through a
> particle field. Each section is a waypoint — manifesto, projects, skills, contact — anchored
> in space and revealed as the camera reaches them. Mobile: 2D fallback with the same giant
> type / asymmetric composition but no WebGL.

## 6. Constraints

- **Stack override**: site is SvelteKit 2 + Svelte 5. Keep it. Map the spec's R3F + drei to
  Threlte. Framer Motion → `svelte-motion`. Three.js for raw Three classes (text geometry,
  shaders).
- Tailwind v3 + existing tokens; add a small palette extension for the 3D scene accents.
- Fonts already loaded: `@fontsource/syne` (display), `@fontsource/space-grotesk` (body),
  `@fontsource/fragment-mono` (terminal accents kept for nav).
- **Performance budget**:
  - Particle count: ≤ 3000 on desktop, ≤ 800 on mobile
  - 3D scene lazy-initializes after first paint; paused when off-screen via IntersectionObserver
  - 3D scene skipped entirely on `prefers-reduced-motion: reduce` and on viewports < 768px
  - DPR capped at 2
  - Lighthouse mobile Performance ≥ 85 (3D tradeoff; A11y / Best Practices / SEO ≥ 95)
- Hosting: Vercel via adapter-auto (already configured)

## 7. Out of scope

- Blog post writing (existing posts stay as-is; only the route's visual shell changes)
- Auth, search functionality (decorative nav stays)
- New sections not in current data (no new content types)
- WebGL raymarching / fluid sim (perf risk; use procedural particle + simple displacement)
- Light/dark toggle (stay dark forced)

## 8. Open questions

- Should the 3D hero text be the literal name `lora` or a stylized monogram (e.g. `L.` or
  symbol-like)? → Use `lora` (literal, matches DATA.name, type-as-hero principle).
- For projects, render each project as a floating 3D card the camera flies past, OR keep
  projects as 2D overlay and use 3D only for bg/particle field? → Floating 3D cards
  (one-card-per-project, each at a depth, camera pulls past them as user scrolls).
- Maintain blog's existing serif typography or migrate blog posts to display + mono? →
  Migrate: blog uses Syne display headings + Space Grotesk body, consistent with rest of site.

## 9. Round 0 → Round 1 target

- Round 0 (cinema, archived): 52/60 — composition good, motion acceptable, no 3D.
- Round 1 target: ≥ 54/60 — add WebGL, push motion to 9/10 via scroll-driven camera + scene
  transitions. Awwwards ceiling stays ~58 unless we add sound design or unique shaders.

## 10. Per-page plan

### 10.1 `/` — main portfolio (most impact)

**Composition**: 3D scene as background; HTML content layers on top with `mix-blend-mode: difference`
on hero only.

**Sections** (each = a waypoint in 3D space):

1. **Hero (scene 01 / lora)**
   - Full-bleed, no nav background (transparent)
   - 3D: giant "lora" text floating center, vertex displacement shader (sine wave driven by
     time + mouse), iridescent material (cyan/purple gradient driven by view angle)
   - 3D: particle field bg (3000 particles, mouse-reactive)
   - HTML overlay: scene label `scene=01 / lora`, REC dot + city indicator top-right,
     `$ whoami` + manifesto line + social pills bottom-left, "scroll" cue bottom-right
   - Mouse: subtle camera orbit (max 5° yaw, 3° pitch)
   - Scroll: camera dollies forward from z=5 to z=2 over hero height

2. **Manifesto (scene 02 / credo)**
   - 3D: particle field continues; particles denser here
   - HTML: asymmetric 7/5 split. Left: giant display pull-quote with one word gradient-clipped.
     Right: meta dl (base / craft / focus / repos / hackathons) + summary prose.
   - Scroll: camera tilts down 5° on entry

3. **Education (scene 03 / trained)**
   - 3D: subtle particle thinning (clearing)
   - HTML: giant "Trained at." title left, single timeline row right (uses existing EduCard,
     fix width)
   - SSoT: `DATA.education` — currently 1 entry

4. **Skills (scene 04 / tools)**
   - 3D: floating skill icons as 3D meshes orbiting a central anchor point (subtle, slow rotation)
   - HTML: 5/7 split. Left: title + 1-line description. Right: 3D scene fills right column.
   - Skill badges as static list below 3D scene.

5. **Projects (scene 05 / built)** — most ambitious
   - 3D: each project = a floating 3D card with thumbnail texture. 7 projects spaced in z-axis
     from camera. Camera dolly stops at each card on scroll-snap.
   - HTML: title "Things I've built." sticks left, current project title overlay on the
     active card. Click card → navigate to project href.
   - On mobile: 2D fallback, list of TerminalCard components.

6. **Hackathons (scene 06 / events)**
   - 3D: each hackathon = a glowing dot on a curved 3D timeline path
   - HTML: title + description + vertical list overlay
   - SSoT: `DATA.hackathons`

7. **Anime + Favorites (scene 07-08 / culture)**
   - 3D: bg shifts to warmer color (subtle amber tint)
   - HTML: keep existing AnimeSection (carousel) and FavoritesSection; just re-style
   - These sections feel like a breath — slower scroll, gentler motion

8. **Contact (scene 09 / hello)**
   - 3D: particle field densifies dramatically; bg color shifts to amber/magenta gradient
   - HTML: giant "Say / hello." with gradient on "hello.", split layout with form on right

9. **Footer (scene 10 / end_credit)**
   - 3D: 3D scene fades to black
   - HTML: social icons + © line + small "Built with lora" signature

**3D scene management**: one `<Canvas>` mounted at root (`+layout.svelte`), camera state shared
across sections, scene composition reactive to current section index (driven by scroll position

- IntersectionObserver). Render pause when scene off-screen.

### 10.2 `/blog` — blog list

**Composition**: smaller, but same visual language. No 3D scene (route is secondary; reserve
3D budget for `/`).

- Hero: thin — scene label + giant "Writing." (Syne clamp 4-8rem) + subtitle, one-line
  description, count of posts. Asymmetric — title pulled left, count + filter right.
- Post list: each post is a horizontal card (full-width row, not stacked columns), with:
  - Date column (left, mono)
  - Title + description (center, display type for title)
  - Categories (right, badges)
  - Hover: gradient line sweeps across the row, title shifts to gradient color
- Empty state: 3D wireframe grid as bg with "No posts yet" text overlay
- Footer: same as `/`

### 10.3 `/blog/[slug]` — blog post

**Composition**: editorial layout. Two-column reading frame.

- Top: scene label + post title (clamp 2-5rem) + date + categories. Asymmetric — title full-width,
  meta below in 3-col strip (date / read time / categories).
- Body: max-w-prose centered column, generous line-height (1.7), code blocks with Shiki vesper
  theme (existing), inline images full-bleed (break out of prose column).
- Footer of post: related posts (3 cards horizontal) + "← back to /blog" link
- Right edge: scroll progress bar (vertical, thin, gradient)
- 3D: NONE on this route (focus on reading)

### 10.4 `/now` — what I'm doing now

**Composition**: status-page aesthetic, vertical timeline.

- Top: scene label + giant "/now" (display, clamp 4-8rem)
- Sections (each = a card, vertical stack, asymmetric internal layout):
  - Currently Building (list of projects, status pills)
  - Currently Learning (list of topics, links)
  - Currently Reading (book/article list)
  - Currently Vibing (music — auto-detected from Spotify API or manual)
- Update mechanism: file-based (edit `/src/content/now.md` or similar), versioned
- 3D: NONE — keep this page quiet, focused on the content

### 10.5 `/api/*` — JSON/RSS/sitemap endpoints

No visual change. These routes return data; not user-facing. Leave as-is.

### 10.6 404 / error page

- Full-bleed dark page with floating 3D shape (broken geometry, glitched shader)
- "404 / page not found" giant display + "← back home" link
- 3D: minimal — broken/fragmented mesh with displacement shader, slow rotation

### 10.7 PWA manifest, service worker

No change. Workbox-generated `sw.js`, existing manifest.json.

## 11. Performance budget per route

| Route          | WebGL         | Particle count            | DPR cap | Initial JS |
| -------------- | ------------- | ------------------------- | ------- | ---------- |
| `/`            | yes           | 3000 desktop / 800 mobile | 2       | ~250kb gz  |
| `/blog`        | no            | —                         | —       | ~150kb gz  |
| `/blog/[slug]` | no            | —                         | —       | ~150kb gz  |
| `/now`         | no            | —                         | —       | ~80kb gz   |
| 404            | yes (minimal) | 200                       | 1.5     | ~200kb gz  |

## 12. Risk register

- **R1**: Threlte + Three.js bundle bloat (~150kb gz). Mitigation: dynamic import, code-split
  `/` route only.
- **R2**: 3D scene CPU/GPU spike on low-end mobile. Mitigation: DPR cap, particle count
  reduction, 2D fallback < 768px.
- **R3**: Scroll-triggered camera dolly can feel nauseating. Mitigation: short distance (z 5→2),
  ease-in-out, opt-out via `prefers-reduced-motion`.
- **R4**: Mixing `mix-blend-mode` on hero with grain overlay = potential readability collapse.
  Mitigation: grain stays as a separate `<canvas>` layer, blend-mode only on the 3D canvas,
  not on text.
- **R5**: Section waypoints don't align with scroll position on tall viewports. Mitigation:
  snap based on section center, allow ±15% scroll slack.

## 13. Reject criteria (from review-checklist)

- Total < 48 → back to Round 2
- Any individual category = 0 → redo, not refine
- Lighthouse mobile Performance < 85 → ship block, optimize 3D
- LCP > 4s on 4G mid-range mobile → ship block
- Generic particle sphere / generic shader cliché → redo hero scene
