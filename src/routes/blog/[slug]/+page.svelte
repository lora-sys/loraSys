<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { formatDate } from '$lib/utils';
	
	let { data } = $props();
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta?.title ?? 'Blog Post'} — lora-sys</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta?.title ?? ''} />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"headline": data.meta?.title ?? '',
		"datePublished": data.meta?.date ?? '',
		"description": data.meta?.description ?? '',
		"keywords": data.meta?.categories?.join(', ') ?? '',
		"author": { "@type": "Person", "name": "lora-sys" }
	})}</script>`}
</svelte:head>

<div class="mx-auto max-w-2xl space-y-8 py-12">
		<!-- Back button -->
		<a
			href="/blog"
			class="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-gold"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300 group-hover:-translate-x-1">
				<path d="m12 19-7-7 7-7"/>
				<path d="M19 12H5"/>
			</svg>
			Back to Blog
		</a>

		<!-- Title -->
		<hgroup class="space-y-3">
			<div class="flex flex-wrap gap-2">
				{#each (data.meta?.categories ?? []) as category}
					<Badge variant="secondary" class="rounded-lg border border-gold/30 text-xs text-gold">
						{category}
					</Badge>
				{/each}
			</div>
			<h1 class="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
				{data.meta?.title ?? ""}
			</h1>
			<p class="text-sm text-muted-foreground">{data.meta?.date ? formatDate(data.meta.date) : ''}</p>
		</hgroup>

		<Separator class="border-border/50" />

		<!-- Post content -->
		<article class="prose prose-lg max-w-none
			prose-headings:font-serif prose-headings:tracking-tight
			prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
			prose-p:text-base prose-p:leading-relaxed
			prose-a:text-gold prose-a:no-underline hover:prose-a:underline
			prose-blockquote:border-l-gold prose-blockquote:text-muted-foreground
			prose-code:text-gold prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
			prose-pre:bg-card prose-pre:border prose-pre:border-border
			prose-img:rounded-xl prose-img:shadow-lg
			prose hr:border-border/50
			dark:prose-invert">
			<data.content />
		</article>

		<!-- Footer -->
		<Separator class="border-border/50" />
		<div class="flex items-center justify-between text-sm text-muted-foreground">
			<a href="/blog" class="flex items-center gap-1 transition-colors hover:text-gold">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="m12 19-7-7 7-7"/>
					<path d="M19 12H5"/>
				</svg>
				All posts
			</a>
			<span>By lora-sys</span>
		</div>
	</div>
