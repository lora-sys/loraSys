<script lang="ts">
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	import BackToTop from '$lib/components/ui/back-to-top/back-to-top.svelte';

	const sections = [
		{
			n: '01',
			title: '营造中',
			items: [
				{ t: 'Agent 沙盒：MCP 工具 + LangGraph', m: '构建中 · 每周' },
				{ t: '设计生成式画布 + 运动系统', m: '探索中 · 每周' }
			]
		},
		{
			n: '02',
			title: '学习中',
			items: [
				{ t: '生成式画布 + 运动系统', m: '墨刊 · 氛围' },
				{ t: 'LangGraph + 多智能体系统', m: '智能体 · 协作' }
			]
		},
		{
			n: '03',
			title: '阅读中',
			items: [{ t: 'Designing Data-Intensive Applications', m: '书籍 · 系统' }]
		},
		{
			n: '04',
			title: '共鸣中',
			items: [{ t: 'Tame Impala — Currents', m: '音乐 · 单曲循环' }]
		}
	];
</script>

<svelte:head>
	<title>/now — Lora 当下的专注</title>
	<meta
		name="description"
		content="Lora 当前的专注：正在打造、学习和探索的方向。/now 页面是一个持续更新的快照。"
	/>
	<link rel="canonical" href="https://lora-sys.github.io/loraSys/now" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="/now — Lora Sys" />
	<meta property="og:description" content="Lora 当前的专注 — 正在打造、学习和探索的方向。" />
	<meta property="og:url" content="https://lora-sys.github.io/loraSys/now" />
	<meta property="og:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="/now — Lora Sys" />
	<meta name="twitter:description" content="Lora 当前的专注 — 正在打造、学习和探索的方向。" />
	<meta name="twitter:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />
</svelte:head>

<main class="now">
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="wrap">
		<p class="tag">Now · 現</p>

		<div class="head">
			<h1>/now<span class="dim">.live()</span></h1>
			<div class="head-side">
				<div class="live-orbit" aria-hidden="true"><span></span><b>实时</b></div>
				<p class="dek">一个持续更新的快照 — 正在打造、学习和探索的方向。</p>
				<dl class="meta">
					<dt>更新于</dt>
					<dd>2026-07</dd>
					<dt>频率</dt>
					<dd>每月</dd>
				</dl>
			</div>
		</div>

		<div class="rule"></div>

		<div class="grid">
			{#each sections as s, i}
				<section class:wide={i === 0}>
					<div class="s-head reveal" use:reveal>
						<span class="n">{s.n} /</span>
						<h2>{s.title}</h2>
					</div>
					<ul>
						{#each s.items as it}
							<li class="reveal" use:reveal>
								<span class="arrow">→</span>
								<div>
									<div class="it-t">{it.t}</div>
									<div class="it-m">{it.m}</div>
								</div>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>

		<div class="elsewhere">
			<p class="elsewhere-tag">别处 · 散</p>
			<div class="elsewhere-grid">
				<a
					href="https://peerlist.io/mierpiter"
					target="_blank"
					rel="noreferrer"
					class="elsewhere-link"
				>
					<span class="arrow">→</span>
					<div>
						<div class="it-t">PeerList</div>
						<div class="it-m">开发者社区</div>
					</div>
				</a>
				<a
					href="https://www.youtube.com/@MierPiter33280"
					target="_blank"
					rel="noreferrer"
					class="elsewhere-link"
				>
					<span class="arrow">→</span>
					<div>
						<div class="it-t">YouTube</div>
						<div class="it-m">视频 · 技术</div>
					</div>
				</a>
				<a
					href="https://space.bilibili.com/431821023"
					target="_blank"
					rel="noreferrer"
					class="elsewhere-link"
				>
					<span class="arrow">→</span>
					<div>
						<div class="it-t">Bilibili</div>
						<div class="it-m">视频 · 技术</div>
					</div>
				</a>
				<a
					href="https://www.zhihu.com/people/lorry-23-28-30"
					target="_blank"
					rel="noreferrer"
					class="elsewhere-link"
				>
					<span class="arrow">→</span>
					<div>
						<div class="it-t">ZhiHu</div>
						<div class="it-m">知乎 · 问答</div>
					</div>
				</a>
			</div>
		</div>

		<div class="foot">
			<a href={base + '/'} class="back">← 返回封面</a>
			<span>04 个版块 · 更新于 2026-07</span>
		</div>
	</div>

	<BackToTop threshold={300} />
</main>

<style>
	.now {
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
		font-size: clamp(4rem, 13vw, 10rem);
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
		margin: clamp(40px, 7vh, 72px) 0 clamp(28px, 5vh, 48px);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 0 clamp(32px, 5vw, 72px);
	}
	.s-head {
		display: flex;
		align-items: baseline;
		gap: 14px;
		margin-bottom: 0;
		padding: 28px 0 18px;
		border-top: 2px solid var(--ink);
	}
	.s-head .n {
		font-family: var(--font-label);
		font-weight: 900;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		color: var(--zhu);
		min-width: 28px;
	}
	.s-head h2 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		letter-spacing: -0.02em;
		margin: 0;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	li {
		display: flex;
		gap: 12px;
		align-items: baseline;
		border-top: 1px solid var(--ink-line);
		padding: 14px 8px;
		transition:
			background 0.3s ease,
			padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	li:last-child {
		border-bottom: 1px solid var(--ink-line);
	}
	li:hover {
		background: linear-gradient(90deg, rgba(198, 65, 44, 0.05), transparent 50%);
		padding-left: 14px;
	}
	.arrow {
		color: var(--zhu);
		font-family: var(--font-label);
		display: inline-block;
		transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	}
	li:hover .arrow {
		transform: translateX(4px);
	}
	.it-t {
		font-size: 1.15rem;
		line-height: 1.35;
		transition: color 0.25s ease;
	}
	li:hover .it-t {
		color: var(--zhu);
	}
	.it-m {
		margin-top: 5px;
		font-family: var(--font-label);
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: clamp(56px, 10vh, 96px);
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
	}
	.elsewhere {
		margin-top: clamp(40px, 7vh, 64px);
	}
	.elsewhere-tag {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin-bottom: 20px;
	}
	.elsewhere-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 0;
	}
	.elsewhere-link {
		display: flex;
		gap: 12px;
		align-items: baseline;
		border-top: 1px solid var(--ink-line);
		padding: 14px 8px;
		transition:
			background 0.3s ease,
			padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.elsewhere-link:hover {
		background: linear-gradient(90deg, rgba(198, 65, 44, 0.05), transparent 50%);
		padding-left: 14px;
	}
	.elsewhere-link .it-t {
		font-size: 1.05rem;
		line-height: 1.35;
		color: var(--ink-soft);
		transition: color 0.25s ease;
	}
	.elsewhere-link:hover .it-t {
		color: var(--zhu);
	}
	.elsewhere-link .it-m {
		margin-top: 5px;
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.live-orbit {
		position: relative;
		width: 76px;
		height: 76px;
		border: 1px solid var(--ink-line-strong);
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-family: var(--font-label);
		font-size: 0.62rem;
		letter-spacing: 0.18em;
		color: var(--zhu);
	}
	.live-orbit::before {
		content: '';
		position: absolute;
		inset: 8px;
		border: 1px dashed var(--ink-line-strong);
		border-radius: 50%;
		animation: orbitSpin 12s linear infinite;
	}
	.live-orbit span {
		position: absolute;
		top: 2px;
		left: 50%;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--zhu);
		box-shadow: 0 0 0 6px rgba(198, 65, 44, 0.12);
	}
	.live-orbit b {
		font-weight: 800;
	}
	@keyframes orbitSpin {
		to {
			transform: rotate(360deg);
		}
	}
	.grid {
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: clamp(28px, 5vw, 72px) clamp(20px, 3vw, 44px);
	}
	.grid section {
		grid-column: span 4;
	}
	.grid section.wide {
		grid-column: span 8;
	}
	.grid section:nth-child(4) {
		grid-column: 9 / -1;
	}
	.grid section.wide .s-head h2 {
		font-size: clamp(2.5rem, 6vw, 5.5rem);
		line-height: 0.9;
	}
	.grid section.wide li {
		padding-block: 22px;
	}
	@media (max-width: 820px) {
		.grid section,
		.grid section.wide,
		.grid section:nth-child(4) {
			grid-column: 1 / -1;
		}
		.live-orbit {
			width: 60px;
			height: 60px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.live-orbit::before {
			animation: none;
		}
	}
</style>
