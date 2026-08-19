# Content Workbench Browser Review

## Shared data verification

The homepage Content Pulse and Projects Content Directory consume the same `getContentOpportunities` model. Both identify TradingOS as the next High-priority Build note opportunity. Projects reports 54 active/building projects without a Story; the panel renders the top six opportunities, while the count remains the full gap count.

## Local browser verification

Homepage `#content-pulse` renders the new `Next content opportunity` strip with TradingOS, `Build note`, and `54 projects need a Story`, linked to the TradingOS project anchor. Projects `#content-directory` renders priority, format, owner, and reason for the top opportunities, including High/Build note and Medium/Project update entries.

## Data rationale

Opportunities are derived only from normalized project fields and explicit Story mappings: archived projects are excluded; featured or building projects are High priority; ACAMLab projects use Lab note; other active projects use Project update. No social or project data is invented.

## Screenshot notes

The Projects 390×844 headless capture confirms the existing page hero and Content Graph stack cleanly without horizontal overflow. The homepage 390×844 headless capture stayed at the page top instead of applying the `#content-pulse` anchor; this is a capture-position limitation, so the homepage Content Pulse will be verified by browser DOM scroll before finalizing the review. 

The browser-scrolled homepage view at the Content Pulse section confirms the opportunity strip remains readable at the narrow viewport: TradingOS, Build note, and the 54-project gap fit on one compact card without horizontal overflow. The four summary cards, freshness details, ownership counts, and GitHub sync row remain visible and aligned.
