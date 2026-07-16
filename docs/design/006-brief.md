# Design Brief — 006 INK EDITION (墨刊)

> Redo #5. Supersedes 005 FIELD (archived at `before-redo-5-field`).
> Fuses the **長安 ink-editorial elegance** with **ZINE magazine impact**.
> No location/geography theme (no "Xi'an / 長安 / 古都"). Real data only.

## 1. What

Personal portfolio for `lora`. The site is a **modern ink-print magazine**:
paper + ink + a single vermilion accent, high-contrast serif display type,
a masthead, an "issue/edition" system, and a table-of-contents that doubles
as navigation. Elegant and quiet like ink-wash; bold and structured like a
printed cover. Content is driven entirely by `src/lib/data/resume.ts`.

## 2. Audience

- Creative-technical hiring managers (recognize taste + find the work fast)
- Open-source peers (Monad / ETH Beijing crowd)
- Visitors from X / GitHub

## 3. Primary action

- Read the cover, understand who lora is in 5 seconds
- Jump via the contents/nav to **Selected Work** (the payload)
- Click through to a project / blog / mailto
- Secondary: feel the ink atmosphere + brush/seal motion

## 4. References (learn the language, don't copy)

1. Kenya Hara / MUJI editorial restraint — paper, negative space, quiet
2. Pentagram — typographic art-direction-first
3. Independent riso zines — masthead, contents page, page numbers, energy
4. Fraunces / high-contrast serif specimens — type as the subject
5. Ink-wash (水墨) atmosphere — diffusion, bleed, single red seal

## 5. Theme

- [x] Custom — **INK EDITION (墨刊)**: 長安 elegance × ZINE impact.

Palette: ink `#1A1815` · paper `#F3EFE6` · vermilion `#C6412C` (single accent).
Type: **Fraunces** (EN display, 9–144 optical) + **Noto Serif SC** (CN, subset).
Texture: subtle paper grain + one soft ink wash. Seal = personal mark (`洛拉`/`lora`, toggleable).

## 6. Constraints

- **Stack**: SvelteKit 2 + Svelte 5 runes + GSAP + CSS-var design tokens.
  Reuse existing GSAP/Lenis. No new 3D scene (Threlte stays unused here).
- **Motion budget**: 1 canvas (ink wash, hero only, lazy, reduced-motion off).
  Seal stamp = GSAP. Section titles = SVG brush stroke reveal. Scroll reveal.
- **Type**: display scale clamp; Fraunces variable; CN font subset to used glyphs.
- **No dark tech**: light paper base is mandatory (breaks the 4-redo dark lineage).
- **Nav persists**: masthead + contents-as-nav always reachable. No mystery.
- **Perf**: `/` Lighthouse mobile ≥ 90, LCP < 2.5s, `/` JS gz ≤ 180kb.

## 7. Out of scope

- Xi'an / location-as-theme copy
- Blog _content_ edits (reskin only)
- Auth, search, i18n
- Heavy 3D, WebGL scene, Web Audio, autoplay
- Custom-cursor-required interactions (page must work with a normal cursor)

## 8. Section plan (maps real `resume.ts` data)

Sections carry a single CN character marker (長安 flavor) + EN title + page no.

### 序 — COVER / HERO (P.01)

- Masthead: `lora` (Fraunces black) + vermilion seal
- Edition line: `Field Notes on Building · Edition 2026 — 103 Repositories`
- Meta band: `Builder of Evolving Systems · AI Agents · Full-Stack · Web3 · github.com/lora-sys`
- Headline: `I build systems that learn.` (learn = vermilion)
- Dek: DATA.description / summary (drop-cap)
- Contents index (doubles as nav) with page numbers → all sections

### 己 — THE SELF (P.02)

- DATA.summaryHtml (bio), DATA.education (Mingde), DATA.skills as a typeset stack list

### 作 — SELECTED WORK (P.04) ← core payload

- DATA.projects (7): Chinese numerals 壹–柒 or 01–07, title, dates, blurb,
  technologies, real links (Source/Website). Editorial list, hover expand.

### 戰 — HACKATHONS & SIGNALS (P.09)

- DATA.hackathons (ETH Beijing, Monad ×2, AI Agent) + `103 public repos` statement

### 閒 — OFF HOURS (P.12)

- DATA.anime + DATA.favorites, presented as a "collection / 題跋" spread

### 聯 — SAY HELLO (P.16)

- Big `聯` + DATA.contact.email + DATA.contact.social links

Other routes: `/blog`, `/blog/[slug]`, `/now`, `+error` — reskin to INK tokens.

## 9. Interaction model

| Input                   | Result                                                   |
| ----------------------- | -------------------------------------------------------- |
| Load                    | Seal stamps onto masthead (ink-press), then hero settles |
| Scroll into a section   | Section title "written" by a brush stroke (SVG)          |
| Hover project row       | Row expands: blurb + tech + links slide in               |
| Move mouse (hero)       | Ink wash drifts subtly (canvas, desktop only)            |
| Contents item click     | Smooth-scroll to section                                 |
| Reduced-motion / mobile | No canvas, no stamp animation; static elegant layout     |

## 10. Performance budget

| Route          | Canvas             | JS gz  | Lighthouse mobile |
| -------------- | ------------------ | ------ | ----------------- |
| `/`            | 1 (hero ink, lazy) | ≤180kb | ≥90               |
| `/blog`        | 0                  | ≤90kb  | ≥95               |
| `/blog/[slug]` | 0                  | ≤90kb  | ≥95               |
| `/now`         | 0                  | ≤70kb  | ≥95               |
| 404            | 0                  | ≤60kb  | ≥95               |

## 11. Reject criteria

- Reverts to dark background / dark-tech look → fail (that's the 4-redo trap)
- Location/Xi'an theme reappears in copy → fail
- Looks like a generic SaaS or Tailwind template → fail
- Type is decoration, not the subject → fail
- Work section not findable in 5 seconds → fail
- Contents/nav missing or hidden → fail
- CN font ships unsubset (huge payload) → fail
- Lighthouse mobile < 90 → fail
- Awwwards self-checklist < 48 → fail
