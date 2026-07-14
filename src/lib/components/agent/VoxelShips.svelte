<script lang="ts">
	// VoxelShips — list of 7 projects, click reveals. Vertical stack instead of 3D voxels for Round 1 motion commit.
	import { DATA } from '$lib/data/resume';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	interface Props {
		activeIndex: number | null;
		onpick?: (i: number) => void;
	}
	let { activeIndex = $bindable(null), onpick }: Props = $props();
	let listEl: HTMLElement | undefined = $state();

	onMount(() => {
		if (!listEl) return;
		gsap.fromTo(
			listEl.querySelectorAll('li'),
			{ opacity: 0, y: 12 },
			{ opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
		);
	});

	function click(i: number) {
		activeIndex = i;
		onpick?.(i);
	}
</script>

<ul class="voxel-list" bind:this={listEl}>
	{#each DATA.projects as project, i}
		<li>
			<button
				onclick={() => click(i)}
				class:active={activeIndex === i}
				class="voxel-btn"
			>
				<span class="num">{String(i + 1).padStart(2, '0')}</span>
				<span class="title">{project.title}</span>
				<span class="href">{project.href?.replace(/^https?:\/\//, '')}</span>
				<span class="arrow">→</span>
			</button>
		</li>
	{/each}
</ul>

<style>
	.voxel-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}
	li {
		border-bottom: 1px solid var(--agent-line);
	}
	.voxel-btn {
		display: grid;
		grid-template-columns: 48px 1fr auto 32px;
		gap: 16px;
		align-items: baseline;
		padding: clamp(12px, 1.6vh, 20px) 0;
		width: 100%;
		background: transparent;
		border: none;
		font-family: var(--font-mono);
		text-align: left;
		cursor: pointer;
		color: var(--agent-fg-dim);
		transition: color 0.2s;
	}
	.voxel-btn:hover,
	.voxel-btn.active {
		color: var(--agent-accent);
	}
	.num {
		color: var(--agent-fg-ghost);
		font-size: var(--type-mono-sm);
		letter-spacing: 0.18em;
	}
	.title {
		font-size: var(--type-mono-lg);
		letter-spacing: 0.04em;
		color: inherit;
	}
	.href {
		font-size: var(--type-mono-sm);
		color: var(--agent-fg-ghost);
		letter-spacing: 0.04em;
	}
	.arrow {
		text-align: right;
	}
</style>