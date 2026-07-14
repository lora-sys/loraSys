<script lang="ts">
	// INK EDITION — hero ink-wash. Cheap Canvas 2D: a few soft drifting ink
	// blobs with gentle cursor parallax. No 3D, capped DPR, pauses when hidden,
	// and never mounts under prefers-reduced-motion / small screens (parent-gated).
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let w = 0;
		let h = 0;
		const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

		type Blob = { x: number; y: number; r: number; hue: string; sx: number; sy: number; ph: number };
		let blobs: Blob[] = [];

		function seed() {
			blobs = [
				{ x: 0.86, y: 0.1, r: 0.42, hue: '26,24,21', sx: 0.00006, sy: 0.00004, ph: 0 },
				{ x: 0.14, y: 0.95, r: 0.3, hue: '198,65,44', sx: 0.00005, sy: 0.00007, ph: 2 },
				{ x: 0.55, y: 0.4, r: 0.26, hue: '26,24,21', sx: 0.00004, sy: 0.00005, ph: 4 },
				{ x: 0.3, y: 0.2, r: 0.2, hue: '90,84,75', sx: 0.00007, sy: 0.00003, ph: 1 }
			];
		}

		function resize() {
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = Math.floor(w * dpr);
			canvas.height = Math.floor(h * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		const mouse = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 };
		function onMove(e: MouseEvent) {
			mouse.tx = e.clientX / window.innerWidth;
			mouse.ty = e.clientY / window.innerHeight;
		}

		let raf = 0;
		let running = true;
		function frame(t: number) {
			if (!running) return;
			mouse.x += (mouse.tx - mouse.x) * 0.04;
			mouse.y += (mouse.ty - mouse.y) * 0.04;
			ctx.clearRect(0, 0, w, h);
			const px = (mouse.x - 0.5) * 40;
			const py = (mouse.y - 0.5) * 40;
			for (const b of blobs) {
				const cx = (b.x + Math.sin(t * b.sx + b.ph) * 0.03) * w + px * b.r;
				const cy = (b.y + Math.cos(t * b.sy + b.ph) * 0.03) * h + py * b.r;
				const rad = b.r * Math.max(w, h);
				const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
				const alpha = b.hue === '198,65,44' ? 0.09 : 0.13;
				g.addColorStop(0, `rgba(${b.hue},${alpha})`);
				g.addColorStop(1, `rgba(${b.hue},0)`);
				ctx.fillStyle = g;
				ctx.fillRect(0, 0, w, h);
			}
			raf = requestAnimationFrame(frame);
		}

		function onVis() {
			if (document.hidden) {
				running = false;
				cancelAnimationFrame(raf);
			} else if (!running) {
				running = true;
				raf = requestAnimationFrame(frame);
			}
		}

		seed();
		resize();
		raf = requestAnimationFrame(frame);
		window.addEventListener('resize', resize);
		window.addEventListener('mousemove', onMove, { passive: true });
		document.addEventListener('visibilitychange', onVis);

		return () => {
			running = false;
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', onMove);
			document.removeEventListener('visibilitychange', onVis);
		};
	});
</script>

<canvas bind:this={canvas} class="ink-wash-canvas" aria-hidden="true"></canvas>

<style>
	.ink-wash-canvas {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		pointer-events: none;
	}
</style>
