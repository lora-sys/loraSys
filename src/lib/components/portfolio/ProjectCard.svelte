<script lang="ts">
	import Badge from '../ui/badge/badge.svelte';
	import OptimizedImage from '../ui/optimized-image.svelte';

	interface Props {
		title: string;
		href?: string;
		descriptionHtml?: string;
		dates: string;
		tags: readonly string[];
		image?: string;
		video?: string;
		links?: { icon: any; type: string; href: string }[];
	}

	let {
		title,
		href = '',
		descriptionHtml,
		dates,
		tags,
		image = '',
		video = '',
		links = []
	}: Props = $props();
</script>

<!-- Card with gradient border on hover -->
<div
	class="group relative h-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_hsl(45_100%_70%_/0.1)]"
>
	<!-- Gradient border glow on hover -->
	<div
		class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
		style="background: radial-gradient(ellipse at top left, hsl(45_100%_70%_/0.08) 0%, transparent 50%); pointer-events: none;"
	></div>

	<a href={href || '#'} class="block cursor-pointer">
		{#if video}
			<video
				class="mx-auto h-40 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
				src={video}
				autoplay
				loop
				muted
				playsinline
				preload="metadata"
				aria-hidden="true"
			></video>
		{:else}
			<div class="relative overflow-hidden">
				<OptimizedImage
					src={image}
					alt={title}
					class="h-40 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				<!-- Gradient overlay on hover -->
				<div
					class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					style="background: linear-gradient(to top, hsl(45_100%_70%_/0.1) 0%, transparent 50%);"
				></div>
			</div>
		{/if}
	</a>

	<!-- Card content -->
	<div class="flex flex-1 flex-col p-4">
		<div class="space-y-1">
			<div
				class="font-sans text-lg font-semibold transition-colors duration-300 group-hover:text-gold"
			>
				{title}
			</div>
			<time class="font-sans text-xs text-muted-foreground">{dates}</time>
		</div>

		<div class="mt-2 flex-1">
			<div
				class="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert"
			>
				{@html descriptionHtml}
			</div>
		</div>

		{#if tags && tags.length > 0}
			<div class="mt-3 flex flex-wrap gap-1">
				{#each tags as tag}
					<Badge
						class="rounded-[4px] border border-border/50 bg-card px-2 py-0.5 text-[10px] text-card-foreground transition-colors duration-300 hover:border-gold/40 hover:text-gold"
					>
						{tag}
					</Badge>
				{/each}
			</div>
		{/if}

		{#if links && links.length > 0}
			<div class="mt-3 flex items-center gap-2">
				{#each links as link}
					<a
						href={link?.href}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-1 text-xs text-muted-foreground transition-colors duration-300 hover:text-gold"
					>
						<link.icon class="mb-px size-3" strokeWidth={1.6} />
						{link.type}
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Gold accent line at bottom -->
	<div
		class="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-all duration-700 group-hover:w-full"
	></div>
</div>
