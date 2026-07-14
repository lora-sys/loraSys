<script lang="ts">
	// 3D orb — placeholder Round 1, Threlte wired in Round 2
	import type { AgentMode } from './AgentState.svelte';
	interface Props {
		mode: AgentMode;
	}
	let { mode }: Props = $props();
</script>

<div class="orb" data-mode={mode}>
	<div class="orb-inner"></div>
	<div class="orb-glow"></div>
</div>

<style>
	.orb {
		position: relative;
		width: clamp(180px, 22vw, 320px);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
	}
	.orb-inner {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: radial-gradient(
			circle at 32% 28%,
			#ffffff 0%,
			#d4d4d8 18%,
			#71717a 42%,
			#27272a 72%,
			#000000 100%
		);
		box-shadow:
			0 0 60px -10px rgba(103, 232, 249, 0.18),
			inset 0 0 80px rgba(255, 255, 255, 0.06);
		animation: breathe 4s ease-in-out infinite;
	}
	.orb-glow {
		position: absolute;
		inset: -20%;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(103, 232, 249, 0.12) 0%, transparent 60%);
		filter: blur(20px);
		animation: breathe 4s ease-in-out infinite;
		pointer-events: none;
	}
	.orb[data-mode='speaking'] .orb-inner {
		animation: breathe-fast 2s ease-in-out infinite;
	}
	.orb[data-mode='awaiting'] .orb-inner {
		animation: breathe-slow 6s ease-in-out infinite;
	}
	.orb[data-mode='transition'] .orb-inner {
		animation: breathe-glitch 0.6s steps(2, end) 1;
	}
	@keyframes breathe {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.04); }
	}
	@keyframes breathe-fast {
		0%, 100% { transform: scale(1.02); }
		50% { transform: scale(1.08); }
	}
	@keyframes breathe-slow {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.02); }
	}
	@keyframes breathe-glitch {
		0% { transform: scale(1); }
		50% { transform: scale(1.15) translateX(2px); }
		100% { transform: scale(1); }
	}
</style>