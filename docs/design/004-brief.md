# Design Brief — 004 AGENT

## 1. What

Personal portfolio for `lora` (Sikandar Bhide). The website **is** an
agent — it greets, observes, responds, has state. Theme is **AGENT**
(custom — not in spec §4 list).

## 2. Audience

- Creative-technical hiring managers (recognize the meta-move)
- Open-source peers (Monad / ETH Beijing crowd)
- Anons from X / GitHub (need the "wait, it's talking to me" reaction)

## 3. Primary Action

- Feel something — the work IS the site
- Secondary: ask about work / read a post / send mail

## 4. References

1. Bruno Simon — drive-through 3D world
2. Active Theory — single immersive scene, mouse-reactive
3. Refik Anadol — generative art as the page
4. Yatzer — editorial typography restraint
5. Cavalier — fashion site single product hero

## 5. Theme

- [ ] A — Cyberpunk
- [ ] B — Minimal Gallery
- [ ] C — Retro Acid
- [ ] D — Future 3D Particle
- [x] Custom — **AGENT**

> The page is not "decorated with agent metaphors". The page IS an
> agent. Single bold thesis. Every interaction makes it respond.
> Typewriter text is its speech. The orb is its body. The status
> bar is its heartbeat. The rooms are its memories.

## 6. Constraints

- **Stack**: SvelteKit 2 + Svelte 5 runes + Threlte + GSAP + Web Audio
  API + Tailwind v3. No Lenis. No BentoGrid. No card grids.
- **3D budget**: 1 Three.js scene, single canvas. Orb + 7 voxels only.
- **Sound**: Web Audio API. Muted by default. Speaker icon toggle.
  Zero autoplay.
- **Type**: typewriter is the only text reveal. No fade-up, no
  BlurFade, no slide-in.
- **Cursor**: custom. 4px dot default. Orbital near orb. Text-bar
  near type. Ripple on click.
- **Mobile**: vertical scroll fallback. Static orb (CSS, no Three.js).
  Typewriter retained. Audio disabled. No orbital cursor.
- **Perf**: Lighthouse mobile ≥ 80. `/` JS gz ≤ 200kb.

## 7. Out of scope

- Blog content edits
- Auth, search, i18n
- New sections beyond the 6 rooms
- BentoGrid, card grids, badges, ribbons
- Particle fields
- Multiple Three.js scenes
- Auto-playing audio / video

## 8. Per-room plan (6 rooms, single 3D scene)

### Room 01 — MANIFEST (entry, always loaded)
- Black void. 3D orb, breathing (sin pulse).
- Status: `[ LORA · ONLINE · T+ HH:MM:SS ]`
- Below orb: typewriter thoughts cycling on spacebar
  - "I BUILD SYSTEMS THAT LEARN."
  - "WANT TO KNOW ABOUT MY WORK?"
  - "TRY ASKING ME SOMETHING."
- Input box at bottom: type `work`/`self`/`blog`/`now`/`email` →
  intent match → transition to that room.

### Room 02 — SELF
- Camera lerps to mid-distance. Orb dimmed.
- Status: `[ AGENT SPEAKING ]`
- Typewriter fires 7 lines (60ms/char):
  ```
  LORA.
  XI'AN, EARTH.
  ROLE: BUILDER OF SYSTEMS THAT LEARN.
  STACK: TYPESCRIPT · SVELTE · THREE.JS · AGENTS · ZK.
  FOCUS: AI · WEB3 · DX.
  SHIPPED: 7 PROJECTS · 12 HACKATHONS · 103 REPOS.
  ```
- After complete: status → `[ AGENT AWAITING ]`, cursor blinks.

### Room 03 — WORK
- Camera pulls back. 7 voxels visible, floating in 3D space.
- Above voxels: typewriter: `I'VE SHIPPED 7 THINGS THIS YEAR.`
- Click voxel → camera pushes to it → voxel explodes → text reveals
  project info (3 lines max). `NEXT →` to advance.

### Room 04 — BLOG
- Camera lowers. Vertical wall of text.
- Typewriter: `I WRITE ABOUT AGENTS.`
- 3-4 post titles, monospace, 1 line each. Click → post.

### Room 05 — NOW
- Single screen. `/NOW` at 18vw.
- 4 stacked metrics (label 11vw, description 2vw):
  ```
  BUILDING   agents.sh — autonomous IDE for solo devs
  LEARNING   ZK circuits · GPU shaders · Spanish
  READING    Refik Anadol · "Unsupervised" (2022)
  VIBING     Hania Rani — "Esja"
  ```

### Room 06 — CONTACT
- Camera pushes orb forward. Orb pulses fast.
- `WRITE ME.` at 28vw.
- mailto link + optional textarea. Submit = mailto.

## 9. Performance budget

| Route | 3D | JS gz | Lighthouse mobile |
|-------|----|----|-------------------|
| `/` | 1 scene | ≤200kb | ≥80 |
| `/blog` | 0 | ≤80kb | ≥95 |
| `/blog/[slug]` | 0 | ≤80kb | ≥95 |
| `/now` | 0 | ≤60kb | ≥95 |
| 404 | 0 | ≤60kb | ≥95 |

## 10. Reject criteria

- Looks like "another 3D floating portfolio" → fail
- Agent feels gimmicky, doesn't actually respond → fail
- Mobile fallback broken → fail
- Audio plays without user gesture → fail
- Orb is generic shader sphere (no character) → fail
- Any card / grid / badge / ribbon appears → fail
- Lighthouse mobile < 80 → fail
- Total Awwwards checklist < 48 → fail