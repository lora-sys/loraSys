# Site quality checks

## Language boundaries

Site controls follow the page locale. Project identifiers, technology names, code and original article bodies retain their own language. An original article title in another interface language needs an explicit language marker. A mirrored article route is not a translation.

The English search page has English controls. Search may return original Chinese articles; their language is part of the result, not an automatic translation.

## Zhihu Threads assets

The verified project is `lora-sys/zhihu-threads`. It organizes user-selected Zhihu excerpts into learning threads. It is not a discussion community, and the AI must not silently select or expand the user's sources.

The four `lora-v3-*zhihu*` WebP files are localized compositions using the existing original Lora and Mochi artwork. They are illustrations and explanatory diagrams, not product screenshots. Fonts and intermediate renders stay outside the repository.

## Before merging

The existing verification workflow runs snapshot validation, Astro checks, production build and the original browser regression suites.

The localization workflow additionally checks every rendered HTML file and local target, page and image languages, the new project, accessible controls, search, empty states, directory history, clipboard success and denial, keyboard workflow steps and reduced motion. Automated accessibility checks cover light surfaces and key dark surfaces. Browser screenshots require visual review in addition to passing assertions.

Lighthouse runs against a gzip-enabled production preview using its mobile simulation. Record its actual scores and metrics. A successful measurement step is not proof that a performance target was met. Inlined styles avoid several blocking requests on the initial navigation but increase HTML size and reduce cross-page stylesheet caching; retain this setting only with measured results.

## Release audits

Production output is audited during `bun run build` via `scripts/audit-release.mjs` and `scripts/audit-writing-taxonomy.mjs`, ensuring required files, metadata, unique `h1` headings, taxonomy consistency, and clean internal links without duplicated prefixes.

Automated pull-request verification (`.github/workflows/verify.yml`) runs headless browser suites, accessibility (axe-core) checks, and Lighthouse audits against the exact production artifact before merge. Passing these suites does not establish physical-device, Safari, Firefox or screen-reader compatibility, which require separate manual verification when design changes occur. Third-party services that load only after consent or visitor interaction are never silently enabled for tests.
