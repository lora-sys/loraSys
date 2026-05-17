<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		text?: string;
		color?: string;
		fontSize?: number;
		duration?: number;
		delay?: number;
		class?: string;
	}

	let {
		text = "Signature",
		color = "#22c55e",
		fontSize = 72,
		class: className,
	}: Props = $props();

	let textStyle = $derived(`
		font-size: ${fontSize}px;
		font-family: 'Lastoria', serif;
		background: linear-gradient(135deg, ${color}, #9c40ff, ${color}, #ffaa40);
		background-size: 300% 300%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: signature-gradient 3s ease infinite;
	`);
</script>

<svelte:head>
	<link rel="preload" href="/LastoriaBoldRegular.otf" as="font" type="font/otf" crossorigin="anonymous" />
	<style>
		@font-face {
			font-family: 'Lastoria';
			src: url('/LastoriaBoldRegular.otf') format('opentype');
			font-weight: bold;
			font-display: swap;
		}
		@keyframes signature-gradient {
			0%, 100% { background-position: 0% 50%; }
			50% { background-position: 100% 50%; }
		}
	</style>
</svelte:head>

<div class={cn("overflow-visible tracking-wider", className)} style={textStyle}>
	{text}
</div>
