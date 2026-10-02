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

## October 2 coverage expansion

The expansion is bounded to the 83 Chinese articles published in commit `c0518b79f997793b2182d1890fc8d8fb29614083`, tree `2a733eada9af7f4326b9131f3ea6fb29ad0e67d2`. At that point six had paired English editions; three other English articles were originals. All remaining 77 sources have now been translated and checked in bounded groups. New Chinese articles after this snapshot are outside this completion pass.

The first completed batch adds these ten full English reading lists, preserving the original dates, sections, links, numbers, and qualifications. These sources contain no media.

- `ai-agent-engineering-news-2026-09-04-10` → `ai-agent-engineering-news-2026-09-04-10-en`
- `ai-agent-engineering-news-2026-09-11-16` → `ai-agent-engineering-news-2026-09-11-16-en`
- `ai-agent-engineering-news-2026-09-11-17` → `ai-agent-engineering-news-2026-09-11-17-en`
- `ai-agent-engineering-news-2026-09-11-18` → `ai-agent-engineering-news-2026-09-11-18-en`
- `ai-agent-engineering-news-2026-09-18-19` → `ai-agent-engineering-news-2026-09-18-19-en`
- `ai-agent-engineering-news-2026-09-18-20` → `ai-agent-engineering-news-2026-09-18-20-en`
- `ai-agent-engineering-news-2026-09-21` → `ai-agent-engineering-news-2026-09-21-en`
- `ai-agent-engineering-news-2026-09-22` → `ai-agent-engineering-news-2026-09-22-en`
- `ai-agent-engineering-news-2026-09-23` → `ai-agent-engineering-news-2026-09-23-en`
- `ai-agent-engineering-news-2026-09-24-25` → `ai-agent-engineering-news-2026-09-24-25-en`

The English archive now opens with English editions, including the English edition of the selected featured source. All and Chinese remain explicit language choices. The static HTML also defaults to English so the first render and no-JavaScript reading do not expose Chinese duplicates.

The second completed batch adds six later reading lists, three Anthropic articles, and the full AI Engineering Harness guide. The guide retains all 35 fenced code blocks and its three existing English-labeled WebP diagrams.

- `ai-agent-engineering-news-2026-09-25-26` → `ai-agent-engineering-news-2026-09-25-26-en`
- `ai-agent-engineering-news-2026-09-26-27` → `ai-agent-engineering-news-2026-09-26-27-en`
- `ai-agent-engineering-news-2026-09-27-28` → `ai-agent-engineering-news-2026-09-27-28-en`
- `ai-agent-engineering-news-2026-09-28-29` → `ai-agent-engineering-news-2026-09-28-29-en`
- `ai-agent-engineering-news-2026-09-29-30` → `ai-agent-engineering-news-2026-09-29-30-en`
- `ai-agent-engineering-news-2026-09-30-10-01` → `ai-agent-engineering-news-2026-09-30-10-01-en`
- `ai-engineering-harness` → `ai-engineering-harness-en`
- `anthropic-agent-market-preference-negotiation` → `anthropic-agent-market-preference-negotiation-en`
- `anthropic-art-scientific-agent-wetlab` → `anthropic-art-scientific-agent-wetlab-en`
- `anthropic-embedded-evaluator-access` → `anthropic-embedded-evaluator-access-en`

Homepage recent-writing links now select the page language before taking three entries. The English homepage distinguishes translated editions from English originals and keeps an explicit empty-English state. The Chinese homepage keeps Chinese originals; its archive filters and All semantics are unchanged.

The third completed batch adds ten runtime, deployment, security, and evaluation articles. Seven diagrams have separate English-label SVG copies. The AWS and coding-agent supply-chain security covers retain Chinese pixel labels with explicit English explanations; the bitmap images are not presented as fully English assets.

- `aws-agent-proposal-validation` → `aws-agent-proposal-validation-en`
- `claude-chat-cowork-unified-mode` → `claude-chat-cowork-unified-mode-en`
- `cloudflare-agent-traffic-economics` → `cloudflare-agent-traffic-economics-en`
- `cloudflare-cf-agent-native-cli` → `cloudflare-cf-agent-native-cli-en`
- `cloudflare-python-workers-agent-backend` → `cloudflare-python-workers-agent-backend-en`
- `coding-agent-long-task-eval-completion-rate` → `coding-agent-long-task-eval-completion-rate-en`
- `coding-agent-prompt-audit-migration-eval` → `coding-agent-prompt-audit-migration-eval-en`
- `coding-agent-supply-chain-security` → `coding-agent-supply-chain-security-en`
- `company-brain-agent-memory-permissions` → `company-brain-agent-memory-permissions-en`
- `emdash-decentralized-plugin-registry` → `emdash-decentralized-plugin-registry-en`

Browser translation coverage reads the published `translationOf` fields in the tested checkout. One desktop pass checks every translated edition, its reciprocal language links, a single reading-progress control, images, and interactive media. The original six editions plus available SVG, interactive-HTML, and video representatives retain the desktop/mobile and reduced-motion matrix. The report records the exact IDs completed in each pass; it does not describe the representative matrix as all-article mobile coverage.

The fourth completed batch adds ten agent-control, durability, observability, memory, and evaluation articles with 26 separate English SVG diagrams. Original bitmap figures remain intact. Chinese-labeled covers have accurate English label explanations; the two Anthropic figures in the budget and evaluation article are already English.

- `agent-budget-memory-evaluation` → `agent-budget-memory-evaluation-en`
- `agent-demo-harness-control-layer` → `agent-demo-harness-control-layer-en`
- `agent-durable-execution-step-idempotency` → `agent-durable-execution-step-idempotency-en`
- `agent-eval-monitor-coverage` → `agent-eval-monitor-coverage-en`
- `agent-instant-steering-preemption-recoverable-tools` → `agent-instant-steering-preemption-recoverable-tools-en`
- `agent-network-policy-revocation` → `agent-network-policy-revocation-en`
- `agent-observability-trace-span-opentelemetry` → `agent-observability-trace-span-opentelemetry-en`
- `agent-review-evidence-independent-history` → `agent-review-evidence-independent-history-en`
- `agent-tool-search-mcp-ard` → `agent-tool-search-mcp-ard-en`
- `agentic-workflows-noop-triage` → `agentic-workflows-noop-triage-en`

The fifth completed batch adds ten practice and infrastructure articles, including the full FDE study and financial-markets guide. Seven diagrams have English SVG copies. All three FDE interactive HTML artifacts have English copies with unchanged CSS, CSP, logic, and numerical claims. Research dates, sample limitations, and company/project-reported evidence boundaries remain explicit. Original media files are retained.

- `fde-enterprise-ai-engineering-role` → `fde-enterprise-ai-engineering-role-en`
- `financial-markets-zero-to-one-roadmap` → `financial-markets-zero-to-one-roadmap-en`
- `foreman-coding-agent-supervisor` → `foreman-coding-agent-supervisor-en`
- `gemini-live-background-reasoning` → `gemini-live-background-reasoning-en`
- `git-sha-pinning-final-head-verification` → `git-sha-pinning-final-head-verification-en`
- `github-agentic-autofix-copilot-memory` → `github-agentic-autofix-copilot-memory-en`
- `github-agentic-workflows` → `github-agentic-workflows-en`
- `github-security-lab-agent-fuzzing-loop` → `github-security-lab-agent-fuzzing-loop-en`
- `google-agent-plugins-skills-mcp` → `google-agent-plugins-skills-mcp-en`
- `gpt6-prompt-cache-agent-state-layer` → `gpt6-prompt-cache-agent-state-layer-en`

Translation group 6: Nine tool and tutorial articles, with four English Kitaru diagrams. Original illustrative sample images remain unchanged; Chinese text or generated Chinese-looking text is explicitly explained in English.

- `herdr-coding-agent-runtime` → `herdr-coding-agent-runtime-en`
- `hermes-minimax-media` → `hermes-minimax-media-en`
- `hermes-stepfun-imagegen` → `hermes-stepfun-imagegen-en`
- `hyperframes-html-video-engineering` → `hyperframes-html-video-engineering-en`
- `jcode-agent-harness` → `jcode-agent-harness-en`
- `jev-code-reviewer-pr-priority` → `jev-code-reviewer-pr-priority-en`
- `jev-typed-agent-decisions` → `jev-typed-agent-decisions-en`
- `json-render-constrained-generative-ui` → `json-render-constrained-generative-ui-en`
- `kitaru-agent-regression-testing` → `kitaru-agent-regression-testing-en`

Translation group 7: Nine product and runtime articles, with an English Link CLI diagram. Minecraft and Munim covers retain their original Chinese labels with accurate English explanations.

- `link-cli-agent-payment` → `link-cli-agent-payment-en`
- `lobsterai-mobile-desktop-agent` → `lobsterai-mobile-desktop-agent-en`
- `mentraos-smart-glasses-runtime` → `mentraos-smart-glasses-runtime-en`
- `microsoft-copilot-managed-runtime-app-delivery` → `microsoft-copilot-managed-runtime-app-delivery-en`
- `minecraft-agent-layered-planning-action` → `minecraft-agent-layered-planning-action-en`
- `munim-accessibility-computer-use` → `munim-accessibility-computer-use-en`
- `nvidia-openshell-runtime-policy` → `nvidia-openshell-runtime-policy-en`
- `openai-agents-api-browser-authentication` → `openai-agents-api-browser-authentication-en`
- `openai-research-agent-workdays` → `openai-research-agent-workdays-en`

Translation group 8 completes the final nine sources, including the sandbox guide and Tau architecture. Tau's original architecture PNG and silent five-second video already use English labels. The OpenCompany GIF keeps its source URL; sampled frames were inspected without claiming a full transcription of every frame.

- `opencloak-local-pii-redaction` → `opencloak-local-pii-redaction-en`
- `opencompany-versioned-agent-config` → `opencompany-versioned-agent-config-en`
- `qwen-image-2-1-rgba-license` → `qwen-image-2-1-rgba-license-en`
- `rtk-agent-shell-output-filter` → `rtk-agent-shell-output-filter-en`
- `sandbox` → `sandbox-en`
- `skill-up-stateful-multiturn-eval` → `skill-up-stateful-multiturn-eval-en`
- `skills-manager-multi-agent-skill-sync` → `skills-manager-multi-agent-skill-sync-en`
- `splash-model-specific-local-llm` → `splash-model-specific-local-llm-en`
- `tau-agent-architecture` → `tau-agent-architecture-en`

## Completed snapshot

All 83 Chinese articles in the source snapshot have full English editions. The repository now contains 83 Chinese articles, 83 paired translations, and three English originals: 169 published editions in total. The 92 preexisting article files remain byte-identical to the source tree. The complete pair list and source/translation hashes are recorded in `content-sync/article-translation-coverage.json`.

There are 57 English SVG diagrams, including 45 new copies, and three English interactive HTML copies. All original assets remain. Text coverage is complete; pixel-language coverage is not 100% English. These 19 original raster assets retain Chinese or generated Chinese-looking text with accurate English explanations:

- `src/assets/blog/agent-demo-harness-control-layer/lora-explainer-v2.webp`
- `src/assets/blog/agent-eval-monitor-coverage/lora-explainer-v2.webp`
- `src/assets/blog/agentic-workflows-noop-triage/lora-explainer-v2.webp`
- `src/assets/blog/aws-agent-proposal-validation/lora-explainer-v2.webp`
- `src/assets/blog/coding-agent-supply-chain-security/lora-explainer-v2.webp`
- `src/assets/blog/foreman-coding-agent-supervisor/lora-explainer-v2.webp`
- `src/assets/blog/github-agentic-workflows/lora-explainer-v2.webp`
- `src/assets/blog/herdr-coding-agent-runtime/lora-explainer-v2.webp`
- `src/assets/blog/hyperframes-html-video-engineering/lora-explainer-v2.webp`
- `src/assets/blog/jcode-agent-harness/lora-explainer-v2.webp`
- `public/images/blog/hermes-minimax-media/city.webp`
- `src/assets/blog/minecraft-agent-layered-planning-action/lora-explainer-v2.webp`
- `src/assets/blog/munim-accessibility-computer-use/lora-explainer-v2.webp`
- `src/assets/blog/opencloak-local-pii-redaction/lora-explainer-v2.webp`
- `src/assets/blog/opencompany-versioned-agent-config/lora-explainer-v2.webp`
- `src/assets/blog/rtk-agent-shell-output-filter/lora-explainer-v2.webp`
- `src/assets/blog/skills-manager-multi-agent-skill-sync/lora-explainer-v2.webp`
- `src/assets/blog/splash-model-specific-local-llm/lora-explainer-v2.webp`
- `src/assets/blog/tau-agent-loop-events/agent_event_loop.png`
