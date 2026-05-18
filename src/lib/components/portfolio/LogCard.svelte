<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let {
		title = '',
		description = '',
		descriptionHtml,
		dates = '',
		location = '',
		image: _image,
		links = [],
		pid
	}: {
		title: string;
		description: string;
		descriptionHtml?: string;
		dates: string;
		location: string;
		image?: string;
		links?: readonly { icon?: any; title: string; href: string }[];
		pid: number;
	} = $props();

	let expanded = $state(false);
</script>

<div class="group font-mono text-xs leading-relaxed">
	<!-- Log line -->
	<div
		class="flex cursor-pointer items-baseline gap-2 rounded px-2 py-1 transition-colors hover:bg-emerald-500/5"
		onclick={() => (expanded = !expanded)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && (expanded = !expanded)}
	>
		<span class="shrink-0 text-zinc-400">[{dates}]</span>
		<span class="shrink-0 text-zinc-500">hackathond[{pid}]:</span>
		<span class="shrink-0 font-semibold text-emerald-400">{title}</span>
		<span
			class="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400"
		>
			STATUS: participated
		</span>
	</div>

	<!-- Expanded details -->
	{#if expanded}
		<div class="my-1 ml-6 border-l border-zinc-700 pl-4">
			{#if location}
				<div class="flex items-baseline gap-2 py-0.5">
					<span class="w-16 shrink-0 text-zinc-500">LOCATION:</span>
					<span class="text-zinc-300">{location}</span>
				</div>
			{/if}
			{#if description}
				<div class="flex items-baseline gap-2 py-0.5">
					<span class="w-16 shrink-0 text-zinc-500">DESC:</span>
					<span class="text-zinc-300">{@html descriptionHtml ?? description}</span>
				</div>
			{/if}
			{#if links && links.length > 0}
				<div class="flex items-baseline gap-2 py-0.5">
					<span class="w-16 shrink-0 text-zinc-500">LINKS:</span>
					<div class="flex flex-wrap gap-1.5">
						{#each links as link}
							<a href={link.href} target="_blank" rel="noopener noreferrer">
								<Badge
									variant="secondary"
									class="border-zinc-700 bg-zinc-800 font-mono text-[10px] text-zinc-300"
								>
									{link.title}
								</Badge>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
