<script lang="ts">
	import '../app.css';
	import '@fontsource/space-grotesk/index.css';
	import '@fontsource/syne/index.css';
	import '@fontsource/fragment-mono/index.css';

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