# Review queue

Files in this directory are **unpublished candidates**. They are not imported by Astro content collections and do not appear in Blog, Notes, Projects, or the public site.

Before moving a candidate into a production content directory, a human reviewer must confirm the source URL, ownership boundary (`lora-sys`, `ACAMLab`, or `External`), copyright and attachment handling, publish shape, and migration target. The reviewer should then add `reviewedAt`, `reviewer`, and a short `reviewNote` to the frontmatter before moving the file.

Public Notion imports are read-only snapshots. The importer preserves the source URL and converts page links and attachment references into Markdown-like evidence, but it does not publish, edit, or delete anything in Notion.


## Smoke test

On 2026-08-20, `https://hof9.notion.site/` was entered as a Notion source in the local Inbox. The browser generated a candidate with `ownership: External`, `status: needs-review`, `migrationTarget: src/content/blog` (because the selected publish shape was Blog), preserved the source URL, stored it in localStorage, downloaded Markdown, and reported that it was not published.
