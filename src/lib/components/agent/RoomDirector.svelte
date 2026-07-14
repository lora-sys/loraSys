<script lang="ts">
	// RoomDirector — routes by agent.room. Stub for Round 2/3.
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
	<div class="topbar">
		<AgentStatus />
		<nav class="rooms">
			{#each Object.keys(rooms) as r}
				<button
					class:active={agent.room === r}
					onclick={() => agent.setRoom(r as keyof typeof rooms)}
				>
					{r}
				</button>
			{/each}
		</nav>
	</div>

	<div class="stage">
		<AgentOrb mode={agent.mode} />

		{#if agent.room === '01'}
			<AgentVoice text={rooms['01'].title} />
			<AgentInput />
		{:else if agent.room === '02'}
			<div class="lines">
				{#each rooms['02'].lines as line, i}
					<AgentVoice text={line} />
				{/each}
			</div>
		{:else if agent.room === '03'}
			<AgentVoice text={rooms['03'].title} />
			<VoxelShips bind:activeProject />
			{#if activeProject !== null}
				<ProjectReveal index={activeProject} />
			{/if}
		{:else if agent.room === '04'}
			<AgentVoice text={rooms['04'].title} />
		{:else if agent.room === '05'}
			<AgentVoice text={rooms['05'].title} />
			<NowMetrics />
		{:else if agent.room === '06'}
			<AgentVoice text={rooms['06'].title} />
		{/if}
	</div>
</div>

<style>
	.director {
		min-height: 100vh;
		background: #000;
		color: #fff;
		padding: 32px clamp(24px, 6vw, 96px);
		display: flex;
		flex-direction: column;
		gap: 48px;
	}
	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.rooms {
		display: flex;
		gap: 12px;
	}
	.rooms button {
		background: transparent;
		border: none;
		color: #52525b;
		font-family: ui-monospace, 'Fragment Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.18em;
		cursor: pointer;
	}
	.rooms button.active {
		color: #67e8f9;
	}
	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
		text-align: center;
	}
	.lines {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: ui-monospace, 'Fragment Mono', monospace;
		font-size: 14px;
		color: #e4e4e7;
		letter-spacing: 0.04em;
	}
</style>