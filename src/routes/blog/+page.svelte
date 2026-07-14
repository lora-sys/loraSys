<script lang="ts">
	import { formatDate } from '$lib/utils';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	let { data } = $props();
	import { base } from '$app/paths';
	let BLUR_FADE_DELAY = 0.04;
</script>

<svelte:head>
	<title>Blog — Lora Sys · Software Engineering, Indie Hacking, AI</title>
	<meta
		name="description"
		content="Writing from Lora Sys (Sikandar Bhide) on software engineering, indie hacking, AI agents, spatial web, and shipping products end-to-end."
	/>
	<meta
		name="keywords"
		content="Lora Sys blog, Sikandar Bhide, software engineering, indie hacking, AI agents, spatial web, monorepo, Svelte, TypeScript"
	/>
	<link rel="canonical" href="https://lora-sys.github.io/loraSys/blog" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Blog — Lora Sys" />
	<meta
		property="og:description"
		content="Writing on software engineering, indie hacking, AI agents, spatial web, and shipping products end-to-end."
	/>
	<meta property="og:url" content="https://lora-sys.github.io/loraSys/blog" />
	<meta property="og:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Blog — Lora Sys" />
	<meta
		name="twitter:description"
		content="Writing on software engineering, indie hacking, AI agents, spatial web, and shipping products end-to-end."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-16 py-16">
	<BlurFade delay={BLUR_FADE_DELAY}>
		<div class="space-y-6 text-center">
			<div
				class="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
			>
				Writing
			</div>
			<h1
				class="bg-gradient-to-r from-foreground to-primary bg-clip-text font-sans text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
			>
				Blog
			</h1>
			<p class="mx-auto max-w-2xl text-muted-foreground md:text-lg">
				Writing on software engineering, startups, and indie hacking.
			</p>
		</div>
	</BlurFade>

	<div class="space-y-8">
		{#each data.posts as post, id}
			<BlurFade delay={BLUR_FADE_DELAY * 1.5 + id * 0.1}>
				<a
					href={`${base}/blog/${post.slug}`}
					class="group relative block overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/5 focus-visible:ring-2 focus-visible:ring-primary/50"
				>
					<!-- Gradient accent line -->
					<div
						class="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-all duration-700 group-hover:w-full"
					></div>

					<div class="space-y-4">
						<div class="flex flex-wrap gap-2">
							{#each post.categories as category}
								<Badge
									variant="secondary"
									class="rounded-lg border border-primary/30 bg-primary/5 text-xs text-primary"
								>
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
							<p class="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
								{post.description}
							</p>
						{/if}

						<div class="flex items-center justify-between text-sm text-muted-foreground">
							<span>{formatDate(post.date)}</span>
							<div
								class="flex items-center gap-1 text-primary/60 transition-colors duration-300 group-hover:text-primary"
							>
								<span>Read more</span>
								<svg
									class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							</div>
						</div>
					</div>
				</a>
			</BlurFade>
		{/each}
	</div>
</div>
