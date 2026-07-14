<script lang="ts">
	// AudioGates — speaker toggle + Web Audio init. Round 2 wires actual sounds.
	import { agent } from './AgentState.svelte';

	function toggle() {
		if (!agent.audioEnabled) {
			// Round 2: initialize AudioContext here on first user gesture.
		}
		agent.toggleAudio();
	}
</script>

<button onclick={toggle} class="speaker" aria-label="Toggle audio">
	{agent.audioEnabled ? '◉ SOUND ON' : '○ SOUND OFF'}
</button>

<style>
	.speaker {
		position: fixed;
		bottom: 24px;
		right: 24px;
		background: transparent;
		border: 1px solid #27272a;
		padding: 6px 12px;
		font-family: ui-monospace, 'Fragment Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.18em;
		color: #71717a;
		cursor: pointer;
		z-index: 100;
	}
	.speaker:hover {
		color: #67e8f9;
		border-color: #67e8f9;
	}
</style>