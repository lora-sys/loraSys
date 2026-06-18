<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Marquee from '$lib/components/magic/marquee/marquee.svelte';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { formatDate } from '$lib/utils';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let { data } = $props();

	const ldJson = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.meta?.title ?? '',
		datePublished: data.meta?.date ?? '',
		description: data.meta?.description ?? '',
		keywords: data.meta?.categories?.join(', ') ?? '',
		author: { '@type': 'Person', name: 'lora' }
	});
	const ldJsonTag = '<script type="application/ld+json">' + ldJson + '<' + '/script>';

	// Extract headings for TOC — read actual DOM ids (set after mount when content renders)
	let toc = $state<Array<{ id: string; text: string; level: number }>>([]);

	let activeHeading = $state('');
	let tocDrawerOpen = $state(false);

	// Track active heading on scroll
	onMount(() => {
		let observer: IntersectionObserver | undefined;

		// Small delay to let async/mdsvex content render headings with ids
		const timer = setTimeout(() => {
			const headings = document.querySelectorAll(
				'article h1, article h2, article h3, article h4, article h5, article h6'
			);
			toc = Array.from(headings).map((h) => ({
				id: h.id || '',
				text: h.textContent || '',
				level: parseInt(h.tagName.charAt(1))
			}));

			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							activeHeading = entry.target.id;
						}
					}
				},
				{ rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
			);
			headings.forEach((h) => observer!.observe(h));
		}, 100);

		return () => {
			clearTimeout(timer);
			observer?.disconnect();
		};
	});

	// Code copy functionality
	onMount(() => {
		const timer = setTimeout(() => {
			document.querySelectorAll('pre').forEach((pre) => {
				if (pre.querySelector('.copy-btn')) return;
				const btn = document.createElement('button');
				btn.className =
					'copy-btn absolute top-2 right-2 rounded-md border border-border/50 bg-background/80 px-2 py-1 text-xs font-mono text-muted-foreground opacity-0 transition-opacity duration-200 hover:bg-muted hover:text-foreground backdrop-blur-sm';
				btn.textContent = 'Copy';
				btn.onclick = async () => {
					const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
					try {
						await navigator.clipboard.writeText(code);
						btn.textContent = 'Copied!';
						setTimeout(() => {
							btn.textContent = 'Copy';
						}, 2000);
					} catch {
						btn.textContent = 'Failed';
						setTimeout(() => {
							btn.textContent = 'Copy';
						}, 2000);
					}
				};
				pre.style.position = 'relative';
				pre.appendChild(btn);
				pre.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
				pre.addEventListener('mouseleave', () => (btn.style.opacity = '0'));
			});
		}, 200);

		return () => clearTimeout(timer);
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta?.title ?? 'Blog Post'} — lora</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta?.title ?? ''} />
	{@html ldJsonTag}
</svelte:head>

<div class="relative mx-auto max-w-6xl px-4 py-12 lg:px-8">
	<div class="flex gap-8">
		<!-- Main content -->
		<article class="min-w-0 max-w-2xl flex-1">
			<BlurFade>
				<!-- Back button -->
				<a
					href={`${base}/blog`}
					class="group mb-8 inline-flex items-center gap-1 font-mono font-pixel-square text-sm text-muted-foreground transition-colors hover:text-term-green"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="transition-transform duration-300 group-hover:-translate-x-1"
					>
						<path d="m12 19-7-7 7-7" />
						<path d="M19 12H5" />
					</svg>
					cd ../blog
				</a>

				<!-- Title -->
				<hgroup class="mb-8 space-y-4">
					<div class="flex flex-wrap gap-2">
						{#each data.meta?.categories ?? [] as category}
							<Badge
								variant="secondary"
								class="rounded-lg border border-term-green/30 font-mono text-xs text-term-green"
							>
								{category}
							</Badge>
						{/each}
					</div>
					<h1
						class="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
					>
						{data.meta?.title ?? ''}
					</h1>
					<p class="font-mono text-sm text-muted-foreground">
						{data.meta?.date ? formatDate(data.meta.date) : ''} / by {data.meta?.author ?? 'lora'}
					</p>
				</hgroup>

				<Separator class="mb-8 border-border/50" />

				<!-- Mobile TOC toggle -->
				{#if toc.length > 0}
					<button
						onclick={() => (tocDrawerOpen = !tocDrawerOpen)}
						class="mb-6 flex w-full items-center justify-between rounded-lg border border-border/50 bg-card/50 px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:bg-card/80 lg:hidden"
					>
						<span>Table of Contents</span>
						<svg
							class="h-4 w-4 transition-transform {tocDrawerOpen ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if tocDrawerOpen}
						<nav class="mb-6 rounded-xl border border-border/50 bg-card/50 p-4 lg:hidden">
							{#each toc as heading}
								<a
									href="#{heading.id}"
									onclick={() => (tocDrawerOpen = false)}
									class="block rounded px-2 py-1.5 font-mono text-sm transition-colors
										{activeHeading === heading.id
										? 'bg-term-green/10 text-term-green'
										: 'text-muted-foreground hover:text-foreground'}"
									style="padding-left: {(heading.level - 1) * 0.75}rem;"
								>
									{#if heading.level > 1}
										<span class="mr-2 text-term-green/50">{'-'.repeat(heading.level - 1)}</span>
									{/if}
									{heading.text}
								</a>
							{/each}
						</nav>
					{/if}
				{/if}

				<!-- Post content -->
				<div
					class="prose prose-lg max-w-none font-sans
						dark:prose-invert
						prose-headings:font-sans prose-headings:tracking-tight
						prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
						prose-p:text-base prose-p:leading-relaxed
						prose-a:text-term-green prose-a:no-underline hover:prose-a:underline
						prose-blockquote:border-l-term-green prose-blockquote:text-muted-foreground
						prose-code:rounded prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm
						prose-pre:border prose-pre:border-border/50 prose-pre:bg-term-bg
						prose-img:rounded-xl prose-img:shadow-lg"
				>
					<data.content />
				</div>

				<!-- Footer -->
				<Separator class="my-8 border-border/50" />
				<div class="flex items-center justify-between font-mono text-sm text-muted-foreground">
					<a
						href={`${base}/blog`}
						class="flex items-center gap-1 transition-colors hover:text-term-green"
					>
						<span class="text-term-green">$</span> <span class="font-pixel-square">cd ../blog</span>
					</a>
					<span>by {data.meta?.author ?? 'lora'}</span>
				</div>
			</BlurFade>
		</article>

		<!-- Right-side fixed TOC (desktop only) -->
		{#if toc.length > 0}
			<aside class="hidden w-64 shrink-0 lg:block">
				<div class="sticky top-24">
					<div class="rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm">
						<h3
							class="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground"
						>
							<svg
								class="h-3.5 w-3.5 text-term-green"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
								/>
							</svg>
							Table of Contents
						</h3>
						<nav class="space-y-0.5">
							{#each toc as heading}
								<a
									href="#{heading.id}"
									class="flex items-center gap-1 rounded-md px-2 py-1.5 font-mono text-xs transition-all duration-200
										{activeHeading === heading.id
										? 'bg-term-green/10 font-medium text-term-green'
										: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
									style="padding-left: {(heading.level - 1) * 0.625 + 0.5}rem;"
								>
									{#if heading.level > 1}
										<span class="font-pixel-line text-term-green/40">{'├'}</span>
									{:else}
										<span class="font-pixel-line text-term-green/60">{'└'}</span>
									{/if}
									<span class="truncate">{heading.text}</span>
								</a>
							{/each}
						</nav>
					</div>
				</div>
			</aside>
		{/if}
	</div>

	<!-- Tags Marquee -->
	{#if (data.meta?.categories?.length ?? 0) > 0}
		<div class="mt-16 border-t border-border/40 pt-8">
			<p class="mb-4 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
				Tags
			</p>
			<Marquee pauseOnHover class="[--duration:20s]">
				{#each [...(data.meta?.categories ?? []), ...(data.meta?.categories ?? []), ...(data.meta?.categories ?? [])] as tag}
					<span
						class="mx-3 inline-block rounded-full border border-term-green/20 bg-term-green/5 px-4 py-1.5 font-mono text-sm text-term-green"
					>
						#{tag}
					</span>
				{/each}
			</Marquee>
		</div>
	{/if}
</div>
