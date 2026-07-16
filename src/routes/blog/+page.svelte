<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { base } from '$app/paths';
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog — Lora Sys · Software Engineering, Indie Hacking, AI</title>
	<meta
		name="description"
		content="Writing from Lora Sys (Sikandar Bhide) on software engineering, indie hacking, AI agents, and shipping products end-to-end."
	/>
	<link rel="canonical" href="https://lora-sys.github.io/loraSys/blog" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Blog — Lora Sys" />
	<meta
		property="og:description"
		content="Writing on software engineering, indie hacking, AI agents, and shipping products end-to-end."
	/>
</svelte:head>

<main class="blog">
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="wrap">
		<p class="tag">書 · Writing</p>

		<div class="head">
			<h1>Writing<span class="dim">.log</span></h1>
			<div class="head-side">
				<p class="dek">On software engineering, AI agents, blockchain, and indie hacking.</p>
				<dl class="meta">
					<dt>Posts</dt>
					<dd>{data.posts.length}</dd>
					<dt>Topics</dt>
					<dd>AI · Web3 · DX</dd>
				</dl>
			</div>
		</div>

		<div class="rule"></div>

		<ol class="posts">
			{#each data.posts as post, i (post.slug)}
				<li class="row">
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
						<span class="go">read →</span>
					</a>
				</li>
			{/each}
		</ol>

		<div class="foot">
			<a href={base + '/'} class="back">← Back to cover</a>
			<span>{data.posts.length} entries</span>
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
		font-style: italic;
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
		color: var(--zhu);
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
		grid-template-columns: 60px 1fr auto;
		gap: 24px;
		align-items: baseline;
		padding: 30px 0 30px 20px;
		transition:
			background 0.35s ease,
			padding-left 0.35s ease;
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
		background: linear-gradient(90deg, rgba(198, 65, 44, 0.05), transparent 60%);
		padding-left: 32px;
	}
	.row a:hover::before {
		width: 4px;
	}
	.idx {
		font-family: var(--font-label);
		font-weight: 900;
		font-size: 1.4rem;
		color: var(--ink-mute);
		transition: color 0.3s;
	}
	.row a:hover .idx {
		color: var(--zhu);
	}
	.date {
		display: block;
		font-family: var(--font-label);
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin-bottom: 8px;
	}
	.row h2 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		line-height: 1.05;
		letter-spacing: -0.01em;
		margin: 0;
		transition: color 0.3s;
	}
	.row a:hover h2 {
		color: var(--zhu);
	}
	.desc {
		margin-top: 8px;
		max-width: 60ch;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.cats {
		margin-top: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.cats span {
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border: 1px solid var(--ink-line-strong);
		padding: 3px 9px;
		border-radius: 2px;
		color: var(--ink-soft);
	}
	.go {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--zhu);
		white-space: nowrap;
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
	}
</style>
