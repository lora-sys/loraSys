<script lang="ts">
	// Main field — hosts all 12 nodes + background + depth indicator
	import { field } from './FieldState.svelte';
	import { FIELD_NODES } from './field-nodes';
	import FieldNode from './FieldNode.svelte';
	import FieldBackground from './FieldBackground.svelte';

	// Pre-baked positions for Round 1 commit 2 — tuned to avoid overlap.
	const POSITIONS: Record<string, { x: number; y: number; align?: 'left' | 'center' | 'right' }> = {
		'manifest-claim': { x: 50, y: 36, align: 'center' },
		'manifest-enter': { x: 50, y: 88, align: 'center' },
		'self-name': { x: 50, y: 32, align: 'center' },
		'self-stack': { x: 50, y: 56, align: 'center' },
		'self-repos': { x: 50, y: 70, align: 'center' },
		'work-0': { x: 14, y: 18 },
		'work-1': { x: 50, y: 20, align: 'center' },
		'work-2': { x: 86, y: 18 },
		'work-3': { x: 14, y: 46 },
		'work-4': { x: 50, y: 46, align: 'center' },
		'work-5': { x: 86, y: 46 },
		'work-6': { x: 14, y: 78 },
		'idea-blog': { x: 28, y: 36 },
		'idea-now': { x: 70, y: 64 },
		'reach-claim': { x: 50, y: 36, align: 'center' },
		'reach-email': { x: 30, y: 64 },
		'reach-x': { x: 70, y: 74 }
	};

	// Layer tokens. Hero cap reduced to 9rem so it doesn't eat the viewport.
	const LAYER_TOKENS = {
		0: {
			size: 'clamp(2.4rem, 9vw, 9rem)',
			weight: 700,
			color: 'var(--field-fg)',
			opacity: 1,
			family: 'display' as const,
			letterSpacing: '-0.05em',
			lineHeight: 0.92
		},
		1: {
			size: 'clamp(1.4rem, 4vw, 3.6rem)',
			weight: 600,
			color: 'var(--field-fg)',
			opacity: 0.82,
			family: 'display' as const,
			letterSpacing: '-0.03em',
			lineHeight: 1.05
		},
		2: {
			size: 'clamp(0.7rem, 0.95vw, 0.9rem)',
			weight: 400,
			color: 'var(--field-fg-dim)',
			opacity: 0.62,
			family: 'mono' as const,
			letterSpacing: '0.04em',
			lineHeight: 1.4
		},
		3: {
			size: 'clamp(0.65rem, 0.85vw, 0.82rem)',
			weight: 400,
			color: 'var(--field-fg-mute)',
			opacity: 0.45,
			family: 'mono' as const,
			letterSpacing: '0.06em',
			lineHeight: 1.4
		},
		4: {
			size: 'clamp(1rem, 2.4vw, 2.2rem)',
			weight: 600,
			color: 'var(--field-fg)',
			opacity: 0.78,
			family: 'display' as const,
			letterSpacing: '-0.03em',
			lineHeight: 1.1
		}
	};

	let tiltX = $derived(field.mouseY * 3);
	let tiltY = $derived(field.mouseX * -3);
	let scrollZ = $derived(field.depthProgress * 600);
</script>

<div class="field" style="--tilt-x: {tiltX}deg; --tilt-y: {tiltY}deg; --scroll-z: {scrollZ}px">
	<FieldBackground />

	<div class="nodes">
		{#each FIELD_NODES as node}
			{@const pos = POSITIONS[node.id] ?? { x: 50, y: 50 }}
			{@const tokens = LAYER_TOKENS[node.layer]}
			<FieldNode
				{node}
				x={pos.x}
				y={pos.y}
				size={tokens.size}
				opacity={tokens.opacity}
				weight={tokens.weight}
				color={tokens.color}
				family={tokens.family}
				letterSpacing={tokens.letterSpacing}
				align={pos.align ?? 'left'}
			/>
		{/each}
	</div>

	<div class="depth-rail" aria-hidden="true">
		<div class="rail-track">
			<div class="rail-fill" style="height: {field.depthProgress * 100}%"></div>
		</div>
		<span class="rail-label">L{field.currentLayer}</span>
	</div>
</div>

<style>
	.field {
		position: relative;
		min-height: 100vh;
		width: 100%;
		background: var(--field-bg);
		overflow: hidden;
		perspective: 1200px;
		perspective-origin: 50% 50%;
	}
	.nodes {
		position: fixed;
		inset: 0;
		z-index: 2;
		transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateZ(calc(var(--scroll-z) * -1));
		transform-style: preserve-3d;
		will-change: transform;
	}
	.depth-rail {
		position: fixed;
		top: 50%;
		right: 16px;
		transform: translateY(-50%);
		z-index: 5;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--field-fg-mute);
		letter-spacing: 0.18em;
	}
	.rail-track {
		width: 2px;
		height: 160px;
		background: var(--field-line);
		position: relative;
	}
	.rail-fill {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background: var(--field-accent);
		transition: height 0.3s ease;
	}
	.rail-label {
		font-weight: 700;
		color: var(--field-accent);
	}
</style>
