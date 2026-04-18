<script lang="ts">
	import { browser } from '$app/environment';
	import { inview } from 'svelte-inview';
	import { cn } from '$lib/utils';

	interface Props {
		duration?: number;
		delay?: number;
		yOffset?: number;
		inViewMargin?: string;
		blur?: string;
		once?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		duration = 0.4,
		delay = 0,
		yOffset = 8,
		inViewMargin = '-20px',
		blur = '2px',
		once = true,
		class: _class = '',
		children
	}: Props = $props();

	// Initialize to true on server to match hydration; client will manage visibility
	let isVisible = $state(browser ? false : true);
	let isBlurred = $derived(!isVisible);
</script>

<div
	use:inview={{
		rootMargin: inViewMargin,
		unobserveOnEnter: once
	}}
	oninview_change={({ detail }) => {
		if (detail.inView) isVisible = true;
	}}
	class={cn(
		'will-change-[opacity,transform,filter]',
		'transition-all ease-out',
		isVisible ? 'opacity-100' : 'opacity-0',
		_class
	)}
	style:transform={isVisible ? 'translateY(0)' : `translateY(${yOffset}px)`}
	style:filter={isBlurred ? `blur(${blur})` : 'none'}
	style:transition-duration="{duration}s"
	style:transition-delay="{0.04 + delay}s"
>
	{#if children}{@render children()}{:else}Default{/if}
</div>
