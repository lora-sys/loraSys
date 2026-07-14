<script lang="ts">
	import '../app.css';
	// INK EDITION fonts — Latin display self-hosted; CN uses system serif (blog is CN-heavy;
	// self-hosting full CJK would be MBs). Fraunces 'standard' axis (wght+opsz) keeps payload light.
	import '@fontsource-variable/fraunces/standard.css';
	import '@fontsource-variable/fraunces/standard-italic.css';
	import '@fontsource/archivo/500.css';
	import '@fontsource/archivo/700.css';
	import '@fontsource/archivo/900.css';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#0a0a0a" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
</svelte:head>

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
	.layout {
		min-height: 100vh;
	}
</style>