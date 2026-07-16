<script lang="ts">
	// Custom cursor — magnifies near nodes
	import { onMount } from 'svelte';
	import { field } from './FieldState.svelte';

	let x = $state(0);
	let y = $state(0);
	let overNode = $state(false);

	onMount(() => {
		const move = (e: PointerEvent) => {
			x = e.clientX;
			y = e.clientY;
			field.setMouse(
				(e.clientX / window.innerWidth) * 2 - 1,
				(e.clientY / window.innerHeight) * 2 - 1
			);
			const target = e.target as HTMLElement | null;
			overNode = !!target?.closest('.field-node');
		};
		window.addEventListener('pointermove', move);
		return () => window.removeEventListener('pointermove', move);
	});
</script>

<div
	class="cursor"
	class:over={overNode}
	style="transform: translate({x - (overNode ? 18 : 2)}px, {y - (overNode ? 18 : 2)}px)"
	aria-hidden="true"
></div>

<style>
	.cursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 4px;
		height: 4px;
		background: #fff;
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		mix-blend-mode: difference;
		transition:
			width 0.2s ease,
			height 0.2s ease;
	}
	.cursor.over {
		width: 36px;
		height: 36px;
		background: transparent;
		border: 1px solid var(--field-accent);
	}
</style>
