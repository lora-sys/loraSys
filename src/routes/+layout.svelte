<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import Navbar from '$lib/components/ink/Navbar.svelte';
	import ResumeViewer from '$lib/components/ink/ResumeViewer.svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { initLenis, destroyLenis } from '$lib/lenis';
	import { onMount } from 'svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let transitioning = $state(false);
	let { children }: Props = $props();

	beforeNavigate(() => {
		transitioning = true;
	});

	afterNavigate(() => {
		setTimeout(() => {
			transitioning = false;
		}, 120);
	});

	// Lenis smooth scroll — only on non-HomePage routes.
	// HomePage uses GSAP ScrollTrigger with native scroll for complex entry animations.
	$effect(() => {
		const path = $page.url.pathname;
		destroyLenis();

		if (path !== '/') {
			try {
				initLenis();
			} catch {
				// lenis import failed — native scroll fallback
			}
		}

		return () => destroyLenis();
	});

	// View counter — fire once per session per page
	onMount(() => {
		if (typeof sessionStorage === 'undefined' || sessionStorage.getItem('vk')) return;
		sessionStorage.setItem('vk', '1');
		fetch(`/api/views?path=${encodeURIComponent($page.url.pathname)}`, { method: 'POST' }).catch(
			() => {}
		);
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#f3efe6" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<link rel="icon" type="image/svg+xml" href="{base}/favicon.svg" />
	<!-- Preconnect to font provider — eliminates DNS + TCP + TLS round-trips -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<!-- Fraunces (serif headings) + Archivo (label/UI) — display=swap avoids FOIT -->
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Archivo:wght@500;700;900&display=swap"
	/>
	<meta property="og:image" content="{base}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="{base}/og-image.png" />
</svelte:head>
