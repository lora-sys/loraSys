<script lang="ts">
	// Status bar — [ LORA · ONLINE · T+ HH:MM:SS ]
	// Ticking UptimeMs placeholder until Round 2 wires the timer.
	import { agent } from './AgentState.svelte';

	let formatted = $derived(() => {
		const total = Math.floor(agent.uptimeMs / 1000);
		const h = String(Math.floor(total / 3600)).padStart(2, '0');
		const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
		const s = String(total % 60).padStart(2, '0');
		return `${h}:${m}:${s}`;
	});

	let label = $derived(
		agent.mode === 'speaking'
			? 'AGENT SPEAKING'
			: agent.mode === 'awaiting'
				? 'AGENT AWAITING'
				: agent.mode === 'transition'
					? 'AGENT SWITCHING'
					: 'LORA · ONLINE'
	);
</script>

<div class="status">
	<span class="bracket">[</span>
	<span class="label">{label}</span>
	<span class="sep">·</span>
	<span class="ticker">T+ {formatted()}</span>
	<span class="bracket">]</span>
</div>

<style>
	.status {
		display: inline-flex;
		gap: 0.5em;
		font-family: ui-monospace, 'Fragment Mono', monospace;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: #71717a;
	}
	.bracket {
		color: #52525b;
	}
	.label {
		color: #e4e4e7;
	}
	.sep {
		color: #3f3f46;
	}
	.ticker {
		color: #a1a1aa;
	}
</style>