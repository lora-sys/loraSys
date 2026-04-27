<script lang="ts">
	import { formatDate } from '$lib/utils';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	let { data } = $props();
	let BLUR_FADE_DELAY = 0.04;
</script>

<svelte:head>
	<title>Blog — lora-sys</title>
	<meta
		name="description"
		content="Writing on software engineering, startups, and indie hacking."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-16 py-16">
	<BlurFade delay={BLUR_FADE_DELAY}>
		<div class="space-y-6 text-center">
			<div class="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
				Writing
			</div>
			<h1 class="font-sans text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
				Blog
			</h1>
			<p class="text-muted-foreground md:text-lg max-w-2xl mx-auto">
				Writing on software engineering, startups, and indie hacking.
			</p>
		</div>
	</BlurFade>

	<div class="space-y-8">
		{#each data.posts as post, id}
			<BlurFade delay={BLUR_FADE_DELAY * 1.5 + id * 0.1}>
				<a
					href="/blog/{post.slug}"
					class="group relative block overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all duration-500 hover:border-primary/30 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-primary/50"
				>
					<!-- Gradient accent line -->
					<div
						class="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-all duration-700 group-hover:w-full"
					></div>

					<div class="space-y-4">
						<div class="flex flex-wrap gap-2">
							{#each post.categories as category}
								<Badge variant="secondary" class="rounded-lg border border-primary/30 text-xs text-primary bg-primary/5">
									{category}
								</Badge>
							{/each}
						</div>

						<h2
							class="font-sans text-xl font-semibold transition-colors duration-300 group-hover:text-primary sm:text-2xl"
						>
							{post.title}
						</h2>

						{#if post.description}
							<p class="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
								{post.description}
							</p>
						{/if}

						<div class="flex items-center justify-between text-sm text-muted-foreground">
							<span>{formatDate(post.date)}</span>
							<div class="flex items-center gap-1 text-primary/60 group-hover:text-primary transition-colors duration-300">
								<span>Read more</span>
								<svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</div>
						</div>
					</div>
				</a>
			</BlurFade>
		{/each}
	</div>
</div>
