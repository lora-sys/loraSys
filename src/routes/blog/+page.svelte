<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	let { data } = $props();

	const allCategories = Array.from(new Set(data.posts.flatMap((p) => p.categories ?? []))).sort();

	let searchQuery = $state('');
	let activeCategory = $state<string | null>(null);

	const filtered = $derived.by(() => {
		let posts = data.posts;
		if (activeCategory !== null) {
			const cat = activeCategory;
			posts = posts.filter((p) => (p.categories ?? []).includes(cat));
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			posts = posts.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.description?.toLowerCase().includes(q) ||
					p.categories?.some((c) => c.toLowerCase().includes(q))
			);
		}
		return posts;
	});

	function readingTime(text: string): number {
		const words = text.split(/\s+/).length;
		return Math.max(1, Math.round(words / 200));
	}
</script>

<svelte:head>
	<title>写作·日志 — Lora Sys</title>
	<meta
		name="description"
		content="Lora Sys 的写作 — 关于软件工程、AI 智能体、区块链和独立开发的技术博客。"
	/>
	<link rel="canonical" href="https://lora-sys.github.io/loraSys/blog" />
	<link rel="alternate" type="application/rss+xml" title="lora 的博客" href="{base}/api/rss.xml" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="写作·日志 — Lora Sys" />
	<meta property="og:description" content="关于软件工程、AI 智能体、区块链和独立开发的写作。" />
	<meta property="og:url" content="https://lora-sys.github.io/loraSys/blog" />
	<meta property="og:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
	<meta property="og:site_name" content="Lora Sys" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="写作·日志 — Lora Sys" />
	<meta name="twitter:description" content="关于软件工程、AI 智能体、区块链和独立开发的写作。" />
	<meta name="twitter:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
</svelte:head>

<main class="blog">
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="writing-mark" aria-hidden="true">書</div>
	<div class="wrap">
		<p class="tag">書 · 写作</p>

		<div class="head">
			<h1>写作<span class="dim">·日志</span></h1>
			<div class="head-side">
				<p class="dek">关于软件工程、AI 智能体、区块链和独立开发。</p>
				<dl class="meta">
					<dt>文章</dt>
					<dd>{data.posts.length}</dd>
					<dt>主题</dt>
					<dd>{allCategories.slice(0, 4).join(' · ')}</dd>
				</dl>
			</div>
		</div>

		<div class="rule"></div>

		<!-- Filter bar -->
		<div class="filter-bar">
			<div class="search-wrap">
				<svg
					class="search-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					type="search"
					placeholder="搜索文章…"
					bind:value={searchQuery}
					class="search-input"
				/>
			</div>
			<div class="cat-pills" role="group" aria-label="分类筛选">
				<button
					class="pill {activeCategory === null ? 'active' : ''}"
					onclick={() => (activeCategory = null)}
				>
					全部
				</button>
				{#each allCategories as cat}
					<button
						class="pill {activeCategory === cat ? 'active' : ''}"
						onclick={() => (activeCategory = activeCategory === cat ? null : cat)}
					>
						{cat}
					</button>
				{/each}
			</div>
		</div>

		{#if filtered.length === 0}
			<p class="no-results">没有匹配的文章。</p>
		{:else}
			<div class="card-grid">
				{#each filtered as post, i}
					<a
						href={`${base}/blog/${post.slug}`}
						class="card reveal"
						class:featured={i === 0 && !activeCategory && !searchQuery}
						use:reveal
						style="transition-delay: {i * 0.05}s"
					>
						<div class="card-head">
							<time class="card-date" datetime={post.date}>
								{formatDate(post.date)}
							</time>
							{#if post.description}
								<span class="card-rt">
									{readingTime(post.description)} 分钟
								</span>
							{/if}
						</div>
						<h2 class="card-title">{post.title}</h2>
						{#if post.description}
							<p class="card-desc">{post.description}</p>
						{/if}
						<div class="card-cats">
							{#each post.categories as c}
								<span class="cat-tag">{c}</span>
							{/each}
						</div>
						<div class="card-hover-line" aria-hidden="true"></div>
					</a>
				{/each}
			</div>
		{/if}

		<div class="foot">
			<a href={base + '/'} class="back">← 返回封面</a>
			<a href={base + '/api/rss.xml'} class="rss" target="_blank" rel="noreferrer">RSS ↗</a>
			<span>{data.posts.length} 篇</span>
		</div>
	</div>
</main>

<style>
	.blog {
		position: relative;
		min-height: 100vh;
		padding: clamp(80px, 14vh, 160px) 0 96px;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-serif);
	}
	.paper-grain {
		position: fixed;
		inset: 0;
		z-index: 50;
		pointer-events: none;
		mix-blend-mode: multiply;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/></svg>");
	}
	.wrap {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 var(--page-x);
	}
	.tag {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--zhu);
	}
	.head {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: clamp(24px, 4vw, 56px);
		align-items: flex-end;
		margin-top: 22px;
	}
	h1 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(3.5rem, 12vw, 9rem);
		line-height: 0.84;
		letter-spacing: -0.04em;
		margin: 0;
	}
	h1 .dim {
		color: var(--ink-mute);
		font-style: normal;
		font-weight: 400;
	}
	.head-side {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.dek {
		font-size: var(--type-dek);
		line-height: 1.45;
		color: var(--ink-soft);
	}
	.meta {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 4px 16px;
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.meta dt {
		color: var(--ink-mute);
	}
	.meta dd {
		color: var(--ink);
		font-weight: 700;
		margin: 0;
	}
	.rule {
		height: 2px;
		background: var(--ink);
		margin: clamp(40px, 7vh, 72px) 0 clamp(8px, 2vh, 16px);
	}

	/* Filter bar */
	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 16px;
		margin-bottom: clamp(32px, 5vh, 48px);
	}
	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 200px;
		max-width: 360px;
	}
	.search-icon {
		position: absolute;
		left: 14px;
		top: 50%;
		translate: 0 -50%;
		color: var(--ink-mute);
		pointer-events: none;
	}
	.search-input {
		width: 100%;
		padding: 10px 14px 10px 40px;
		font-family: var(--font-label);
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		color: var(--ink);
		background: var(--paper);
		border: 1px solid var(--ink-line);
		border-radius: 2px;
		outline: none;
		transition:
			border-color 0.25s,
			box-shadow 0.25s;
	}
	.search-input::placeholder {
		color: var(--ink-mute);
	}
	.search-input:focus {
		border-color: var(--zhu);
		box-shadow: 0 0 0 3px rgba(198, 65, 44, 0.1);
	}
	.cat-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.pill {
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 6px 14px;
		border: 1px solid var(--ink-line);
		border-radius: 100px;
		color: var(--ink-soft);
		background: transparent;
		cursor: pointer;
		transition:
			background 0.25s,
			border-color 0.25s,
			color 0.25s;
	}
	.pill:hover {
		border-color: var(--zhu);
		color: var(--zhu);
	}
	.pill.active {
		background: var(--zhu);
		border-color: var(--zhu);
		color: var(--paper);
	}

	/* Card grid */
	.card-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 28px 28px 24px;
		background: var(--paper);
		border: 1px solid var(--ink-line);
		border-radius: 2px;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.35s,
			box-shadow 0.35s,
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
		overflow: hidden;
	}
	.card:hover {
		border-color: var(--ink-line-strong);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
		transform: translateY(-3px);
	}
	.card-hover-line {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--zhu);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.card:hover .card-hover-line {
		transform: scaleX(1);
	}
	.card.featured {
		grid-column: 1 / -1;
		border-top: 2px solid var(--ink);
		border-bottom: 2px solid var(--ink);
		padding: 40px 44px 36px;
		background: linear-gradient(120deg, rgba(198, 65, 44, 0.06), transparent 60%);
	}
	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 14px;
	}
	.card-date {
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.card-rt {
		font-family: var(--font-label);
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		color: var(--ink-mute);
		opacity: 0.8;
	}
	.card-title {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.2rem, 2vw, 1.6rem);
		line-height: 1.15;
		letter-spacing: -0.01em;
		margin: 0 0 10px;
		transition: color 0.3s;
	}
	.card:hover .card-title {
		color: var(--zhu);
	}
	.card-desc {
		font-size: 0.92rem;
		line-height: 1.55;
		color: var(--ink-soft);
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.card.featured .card-desc {
		-webkit-line-clamp: 3;
		max-width: 58ch;
	}
	.card-cats {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 16px;
	}
	.cat-tag {
		font-family: var(--font-label);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		border: 1px solid var(--ink-line);
		padding: 2px 9px;
		border-radius: 2px;
		color: var(--ink-mute);
		transition:
			border-color 0.25s,
			color 0.25s;
	}
	.card:hover .cat-tag {
		border-color: var(--ink-line-strong);
		color: var(--ink-soft);
	}
	.no-results {
		text-align: center;
		padding: 60px 0;
		font-family: var(--font-label);
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		color: var(--ink-mute);
	}

	.foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: clamp(48px, 9vh, 80px);
		border-top: 2px solid var(--ink);
		padding-top: 20px;
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.back {
		color: var(--ink);
		text-decoration: none;
		transition: color 0.25s;
	}
	.back:hover {
		color: var(--zhu);
	}
	.rss {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		color: var(--zhu);
		border: 1px solid var(--ink-line-strong);
		padding: 5px 14px;
		border-radius: 100px;
		text-decoration: none;
		transition:
			background 0.25s,
			color 0.25s;
	}
	.rss:hover {
		background: var(--zhu);
		color: var(--paper);
	}
	.writing-mark {
		position: fixed;
		right: -0.04em;
		top: 8vh;
		font-family: var(--font-serif);
		font-size: min(48vw, 42rem);
		font-weight: 900;
		line-height: 0.8;
		color: rgba(198, 65, 44, 0.035);
		pointer-events: none;
		user-select: none;
	}

	@media (max-width: 760px) {
		.head {
			grid-template-columns: 1fr;
			align-items: flex-start;
			gap: 20px;
		}
		.card-grid {
			grid-template-columns: 1fr;
			gap: 14px;
		}
		.card {
			padding: 22px 20px 20px;
		}
		.card.featured {
			padding: 28px 24px 24px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card:hover {
			transform: none;
		}
	}
</style>
