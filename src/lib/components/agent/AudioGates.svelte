<script lang="ts">
	// AudioGates — speaker toggle + Web Audio init. Round 2 wires actual sounds.
	import { agent } from './AgentState.svelte';

	let ctx: AudioContext | null = null;

	async function toggle() {
		if (!agent.audioEnabled) {
			try {
				const AC = window.AudioContext || (window as any).webkitAudioContext;
				if (AC) ctx = new AC();
				if (ctx && ctx.state === 'suspended') await ctx.resume();
				playClick();
			} catch (e) {
				console.warn('audio init failed', e);
			}
		}
		agent.toggleAudio();
	}

	function playClick() {
		if (!ctx) return;
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.connect(g);
		g.connect(ctx.destination);
		o.frequency.value = 880;
		o.type = 'sine';
		g.gain.setValueAtTime(0.0001, ctx.currentTime);
		g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.005);
		g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
		o.start();
		o.stop(ctx.currentTime + 0.1);
	}
</script>

<button onclick={toggle} class="speaker" aria-label="Toggle audio">
	<span class="dot" class:on={agent.audioEnabled}></span>
	{agent.audioEnabled ? 'SOUND ON' : 'SOUND OFF'}
</button>

<style>
	.speaker {
		position: fixed;
		bottom: 24px;
		right: 24px;
		background: transparent;
		border: 1px solid var(--agent-line-strong);
		padding: 8px 14px;
		font-family: var(--font-mono);
		font-size: var(--type-mono-sm);
		letter-spacing: 0.18em;
		color: var(--agent-fg-mute);
		cursor: pointer;
		z-index: 100;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		transition: color 0.2s, border-color 0.2s;
	}
	.speaker:hover {
		color: var(--agent-accent);
		border-color: var(--agent-accent);
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--agent-fg-ghost);
		transition: background 0.2s, box-shadow 0.2s;
	}
	.dot.on {
		background: var(--agent-accent);
		box-shadow: 0 0 8px var(--agent-accent);
	}
</style>