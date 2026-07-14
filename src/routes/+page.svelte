<script lang="ts">
	// INK EDITION (墨刊) — redo #5. Round 1 · commit 1 (skeleton).
	// Structure + real data + nav. Type/color polish → commit 2. Motion → commit 3.
	import { DATA } from '$lib/data/resume';

	const socials = Object.values(DATA.contact.social).filter((s) => s.url);

	// Contents index doubles as navigation.
	const contents = [
		{ n: '01', cn: '己', title: 'The Self', note: 'who & stack', href: '#self', page: 'P.02' },
		{ n: '02', cn: '作', title: 'Selected Work', note: `${DATA.projects.length} projects`, href: '#work', page: 'P.04' },
		{ n: '03', cn: '戰', title: 'Hackathons', note: 'ETH · Monad', href: '#hack', page: 'P.09' },
		{ n: '04', cn: '閒', title: 'Off Hours', note: 'anime & more', href: '#off', page: 'P.12' },
		{ n: '05', cn: '聯', title: 'Say Hello', note: '', href: '#contact', page: 'P.16' }
	];
</script>

<svelte:head>
	<title>{DATA.name} — Field Notes on Building</title>
	<meta name="description" content={DATA.description} />
	<meta property="og:title" content={`${DATA.name} — Field Notes on Building`} />
	<meta property="og:description" content={DATA.description} />
	<meta property="og:type" content="website" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="edition">
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="ink-wash" aria-hidden="true"></div>
	<!-- MASTHEAD -->
	<header class="mast">
		<a class="logo" href="#top" aria-label="lora — home">
			<span class="word">{DATA.name}</span>
			<span class="seal" aria-hidden="true">lora</span>
		</a>
		<p class="ed-line">
			Field Notes on Building<br />
			<b>Edition 2026 — 103 Repositories</b>
		</p>
	</header>

	<div class="band">
		<span>Builder of Evolving Systems</span>
		<span class="z">AI Agents · Full-Stack · Web3</span>
		<a href={DATA.url}>github.com/lora-sys</a>
	</div>

	<main>
		<!-- 序 COVER / HERO -->
		<section id="top" class="hero">
			<div class="hero-left">
				<p class="tag">Cover · 序</p>
				<h1>I build<br /><span class="it">systems</span><br />that <span class="z">learn.</span></h1>
				<p class="dek">{DATA.description}</p>
			</div>
			<nav class="index" aria-label="Contents">
				<p class="index-h">In This Issue</p>
				<ul>
					{#each contents as c}
						<li>
							<a href={c.href}>
								<span class="l"><span class="n">{c.n}</span> {c.cn} &nbsp;{c.title}{#if c.note}<em> — {c.note}</em>{/if}</span>
								<span class="p">{c.page}</span>
							</a>
						</li>
					{/each}
				</ul>
				<p class="pull">“Turning ambitious ideas into <b>reality</b> — always building, learning, and shipping.”</p>
			</nav>
		</section>

		<!-- 己 THE SELF -->
		<section id="self" class="sec">
			<div class="sec-head"><span class="cn">己</span><h2>The Self</h2><span class="folio">P.02</span></div>
			<div class="self-grid">
				<div class="prose">{@html DATA.summaryHtml}</div>
				<aside>
					<p class="mini-h" id="education">Education</p>
					{#each DATA.education as e}
						<p class="edu"><a href={e.href}>{e.school}</a><br /><em>{e.degree}</em><br /><span class="years">{e.start} — {e.end}</span></p>
					{/each}
					<p class="mini-h">Stack</p>
					<ul class="skills">
						{#each DATA.skills as s}<li>{s}</li>{/each}
					</ul>
				</aside>
			</div>
		</section>

		<!-- 作 SELECTED WORK -->
		<section id="work" class="sec">
			<div class="sec-head"><span class="cn">作</span><h2>Selected Work</h2><span class="folio">P.04</span></div>
			<ol class="work">
				{#each DATA.projects as p, i}
					<li class="row">
						<span class="idx">{String(i + 1).padStart(2, '0')}</span>
						<div class="row-main">
							<a class="row-title" href={p.href}>{p.title}</a>
							<p class="row-desc">{p.description}</p>
							<p class="row-tech">{p.technologies.join(' · ')}</p>
							<p class="row-links">
								{#each p.links as l}<a href={l.href}>{l.type} →</a>{/each}
							</p>
						</div>
						<span class="row-date">{p.dates}</span>
					</li>
				{/each}
			</ol>
		</section>

		<!-- 戰 HACKATHONS -->
		<section id="hack" class="sec">
			<div class="sec-head"><span class="cn">戰</span><h2>Hackathons &amp; Signals</h2><span class="folio">P.09</span></div>
			<ul class="hacks">
				{#each DATA.hackathons as h}
					<li>
						<div class="hk-top"><h3>{h.title}</h3><span>{h.dates}</span></div>
						<p class="hk-loc">{h.location}</p>
						<p class="hk-desc">{h.description}</p>
						{#each h.links as l}<a href={l.href}>{l.title} →</a>{/each}
					</li>
				{/each}
			</ul>
			<p class="repos">103 public repositories on GitHub — AI agents, Web3 dApps, full-stack applications.</p>
		</section>

		<!-- 閒 OFF HOURS -->
		<section id="off" class="sec">
			<div class="sec-head"><span class="cn">閒</span><h2>Off Hours</h2><span class="folio">P.12</span></div>
			<p class="mini-h">Anime</p>
			<ul class="anime">
				{#each DATA.anime as a}
					<li><a href={a.link}><b>{a.name}</b><em>“{a.quote}”</em></a></li>
				{/each}
			</ul>
			<p class="mini-h">Favorites</p>
			<ul class="favs">
				{#each DATA.favorites as f}
					<li><a href={f.href}><b>{f.name}</b><span>{f.description}</span></a></li>
				{/each}
			</ul>
		</section>

		<!-- 聯 CONTACT -->
		<section id="contact" class="sec contact">
			<span class="cn big">聯</span>
			<h2 class="say">Say Hello.</h2>
			<a class="email" href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>
			<ul class="socials">
				{#each socials as s}<li><a href={s.url}>{s.name} →</a></li>{/each}
			</ul>
		</section>
	</main>

	<footer>
		<span>◆ {DATA.name} — Field Notes on Building</span>
		<span>Edition 2026</span>
		<a href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>
	</footer>
</div>

<style>
	.edition {
		position: relative;
		max-width: 1600px;
		margin: 0 auto;
		padding: clamp(20px, 3vw, 40px) var(--page-x) 0;
		font-family: var(--font-serif);
		color: var(--ink);
	}

	/* Atmosphere: paper grain (over all) + soft ink wash (behind content) */
	.paper-grain {
		position: fixed;
		inset: 0;
		z-index: 50;
		pointer-events: none;
		mix-blend-mode: multiply;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/></svg>");
	}
	.ink-wash {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background:
			radial-gradient(50% 45% at 88% 8%, rgba(26, 24, 21, 0.14), transparent 70%),
			radial-gradient(38% 38% at 12% 96%, rgba(198, 65, 44, 0.08), transparent 70%);
		filter: blur(30px);
	}

	/* Masthead */
	.mast {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		border-bottom: 2.5px solid var(--ink);
		padding-bottom: 16px;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 18px;
	}
	.logo .word {
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(2.5rem, 6vw, 4rem);
		line-height: 0.8;
		letter-spacing: -0.02em;
	}
	.seal {
		display: grid;
		place-items: center;
		width: 58px;
		height: 58px;
		border-radius: 8px;
		background: var(--zhu);
		color: var(--paper);
		font-family: var(--font-serif);
		font-optical-sizing: auto;
		font-weight: 900;
		font-style: italic;
		font-size: 20px;
		line-height: 1;
		letter-spacing: -0.02em;
		text-align: center;
		transform: rotate(-4deg);
		box-shadow: inset 0 0 0 2.5px rgba(243, 239, 230, 0.32);
	}
	.ed-line {
		text-align: right;
		font-family: var(--font-label);
		font-size: var(--type-label);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		line-height: 1.7;
		color: var(--ink-soft);
	}
	.ed-line b {
		color: var(--ink);
	}
	.band {
		display: flex;
		flex-wrap: wrap;
		gap: 16px 32px;
		justify-content: space-between;
		padding: 10px 0;
		font-family: var(--font-label);
		font-size: var(--type-label);
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.band .z {
		color: var(--zhu);
	}

	/* Hero */
	.hero {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: clamp(32px, 5vw, 72px);
		padding: clamp(40px, 8vh, 96px) 0 var(--page-y);
		align-items: center;
	}
	.tag {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--zhu);
		margin-bottom: 18px;
	}
	h1 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: var(--type-hero);
		line-height: 0.85;
		letter-spacing: -0.025em;
		margin: 0;
	}
	h1 .it {
		font-weight: 400;
		font-style: italic;
		color: var(--ink-soft);
	}
	.z {
		color: var(--zhu);
	}
	.dek {
		font-size: var(--type-dek);
		line-height: 1.5;
		max-width: 46ch;
		margin-top: 26px;
		color: var(--ink);
	}

	/* Contents index / nav */
	.index {
		border-left: 1.5px solid var(--ink-line);
		padding-left: clamp(18px, 2vw, 30px);
	}
	.index-h {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.28em;
		text-transform: uppercase;
		margin-bottom: 12px;
	}
	.index ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.index li a {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid var(--ink-line);
		transition: color 0.2s;
	}
	.index li a:hover {
		color: var(--zhu);
	}
	.index .n {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.7em;
		color: var(--zhu);
	}
	.index em {
		font-style: italic;
		color: var(--ink-soft);
		font-size: 0.85em;
	}
	.index .p {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.7em;
		color: var(--ink-soft);
	}
	.pull {
		font-style: italic;
		font-size: 1.15rem;
		line-height: 1.35;
		margin-top: 26px;
	}
	.pull b {
		font-style: normal;
		color: var(--zhu);
	}

	/* Sections */
	.sec {
		padding: var(--page-y) 0;
		border-top: 2px solid var(--ink);
	}
	.sec-head {
		display: flex;
		align-items: baseline;
		gap: 20px;
		margin-bottom: clamp(28px, 5vh, 56px);
	}
	.cn {
		font-family: var(--font-cn);
		font-weight: 900;
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		color: var(--zhu);
	}
	.sec-head h2 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: var(--type-section);
		letter-spacing: -0.02em;
		line-height: 1;
		margin: 0;
		flex: 1;
	}
	.folio {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.16em;
		color: var(--ink-mute);
	}
	.mini-h {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--zhu);
		margin: 32px 0 14px;
	}

	/* Self */
	.self-grid {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: clamp(32px, 5vw, 72px);
	}
	.prose {
		font-size: 1.2rem;
		line-height: 1.65;
	}
	.prose :global(a) {
		color: var(--zhu);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	aside {
		border-left: 1.5px solid var(--ink-line);
		padding-left: clamp(18px, 2vw, 30px);
	}
	.edu {
		line-height: 1.5;
		margin-bottom: 8px;
	}
	.edu a {
		font-weight: 700;
	}
	.edu .years {
		color: var(--ink-mute);
		font-size: 0.9em;
	}
	.skills {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 8px 10px;
		padding: 0;
		margin: 0;
	}
	.skills li {
		font-family: var(--font-label);
		font-size: 0.8rem;
		letter-spacing: 0.05em;
		border: 1px solid var(--ink-line-strong);
		padding: 4px 10px;
		border-radius: 2px;
	}

	/* Work */
	.work {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.row {
		display: grid;
		grid-template-columns: 60px 1fr auto;
		gap: 24px;
		padding: 28px 0;
		border-top: 1px solid var(--ink-line);
	}
	.row:last-child {
		border-bottom: 1px solid var(--ink-line);
	}
	.idx {
		font-family: var(--font-label);
		font-weight: 900;
		font-size: 1.5rem;
		color: var(--zhu);
	}
	.row-title {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		line-height: 1.05;
		letter-spacing: -0.01em;
	}
	.row-title:hover {
		color: var(--zhu);
	}
	.row-desc {
		margin-top: 8px;
		max-width: 60ch;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.row-tech {
		margin-top: 10px;
		font-family: var(--font-label);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
		text-transform: uppercase;
	}
	.row-links {
		margin-top: 10px;
		display: flex;
		gap: 18px;
	}
	.row-links a {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--zhu);
	}
	.row-date {
		font-family: var(--font-label);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		color: var(--ink-mute);
		white-space: nowrap;
		text-align: right;
	}

	/* Hackathons */
	.hacks {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 28px;
	}
	.hacks li {
		border-top: 1px solid var(--ink-line);
		padding-top: 16px;
	}
	.hk-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}
	.hk-top h3 {
		font-weight: 900;
		font-size: 1.25rem;
		margin: 0;
	}
	.hk-top span {
		font-family: var(--font-label);
		font-size: 0.72rem;
		color: var(--ink-mute);
		white-space: nowrap;
	}
	.hk-loc {
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--zhu);
		margin: 6px 0 10px;
	}
	.hk-desc {
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.hacks a {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--zhu);
		display: inline-block;
		margin-top: 8px;
	}
	.repos {
		margin-top: 40px;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 1.4rem;
	}

	/* Off hours */
	.anime,
	.favs {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 20px;
	}
	.anime li a,
	.favs li a {
		display: block;
		border-top: 1px solid var(--ink-line);
		padding-top: 12px;
	}
	.anime b,
	.favs b {
		display: block;
		font-weight: 900;
		font-size: 1.1rem;
	}
	.anime em {
		display: block;
		font-style: italic;
		color: var(--ink-soft);
		margin-top: 6px;
		line-height: 1.4;
	}
	.favs span {
		display: block;
		color: var(--ink-soft);
		margin-top: 4px;
	}
	.anime li a:hover b,
	.favs li a:hover b {
		color: var(--zhu);
	}

	/* Contact */
	.contact {
		text-align: center;
	}
	.cn.big {
		display: block;
		font-size: clamp(4rem, 12vw, 9rem);
		line-height: 1;
	}
	.say {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: var(--type-hero);
		letter-spacing: -0.03em;
		margin: 8px 0 24px;
	}
	.email {
		font-size: clamp(1.25rem, 3vw, 2rem);
		text-decoration: underline;
		text-underline-offset: 6px;
		text-decoration-color: var(--zhu);
	}
	.socials {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px 28px;
		padding: 32px 0 0;
		margin: 0;
	}
	.socials a {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.04em;
	}
	.socials a:hover {
		color: var(--zhu);
	}

	/* Footer */
	footer {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 24px;
		justify-content: space-between;
		border-top: 2.5px solid var(--ink);
		margin-top: var(--page-y);
		padding: 20px 0 40px;
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	/* Responsive */
	@media (max-width: 860px) {
		.hero,
		.self-grid {
			grid-template-columns: 1fr;
		}
		.index,
		aside {
			border-left: none;
			padding-left: 0;
			border-top: 1.5px solid var(--ink-line);
			padding-top: 20px;
		}
		.row {
			grid-template-columns: 40px 1fr;
		}
		.row-date {
			grid-column: 2;
			text-align: left;
		}
	}
</style>
