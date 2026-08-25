export type LoraVisualManifestEntry = {
  asset: string
  component: string
  pages: readonly string[]
  purpose: string
  sourceId: string
  original: readonly [number, number]
  display: string
  theme: 'hero' | 'field-notes' | 'archive'
  factualEvidence: boolean
  replacement: 'v2-approved' | 'retain-v1'
}

/** Audit trail for the reusable Lora/Mochi illustrations; raw source files stay outside the repo. */
export const loraVisualManifest = [
  { asset: 'heroLora', component: 'HeroScene', pages: ['/', '/en/'], purpose: 'hero character layer', sourceId: 'exec-43063951', original: [1536, 1024], display: '42rem desktop / 78vw mobile', theme: 'hero', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'heroMochi', component: 'HeroScene', pages: ['/', '/en/'], purpose: 'hero companion layer', sourceId: 'exec-5ae040b5', original: [1536, 1024], display: '17rem desktop / 42vw mobile', theme: 'hero', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'heroProps', component: 'HeroScene', pages: ['/', '/en/'], purpose: 'hero workbench layer', sourceId: 'exec-1ca6e9a1', original: [1536, 1024], display: '42rem desktop / 78vw mobile', theme: 'hero', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'avatar', component: 'LoraVisual', pages: ['/', '/en/', '/links', '/en/links'], purpose: 'role reference avatar crop', sourceId: 'lora-character-reference-v2', original: [1023, 1537], display: '10rem', theme: 'archive', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'aboutJourney', component: 'About', pages: ['/about', '/en/about'], purpose: 'route illustration', sourceId: 'exec-cc304518', original: [1448, 1086], display: '38rem desktop / 86vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'aboutHackathon', component: 'About', pages: ['/about'], purpose: 'hackathon evidence illustration', sourceId: 'exec-6b12b2ba', original: [1003, 1568], display: '26rem desktop / 92vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'nowWorkbench', component: 'Now', pages: ['/now', '/en/now', '/'], purpose: 'current workbench illustration', sourceId: 'exec-4149589e', original: [1536, 1024], display: '42rem desktop / 86vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'contactCorrespondence', component: 'Contact', pages: ['/contact', '/en/contact', '/'], purpose: 'correspondence illustration', sourceId: 'exec-7115eef6', original: [1672, 941], display: '44rem desktop / 86vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'readingMarker', component: 'BlogListing', pages: ['/blog', '/en/writing', '/'], purpose: 'reading marker illustration', sourceId: 'exec-54145531', original: [1536, 1024], display: '38rem desktop / 86vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'favoritesTicket', component: 'PersonalShowcase', pages: ['/'], purpose: 'collection ticket illustration', sourceId: 'exec-1be6a868', original: [1003, 1568], display: '24rem desktop / 80vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'labLedger', component: 'Lab', pages: ['/lab'], purpose: 'experiment ledger illustration', sourceId: 'exec-f53846dc', original: [1536, 1024], display: '38rem desktop / 86vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'notesStrip', component: 'Notes', pages: ['/notes'], purpose: 'field note strip', sourceId: 'exec-06abb17f', original: [1774, 887], display: '48rem desktop / 86vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'blogAgentSystems', component: 'FeaturedWriting', pages: ['/blog'], purpose: 'agent systems margin illustration', sourceId: 'exec-c554bb3a', original: [1003, 1568], display: '18rem desktop / 70vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'blogMultimodal', component: 'FeaturedWriting', pages: ['/blog'], purpose: 'multimodal margin illustration', sourceId: 'exec-2dfa17e9', original: [1003, 1568], display: '18rem desktop / 70vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'agentRunbook', component: 'ArticleFieldNote', pages: ['/blog/*'], purpose: 'runbook sidebar illustration', sourceId: 'exec-24069df0', original: [1122, 1402], display: '17rem desktop / 60vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'mediaWorkbench', component: 'ArticleFieldNote', pages: ['/blog/*'], purpose: 'media sidebar illustration', sourceId: 'exec-185f8b23', original: [1122, 1402], display: '17rem desktop / 60vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'sandbox', component: 'ArticleFieldNote', pages: ['/blog/*'], purpose: 'sandbox sidebar illustration', sourceId: 'exec-717e5d4d', original: [1122, 1402], display: '17rem desktop / 60vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'shippingLog', component: 'ArticleFieldNote', pages: ['/blog/*'], purpose: 'shipping sidebar illustration', sourceId: 'exec-3ae427e8', original: [1122, 1402], display: '17rem desktop / 60vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'projectsMap', component: 'Projects', pages: ['/projects', '/en/work', '/', '/en/'], purpose: 'selected work map', sourceId: 'exec-a9fd5d99', original: [1672, 941], display: '52rem desktop / 77vw mobile', theme: 'field-notes', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'linksConstellation', component: 'Links', pages: ['/links', '/en/links'], purpose: 'links constellation', sourceId: 'exec-1faf25ba', original: [1536, 1024], display: '42rem desktop / 86vw mobile', theme: 'archive', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'resumeDossier', component: 'Resume', pages: ['/resume', '/en/resume'], purpose: 'resume dossier', sourceId: 'exec-5481a1d7', original: [1536, 1024], display: '42rem desktop / 86vw mobile', theme: 'archive', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'guestbookPostcard', component: 'Guestbook', pages: ['/guestbook', '/en/guestbook'], purpose: 'guestbook postcard', sourceId: 'exec-d4d42fa7', original: [1536, 1024], display: '38rem desktop / 86vw mobile', theme: 'archive', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'indexScene', component: 'SearchArchiveTags', pages: ['/search', '/archives', '/tags'], purpose: 'index search illustration', sourceId: 'exec-daaab073', original: [1672, 941], display: '48rem desktop / 86vw mobile', theme: 'archive', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'talksPodium', component: 'Talks', pages: ['/talks'], purpose: 'talks podium', sourceId: 'exec-b5bee6a2', original: [1536, 1024], display: '34rem desktop / 86vw mobile', theme: 'archive', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'termsLedger', component: 'Terms', pages: ['/terms'], purpose: 'terms ledger', sourceId: 'exec-5f73d4ee', original: [1536, 1024], display: '38rem desktop / 86vw mobile', theme: 'archive', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'wayfinding404', component: '404', pages: ['/404'], purpose: 'wayfinding illustration', sourceId: 'exec-7c2b2adf', original: [1672, 941], display: '44rem desktop / 86vw mobile', theme: 'archive', factualEvidence: false, replacement: 'v2-approved' },
  { asset: 'stampVerified', component: 'PersonalShowcase', pages: ['/'], purpose: 'verification stamp', sourceId: 'existing-v1-asset', original: [256, 256], display: '2.75rem', theme: 'field-notes', factualEvidence: false, replacement: 'retain-v1' },
  { asset: 'stampExperiment', component: 'PersonalShowcase', pages: ['/'], purpose: 'experiment stamp', sourceId: 'existing-v1-asset', original: [256, 256], display: '2.75rem', theme: 'field-notes', factualEvidence: false, replacement: 'retain-v1' },
  { asset: 'stampContribution', component: 'PersonalShowcase', pages: ['/'], purpose: 'contribution stamp', sourceId: 'existing-v1-asset', original: [256, 256], display: '2.75rem', theme: 'field-notes', factualEvidence: false, replacement: 'retain-v1' }
] as const satisfies readonly LoraVisualManifestEntry[]
