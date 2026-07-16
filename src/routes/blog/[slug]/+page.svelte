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

	// Giscus comments
	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://giscus.app/client.js';
		script.setAttribute('data-repo', 'lora-sys/loraSys');
		script.setAttribute('data-repo-id', 'R_kgDORZoeSQ');
		script.setAttribute('data-category', 'Announcements');
		script.setAttribute('data-category-id', 'DIC_kwDORZoeSc4C9UW6');
		script.setAttribute('data-mapping', 'pathname');
		script.setAttribute('data-strict', '0');
		script.setAttribute('data-reactions-enabled', '1');
		script.setAttribute('data-emit-metadata', '1');
		script.setAttribute('data-input-position', 'top');
		script.setAttribute('data-theme', 'light');
		script.setAttribute('data-lang', 'zh-CN');
		script.setAttribute('data-loading', 'lazy');
		script.setAttribute('crossorigin', 'anonymous');
		script.async = true;

		const container = document.querySelector('.giscus');
		if (container) {
			container.appendChild(script);
		}

		return () => {
			script.remove();
		};
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta?.title ?? 'Blog Post'} — Lora Sys</title>
	<meta
		name="description"
		content={data.meta?.description ?? 'Writing on software engineering, AI, and indie hacking.'}
	/>
	<meta name="author" content="Lora Sys (Sikandar Bhide)" />
	{#if data.meta?.categories?.length}
		<meta
			name="keywords"
			content={['Lora Sys', 'Sikandar Bhide', ...(data.meta.categories ?? [])].join(', ')}
		/>
	{/if}
	<link rel="canonical" href={`https://lora-sys.github.io/loraSys/blog/${data.meta?.slug ?? ''}`} />

	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta?.title ?? ''} />
	<meta property="og:description" content={data.meta?.description ?? ''} />
	<meta
		property="og:url"
		content={`https://lora-sys.github.io/loraSys/blog/${data.meta?.slug ?? ''}`}
	/>
	<meta property="og:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
	<meta property="article:published_time" content={data.meta?.date ?? ''} />
	{#if data.meta?.categories?.length}
		<meta property="article:section" content={data.meta.categories[0]} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.meta?.title ?? ''} />
	<meta name="twitter:description" content={data.meta?.description ?? ''} />
	<meta name="twitter:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
	{@html ldJsonTag}
</svelte:head>

<div class="relative mx-auto max-w-6xl px-4 py-12 lg:px-8">
	<div class="flex gap-8">
		<!-- Main content -->
		<article class="min-w-0 max-w-3xl flex-1">
			<!-- Scene label -->
			<div class="mb-6 font-mono text-[11px] uppercase tracking-[0.32em] text-[#8a857c]">
				<span class="text-[#c6412c]">書</span> · <span class="text-[#5a544b]">Field Note</span>
			</div>

			<!-- Back button -->
			<a
				href={`${base}/blog`}
				class="group mb-6 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a857c] transition-colors hover:text-[#c6412c]"
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
				All writing
			</a>

			<!-- Title -->
			<hgroup class="mb-8 space-y-4">
				<div class="flex flex-wrap gap-2">
					{#each data.meta?.categories ?? [] as category}
						<span
							class="rounded border border-[#c6412c]/30 bg-[#c6412c]/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#c6412c]"
						>
							{category}
						</span>
					{/each}
				</div>
				<h1
					class="font-heading text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
				>
					{data.meta?.title ?? ''}
				</h1>
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a857c]">
					<span class="text-[#5a544b]">{data.meta?.date ? formatDate(data.meta.date) : ''}</span>
					<span class="text-[#cfc8ba]">·</span>
					<span>by {data.meta?.author ?? 'lora'}</span>
					{#if data.meta?.readTime}
						<span class="text-[#cfc8ba]">·</span>
						<span class="text-[#c6412c]">{data.meta.readTime} min read</span>
					{/if}
				</p>
			</hgroup>

			<div class="mb-12 border-t border-[#1a1815]/60"></div>

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
									? 'bg-[#c6412c]/10 text-[#c6412c]'
									: 'text-muted-foreground hover:text-foreground'}"
								style="padding-left: {(heading.level - 1) * 0.75}rem;"
							>
								{#if heading.level > 1}
									<span class="mr-2 text-[#c6412c]/50">{'-'.repeat(heading.level - 1)}</span>
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
						prose-a:text-[#c6412c] prose-a:no-underline hover:prose-a:underline
						prose-blockquote:border-l-[#c6412c] prose-blockquote:text-muted-foreground
						prose-code:rounded prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm
						prose-pre:border prose-pre:border-border/50 prose-pre:bg-[#ece7db]
						prose-img:rounded-xl prose-img:shadow-lg"
			>
				<data.content />
			</div>

			<!-- Footer -->
			<Separator class="my-8 border-border/50" />
			<div class="flex items-center justify-between font-mono text-sm text-muted-foreground">
				<a
					href={`${base}/blog`}
					class="flex items-center gap-1 transition-colors hover:text-[#c6412c]"
				>
					<span class="font-pixel-square">← All writing</span>
				</a>
				<span>by {data.meta?.author ?? 'lora'}</span>
			</div>

			<!-- Giscus comments -->
			<Separator class="my-8 border-border/50" />
			<div class="giscus" />
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
								class="h-3.5 w-3.5 text-[#c6412c]"
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
										? 'bg-[#c6412c]/10 font-medium text-[#c6412c]'
										: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
									style="padding-left: {(heading.level - 1) * 0.625 + 0.5}rem;"
								>
									{#if heading.level > 1}
										<span class="font-pixel-line text-[#c6412c]/40">{'├'}</span>
									{:else}
										<span class="font-pixel-line text-[#c6412c]/60">{'└'}</span>
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
		<div class="mt-16 border-t border-[#1a1815]/60 pt-8">
			<p class="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a857c]">
				<span class="text-[#c6412c]">✦</span> Tagged
			</p>
			<Marquee pauseOnHover class="[--duration:20s]">
				{#each [...(data.meta?.categories ?? []), ...(data.meta?.categories ?? []), ...(data.meta?.categories ?? [])] as tag}
					<span
						class="mx-3 inline-block rounded-full border border-[#c6412c]/20 bg-[#c6412c]/5 px-4 py-1.5 font-mono text-sm text-[#c6412c]"
					>
						#{tag}
					</span>
				{/each}
			</Marquee>
		</div>
	{/if}
</div>
