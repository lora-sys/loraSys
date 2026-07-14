<script lang="ts">
	// 3D orb — placeholder until Round 2 wires Threlte
	import type { AgentMode } from './AgentState.svelte';
	interface Props {
		mode: AgentMode;
	}
	let { mode }: Props = $props();
</script>

<div class="orb-placeholder" data-mode={mode}></div>

<style>
	.orb-placeholder {
		width: clamp(180px, 24vw, 360px);
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 35%, #fff 0%, #ccc 30%, #555 70%, #000 100%);
		opacity: 0.9;
	}
</style>