<script lang="ts">
	// Single field node — text + breathing + click to open
	import type { FieldNode } from './FieldState.svelte';
	import { field } from './FieldState.svelte';

	interface Props {
		node: FieldNode;
		x: number; // vw
		y: number; // vh
		size: string; // CSS font-size
		opacity: number; // base opacity (0..1)
		weight?: number;
		align?: 'left' | 'center' | 'right';
		letterSpacing?: string;
		color?: string;
		family?: 'display' | 'mono';
	}
	let {
		node,
		x,
		y,
		size,
		opacity,
		weight = 500,
		align = 'left',
		letterSpacing = '-0.02em',
		color = 'var(--field-fg)',
		family = 'display'
	}: Props = $props();

	let isActive = $derived(field.activeNodeId === node.id);
	let dimmed = $derived(field.activeNodeId !== null && !isActive);

	function handleClick() {
		field.openNode(node.id);
	}
</script>

<button
	class="field-node"
	class:active={isActive}
	class:dimmed
	data-layer={node.layer}
	onclick={handleClick}
	style="
		left: {x}vw;
		top: {y}vh;
		font-size: {size};
		opacity: {isActive ? 1 : opacity};
		font-weight: {weight};
		text-align: {align};
		letter-spacing: {letterSpacing};
		color: {color};
		font-family: var(--font-{family});
		--breathe-period: {node.breathePeriod}s;
		--breathe-offset: {node.breatheOffset};
	"
>
	{node.text}
</button>

<style>
	.field-node {
		position: absolute;
		background: transparent;
		border: none;
		padding: 8px 12px;
		margin: 0;
		cursor: pointer;
		transform: translate(-50%, -50%);
		line-height: 0.95;
		white-space: nowrap;
		transition:
			opacity 0.6s ease,
			letter-spacing 0.3s ease,
			color 0.3s ease;
		animation: breathe var(--breathe-period, 5s) ease-in-out infinite;
		animation-delay: calc(var(--breathe-offset, 0) * -5s);
	}
	.field-node:hover {
		letter-spacing: -0.04em;
		color: var(--field-accent) !important;
	}
	.field-node.active {
		z-index: 10;
	}
	.field-node.dimmed {
		opacity: 0.08 !important;
	}
	@keyframes breathe {
		0%,
		100% {
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			transform: translate(-50%, -50%) scale(1.025);
		}
	}
</style>
