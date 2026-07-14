<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { inview } from 'svelte-inview';

	interface Props {
		delay?: number;
		y?: number;
		blur?: number;
		duration?: number;
		once?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		delay = 0,
		y = 24,
		blur = 6,
		duration = 0.9,
		once = true,
		class: _class = '',
		children
	}: Props = $props();

	let visible = $state(browser ? false : true);
	let reduced = $state(false);

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) visible = true;
	});
</script>

<div
	use:inview={{ rootMargin: '-10% 0px -10% 0px', unobserveOnEnter: once }}
	oninview_change={({ detail }) => {
		if (detail.inView) visible = true;
	}}
	class="will-change-[opacity,transform,filter] {_class}"
	style:opacity={visible || reduced ? 1 : 0}
	style:transform={visible || reduced ? 'translateY(0)' : `translateY(${y}px)`}
	style:filter={visible || reduced ? 'blur(0px)' : `blur(${blur}px)`}
	style:transition="opacity {duration}s cubic-bezier(0.22,1,0.36,1) {delay}s, transform {duration}s cubic-bezier(0.22,1,0.36,1) {delay}s, filter {duration}s cubic-bezier(0.22,1,0.36,1) {delay}s"
>
	{#if children}{@render children()}{/if}
</div>