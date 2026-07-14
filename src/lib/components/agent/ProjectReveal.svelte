<script lang="ts">
	// ProjectReveal — text overlay after voxel pick. Stub for Round 2.
	import { DATA } from '$lib/data/resume';

	interface Props {
		index: number;
	}
	let { index }: Props = $props();
	let project = $derived(DATA.projects[index]);
</script>

{#if project}
	<div class="reveal">
		<div class="head">
			<span class="num">{String(index + 1).padStart(2, '0')}</span>
			<span class="dot">·</span>
			<span class="title">{project.title}</span>
		</div>
		<p class="desc">{project.description}</p>
		{#if project.href}
			<a class="link" href={project.href} target="_blank" rel="noopener noreferrer">
				→ {project.href.replace(/^https?:\/\//, '')}
			</a>
		{/if}
	</div>
{/if}

<style>
	.reveal {
		display: flex;
		flex-direction: column;
		gap: 12px;
		font-family: ui-monospace, 'Fragment Mono', monospace;
	}
	.head {
		display: flex;
		gap: 8px;
		font-size: 16px;
		color: #e4e4e7;
	}
	.num {
		color: #67e8f9;
	}
	.dot {
		color: #3f3f46;
	}
	.desc {
		font-size: 13px;
		color: #a1a1aa;
		line-height: 1.5;
		max-width: 540px;
	}
	.link {
		font-size: 12px;
		color: #67e8f9;
		text-decoration: none;
		letter-spacing: 0.04em;
	}
	.link:hover {
		text-decoration: underline;
	}
</style>