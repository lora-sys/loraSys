<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	interface Props {
		opacity?: number;
		scanlineOpacity?: number;
		class?: string;
	}

	let { opacity = 0.06, scanlineOpacity = 0.025, class: _class = '' }: Props = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let timeoutId = 0;

	onMount(() => {
		const c = canvas;
		if (!c) return;
		const ctx = c.getContext('2d');
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		const resize = () => {
			const w = window.innerWidth;
			const h = window.innerHeight;
			c.width = Math.floor(w * dpr);
			c.height = Math.floor(h * dpr);
		};
		resize();
		window.addEventListener('resize', resize);

		const draw = () => {
			const img = ctx.createImageData(c.width, c.height);
			const data = img.data;
			for (let i = 0; i < data.length; i += 4) {
				const v = Math.random() * 255;
				data[i] = v;
				data[i + 1] = v;
				data[i + 2] = v;
				data[i + 3] = 255;
			}
			ctx.putImageData(img, 0, 0);
		};
		draw();

		const tick = () => {
			draw();
			timeoutId = window.setTimeout(tick, 110);
		};
		timeoutId = window.setTimeout(tick, 110);

		return () => {
			window.clearTimeout(timeoutId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

{#if browser}
	<div class="pointer-events-none fixed inset-0 z-[1] {_class}" aria-hidden="true">
		<canvas
			bind:this={canvas}
			class="absolute inset-0 h-full w-full mix-blend-overlay"
			style:opacity={opacity}
		></canvas>
		<div
			class="absolute inset-0"
			style:background-image="repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)"
			style:opacity={scanlineOpacity}
			style:mix-blend-mode="overlay"
		></div>
		<div
			class="absolute inset-0"
			style:background="radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)"
		></div>
	</div>
{/if}