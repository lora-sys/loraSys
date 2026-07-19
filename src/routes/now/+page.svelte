<script lang="ts">
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';

	const sections = [
		{
			n: '01',
			title: 'Building',
			items: [
				{ t: 'lora-sys portfolio — this site', m: 'active · daily' },
				{ t: 'AI agent orchestration experiments', m: 'active · weekly' }
			]
		},
		{
			n: '02',
			title: 'Learning',
			items: [
				{ t: 'Generative canvas + motion systems', m: 'ink · atmosphere' },
				{ t: 'LangGraph + multi-agent systems', m: 'agents · coordination' }
			]
		},
		{
			n: '03',
			title: 'Reading',
			items: [{ t: 'Designing Data-Intensive Applications', m: 'book · systems' }]
		},
		{
			n: '04',
			title: 'Vibing',
			items: [{ t: 'Tame Impala — Currents', m: 'music · on repeat' }]
		}
	];
</script>

<svelte:head>
	<title>/now — What Lora Sys Is Focused On Right Now</title>
	<meta
		name="description"
		content="Current focus of Lora Sys (Sikandar Bhide): what I'm shipping, learning, and exploring right now. The /now page is a living snapshot."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="/now — Lora Sys" />
	<meta
		property="og:description"
		content="Current focus of Lora Sys — what I'm shipping, learning, and exploring right now."
	/>
</svelte:head>

<main class="now">
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="wrap">
		<p class="tag">Now · 現</p>

		<div class="head">
			<h1>/now<span class="dim">.live()</span></h1>
			<div class="head-side">
				<p class="dek">A living snapshot — what I'm shipping, learning, and exploring right now.</p>
				<dl class="meta">
					<dt>Updated</dt>
					<dd>2026-07</dd>
					<dt>Cadence</dt>
					<dd>Monthly</dd>
				</dl>
			</div>
		</div>

		<div class="rule"></div>

		<div class="grid">
			{#each sections as s}
				<section>
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

		<div class="foot">
			<a href={base + '/'} class="back">← Back to cover</a>
			<span>04 sections · last updated 2026-07</span>
		</div>
	</div>
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
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: clamp(32px, 5vh, 56px) clamp(32px, 5vw, 72px);
	}
	.s-head {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 22px;
	}
	.s-head .n {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.28em;
		color: var(--zhu);
	}
	.s-head h2 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.75rem, 3.5vw, 2.75rem);
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
		transition: background 0.3s ease, padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
</style>
