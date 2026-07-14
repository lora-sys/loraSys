<script lang="ts">
	// VoxelShips — placeholder for 7 voxels in 3D space
	import { DATA } from '$lib/data/resume';

	interface Props {
		activeIndex: number | null;
		onpick?: (i: number) => void;
	}
	let { activeIndex = $bindable(null), onpick }: Props = $props();

	function click(i: number) {
		activeIndex = i;
		onpick?.(i);
	}
</script>

<ul class="voxel-list">
	{#each DATA.projects as project, i}
		<li>
			<button onclick={() => click(i)} class:active={activeIndex === i}>
				<span class="num">{String(i + 1).padStart(2, '0')}</span>
				<span class="title">{project.title}</span>
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
		gap: 4px;
	}
	button {
		background: transparent;
		border: none;
		padding: 6px 0;
		font-family: ui-monospace, 'Fragment Mono', monospace;
		font-size: 14px;
		color: #a1a1aa;
		cursor: pointer;
		display: flex;
		gap: 16px;
		text-align: left;
	}
	button.active,
	button:hover {
		color: #67e8f9;
	}
	.num {
		color: #52525b;
		width: 24px;
	}
</style>