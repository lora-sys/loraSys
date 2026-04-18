# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Sikandar Bhide (lora-sys), built with SvelteKit 2, Svelte 5, and TypeScript. Inspired by Magic UI portfolio template.

## Package Manager

**Use pnpm as the package manager.** All commands should use `pnpm` instead of `npm`/`yarn`/`bun`.

```bash
pnpm install       # Install dependencies
pnpm run dev       # Start dev server
pnpm run build     # Build for production
pnpm run preview   # Preview production build
pnpm run check     # Type-check (svelte-kit sync + svelte-check)
pnpm run check:watch # Watch mode type-checking
pnpm run lint      # Run prettier + eslint
pnpm run format    # Auto-format all files
```

## Development Workflow

### 1. Analysis

Understand requirements, explore codebase, identify affected areas.

### 2. Plan

Create a phased implementation plan. Break work into self-contained phases. Present plan to user for approval before proceeding.

### 3. Execute Phase

For each phase:

1. Make code changes
2. Run `pnpm run build` to verify no build errors
3. Start dev server
4. Use **agent-browser** to verify page load and runtime behavior:
   - `agent-browser open <url>` → open the page
   - `agent-browser console --level error` → check for errors
   - `agent-browser screenshot <path>` → capture visual
5. Fix any issues found
6. Git commit the phase: `git add -A && git commit -m "<type>: <description>"`
7. Proceed to next phase

### 4. Final Delivery

After all phases complete, push all commits: `git push`

## Architecture

### Single Source of Truth for Content

All portfolio content (work, education, projects, skills, hackathons, anime, favorites, social links) lives in `src/lib/data/resume.ts` as the exported `DATA` constant. The main page (`src/routes/+page.svelte`) imports and renders this data. To add/edit work experience, projects, skills, or other sections, edit that file.

### Route Structure

- `src/routes/+page.svelte` — Main portfolio page, imports `DATA` from `resume.ts`
- `src/routes/+layout.svelte` — Sets `setMode('dark')` (dark mode forced), wraps content in Navbar and Tooltip.Provider
- `src/routes/blog/+page.svelte` + `+page.server.ts` — Blog listing, fetches from `/api/content`
- `src/routes/blog/[slug]/+page.svelte` + `+page.ts` — Individual blog posts via dynamic import from `src/content/`
- `src/routes/api/content/+server.ts` — API endpoint that lists blog posts from `src/content/*.md` via `import.meta.glob`

### Blog System

Blog posts are Markdown files in `src/content/` with YAML frontmatter (`title`, `description`, `date`, `categories`, `published`). The API endpoint reads all `.md` files, filters by `published: true`, and returns metadata. Individual posts use mdsvex to compile Markdown to Svelte components with Shiki syntax highlighting (theme: `vesper`).

### Component Organization

- `src/lib/components/portfolio/` — Page-specific components (Navbar, ProjectCard, HackathonCard, ResumeCard, AnimeSection, FavoritesSection, ModeToggle)
- `src/lib/components/ui/` — shadcn-svelte components (button, badge, card, avatar, dialog, carousel, separator, tooltip)
- `src/lib/components/magic/` — Animation/visual effect components (BlurFade, Dock, BentoGrid, Lens)

### Styling

- TailwindCSS via `tailwind.config.js` and `@tailwindcss/typography` for prose
- shadcn-svelte pattern: each UI component has a folder with sub-components (root + parts) and an `index.ts` barrel export
- `src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge) and `flyAndScale` transition helper
- Dark mode is forced via `setMode('dark')` in the layout

### Key Dependencies

- **mdsvex** — Markdown preprocessor enabling `.md` files as Svelte components with Shiki syntax highlighting
- **bits-ui** — Headless UI primitives used by shadcn-svelte
- **svelte-motion** / **motion-sv** — Animation library
- **svelte-inview** — Intersection observer for scroll-triggered animations
- **embla-carousel-svelte** — Carousel for Anime section
- **lucide-svelte** — Icon library
- **marked** — Markdown parser for rendering DATA.summary in the About section

## Verification First

- After any code modification, **must** run `pnpm run build`.
- For UI changes, **must** use **agent-browser** for page load and runtime analysis.

## Code Style Constraints

- TypeScript strict mode is enforced.
- Async operations must be wrapped in `try/catch`.

## Tool Flow Configuration

- Build command: `pnpm run build`
- Type check: `pnpm run check`

## Failure Self-Healing Path

- If build fails, read `docs/error-codes.md` first before attempting fixes.
- If a test fails, run `node scripts/analyze.js` first to identify the source of the error.
- Suspend changing service code until the source of error is confirmed.
- For runtime errors, use **agent-browser** to reproduce: open the page, run `console --level error`, take a screenshot.
