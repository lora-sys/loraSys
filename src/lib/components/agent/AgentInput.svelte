<script lang="ts">
	// Intent input — Round 2 wires parseIntent + transitions
	import { agent } from './AgentState.svelte';

	let value = $state('');

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const target = agent.parseIntent(value);
		if (target) {
			agent.setIntent(value);
			agent.setRoom(target);
			value = '';
		}
	}
</script>

<form onsubmit={submit}>
	<input
		type="text"
		bind:value
		placeholder="ASK ME ANYTHING · TYPE work · self · blog · now · email"
		aria-label="Ask the agent"
	/>
</form>

<style>
	form {
		width: 100%;
		max-width: 640px;
	}
	input {
		width: 100%;
		background: transparent;
		border: none;
		border-bottom: 1px solid #27272a;
		padding: 12px 0;
		font-family: ui-monospace, 'Fragment Mono', monospace;
		font-size: 13px;
		letter-spacing: 0.04em;
		color: #e4e4e7;
		outline: none;
	}
	input::placeholder {
		color: #52525b;
	}
	input:focus {
		border-bottom-color: #67e8f9;
	}
</style>