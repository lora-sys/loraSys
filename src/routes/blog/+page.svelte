<script lang="ts">
	import { formatDate } from '$lib/utils';
	let { data } = $props();
	import { base } from '$app/paths';
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

<main class="relative min-h-screen pb-32 pt-32">
	<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
		<!-- Section label -->
		<div class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
			<span class="text-emerald-400">scene</span>=B / <span class="text-zinc-300">writing</span>
		</div>

		<!-- Giant title with split composition -->
		<div class="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
			<h1
				class="font-heading text-[clamp(3.5rem,12vw,9rem)] font-bold leading-[0.86] tracking-[-0.04em] text-foreground md:col-span-8"
			>
				Writing.
				<span class="text-zinc-500">/dev/log</span>
			</h1>
			<div class="flex flex-col justify-end gap-4 md:col-span-4">
				<p class="font-heading text-lg leading-snug text-zinc-300 md:text-xl">
					On software engineering, AI agents, blockchain, and indie hacking.
				</p>
				<dl class="grid grid-cols-2 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em]">
					<dt class="text-zinc-500">posts</dt>
					<dd class="text-cyan-300">{data.posts.length}</dd>
					<dt class="text-zinc-500">topics</dt>
					<dd class="text-zinc-300">AI · Web3 · DX</dd>
				</dl>
			</div>
		</div>

		<!-- Divider -->
		<div class="mt-16 border-t border-zinc-800/40"></div>

		<!-- Post list — terminal-style horizontal rows -->
		<div class="mt-2">
			{#each data.posts as post, id (post.slug)}
				<a
					href={`${base}/blog/${post.slug}`}
					class="group block border-b border-zinc-800/40 py-8 transition hover:bg-zinc-900/30 md:py-10"
				>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-baseline">
						<div
							class="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 md:col-span-2"
						>
							{formatDate(post.date)}
						</div>

						<div class="md:col-span-7">
							<h2
								class="font-heading text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-cyan-300 md:text-3xl"
							>
								{post.title}
							</h2>
							{#if post.description}
								<p class="mt-2 line-clamp-2 font-mono text-sm leading-relaxed text-zinc-400">
									{post.description}
								</p>
							{/if}
						</div>

						<div class="flex flex-wrap items-center gap-2 md:col-span-3 md:justify-end">
							{#each post.categories as category}
								<span
									class="rounded border border-zinc-800/80 bg-zinc-900/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-300 transition group-hover:border-cyan-400/40 group-hover:text-cyan-300"
								>
									{category}
								</span>
							{/each}
						</div>
					</div>

					<div
						class="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 transition group-hover:text-cyan-300"
					>
						read → {post.slug}
					</div>
				</a>
			{/each}
		</div>

		<!-- Page index strip -->
		<div
			class="mt-16 flex items-center justify-between border-t border-zinc-800/40 pt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600"
		>
			<span>cd /blog</span>
			<span>{data.posts.length} entries</span>
		</div>
	</div>
</main>