# Content Inbox

`content-inbox/` is the local-first staging area for content that has not been approved for publication. It is intentionally outside `src/content/blog/`, so adding a candidate does not create a published article.

## Source contract

| Source | What is stored | Default destination | Trust boundary |
|---|---|---|---|
| Public URL | URL, fetched summary, source label and candidate Markdown | Note or Blog | Read public content, summarize, preserve attribution; never claim private facts |
| Notion | Page URL and pending status until connector access works | Note or Blog after review | Read-only discovery first; never mutate the source page; 403/timeout remains visible |
| Social media | Channel, public URL, draft text and project relation | Note, Project update or Blog | Keep the social post as a source signal; do not silently mirror private or unverified content |
| Local file | File name, content kind and exported candidate Markdown | Note or Blog | User chooses the file; export is local and does not publish automatically |

## Review states

`candidate` means a local draft exists but has not been reviewed. `needs-review` means the source or mapping is incomplete. `approved` means it may be moved into `src/content/blog/` or a curated data file. `published` is reserved for content already present in the production collection.

The browser inbox stores locally created drafts in `localStorage` and downloads an explicit Markdown file. It does not upload files, call Notion, or publish to GitHub Pages. The repository remains the source of truth for approved content.

## Mapping rules

Zhihu long-form posts normally map to Blog. Xiaohongshu posts map to short Notes or visual project slices. Bilibili and YouTube demos map to Project updates. A project relation and an owner boundary (`lora-sys`, `ACAMLab`, or `External`) should be attached before approval.


## Verification note

The local browser test created an AgentArena candidate from a public URL, stored one draft in `localStorage`, reported “Candidate created and downloaded. It is not published.”, and then cleared it with `Clear local drafts`, restoring the two seeded candidates. The test did not call a server or publish a page.
