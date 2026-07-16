import { DATA } from '$lib/data/resume';
import type { FieldNode } from './FieldState.svelte';

// 12 nodes across 5 depth layers.
// Positions are pre-baked (vw/vh percentages) for Round 1.
// Round 2 will tune via visual review.

const projects = DATA.projects.slice(0, 7);

export const FIELD_NODES: FieldNode[] = [
	// Layer 0 — MANIFEST
	{
		id: 'manifest-claim',
		layer: 0,
		text: 'I BUILD SYSTEMS THAT LEARN.',
		kind: 'claim',
		breathePeriod: 5.0,
		breatheOffset: 0.0
	},
	{
		id: 'manifest-enter',
		layer: 0,
		text: '↓ ENTER FIELD',
		kind: 'meta',
		breathePeriod: 3.2,
		breatheOffset: 0.5
	},

	// Layer 1 — SELF
	{
		id: 'self-name',
		layer: 1,
		text: `${DATA.name.toUpperCase()} · ${DATA.location.toUpperCase()} · 2026`,
		kind: 'meta',
		breathePeriod: 6.5,
		breatheOffset: 0.2
	},
	{
		id: 'self-stack',
		layer: 1,
		text: 'STACK: TS · SVELTE · THREE · AGENTS · ZK',
		kind: 'meta',
		breathePeriod: 4.8,
		breatheOffset: 0.7
	},
	{
		id: 'self-repos',
		layer: 1,
		text: '103 PUBLIC REPOS',
		kind: 'meta',
		breathePeriod: 5.6,
		breatheOffset: 0.35
	},

	// Layer 2 — WORK
	...projects.map((p, i) => ({
		id: `work-${i}`,
		layer: 2 as const,
		text: `${String(i + 1).padStart(2, '0')} · ${p.title.toUpperCase()} →`,
		kind: 'project' as const,
		href: p.href,
		blurb: p.description,
		breathePeriod: 3.5 + (i % 3) * 0.7,
		breatheOffset: (i * 0.137) % 1
	})),

	// Layer 3 — IDEAS
	{
		id: 'idea-blog',
		layer: 3,
		text: 'ON BUILDING AGENTS →',
		kind: 'idea',
		href: '/blog',
		breathePeriod: 7.0,
		breatheOffset: 0.1
	},
	{
		id: 'idea-now',
		layer: 3,
		text: '/NOW →',
		kind: 'idea',
		href: '/now',
		breathePeriod: 6.2,
		breatheOffset: 0.6
	},

	// Layer 4 — REACH
	{
		id: 'reach-claim',
		layer: 4,
		text: 'WRITE ME.',
		kind: 'reach',
		breathePeriod: 4.4,
		breatheOffset: 0.0
	},
	{
		id: 'reach-email',
		layer: 4,
		text: 'LORASYS@OUTLOOK.COM →',
		kind: 'reach',
		mailto: 'lorasys@outlook.com',
		breathePeriod: 5.0,
		breatheOffset: 0.4
	},
	{
		id: 'reach-x',
		layer: 4,
		text: '@LORA_SYS →',
		kind: 'reach',
		href: 'https://x.com/lora_sys',
		breathePeriod: 4.7,
		breatheOffset: 0.8
	}
];
