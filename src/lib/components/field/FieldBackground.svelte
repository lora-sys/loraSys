<script lang="ts">
	// Particle background — Three.js stub for Round 1
	import { Canvas } from '@threlte/core';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import FieldParticles from './FieldParticles.svelte';

	let reducedMotion = $state(false);
	let isMobile = $state(false);

	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		isMobile = window.matchMedia('(max-width: 767px)').matches;
	});
</script>

<div class="bg" aria-hidden="true">
	{#if browser && !isMobile && !reducedMotion}
		<Canvas>
			<FieldParticles />
		</Canvas>
	{/if}
</div>

<style>
	.bg {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}
	.bg :global(canvas) {
		width: 100% !important;
		height: 100% !important;
		display: block;
	}
</style>