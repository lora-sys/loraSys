<script lang="ts">
	// Status bar — [ LORA · ONLINE · T+ HH:MM:SS ]
	import { agent } from './AgentState.svelte';

	let formatted = $derived.by(() => {
		const total = Math.floor(agent.uptimeMs / 1000);
		const h = String(Math.floor(total / 3600)).padStart(2, '0');
		const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
		const s = String(total % 60).padStart(2, '0');
		return `${h}:${m}:${s}`;
	});

	let label = $derived.by(() => {
		switch (agent.mode) {
			case 'speaking':
				return { text: 'AGENT SPEAKING', live: true };
			case 'awaiting':
				return { text: 'AGENT AWAITING', live: false };
			case 'transition':
				return { text: 'AGENT SWITCHING', live: true };
			default:
				return { text: 'LORA · ONLINE', live: true };
		}
	});
</script>

<div class="status">
	<span class="bracket">[</span>
	<span class="dot" class:live={label.live}></span>
	<span class="label">{label.text}</span>
	<span class="sep">·</span>
	<span class="ticker">T+ {formatted}</span>
	{#if agent.mode === 'awaiting'}
		<span class="sep">·</span>
		<span class="prompt agent-blink">_</span>
	{/if}
	<span class="bracket">]</span>
</div>

<style>
	.status {
		display: inline-flex;
		gap: 0.5em;
		align-items: center;
		font-family: var(--font-mono);
		font-size: var(--type-mono-sm);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--agent-fg-mute);
	}
	.bracket {
		color: #3f3f46;
	}
	.label {
		color: var(--agent-fg);
	}
	.sep {
		color: #3f3f46;
	}
	.ticker {
		color: var(--agent-fg-dim);
		font-variant-numeric: tabular-nums;
	}
	.prompt {
		color: var(--agent-accent);
		font-weight: 700;
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--agent-fg-ghost);
	}
	.dot.live {
		background: var(--agent-accent);
		box-shadow: 0 0 8px var(--agent-accent);
		animation: pulse 1.4s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}
</style>