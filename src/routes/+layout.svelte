<script lang="ts">
	import TopNav from '$lib/components/portfolio/TopNav.svelte';
	import '../app.css';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import '@fontsource/space-grotesk/index.css';
	import '@fontsource/syne/index.css';
	import '@fontsource/fragment-mono/index.css';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let spatialEnabled = $state(false);

	onMount(() => {
		setMode('dark');
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mobile = window.matchMedia('(max-width: 767px)').matches;
		spatialEnabled = !reduced && !mobile;

		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker
					.register(`${base}/sw.js`)
					.then(() => console.log('Service Worker registered'))
					.catch((error) => console.log('SW registration failed:', error));
			});
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://i.pinimg.com" />
	<link rel="preconnect" href="https://pub-83c5db439b40468498f97946200806f7.r2.dev" />
	<link rel="preconnect" href="https://cdn.magicui.design" />
	<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin="anonymous" />
	<link rel="manifest" href="{base}/manifest.json" />
	<meta name="theme-color" content="#020617" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="Lora Portfolio" />
</svelte:head>

<ModeWatcher />

{#if browser && spatialEnabled}
	<!-- 3D scene lazy-loaded only after first mount + capability check -->
	{#await import('$lib/components/spatial/SpatialStage.svelte') then { default: SpatialStage }}
		<SpatialStage />
	{/await}
{/if}

<Tooltip.Provider>
	<TopNav />
	<div class="relative min-h-screen antialiased">
		{@render children?.()}
	</div>
</Tooltip.Provider>