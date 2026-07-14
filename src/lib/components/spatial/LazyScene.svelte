<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, type Snippet } from 'svelte';
	import { inview } from 'svelte-inview';

	interface Props {
		/** Distance from viewport (px) at which to start mounting. 500px
		 *  lets the scene warm up before the user scrolls into it. */
		rootMargin?: string;
		/** Once mounted, never unmount (cheaper than teardown). */
		once?: boolean;
		class?: string;
		fallback?: Snippet;
		children: Snippet;
	}

	let {
		rootMargin = '500px',
		once = true,
		class: _class = '',
		fallback,
		children
	}: Props = $props();

	let mounted = $state(false);
	let isVisible = $state(false);

	onMount(() => {
		if (!browser) return;
		// If reduced motion or no WebGL support, mount immediately (children
		// will decide whether to render their 3D).
		mounted = true;
	});
</script>

<div
	use:inview={{ rootMargin, unobserveOnEnter: once }}
	oninview_change={({ detail }) => {
		if (detail.inView) isVisible = true;
	}}
	class={_class}
>
	{#if mounted && isVisible}
		{@render children()}
	{:else if fallback}
		{@render fallback()}
	{/if}
</div>