<script lang="ts">
	import TopNav from '$lib/components/portfolio/TopNav.svelte';
	import GridPattern from '$lib/components/magic/grid-pattern/grid-pattern.svelte';
	import Meteors from '$lib/components/magic/meteors/meteors.svelte';
	import SmoothCursor from '$lib/components/magic/smooth-cursor/smooth-cursor.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { base } from '$app/paths';
	import '@fontsource/space-grotesk/index.css';
	import '@fontsource/syne/index.css';

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

<!-- Global background layers -->
<div class="pointer-events-none fixed inset-0 z-0">
	<GridPattern />
	<Meteors number={12} />
	<div
		class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.85)_70%)]"
	></div>
</div>

<Tooltip.Provider>
	<TopNav />
	<div class="relative mx-auto min-h-screen max-w-5xl px-6 pb-12 pt-20 antialiased sm:pb-24">
		{@render children?.()}
	</div>
</Tooltip.Provider>
