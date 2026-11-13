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
- `bun run content:validate` checks all article metadata, frontmatter schemas, and MDX components, including translation relationships
- Release audits (`bun run build` -> `scripts/audit-release.mjs` & `scripts/audit-writing-taxonomy.mjs`) verify canonical URLs, reciprocal alternates, search index separation, and bilingual taxonomy completeness across all routes

Structural equality supports review, but does not establish factual fidelity on its own. Read each original and translation before publication, including diagram labels and code examples. When a synchronized original changes later, review its translation separately. Do not overwrite the translated body automatically or mark an untranslated original as English.

## Translation coverage

> [!NOTE]
> The daily news digest items (`ai-agent-engineering-news-*`) referenced in early draft notes were pruned in favor of high-depth technical articles and guides.

All 67 Chinese technical articles in the curated snapshot have paired English editions. Along with three English originals (`eve-agent`, `newtube`, `wishlive`), there are 137 published long-form editions in total. The authoritative map and file hashes are recorded in `content-sync/article-translation-coverage.json`.

English translations preserve source publication and update dates, code blocks, section layout, source URLs, MDX components, and diagrams. 57 technical diagrams provide dedicated English SVG copies, and interactive HTML artifacts (such as the FDE dashboards) feature localized interfaces with strict sandboxed Content Security Policies.

The English archive defaults to English editions, while Chinese readers see Chinese originals. Homepage links select the current locale before retrieving recent articles.

## Completed snapshot

- **Published editions**: 67 Chinese originals, 67 English translations, 3 English originals (137 editions total).
- **Media localization**: 57 English SVG diagrams (45 newly adapted) and 3 English interactive HTML artifacts.
- **Raster figures**: 19 original raster figures retain Chinese labels alongside descriptive English captions without loss of original context.

The English archive now opens with English editions, including the English edition of the selected featured source. All and Chinese remain explicit language choices. The static HTML also defaults to English so the first render and no-JavaScript reading do not expose Chinese duplicates.

### Translation batches and domains

Translations span core technical domains across the site:
- **Agent Architecture & Runtimes**: `tau-agent-architecture`, `herdr-coding-agent-runtime`, `cloudflare-python-workers-agent-backend`, `mentraos-smart-glasses-runtime`, `nvidia-openshell-runtime-policy`
- **Harness & Workflows**: `loop-engineering-harness`, `ai-engineering-harness`, `agent-demo-harness-control-layer`, `github-agentic-workflows`, `agentic-workflows-noop-triage`
- **Evaluation & Benchmarks**: `agent-budget-memory-evaluation`, `coding-agent-long-task-eval-completion-rate`, `skill-up-stateful-multiturn-eval`, `agent-eval-monitor-coverage`
- **Security & Boundaries**: `agent-credential-boundary-vault-broker`, `agent-network-policy-revocation`, `opencloak-local-pii-redaction`, `coding-agent-supply-chain-security`
- **Protocols & Ecosystem**: `emdash-decentralized-plugin-registry`, `google-agent-plugins-skills-mcp`, `agent-tool-search-mcp-ard`, `link-cli-agent-payment`
- **Enterprise Practice & Roles**: `fde-enterprise-ai-engineering-role`, `financial-markets-zero-to-one-roadmap`

### Media and artifact security

Interactive HTML artifacts are excluded from Pagefind search indexing (`data-pagefind-ignore="all"`) so auxiliary panels cannot contaminate general search results. Same-origin framing is enabled solely on authorized interactive article routes (`fde-enterprise-ai-engineering-role` and its `-en` counterpart); frames retain `sandbox="allow-scripts"` without same-origin access, and each artifact retains its own CSP.
