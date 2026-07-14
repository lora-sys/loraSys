<script lang="ts">
	// Custom cursor — Round 2 wires orbital logic + ripple
	import { onMount } from 'svelte';

	let x = $state(0);
	let y = $state(0);
	let ripple = $state<{ x: number; y: number; t: number } | null>(null);

	onMount(() => {
		const move = (e: MouseEvent) => {
			x = e.clientX;
			y = e.clientY;
		};
		const click = (e: MouseEvent) => {
			ripple = { x: e.clientX, y: e.clientY, t: Date.now() };
			setTimeout(() => {
				if (ripple && Date.now() - ripple.t >= 400) ripple = null;
			}, 500);
		};
		window.addEventListener('mousemove', move);
		window.addEventListener('click', click);
		return () => {
			window.removeEventListener('mousemove', move);
			window.removeEventListener('click', click);
		};
	});
</script>

<div
	class="cursor"
	style="transform: translate({x - 2}px, {y - 2}px)"
	aria-hidden="true"
></div>
{#if ripple}
	<div
		class="ripple"
		style="transform: translate({ripple.x - 20}px, {ripple.y - 20}px)"
		aria-hidden="true"
	></div>
{/if}

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
		transition: width 0.15s, height 0.15s;
	}
	.ripple {
		position: fixed;
		top: 0;
		left: 0;
		width: 40px;
		height: 40px;
		border: 1px solid #67e8f9;
		border-radius: 50%;
		pointer-events: none;
		z-index: 9998;
		animation: ripple-out 0.5s ease-out forwards;
		mix-blend-mode: difference;
	}
	@keyframes ripple-out {
		from {
			opacity: 1;
			transform: translate(var(--x, 0), var(--y, 0)) scale(0.4);
		}
		to {
			opacity: 0;
			transform: scale(2.5);
		}
	}
</style>