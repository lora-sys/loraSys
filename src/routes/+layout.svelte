<script lang="ts">
	import Navbar from '$lib/components/portfolio/Navbar.svelte';
	import '../app.css';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import '@fontsource/space-grotesk/index.css';
	import '@fontsource/syne/index.css';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	setMode('dark');

	// Register Service Worker
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker
				.register('/sw.js')
				.then((registration) => {
					console.log('✅ Service Worker registered successfully', registration);
				})
				.catch((error) => {
					console.log('❌ Service Worker registration failed:', error);
				});
		});
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://i.pinimg.com" />
	<link rel="preconnect" href="https://pub-83c5db439b40468498f97946200806f7.r2.dev" />
	<link rel="preconnect" href="https://cdn.magicui.design" />
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#2563eb" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="Lora Portfolio" />
</svelte:head>

<ModeWatcher />
<Tooltip.Provider>
	<div
		class="relative mx-auto min-h-screen max-w-5xl bg-background px-6 py-12 antialiased sm:py-24"
	>
		{@render children?.()}
		<Navbar />
	</div>
</Tooltip.Provider>
