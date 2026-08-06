<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let {
		threshold = 600,
		duration = 400,
		class: className,
		...rest
	}: {
		threshold?: number;
		duration?: number;
		class?: string | undefined | null;
		[key: string]: any;
	} = $props();

	const R = 10;
	const C = 2 * Math.PI * R; // ≈ 62.83

	let visible = $state(false);
	let progress = $state(0); // 0-1
	let rafId: number | null = null;

	function update() {
		const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		const p = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
		progress = p;
		visible = scrollY > threshold;
	}

	function onScroll() {
		if (rafId !== null) return;
		rafId = requestAnimationFrame(() => {
			update();
			rafId = null;
		});
	}

	function scrollToTop() {
		const start = window.scrollY;
		if (start === 0) return;
		const startTime = performance.now();

		function easeOutCubic(t: number) {
			return 1 - Math.pow(1 - t, 3);
		}

		function frame(now: number) {
			const elapsed = now - startTime;
			const t = Math.min(elapsed / duration, 1);
			window.scrollTo(0, start * (1 - easeOutCubic(t)));
			if (t < 1) requestAnimationFrame(frame);
		}
		requestAnimationFrame(frame);
	}

	onMount(() => {
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	});

	onDestroy(() => {
		if (rafId !== null) cancelAnimationFrame(rafId);
	});

	$effect(() => {
		return () => {
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	});

	const offset = C * (1 - progress);
</script>

{#if visible}
	<button
		onclick={scrollToTop}
		class={[
			'back-to-top',
			'visible',
			className
		]
			.filter(Boolean)
			.join(' ')}
		aria-label="回到顶部"
		title="回到顶部"
		{...rest}
	>
		<svg
			class="back-to-top-ring"
			viewBox="0 0 24 24"
			width="44"
			height="44"
			aria-hidden="true"
		>
			<circle
				class="back-to-top-track"
				cx="12"
				cy="12"
				r={R}
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			/>
			<circle
				class="back-to-top-fill"
				cx="12"
				cy="12"
				r={R}
				fill="none"
				stroke="var(--zhu)"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-dasharray={C}
				stroke-dashoffset={offset}
				transform="rotate(-90 12 12)"
			/>
		</svg>
		<svg
			class="back-to-top-arrow"
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="m18 15-6-6-6 6" />
		</svg>
	</button>
{/if}

<style>
	.back-to-top {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 40;
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		background: transparent;
		border: 1.5px solid var(--ink-line-strong);
		color: var(--ink);
		cursor: pointer;
		border-radius: 50%;
		opacity: 0;
		transform: translateY(8px);
		pointer-events: none;
		transition:
			opacity 0.35s ease,
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.25s ease,
			border-color 0.25s ease;
	}
	.back-to-top.visible {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}
	.back-to-top:hover {
		background: var(--zhu);
		border-color: var(--zhu);
		color: var(--paper);
	}
	.back-to-top:hover .back-to-top-fill {
		stroke: var(--paper);
	}

	.back-to-top-ring {
		position: absolute;
		inset: 0;
		color: var(--ink-line-strong);
	}
	.back-to-top-track {
		opacity: 0.5;
	}
	.back-to-top-fill {
		transition: stroke-dashoffset 0.1s linear, stroke 0.25s ease;
	}
	.back-to-top-arrow {
		position: relative;
		z-index: 1;
		transition: color 0.25s ease;
	}
</style>
