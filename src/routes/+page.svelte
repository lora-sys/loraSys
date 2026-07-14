<script lang="ts">
	// FIELD main page — hosts the canvas + scroll-to-depth + audio + cursor
	import { onMount, onDestroy } from 'svelte';
	import { field } from '$lib/components/field/FieldState.svelte';
	import Field from '$lib/components/field/Field.svelte';
	import FieldCursor from '$lib/components/field/FieldCursor.svelte';
	import AudioGates from '$lib/components/field/AudioGates.svelte';
	import { DATA } from '$lib/data/resume';

	let scrollY = $state(0);
	let docHeight = $state(1);

	function onScroll() {
		scrollY = window.scrollY;
		docHeight = document.documentElement.scrollHeight - window.innerHeight;
		const progress = docHeight > 0 ? scrollY / docHeight : 0;
		field.setDepth(progress);
	}

	function onKey(e: KeyboardEvent) {
		if (e.code === 'Escape') field.closeNode();
	}

	onMount(() => {
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('keydown', onKey);
		// Set a tall body to enable depth travel via scroll
		document.body.style.minHeight = '500vh';
		onScroll();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('keydown', onKey);
			document.body.style.minHeight = '';
		};
	});
</script>

<svelte:head>
	<title>{DATA.name} — field</title>
	<meta name="description" content={DATA.description} />
	<meta property="og:title" content={`${DATA.name} — field`} />
	<meta property="og:description" content={DATA.description} />
	<meta property="og:type" content="website" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<main>
	<Field />
	<AudioGates />
	<FieldCursor />
</main>

<style>
	main {
		min-height: 100vh;
		background: var(--field-bg);
	}
</style>