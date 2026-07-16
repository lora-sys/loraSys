<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	interface Props {
		delay?: number;
		y?: number;
		duration?: number;
		once?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		delay = 0,
		y = 6,
		duration = 0.7,
		once = true,
		class: _class = '',
		children
	}: Props = $props();

	let el: HTMLDivElement | undefined = $state();

	let visible = $state(true);
	let reduced = $state(false);

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;
		// Start hidden (via class flip below), then animate on intersect.
		visible = false;
	});

	$effect(() => {
		if (!el || reduced) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						visible = true;
						if (once) io.disconnect();
					} else if (!once) {
						visible = false;
					}
				}
			},
			{ rootMargin: '0px 0px -10% 0px', threshold: 0 }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<div
	bind:this={el}
	class={'entry-reveal ' + _class}
	class:is-visible={visible}
	style:--entry-delay="{delay}s"
	style:--entry-duration="{duration}s"
	style:--entry-y="{y}px"
>
	{#if children}{@render children()}{/if}
</div>

<style>
	.entry-reveal {
		opacity: 0;
		transform: translateY(var(--entry-y, 6px));
		transition-property: opacity, transform;
		transition-duration: var(--entry-duration, 0.7s);
		transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
		transition-delay: var(--entry-delay, 0s);
		will-change: opacity, transform;
	}
	.entry-reveal.is-visible {
		opacity: 1;
		transform: translateY(0);
	}
	@media (prefers-reduced-motion: reduce) {
		.entry-reveal {
			opacity: 1 !important;
			transform: none !important;
			transition: none !important;
		}
	}
</style>
