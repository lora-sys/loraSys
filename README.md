# Lora's Portfolio

Personal portfolio website for [lora-sys](https://github.com/lora-sys), built with **SvelteKit 2**, **Svelte 5**, and **TypeScript**. Inspired by Magic UI portfolio template.

[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte)](https://kit.svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![shadcn-svelte](https://img.shields.io/badge/shadcn--svelte-latest-000000)](https://www.shadcn-svelte.com)

## Features

- **Single source of truth** — all portfolio content lives in [`src/lib/data/resume.ts`](src/lib/data/resume.ts)
- **SvelteKit 2** + **Svelte 5** + **TypeScript strict**
- **shadcn-svelte** UI components (button, badge, card, avatar, dialog, carousel, separator, tooltip)
- **Aceternity / Magic UI** components (Dock, BlurFade, BentoGrid, Lens, Particles, Sparkles, Spotlight, TypewriterEffect, InfiniteMovingCards, AnimatedTooltip, BorderBeam, ShineBorder, NeonGradientCard, RetroGrid, Meteor, Marquee, and more)
- **Responsive design** for all devices
- **MacOS-style floating Dock** with magnification animation
- **Anime Section** — Carousel with Lens zoom effect (8 entries)
- **Favorites Section** — Bento Grid with Dialog modal (movies, music, games)
- **Hackathons timeline** with awards
- **Blog** — 4 published posts with Markdown & Shiki syntax highlighting via mdsvex
- **Scroll-triggered BlurFade** animations via svelte-inview
- **Dark mode forced** via `setMode('dark')` + light mode toggle available
- **Custom SVG icons** for social links (GitHub, LinkedIn, X, PeerList, YouTube, Bilibili, Email)
- **PWA support** — service worker + manifest
- **Image optimization** — WebP conversion for anime & favorites images
- **Animated signature** component

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Type-check
pnpm run check

# Lint & format
pnpm run lint
pnpm run format
```

## Customization

Edit [`src/lib/data/resume.ts`](src/lib/data/resume.ts) to update:

| Section                           | Description              |
| --------------------------------- | ------------------------ |
| `name`, `initials`, `description` | Personal info            |
| `summary`                         | About section (Markdown) |
| `skills`                          | Skill tags               |
| `navbar`                          | Navigation links         |
| `anime`                           | Anime carousel entries   |
| `favorites`                       | Favorites grid entries   |
| `projects`                        | Project cards            |
| `work`                            | Work experience          |
| `education`                       | Education history        |
| `hackathons`                      | Hackathon timeline       |
| `social`                          | Social media links       |

## Blog

Blog posts are Markdown files in [`src/content/`](src/content/) with YAML frontmatter. Published posts (4 total):

- [Building WishLive: A Multi-Agent Runtime with Real Economics](src/content/WishLIve.md) — SVG architecture diagrams, dual-mode AI execution, Solidity smart contracts
- [Building a Full-Stack YouTube Clone](src/content/newtube.md) — Next.js 15, tRPC, Prisma, PostgreSQL
- Svelte is Fun — platform overview
- Coding is Cool — dev philosophy

Add a new `.md` file with `published: true` in frontmatter and it appears automatically.

## Tech Stack

| Category            | Technologies                                                 |
| ------------------- | ------------------------------------------------------------ |
| **Framework**       | SvelteKit 2, Svelte 5                                        |
| **Styling**         | TailwindCSS, shadcn-svelte (bits-ui)                         |
| **Animations**      | Svelte-Motion, svelte-inview, embla-carousel                 |
| **Content**         | mdsvex, Shiki (vesper theme), remark-heading-id, rehype-slug |
| **Icons**           | Lucide Svelte, custom SVGs                                   |
| **Markdown**        | marked (for DATA.summary)                                    |
| **Deployment**      | Vercel (adapter-auto)                                        |
| **Package Manager** | pnpm                                                         |

## Project Structure

```
src/
├── app.css              # Global styles (Tailwind)
├── app.d.ts             # Type declarations
├── app.html             # HTML shell
├── content/             # Blog posts (*.md)
├── lib/
│   ├── actions/         # Svelte actions (portal)
│   ├── components/
│   │   ├── aceternity/  # Aceternity UI components
│   │   ├── magic/       # Magic UI components (animated-beam, bento-grid, blur-fade, dock, etc.)
│   │   ├── portfolio/   # Page-specific (Navbar, ProjectCard, ResumeCard, etc.)
│   │   ├── spell/       # Signature animation
│   │   └── ui/          # shadcn-svelte components (button, card, badge, avatar, dialog, etc.)
│   ├── data/
│   │   └── resume.ts    # Single source of truth for all content
│   ├── imgs/            # SVG icons, company logos
│   └── utils.ts         # cn() utility + flyAndScale transition
└── routes/
    ├── +layout.svelte   # Layout (Navbar, Tooltip.Provider, dark mode)
    ├── +page.svelte     # Main portfolio page
    ├── api/content/     # Blog API endpoint
    └── blog/            # Blog listing + individual posts
```
