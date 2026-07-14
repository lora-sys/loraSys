<script lang="ts">
	// RoomDirector — routes by agent.room. Manages per-room layout tokens.
	import { agent } from './AgentState.svelte';
	import AgentOrb from './AgentOrb.svelte';
	import AgentStatus from './AgentStatus.svelte';
	import AgentVoice from './AgentVoice.svelte';
	import AgentInput from './AgentInput.svelte';
	import VoxelShips from './VoxelShips.svelte';
	import ProjectReveal from './ProjectReveal.svelte';
	import NowMetrics from './NowMetrics.svelte';

	let activeProject = $state<number | null>(null);

	const rooms = {
		'01': { title: 'I BUILD SYSTEMS THAT LEARN.' },
		'02': {
			lines: [
				'LORA.',
				"XI'AN, EARTH.",
				'ROLE: BUILDER OF SYSTEMS THAT LEARN.',
				'STACK: TYPESCRIPT · SVELTE · THREE.JS · AGENTS · ZK.',
				'FOCUS: AI · WEB3 · DX.',
				'SHIPPED: 7 PROJECTS · 12 HACKATHONS · 103 REPOS.'
			]
		},
		'03': { title: "I'VE SHIPPED 7 THINGS THIS YEAR." },
		'04': { title: 'I WRITE ABOUT AGENTS.' },
		'05': { title: '/NOW' },
		'06': { title: 'WRITE ME.' }
	} as const;
</script>

<div class="director" data-room={agent.room}>
	<header class="topbar">
		<AgentStatus />
		<nav class="rooms" aria-label="rooms">
			{#each Object.keys(rooms) as r}
				<button
					class:active={agent.room === r}
					onclick={() => agent.setRoom(r as keyof typeof rooms)}
				>
					<span class="num">/</span>{r}
				</button>
			{/each}
		</nav>
	</header>

	<main class="stage" data-mode={agent.mode}>
		{#if agent.room === '01'}
			<section class="room room-01">
				<AgentOrb mode={agent.mode} />
				<h1 class="agent-hero hero-text">{rooms['01'].title}</h1>
				<AgentInput />
			</section>
		{:else if agent.room === '02'}
			<section class="room room-02">
				<AgentOrb mode={agent.mode} />
				<div class="self-lines">
					{#each rooms['02'].lines as line, i}
						<p class="self-line">
							<span class="self-prefix">{String(i + 1).padStart(2, '0')}</span>
							<AgentVoice text={line} />
						</p>
					{/each}
				</div>
			</section>
		{:else if agent.room === '03'}
			<section class="room room-03">
				<h2 class="agent-room-title">{rooms['03'].title}</h2>
				<VoxelShips bind:activeProject />
				{#if activeProject !== null}
					<ProjectReveal index={activeProject} />
				{/if}
			</section>
		{:else if agent.room === '04'}
			<section class="room room-04">
				<h2 class="agent-room-title">{rooms['04'].title}</h2>
				<p class="agent-mono hint">3 articles · click to read</p>
			</section>
		{:else if agent.room === '05'}
			<section class="room room-05">
				<h2 class="agent-now-headline">{rooms['05'].title}</h2>
				<NowMetrics />
			</section>
		{:else if agent.room === '06'}
			<section class="room room-06">
				<AgentOrb mode={agent.mode} />
				<h2 class="agent-room-title reach-title">{rooms['06'].title}</h2>
				<form
					class="reach-form"
					action="mailto:lorasys@outlook.com"
					method="post"
					enctype="text/plain"
				>
					<input type="email" name="email" placeholder="your@email" aria-label="email" />
					<textarea name="message" placeholder="message (optional)" rows="2"></textarea>
					<button type="submit" class="agent-mono submit">
						<span class="submit-prompt">$</span>
						<span>send_message</span>
						<span class="arrow">→</span>
					</button>
				</form>
			</section>
		{/if}
	</main>
</div>

<style>
	.director {
		min-height: 100vh;
		background: var(--agent-bg);
		color: var(--agent-fg);
		padding: clamp(16px, 3vh, 32px) var(--space-page-x) var(--space-page-y);
		display: flex;
		flex-direction: column;
		gap: var(--space-room-gap);
	}
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.rooms {
		display: flex;
		gap: clamp(8px, 1.2vw, 16px);
	}
	.rooms button {
		background: transparent;
		border: none;
		color: var(--agent-fg-ghost);
		font-family: var(--font-mono);
		font-size: var(--type-mono-sm);
		letter-spacing: 0.18em;
		cursor: pointer;
		padding: 4px 6px;
		display: inline-flex;
		gap: 1px;
	}
	.rooms button:hover {
		color: var(--agent-fg-dim);
	}
	.rooms button.active {
		color: var(--agent-accent);
	}
	.rooms button .num {
		opacity: 0.6;
	}
	.stage {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 70vh;
	}
	.room {
		display: flex;
		flex-direction: column;
		gap: clamp(24px, 5vh, 64px);
	}
	.room-01 {
		align-items: center;
		text-align: center;
	}
	.hero-text {
		text-align: center;
		max-width: 18ch;
	}
	.room-02 {
		max-width: 900px;
	}
	.self-lines {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.self-line {
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: 16px;
		align-items: baseline;
		font-family: var(--font-mono);
		font-size: var(--type-mono-lg);
		color: var(--agent-fg);
		letter-spacing: 0.04em;
		line-height: 1.4;
	}
	.self-prefix {
		color: var(--agent-fg-ghost);
		font-size: var(--type-mono-sm);
	}
	.room-03 {
		gap: clamp(20px, 4vh, 48px);
	}
	.room-04 {
		gap: clamp(16px, 3vh, 32px);
	}
	.hint {
		font-size: var(--type-mono-sm);
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}
	.room-05 {
		gap: clamp(24px, 5vh, 64px);
	}
	.agent-now-headline {
		font-family: var(--font-display);
		font-size: clamp(4rem, 20vw, 16rem);
		font-weight: 700;
		letter-spacing: -0.06em;
		line-height: 0.85;
		color: var(--agent-fg);
	}
	.room-06 {
		align-items: flex-start;
		gap: clamp(24px, 5vh, 64px);
	}
	.reach-title {
		font-size: clamp(3rem, 12vw, 10rem);
	}
	.reach-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		max-width: 480px;
	}
	.reach-form input,
	.reach-form textarea {
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--agent-line);
		padding: 12px 0;
		font-family: var(--font-mono);
		font-size: var(--type-mono-md);
		color: var(--agent-fg);
		outline: none;
		resize: vertical;
	}
	.reach-form input::placeholder,
	.reach-form textarea::placeholder {
		color: var(--agent-fg-ghost);
	}
	.reach-form input:focus,
	.reach-form textarea:focus {
		border-bottom-color: var(--agent-accent);
	}
	.submit {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		background: transparent;
		border: 1px solid var(--agent-line-strong);
		padding: 12px 20px;
		cursor: pointer;
		color: var(--agent-accent);
		text-transform: lowercase;
		letter-spacing: 0.04em;
		align-self: flex-start;
		transition: border-color 0.2s;
	}
	.submit:hover {
		border-color: var(--agent-accent);
	}
	.submit-prompt {
		color: var(--agent-fg-ghost);
	}
	.arrow {
		margin-left: auto;
	}
</style>