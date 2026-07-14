<script lang="ts">
	// Main field — hosts all 12 nodes + background + depth indicator
	import { field } from './FieldState.svelte';
	import { FIELD_NODES } from './field-nodes';
	import FieldNode from './FieldNode.svelte';
	import FieldBackground from './FieldBackground.svelte';

	// Pre-baked positions for Round 1 (vw/vh).
	// Round 2 will tune via visual review.
	const POSITIONS: Record<string, { x: number; y: number; align?: 'left' | 'center' | 'right' }> = {
		'manifest-claim': { x: 50, y: 38, align: 'center' },
		'manifest-enter': { x: 50, y: 88, align: 'center' },
		'self-name': { x: 18, y: 32, align: 'left' },
		'self-stack': { x: 78, y: 56, align: 'left' },
		'self-repos': { x: 30, y: 78, align: 'left' },
		'work-0': { x: 12, y: 18 },
		'work-1': { x: 42, y: 22 },
		'work-2': { x: 78, y: 26 },
		'work-3': { x: 18, y: 50 },
		'work-4': { x: 60, y: 56 },
		'work-5': { x: 86, y: 64 },
		'work-6': { x: 32, y: 80 },
		'idea-blog': { x: 22, y: 30 },
		'idea-now': { x: 72, y: 60 },
		'reach-claim': { x: 50, y: 44, align: 'center' },
		'reach-email': { x: 30, y: 70 },
		'reach-x': { x: 70, y: 76 }
	};

	// Per-layer tokens (size, weight, color, opacity, family)
	const LAYER_TOKENS = {
		0: { size: 'clamp(3rem, 16vw, 14rem)', weight: 700, color: 'var(--field-fg)', opacity: 1, family: 'display' as const, letterSpacing: '-0.05em' },
		1: { size: 'clamp(1.5rem, 5vw, 5rem)', weight: 600, color: 'var(--field-fg)', opacity: 0.85, family: 'display' as const, letterSpacing: '-0.03em' },
		2: { size: 'clamp(0.75rem, 1.2vw, 1.1rem)', weight: 400, color: 'var(--field-fg-dim)', opacity: 0.65, family: 'mono' as const, letterSpacing: '0.04em' },
		3: { size: 'clamp(0.7rem, 0.95vw, 0.95rem)', weight: 400, color: 'var(--field-fg-mute)', opacity: 0.5, family: 'mono' as const, letterSpacing: '0.06em' },
		4: { size: 'clamp(1.2rem, 3.5vw, 3rem)', weight: 600, color: 'var(--field-fg)', opacity: 0.75, family: 'display' as const, letterSpacing: '-0.03em' }
	};

	// Mouse parallax: translate the whole field slightly
	let tiltX = $derived(field.mouseY * 4); // deg
	let tiltY = $derived(field.mouseX * -4); // deg

	// Scroll depth: scale + translate-z the canvas based on scroll
	let scrollZ = $derived(field.depthProgress * 800); // px virtual depth
</script>

<div
	class="field"
	style="--tilt-x: {tiltX}deg; --tilt-y: {tiltY}deg; --scroll-z: {scrollZ}px"
>
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