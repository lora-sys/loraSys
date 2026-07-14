<script lang="ts">
	let { school = '', degree = '', start = '', end = '', logoUrl = '', href = '' } = $props();

	let expanded = $state(false);
</script>

<div class="group font-mono text-xs leading-relaxed">
	<!-- Directory line -->
	<div
		class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-emerald-500/5"
		onclick={() => (expanded = !expanded)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && (expanded = !expanded)}
	>
		<!-- Logo icon -->
		{#if logoUrl}
			<div
				class="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800"
			>
				<img src={logoUrl} alt={school} class="h-4 w-4 object-contain" loading="lazy" />
			</div>
		{:else}
			<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800">
				<span class="text-[10px] text-zinc-500">{school[0]}</span>
			</div>
		{/if}
		<span class="w-[12ch] shrink-0 text-zinc-500">drwxr-xr-x</span>
		<span class="w-[12ch] shrink-0 tabular-nums text-zinc-500">{start}</span>
		<span class="w-[12ch] shrink-0 tabular-nums text-zinc-500">{end}</span>
		<span class="font-semibold text-emerald-400">{school}/</span>
	</div>

	<!-- File line: degree -->
	<div
		class="flex cursor-pointer items-baseline gap-2 rounded px-2 py-1 transition-colors hover:bg-emerald-500/5"
		onclick={() => degree && (expanded = !expanded)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && degree && (expanded = !expanded)}
	>
		<span class="w-[calc(1.5rem+0.5rem)] shrink-0"></span><!-- offset -->
		<span class="w-[12ch] shrink-0 text-zinc-500">-rw-r--r--</span>
		<span class="w-[12ch] shrink-0 text-zinc-500">root</span>
		<span class="w-[12ch] shrink-0 text-zinc-500">root</span>
		<span class="text-zinc-200">{degree}</span>
	</div>

	{#if expanded && href}
		<div
			class="my-1 ml-[calc(1.5rem+0.5rem+12ch+12ch)] overflow-hidden rounded border border-zinc-700 bg-zinc-900/50 px-3 py-2"
		>
			<div class="flex items-center gap-2 text-zinc-500">
				<span class="text-emerald-400">$</span>
				<a
					{href}
					target="_blank"
					rel="noopener noreferrer"
					class="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
				>
					open {href.replace(/https?:\/\//, '')}
				</a>
			</div>
		</div>
	{/if}
</div>
