# Content Graph Browser Review

## Desktop

The Projects page renders a new Content Graph section between the project overview hero and the existing filterable project catalog. The section preserves the site's editorial two-column rhythm and presents four real project nodes: Glassbox Agent Harness, Free Vision Skill, Hermes StepFun Image Generation, and Hermes MiniMax Media. Each node exposes source ownership, status, update month, a project anchor, and explicit Writing/Channel links.

## Mobile 390×844

The mobile screenshot confirms the graph heading collapses to one column without horizontal overflow. The project page hero, project counters, Story note, and Content Graph heading remain readable in the 390px viewport. The graph nodes use a one-column layout below 720px, so metadata and content links stack naturally below the heading.

## Reverse navigation

The `ai-engineering-harness` article was opened in the local preview and rendered a `Build context` block with a working link back to `Glassbox Agent Harness`. The reverse lookup is derived from the explicit `projectStories` mapping and does not infer or fabricate social posts.

## Build

`bun run check` passed with 0 errors and 0 warnings (one existing hint). `bun run build` generated 55 pages, Pagefind indexed 55 pages, and the release audit passed.
