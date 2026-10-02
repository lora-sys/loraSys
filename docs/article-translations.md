# Article translations

Each language edition is a real MDX article with its own permanent `/blog/<id>` address. A translation uses `language: 'en-US'` and `translationOf: '<original-id>'`. The original does not need a reciprocal field, so source synchronization can keep updating it independently.

`content:validate` checks that the original exists, that the two languages differ, and that a published translation does not point to a draft. It rejects self-references, chains, cycles, unsupported locales, and duplicate translations in the same language. Page rendering derives the reverse link from the collection and provides a language switch and reciprocal `hreflang` links. Each edition keeps its own canonical URL. Existing `/en/writing/<id>` aliases remain `noindex` redirects.

## First translated collection

These six translations use the public source articles at `0866b7df001439a67cfbfbdf0101e5c2595714f7`:

- `loop-engineering-harness` → `loop-engineering-harness-en`
- `tau-agent-loop-events` → `tau-agent-loop-events-en`
- `long-running-agent-session-context-state` → `long-running-agent-session-context-state-en`
- `agent-credential-boundary-vault-broker` → `agent-credential-boundary-vault-broker-en`
- `multi-agent-dependency-aware-delegation` → `multi-agent-dependency-aware-delegation-en`
- `free-vision-skill` → `free-vision-skill-en`

Translations preserve the source publication and update dates, code behavior, sections, sources, MDX components, and media. They are labeled as translated editions. The language selector and RSS count published editions, including both languages of a translated article.

Twelve SVG diagrams have separate English-label copies. The application-key location label in `2026-09-18-three-credential-classes-en.svg` says "Outside the execution sandbox." The Chinese explanatory SVG also receives one text-only correction, from "位置：控制面外部" to "位置：执行环境外部". This resolves the diagram's inconsistent "outside the control plane" label using the article's prose and [OpenAI's sandbox security guidance](https://developers.openai.com/api/docs/guides/agents-api/environments/security). Diagram structure, values, and other claims remain unchanged.

The Tau event-loop PNG is retained with its Chinese labels. Its English caption identifies the original language and explains the sequence. It is not presented as an English-language diagram.

## Checks

- `node --test scripts/tests/article-translations.test.mjs` checks valid and invalid relationships
- `bun run content:validate` checks all article metadata and MDX, including translation relationships
- `bun scripts/test-article-translations.mjs --source-only` compares sections, code blocks, source URLs, components, and media with each original
- After a production build, `bun scripts/test-article-translations.mjs` also checks reciprocal alternates, canonical URLs, visible switches, English return paths, aliases, listing counts, and RSS entries

Structural equality supports review, but does not establish factual fidelity on its own. Read each original and translation before publication, including diagram labels and code examples. When a synchronized original changes later, review its translation separately. Do not overwrite the translated body automatically or mark an untranslated original as English.
