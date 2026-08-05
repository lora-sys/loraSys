<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	let { data } = $props();
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
					<dd>AI · Web3 · DX</dd>
				</dl>
			</div>
		</div>

		<div class="rule"></div>

		<ol class="posts">
			{#each data.posts as post, i (post.slug)}
				<li
					class="row reveal"
					class:featured={i === 0}
					use:reveal
					style="transition-delay: {i * 0.06}s"
				>
					<a href={`${base}/blog/${post.slug}`}>
						<span class="idx">{String(i + 1).padStart(2, '0')}</span>
						<div class="row-main">
							<span class="date">{formatDate(post.date)}</span>
							<h2>{post.title}</h2>
							{#if post.description}<p class="desc">{post.description}</p>{/if}
							<div class="cats">
								{#each post.categories as c}<span>{c}</span>{/each}
							</div>
						</div>
						<span class="go">阅读 →</span>
					</a>
				</li>
			{/each}
		</ol>

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
	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.row {
		position: relative;
		border-top: 1px solid var(--ink-line);
	}
	.row:last-child {
		border-bottom: 1px solid var(--ink-line);
	}
	.row a {
		position: relative;
		display: grid;
		grid-template-columns: 56px 1fr auto;
		gap: 20px;
		align-items: baseline;
		padding: 28px 16px 28px 16px;
		transition:
			background 0.35s ease,
			padding-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.row a::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 0;
		background: var(--zhu);
		transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.row a:hover {
		background: linear-gradient(90deg, rgba(198, 65, 44, 0.06), transparent 50%);
		padding-left: 28px;
	}
	.row a:hover::before {
		width: 4px;
	}
	.idx {
		font-family: var(--font-label);
		font-weight: 900;
		font-size: 1.3rem;
		color: var(--ink-mute);
		transition: color 0.3s ease;
	}
	.row a:hover .idx {
		color: var(--zhu);
	}
	.date {
		display: block;
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin-bottom: 8px;
	}
	.row h2 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.35rem, 2.8vw, 2rem);
		line-height: 1.08;
		letter-spacing: -0.01em;
		margin: 0;
		transition: color 0.3s ease;
	}
	.row a:hover h2 {
		color: var(--zhu);
	}
	.desc {
		margin-top: 8px;
		max-width: 55ch;
		line-height: 1.5;
		color: var(--ink-soft);
		font-size: 0.95rem;
	}
	.cats {
		margin-top: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.cats span {
		font-family: var(--font-label);
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		border: 1px solid var(--ink-line-strong);
		padding: 3px 10px;
		border-radius: 2px;
		color: var(--ink-soft);
		transition:
			border-color 0.25s ease,
			color 0.25s ease;
	}
	.row a:hover .cats span {
		border-color: var(--ink-line-strong);
		color: var(--ink-soft);
	}
	.cats span:hover {
		border-color: var(--zhu);
		color: var(--zhu);
	}
	.go {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--zhu);
		white-space: nowrap;
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.3s ease,
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.row a:hover .go {
		opacity: 1;
		transform: translateX(0);
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
		transition:
			background 0.25s ease,
			color 0.25s ease;
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
	.row.featured {
		border-top: 2px solid var(--ink);
		border-bottom: 2px solid var(--ink);
		margin-bottom: clamp(36px, 6vw, 72px);
	}
	.row.featured a {
		min-height: min(52vh, 560px);
		grid-template-columns: clamp(76px, 9vw, 140px) 1fr auto;
		align-items: center;
		padding: clamp(40px, 7vw, 96px) clamp(16px, 3vw, 44px);
		background: linear-gradient(120deg, rgba(198, 65, 44, 0.08), transparent 54%);
	}
	.row.featured .idx {
		align-self: start;
		font-size: clamp(4rem, 10vw, 9rem);
		line-height: 0.8;
		letter-spacing: -0.08em;
		color: transparent;
		-webkit-text-stroke: 1px var(--ink-line-strong);
	}
	.row.featured h2 {
		max-width: 15ch;
		font-size: clamp(2.4rem, 6vw, 6rem);
		line-height: 0.92;
		letter-spacing: -0.045em;
	}
	.row.featured .desc {
		margin-top: 22px;
		font-size: clamp(1rem, 1.4vw, 1.2rem);
		max-width: 48ch;
	}
	@media (max-width: 760px) {
		.head {
			grid-template-columns: 1fr;
			align-items: flex-start;
			gap: 20px;
		}
		.row a {
			grid-template-columns: 40px 1fr;
		}
		.go {
			display: none;
		}
		.row.featured a {
			min-height: 56vh;
			grid-template-columns: 1fr;
			align-content: space-between;
		}
		.row.featured .idx {
			font-size: 5rem;
		}
	}
</style>
