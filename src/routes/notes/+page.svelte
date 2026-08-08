<script lang="ts">
	import { base } from '$app/paths';
	import { DATA } from '$lib/data/resume';
	import BackToTop from '$lib/components/ui/back-to-top/back-to-top.svelte';

	let notes = $state(DATA.notes);
</script>

<svelte:head>
	<title>速记 — 一手笔记 | Lora Sys</title>
	<meta name="description" content="Lora 的一手笔记 — AI、Web3、工程实践的思考速记。" />
	<link rel="canonical" href="https://lora-sys.github.io/loraSys/notes" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="速记 — Lora Sys" />
	<meta property="og:description" content="Lora 的一手笔记。" />
	<meta property="og:url" content="https://lora-sys.github.io/loraSys/notes" />
	<meta property="og:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="速记 — Lora Sys" />
	<meta name="twitter:description" content="Lora 的一手笔记。" />
	<meta name="twitter:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
</svelte:head>

<main class="notes-page">
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="wrap">
		<p class="tag">Notes · 速</p>

		<div class="head">
			<h1>一手笔记<span class="dim">.notes</span></h1>
			<p class="dek">持续生长中 · {notes.length} 条笔记</p>
		</div>

		<div class="rule"></div>

		<div class="notes-list">
			{#each notes as n, i}
				<article class="note-card" style="--note-delay: {i * 0.06}s">
					<div class="note-header">
						<time class="note-date" datetime={n.date}>{n.date}</time>
						<div class="note-tags">
							{#each n.tags as t}
								<span class="note-tag">{t}</span>
							{/each}
						</div>
					</div>
					<h3 class="note-title">{n.title}</h3>
					<p class="note-summary">{n.summary}</p>
					<div class="note-line" aria-hidden="true"></div>
				</article>
			{/each}
		</div>

		<div class="foot">
			<a href={base + '/'} class="back">← 返回封面</a>
			<span>{notes.length} 条笔记</span>
		</div>
	</div>

	<BackToTop threshold={200} />
</main>

<style>
	.notes-page {
		position: relative;
		min-height: 100vh;
		padding: clamp(60px, 10vh, 120px) 0 96px;
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
		max-width: 900px;
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
		margin-top: 22px;
	}
	h1 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(3rem, 10vw, 7rem);
		line-height: 0.84;
		letter-spacing: -0.04em;
		margin: 0;
	}
	h1 .dim {
		color: var(--ink-mute);
		font-style: italic;
		font-weight: 400;
	}
	.dek {
		font-size: var(--type-dek);
		line-height: 1.45;
		color: var(--ink-soft);
		margin-top: 12px;
	}
	.rule {
		height: 2px;
		background: var(--ink);
		margin: clamp(32px, 5vh, 56px) 0 clamp(28px, 4vh, 48px);
	}

	.notes-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		gap: 0;
	}

	.note-card {
		border-top: 1px solid var(--ink-line);
		padding: 24px 4px;
		animation: fadeIn 0.5s ease both;
		animation-delay: var(--note-delay);
	}
	.note-card:last-child {
		border-bottom: 1px solid var(--ink-line);
	}
	.note-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}
	.note-date {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.note-tags {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.note-tag {
		font-family: var(--font-label);
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 2px 8px;
		border: 1px solid var(--ink-line);
		color: var(--ink-mute);
	}
	.note-title {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: clamp(1.1rem, 2.5vw, 1.4rem);
		letter-spacing: -0.01em;
		line-height: 1.25;
		margin: 0 0 8px;
	}
	.note-summary {
		font-size: 0.92rem;
		line-height: 1.55;
		color: var(--ink-soft);
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.note-line {
		height: 2px;
		background: var(--zhu);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		margin-top: 14px;
	}
	.note-card:hover .note-line {
		transform: scaleX(1);
	}

	.foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: clamp(40px, 6vh, 72px);
		border-top: 2px solid var(--ink);
		padding-top: 20px;
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.back {
		color: var(--ink);
		text-decoration: none;
		transition: color 0.2s;
	}
	.back:hover {
		color: var(--zhu);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 600px) {
		.notes-list {
			grid-template-columns: 1fr;
		}
	}
</style>
