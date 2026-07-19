<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animId: number;
	let particles: Array<{
		x: number;
		y: number;
		r: number;
		vx: number;
		vy: number;
		alpha: number;
		targetAlpha: number;
		color: string;
	}> = [];

	const COLORS = [
		'rgba(26, 24, 21,',  // ink
		'rgba(198, 65, 44,', // vermilion
		'rgba(90, 84, 77,',  // ink-soft
	];

	function createParticle(width: number, height: number) {
		return {
			x: Math.random() * width,
			y: Math.random() * height,
			r: Math.random() * 2.5 + 0.5,
			vx: (Math.random() - 0.5) * 0.15,
			vy: Math.random() * 0.2 + 0.05,
			alpha: 0,
			targetAlpha: Math.random() * 0.12 + 0.02,
			color: COLORS[Math.floor(Math.random() * COLORS.length)]
		};
	}

	function init(width: number, height: number) {
		const count = Math.floor((width * height) / 25000); // density: ~1 per 25k px²
		const clamped = Math.min(count, 40); // cap for performance
		particles = Array.from({ length: clamped }, () => createParticle(width, height));
	}

	function draw() {
		if (!ctx || !canvas) return;
		const { width, height } = canvas;
		ctx.clearRect(0, 0, width, height);

		for (const p of particles) {
			// Fade in
			if (p.alpha < p.targetAlpha) p.alpha += 0.002;

			// Move
			p.x += p.vx;
			p.y += p.vy;

			// Wrap around
			if (p.x < -10) p.x = width + 10;
			if (p.x > width + 10) p.x = -10;
			if (p.y > height + 10) {
				p.y = -10;
				p.x = Math.random() * width;
			}

			// Draw soft dot
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			ctx.fillStyle = p.color + p.alpha + ')';
			ctx.fill();
		}

		animId = requestAnimationFrame(draw);
	}

	onMount(() => {
		const parent = canvas.parentElement;
		if (!parent) return;

		const rect = parent.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const width = rect.width;
		const height = rect.height;

		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		ctx = canvas.getContext('2d');
		if (ctx) ctx.scale(dpr, dpr);

		init(width, height);
		draw();

		return () => {
			cancelAnimationFrame(animId);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="ink-particles"
	aria-hidden="true"
/>

<style>
	.ink-particles {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
	}
</style>
