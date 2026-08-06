<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import '@fontsource-variable/fraunces/standard.css';
	import '@fontsource-variable/fraunces/standard-italic.css';
	import '@fontsource/archivo/500.css';
	import '@fontsource/archivo/700.css';
	import '@fontsource/archivo/900.css';
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
<ResumeViewer />

{#if transitioning}
	<div class="page-transition" aria-hidden="true"></div>
{/if}

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
	:global(*),
	:global(::before),
	:global(::after) {
		box-sizing: border-box;
	}
	:global(section[id]),
	:global([id='top']) {
		scroll-margin-top: 80px;
	}
	.layout {
		min-height: 100vh;
		padding-top: 52px;
	}

	:global(.mermaid) {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
		padding: 1rem;
		background: linear-gradient(135deg, #0a0d1a 0%, #0f1a2e 100%);
		border-radius: 12px;
		border: 1px solid #1e293b;
	}

	:global(.mermaid svg) {
		max-width: 100%;
		height: auto;
	}

	.page-transition {
		position: fixed;
		inset: 0;
		z-index: 9999;
		background: var(--ink);
		pointer-events: none;
		animation: pageFlash 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	@keyframes pageFlash {
		0% { opacity: 0; }
		30% { opacity: 1; }
		100% { opacity: 0; }
	}
</style>
