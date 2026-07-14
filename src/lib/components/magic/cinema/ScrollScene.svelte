<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		delay?: number;
		y?: number;
		blur?: number;
		duration?: number;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		delay = 0,
		y = 24,
		blur = 6,
		duration = 0.9,
		class: _class = '',
		children
	}: Props = $props();

	let reduced = $state(false);

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
</script>

<div
	class="will-change-[opacity,transform,filter] {reduced ? '' : 'cinema-reveal'} {_class}"
	style:--cinema-delay="{delay}s"
	style:--cinema-duration="{duration}s"
	style:--cinema-y="{y}px"
	style:--cinema-blur="{blur}px"
>
	{#if children}{@render children()}{/if}
</div>

<style>
	.cinema-reveal {
		animation: cinema-reveal-keyframes var(--cinema-duration, 0.9s)
			cubic-bezier(0.22, 1, 0.36, 1) var(--cinema-delay, 0s) both;
	}

	@keyframes cinema-reveal-keyframes {
		from {
			opacity: 0;
			transform: translateY(var(--cinema-y, 24px));
			filter: blur(var(--cinema-blur, 6px));
		}
		to {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cinema-reveal {
			animation: none;
		}
	}
</style>