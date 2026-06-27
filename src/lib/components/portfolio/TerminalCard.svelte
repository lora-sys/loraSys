<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		title: string;
		description: string;
		technologies: string[];
		href?: string;
		video?: string;
		image?: string;
		dates?: string;
		class?: string;
		ref?: HTMLElement | null;
	}

	let {
		title,
		description,
		technologies,
		href = '#',
		video = '',
		image = '',
		dates = '',
		class: className,
		ref: rootEl = $bindable(null)
	}: Props = $props();

	const fileName = title.toLowerCase().replace(/\s+/g, '-') + '.tsx';
	const shortDesc = description.length > 80 ? description.slice(0, 80) + '...' : description;
	const domain = href.startsWith('http') ? new URL(href).hostname : href;
</script>

<div
	bind:this={rootEl}
	class={cn(
		'group relative rounded-xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md transition-all duration-300 focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-black/40',
		className
	)}
>
	<!-- Terminal Header -->
	<div
		class="relative flex select-none items-center justify-between gap-4 rounded-t-xl border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-3"
	>
		<div class="flex items-center gap-2">
			<div
				class="h-2.5 w-2.5 rounded-full bg-zinc-800 transition-colors duration-200 group-hover:bg-red-500/60"
				aria-hidden="true"
			></div>
			<div
				class="h-2.5 w-2.5 rounded-full bg-zinc-800 transition-colors duration-200 group-hover:bg-yellow-500/60"
				aria-hidden="true"
			></div>
			<div
				class="h-2.5 w-2.5 rounded-full bg-zinc-800 transition-colors duration-200 group-hover:bg-green-500/60"
				aria-hidden="true"
			></div>
		</div>
		<div class="absolute left-1/2 -translate-x-1/2">
			<span
				class="font-mono text-[11px] font-medium tracking-tight text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400"
			>
				{fileName}
			</span>
		</div>
		{#if dates}
			<span
				class="font-mono text-[10px] text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400"
			>
				{dates}
			</span>
		{:else}
			<div class="w-10"></div>
		{/if}
	</div>

	<!-- Content -->
	<div class="p-6">
		<!-- Code comment style header -->
		<div class="mb-4 flex items-center gap-2 font-mono text-sm leading-none">
			<span class="select-none text-emerald-500/40">//</span>
			<span class="font-semibold tracking-tight text-zinc-200">{title}</span>
		</div>

		<!-- Description as comment -->
		<div class="mb-6 font-mono text-[13px] leading-relaxed text-zinc-400">
			<span class="select-none text-zinc-600">//</span>
			<span class="ml-1">{shortDesc}</span>
		</div>

		<!-- Video/Image Area -->
		{#if video || image}
			<div
				class="group/media mb-6 overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-950 transition-colors duration-300 hover:border-zinc-700"
			>
				<a
					{href}
					target="_blank"
					rel="noopener noreferrer"
					class="block focus:outline-none"
					aria-label="View project demo for {title}"
				>
					{#if video}
						<video
							class="h-full w-full object-cover transition-transform duration-500 group-hover/media:scale-[1.02]"
							style="max-height: 8rem;"
							src={video}
							autoplay
							loop
							muted
							playsinline
							preload="metadata"
						></video>
					{:else if image}
						<img
							class="h-full w-full object-cover transition-transform duration-500 group-hover/media:scale-[1.02]"
							style="max-height: 8rem;"
							src={image}
							alt="Screenshot of {title}"
							loading="lazy"
						/>
					{/if}
				</a>
			</div>
		{/if}

		<!-- Tech badges -->
		<div class="mb-6 flex flex-wrap items-center gap-2">
			{#each technologies.slice(0, 5) as tech}
				<span
					class="rounded border border-zinc-800/80 bg-zinc-900/50 px-2.5 py-1 font-mono text-[10px] font-medium text-zinc-300 transition-colors duration-200 hover:border-zinc-700 hover:text-zinc-100"
				>
					{tech}
				</span>
			{/each}
			{#if technologies.length > 5}
				<span
					class="select-none pl-1 font-mono text-[11px] font-medium text-zinc-500"
					aria-label="{technologies.length - 5} more technologies"
				>
					+{technologies.length - 5}
				</span>
			{/if}
		</div>

		<!-- Open command -->
		<div class="flex items-center gap-2 font-mono text-xs text-zinc-500">
			<span class="select-none text-emerald-500">$</span>
			<span>open</span>
			<a
				{href}
				target="_blank"
				rel="noopener noreferrer"
				class="rounded text-emerald-400 underline decoration-emerald-500/20 underline-offset-4 transition-all duration-150 hover:text-emerald-300 hover:decoration-emerald-400/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
			>
				{domain}
			</a>
		</div>
	</div>
</div>
