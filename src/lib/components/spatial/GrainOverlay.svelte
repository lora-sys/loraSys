<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	interface Props {
		opacity?: number;
	}

	let { opacity = 0.05 }: Props = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let timeoutId = 0;

	onMount(() => {
		const c = canvas;
		if (!c) return;
		const ctx = c.getContext('2d');
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

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
			timeoutId = window.setTimeout(tick, 140);
		};
		timeoutId = window.setTimeout(tick, 140);

		return () => {
			window.clearTimeout(timeoutId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

{#if browser}
	<div class="pointer-events-none fixed inset-0 z-[2]" aria-hidden="true">
		<canvas
			bind:this={canvas}
			class="absolute inset-0 h-full w-full mix-blend-overlay"
			style:opacity
		></canvas>
	</div>
{/if}
