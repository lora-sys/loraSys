<script lang="ts">
	// Intent input — wires parseIntent + Room transition
	import { agent } from './AgentState.svelte';
	import { gsap } from 'gsap';

	let value = $state('');
	let justFailed = $state(false);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const v = value.trim();
		if (!v) return;
		const target = agent.parseIntent(v);
		if (target) {
			agent.setIntent(v);
			agent.setRoom(target);
			value = '';
			justFailed = false;
			// Subtle haptic — scale pulse on input
			gsap.fromTo(
				e.target,
				{ scale: 1 },
				{ scale: 0.985, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.inOut' }
			);
		} else {
			justFailed = true;
			gsap.fromTo(
				e.target,
				{ x: 0 },
				{ x: 8, duration: 0.06, yoyo: true, repeat: 3, ease: 'power2.inOut' }
			);
		}
	}
</script>

<form onsubmit={submit}>
	<input
		type="text"
		bind:value
		placeholder={justFailed ? 'NOT RECOGNIZED · TRY work · self · blog · now · email' : 'ASK ME ANYTHING · TYPE work · self · blog · now · email'}
		aria-label="Ask the agent"
		class:fail={justFailed}
	/>
	<p class="hint">SPACE cycles thoughts · 1-6 jump rooms · ENTER submits</p>
</form>

<style>
	form {
		width: 100%;
		max-width: 640px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	input {
		width: 100%;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--agent-line-strong);
		padding: 12px 0;
		font-family: var(--font-mono);
		font-size: var(--type-mono-md);
		letter-spacing: 0.06em;
		color: var(--agent-fg);
		outline: none;
		transition: border-color 0.25s;
	}
	input::placeholder {
		color: var(--agent-fg-ghost);
		text-transform: uppercase;
	}
	input:focus {
		border-bottom-color: var(--agent-accent);
	}
	input.fail {
		border-bottom-color: #f87171;
	}
	.hint {
		font-family: var(--font-mono);
		font-size: var(--type-mono-sm);
		color: var(--agent-fg-ghost);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		margin: 0;
	}
</style>