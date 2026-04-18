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

<div class="mx-auto max-w-3xl space-y-12 py-12">
	<BlurFade delay={BLUR_FADE_DELAY}>
		<div class="space-y-4">
			<p class="text-sm font-medium uppercase tracking-widest text-gold">Writing</p>
			<h1 class="font-serif text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
			<p class="text-muted-foreground md:text-lg">
				Writing on software engineering, startups, and indie hacking.
			</p>
		</div>
	</BlurFade>

	<div class="space-y-4">
		{#each data.posts as post, id}
			<BlurFade delay={BLUR_FADE_DELAY * 1.5 + id * 0.05}>
				<a
					href="/blog/{post.slug}"
					class="group relative block overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_25px_hsl(45_100%_70%_/0.08)]"
				>
					<!-- Gold accent line -->
					<div
						class="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-all duration-700 group-hover:w-full"
					></div>

					<div class="space-y-3">
						<h2
							class="font-serif text-xl font-semibold transition-colors duration-300 group-hover:text-gold sm:text-2xl"
						>
							{post.title}
						</h2>

						{#if post.description}
							<p class="line-clamp-2 text-sm text-muted-foreground">
								{post.description}
							</p>
						{/if}

						<div class="flex flex-wrap items-center gap-3">
							{#each post.categories as category}
								<Badge variant="secondary" class="rounded-lg text-xs">
									{category}
								</Badge>
							{/each}
							<span class="text-xs text-muted-foreground">{formatDate(post.date)}</span>
						</div>
					</div>

					<!-- Arrow indicator -->
					<div
						class="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-gold"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</div>
				</a>
			</BlurFade>
		{/each}
	</div>
</div>
