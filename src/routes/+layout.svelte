<script lang="ts">
	import TopNav from '$lib/components/portfolio/TopNav.svelte';
	import GrainOverlay from '$lib/components/magic/cinema/GrainOverlay.svelte';
	import SmoothCursor from '$lib/components/magic/smooth-cursor/smooth-cursor.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { base } from '$app/paths';
	import '@fontsource/space-grotesk/index.css';
	import '@fontsource/syne/index.css';
	import '@fontsource/fragment-mono/index.css';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Register Service Worker
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker
				.register(`${base}/sw.js`)
				.then((registration) => {
					console.log('Service Worker registered', registration);
				})
				.catch((error) => {
					console.log('Service Worker registration failed:', error);
				});
		});
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://i.pinimg.com" />
	<link rel="preconnect" href="https://pub-83c5db439b40468498f97946200806f7.r2.dev" />
	<link rel="preconnect" href="https://cdn.magicui.design" />
	<link rel="manifest" href="{base}/manifest.json" />
	<meta name="theme-color" content="#07070a" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="Lora Portfolio" />
</svelte:head>

<ModeWatcher />
<SmoothCursor />

<!-- Cinematic background: grain + scanlines + vignette -->
<GrainOverlay opacity={0.07} scanlineOpacity={0.03} />

<Tooltip.Provider>
	<TopNav />
	<!-- Full-bleed layout — sections own their own max-w / bleed -->
	<div class="relative min-h-screen antialiased">
		{@render children?.()}
	</div>
</Tooltip.Provider>