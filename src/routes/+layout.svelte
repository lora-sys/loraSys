<script lang="ts">
	import TopNav from '$lib/components/portfolio/TopNav.svelte';
	import '../app.css';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import SpatialScroll from '$lib/components/spatial/SpatialScroll.svelte';
	import SpatialStage from '$lib/components/spatial/SpatialStage.svelte';
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
	<title>Lora Sys — AI Engineer · Spatial Web · Indie Hacker</title>
	<meta
		name="description"
		content="Portfolio of Sikandar Bhide (Lora Sys) — AI engineer, indie hacker, and builder of spatial web experiences. Shipped projects across agents, blockchain, dev tools, and creative coding."
	/>
	<meta name="author" content="Sikandar Bhide (Lora Sys)" />
	<meta name="keywords" content="Lora Sys, Sikandar Bhide, AI engineer, indie hacker, portfolio, spatial web, agents, blockchain, monad, hackathon, dev tools, Svelte, TypeScript, 3D" />
	<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
	<link rel="canonical" href="https://lora-sys.github.io/loraSys/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Lora Sys" />
	<meta property="og:title" content="Lora Sys — AI Engineer · Spatial Web · Indie Hacker" />
	<meta
		property="og:description"
		content="Portfolio of Sikandar Bhide (Lora Sys) — AI engineer, indie hacker, builder of spatial web experiences. Agents, blockchain, dev tools, creative coding."
	/>
	<meta property="og:url" content="https://lora-sys.github.io/loraSys/" />
	<meta property="og:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Lora Sys — AI Engineer · Spatial Web · Indie Hacker" />
	<meta
		name="twitter:description"
		content="AI engineer, indie hacker, builder of spatial web experiences. Agents, blockchain, dev tools, creative coding."
	/>
	<meta name="twitter:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />

	<link rel="preconnect" href="https://i.pinimg.com" />
	<link rel="preconnect" href="https://pub-83c5db439b40468498f97946200806f7.r2.dev" />
	<link rel="preconnect" href="https://cdn.magicui.design" />
	<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin="anonymous" />
	<link rel="manifest" href="{base}/manifest.json" />
	<meta name="theme-color" content="#020617" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="Lora Portfolio" />

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Sikandar Bhide',
		alternateName: 'Lora Sys',
		url: 'https://lora-sys.github.io/loraSys/',
		image: 'https://lora-sys.github.io/loraSys/og-cover.png',
		jobTitle: 'AI Engineer · Indie Hacker',
		sameAs: [
			'https://github.com/lora-sys',
			'https://twitter.com/lora_sys',
			'https://lora-sys.github.io/loraSys/'
		],
		knowsAbout: [
			'AI Engineering',
			'Multi-Agent Systems',
			'Blockchain',
			'Spatial Web',
			'Svelte',
			'TypeScript',
			'Indie Hacking'
		]
	}).replace(/</g, '\\u003c')}</script>`}
</svelte:head>

<ModeWatcher />

{#if browser && spatialEnabled}
	<SpatialStage />
{/if}

<Tooltip.Provider>
	<TopNav />
	<SpatialScroll>
		<div class="relative min-h-screen antialiased">
			{@render children?.()}
		</div>
	</SpatialScroll>
</Tooltip.Provider>