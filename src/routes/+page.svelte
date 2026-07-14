<script lang="ts">
	import { DATA } from '$lib/data/resume';
	import RoomDirector from '$lib/components/agent/RoomDirector.svelte';
	import AgentCursor from '$lib/components/agent/AgentCursor.svelte';
	import AudioGates from '$lib/components/agent/AudioGates.svelte';
	import { agent } from '$lib/components/agent/AgentState.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		const tick = () => agent.tick();
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	});
</script>

<svelte:head>
	<title>{DATA.name} — agent online</title>
	<meta name="description" content={DATA.description} />
	<meta property="og:title" content={`${DATA.name} — agent online`} />
	<meta property="og:description" content={DATA.description} />
	<meta property="og:type" content="website" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<main>
	<RoomDirector />
	<AudioGates />
	<AgentCursor />
</main>