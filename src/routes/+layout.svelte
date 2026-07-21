<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	// INK EDITION fonts — Latin display self-hosted; CN uses system serif (blog is CN-heavy;
	// self-hosting full CJK would be MBs). Fraunces 'standard' axis (wght+opsz) keeps payload light.
	import '@fontsource-variable/fraunces/standard.css';
	import '@fontsource-variable/fraunces/standard-italic.css';
	import '@fontsource/archivo/500.css';
	import '@fontsource/archivo/700.css';
	import '@fontsource/archivo/900.css';
	import Navbar from '$lib/components/ink/Navbar.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#f3efe6" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<link rel="icon" type="image/svg+xml" href="{base}/favicon.svg" />
	<meta property="og:image" content="{base}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="{base}/og-image.png" />
</svelte:head>

<Navbar />
<div class="layout">
	{@render children?.()}
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		-webkit-font-smoothing: antialiased;
		overflow-x: hidden;
	}
	:global(a) {
		color: inherit;
		text-decoration: none;
	}
	:global(*) {
		box-sizing: border-box;
	}
	/* Offset for the fixed navbar + anchor targets clear the nav */
	:global(section[id]),
	:global([id='top']) {
		scroll-margin-top: 80px;
	}
	.layout {
		min-height: 100vh;
		padding-top: 52px;
	}
</style>
