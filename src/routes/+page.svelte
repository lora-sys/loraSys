<script lang="ts">
	// INK EDITION (墨刊) — redo #5. Round 1 · commit 3 (motion).
	import { onMount } from 'svelte';
	import { DATA } from '$lib/data/resume';
	import InkWash from '$lib/components/ink/InkWash.svelte';
	import Lens from '$lib/components/magic/lens/lens.svelte';

	let animeTrack: HTMLElement | undefined = $state();
	function animeScroll(dir: number) {
		if (!animeTrack) return;
		const card = animeTrack.querySelector('.acard') as HTMLElement | null;
		const amount = card ? card.offsetWidth + 24 : 300;
		animeTrack.scrollBy({ left: dir * amount, behavior: 'smooth' });
	}

	const socials = Object.values(DATA.contact.social).filter((s) => s.url);

	// Contents index doubles as navigation.
	const contents = [
		{ n: '01', cn: '己', title: 'The Self', note: 'who & why', href: '#self', page: 'P.02' },
		{ n: '02', cn: '技', title: 'Skills', note: 'what I build with', href: '#skills', page: 'P.03' },
		{ n: '03', cn: '歷', title: 'Experience', note: 'work history', href: '#exp', page: 'P.04' },
		{ n: '04', cn: '作', title: 'Selected Work', note: `${DATA.projects.length} projects`, href: '#work', page: 'P.06' },
		{ n: '05', cn: '戰', title: 'Hackathons', note: 'ETH · Monad', href: '#hack', page: 'P.09' },
		{ n: '06', cn: '閒', title: 'Off Hours', note: 'anime & more', href: '#off', page: 'P.12' },
		{ n: '07', cn: '聯', title: 'Say Hello', note: '', href: '#contact', page: 'P.16' }
	];

	// Skills grouped for the kinetic marquee (presentation grouping of flat DATA.skills).
	const skillGroups = [
		{ label: 'Languages', items: ['TypeScript', 'Python', 'JavaScript', 'Java', 'Solidity'] },
		{ label: 'Frameworks', items: ['React', 'Next.js', 'Svelte', 'SvelteKit', 'Node.js', 'TailwindCSS'] },
		{ label: 'Tools & Domains', items: ['PostgreSQL', 'Docker', 'AI Agents', 'Web3'] }
	];

	// Work experience (content added to resume.ts later). Timeline renders these when present.
	type WorkItem = {
		company?: string;
		title?: string;
		start?: string;
		end?: string;
		location?: string;
		description?: string;
		badges?: string[];
		logoUrl?: string;
		href?: string;
	};
	const work = DATA.work as WorkItem[];

	let showWash = $state(false);

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const desktop = window.matchMedia('(min-width: 861px)').matches;
		showWash = !reduce && desktop;
		if (reduce) return;

		let cleanup = () => {};
		(async () => {
			try {
				const gsapMod = await import('gsap');
				const stMod = await import('gsap/dist/ScrollTrigger');
				const gsap = (gsapMod as any).gsap ?? (gsapMod as any).default;
				const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
				gsap.registerPlugin(ScrollTrigger);

				// Entry: seal stamp + masthead + hero + index
				gsap.from('.seal', { scale: 2.4, opacity: 0, rotate: -24, duration: 0.5, ease: 'back.out(2)', delay: 0.15 });
				gsap.from('.mast .word', { yPercent: 24, opacity: 0, duration: 0.7, ease: 'power3.out' });
				gsap.from('.hero-left > *', { y: 26, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out', delay: 0.1 });
				gsap.from('.index-h, .index li, .pull', { y: 16, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', delay: 0.35 });

				// Per-section: header rise + brush-underline draw
				gsap.utils.toArray<HTMLElement>('.sec').forEach((sec) => {
					const head = sec.querySelector('.sec-head');
					if (head) {
						gsap.from(head, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 80%' } });
					}
					const brush = sec.querySelector<SVGPathElement>('.brush path');
					if (brush) {
						const len = brush.getTotalLength();
						gsap.set(brush, { strokeDasharray: len, strokeDashoffset: len });
						gsap.to(brush, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', scrollTrigger: { trigger: sec, start: 'top 74%' } });
					}
				});
				gsap.utils.toArray<HTMLElement>('.row').forEach((row) => {
					gsap.from(row, { y: 24, opacity: 0, duration: 0.55, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 90%' } });
				});

				// Staggered reveals for ledger cards, galleries, skill rows
				gsap.utils.toArray<HTMLElement>('.hk, .card, .acard, .tl-item').forEach((el) => {
					gsap.from(el, { y: 22, opacity: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
				});
				gsap.utils.toArray<HTMLElement>('.mrow').forEach((el, i) => {
					gsap.from(el, { xPercent: i % 2 ? 5 : -5, opacity: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
				});

				// Count-up on figures
				gsap.utils.toArray<HTMLElement>('.count').forEach((el) => {
					const target = Number(el.dataset.count || '0');
					const obj = { v: 0 };
					ScrollTrigger.create({
						trigger: el,
						start: 'top 92%',
						once: true,
						onEnter: () =>
							gsap.to(obj, {
								v: target,
								duration: 1.4,
								ease: 'power2.out',
								onUpdate: () => (el.textContent = String(Math.round(obj.v)))
							})
					});
				});

				// Magnetic hover
				gsap.utils.toArray<HTMLElement>('.c-arrow, .socials a').forEach((el) => {
					const move = (e: MouseEvent) => {
						const r = el.getBoundingClientRect();
						gsap.to(el, {
							x: (e.clientX - (r.left + r.width / 2)) * 0.3,
							y: (e.clientY - (r.top + r.height / 2)) * 0.3,
							duration: 0.3
						});
					};
					const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
					el.addEventListener('mousemove', move);
					el.addEventListener('mouseleave', leave);
				});

				ScrollTrigger.refresh();
				cleanup = () => ScrollTrigger.getAll().forEach((s: any) => s.kill());
			} catch (err) {
				console.warn('[ink] motion init failed, static fallback', err);
			}
		})();

		return () => cleanup();
	});
</script>

{#snippet brush()}
	<svg class="brush" viewBox="0 0 320 12" preserveAspectRatio="none" aria-hidden="true">
		<path
			d="M3 8 C 64 2 128 11 190 5 S 300 3 317 7"
			fill="none"
			stroke="var(--zhu)"
			stroke-width="3"
			stroke-linecap="round"
		/>
	</svg>
{/snippet}

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
	{#if showWash}<InkWash />{/if}
	<!-- MASTHEAD -->
	<header class="mast">
		<a class="logo" href="#top" aria-label="lora — home">
			<span class="word">{DATA.name}</span>
			<span class="seal" aria-hidden="true">lora</span>
		</a>
		<p class="ed-line">
			Field Notes on Building<br />
			<b>Edition 2026 — <span class="count" data-count="103">103</span> Repositories</b>
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
				<div class="hero-meta">
					<span class="tag">Cover · 序</span>
					<span class="rule"></span>
					<span class="folio">P.01</span>
				</div>
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
			<div class="sec-head"><span class="cn">己</span><div class="sec-title"><h2>The Self</h2>{@render brush()}</div><span class="folio">P.02</span></div>
			<div class="self-grid">
				<div class="bio">{@html DATA.summaryHtml}</div>
				<aside>
					<p class="mini-h" id="education">Education</p>
					{#each DATA.education as e}
						<div class="edu">
							{#if e.logoUrl}<img class="edu-logo" src={e.logoUrl} alt={e.school} loading="lazy" />{/if}
							<div>
								<a href={e.href}>{e.school}</a><br /><em>{e.degree}</em><br /><span class="years">{e.start} — {e.end}</span>
							</div>
						</div>
					{/each}
					<p class="mini-h" hidden>Stack</p>
					<ul class="skills" hidden style="display:none">
						{#each DATA.skills as s}<li>{s}</li>{/each}
					</ul>
				</aside>
			</div>
		</section>

				<!-- 技 SKILLS -->
		<section id="skills" class="sec skills">
			<div class="sec-head"><span class="cn">技</span><div class="sec-title"><h2>Skills</h2>{@render brush()}</div><span class="folio">P.03</span></div>
			<div class="marquees">
				{#each skillGroups as g, gi}
					<div class="mrow" class:rev={gi % 2 === 1}>
						<span class="mrow-label">{g.label}</span>
						<div class="mviewport">
							<div class="mtrack">
								{#each [...g.items, ...g.items, ...g.items] as s}<span class="skill">{s}</span><span class="sep">✦</span>{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

				<!-- 歷 EXPERIENCE -->
		<section id="exp" class="sec">
			<div class="sec-head"><span class="cn">歷</span><div class="sec-title"><h2>Experience</h2>{@render brush()}</div><span class="folio">P.04</span></div>
			{#if work.length}
				<ol class="timeline">
					{#each work as w}
						<li class="tl-item">
							<span class="tl-dot" aria-hidden="true"></span>
							<div class="tl-date">{w.start} — {w.end}</div>
							<div class="tl-body">
								<div class="tl-top">
									{#if w.logoUrl}<img class="tl-logo" src={w.logoUrl} alt={w.company} loading="lazy" />{/if}
									<div>
										<h3 class="tl-role">{w.title}</h3>
										<p class="tl-co">{w.company}{#if w.location} · {w.location}{/if}</p>
									</div>
								</div>
								{#if w.description}<p class="tl-desc">{w.description}</p>{/if}
								{#if w.badges?.length}
									<div class="tl-badges">{#each w.badges as b}<span>{b}</span>{/each}</div>
								{/if}
							</div>
						</li>
					{/each}
				</ol>
			{:else}
				<div class="exp-empty">
					<p class="exp-lead">First chapter,<br /><span class="z">loading.</span></p>
					<div class="exp-side">
						<p class="exp-note">
							No formal roles on the record yet — I've been building independently: 103
							repositories, hackathons (ETH Beijing, Monad), and self-directed systems. The
							next entry here is open.
						</p>
						<a class="exp-cta" href={`mailto:${DATA.contact.email}`}>Let's talk →</a>
					</div>
				</div>
			{/if}
		</section>

		<!-- 作 SELECTED WORK -->
		<section id="work" class="sec">
			<div class="sec-head"><span class="cn">作</span><div class="sec-title"><h2>Selected Work</h2>{@render brush()}</div><span class="folio">P.04</span></div>
			<ol class="work">
				{#each DATA.projects as p, i}
					<li class="row">
						<span class="idx">{String(i + 1).padStart(2, '0')}</span>
						<div class="row-main">
							<span class="row-date">{p.dates}</span>
							<a class="row-title" href={p.href} target="_blank" rel="noreferrer">{p.title}</a>
							<p class="row-desc">{p.description}</p>
							<p class="row-tech">{p.technologies.join(' · ')}</p>
							<p class="row-links">
								{#each p.links as l}<a href={l.href} target="_blank" rel="noreferrer">{l.type} →</a>{/each}
							</p>
						</div>
						{#if p.image}
							<a class="row-thumb" href={p.href} target="_blank" rel="noreferrer" tabindex="-1" aria-hidden="true">
								<img src={p.image} alt="" loading="lazy" />
							</a>
						{/if}
					</li>
				{/each}
			</ol>
		</section>

		<!-- 戰 HACKATHONS -->
		<section id="hack" class="sec">
			<div class="sec-head"><span class="cn">戰</span><div class="sec-title"><h2>Hackathons &amp; Signals</h2>{@render brush()}</div><span class="folio">P.09</span></div>
			<ol class="hacks">
				{#each DATA.hackathons as h, i}
					<li class="hk">
						<span class="hk-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
						<h3>{h.title}</h3>
						<p class="hk-meta"><span class="hk-loc">{h.location}</span><span class="hk-date">{h.dates}</span></p>
						<p class="hk-desc">{h.description}</p>
						{#each h.links as l}<a href={l.href} target="_blank" rel="noreferrer">{l.title} →</a>{/each}
					</li>
				{/each}
			</ol>
			<p class="repos"><span class="count" data-count="103">103</span> public repositories on GitHub — AI agents, Web3 dApps, full-stack applications.</p>
		</section>

		<!-- 閒 OFF HOURS -->
		<section id="off" class="sec">
			<div class="sec-head"><span class="cn">閒</span><div class="sec-title"><h2>Off Hours</h2>{@render brush()}</div><span class="folio">P.12</span></div>
			<div class="anime-head">
				<p class="mini-h">Anime</p>
				<div class="c-nav">
					<button class="c-arrow" aria-label="Previous" onclick={() => animeScroll(-1)}>←</button>
					<button class="c-arrow" aria-label="Next" onclick={() => animeScroll(1)}>→</button>
				</div>
			</div>
			<ul class="track" bind:this={animeTrack}>
				{#each DATA.anime as a}
					<li class="acard">
						<a href={a.link} target="_blank" rel="noreferrer" aria-label={a.name}>
							<Lens zoomFactor={1.5} lensSize={150} class="rounded-none">
								{#snippet children()}
									<div class="frame"><img src={a.image} alt={a.name} loading="lazy" /></div>
								{/snippet}
							</Lens>
							<b class="card-name">{a.name}</b>
							<em class="card-quote">“{a.quote}”</em>
						</a>
					</li>
				{/each}
			</ul>
			<p class="drag-hint">↔ drag · hover a poster to magnify</p>
			<p class="mini-h">Favorites</p>
			<ul class="gallery favs-g">
				{#each DATA.favorites as f}
					<li class="card">
						<a href={f.href} target="_blank" rel="noreferrer">
							<Lens zoomFactor={1.4} lensSize={120} class="rounded-none">
								{#snippet children()}
									<div class="frame sq"><img src={f.background} alt={f.name} loading="lazy" /></div>
								{/snippet}
							</Lens>
							<b class="card-name">{f.name}</b>
							<span class="card-desc">{f.description}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<!-- 聯 CONTACT -->
		<section id="contact" class="sec contact">
			<span class="cn ghost" aria-hidden="true">聯</span>
			<p class="c-tag">聯 · Say Hello</p>
			<h2 class="say">Say hello.</h2>
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
	.hero-left {
		position: relative;
	}
	.hero-left::before {
		content: '';
		position: absolute;
		bottom: -6%;
		left: -8%;
		width: 52%;
		height: 58%;
		background: radial-gradient(circle, rgba(198, 65, 44, 0.16), transparent 70%);
		filter: blur(55px);
		z-index: -1;
		pointer-events: none;
	}
	.hero-meta {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 26px;
	}
	.hero-meta .rule {
		flex: 1;
		height: 1.5px;
		background: var(--ink-line);
	}
	.hero-meta .folio {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.16em;
		color: var(--ink-mute);
	}
	.tag {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--zhu);
		white-space: nowrap;
	}
	h1 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(4rem, 11.5vw, 11rem);
		line-height: 0.82;
		letter-spacing: -0.03em;
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
	.sec-title {
		flex: 1;
	}
	.sec-head h2 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: var(--type-section);
		letter-spacing: -0.02em;
		line-height: 1;
		margin: 0;
	}
	.brush {
		display: block;
		width: clamp(140px, 26%, 300px);
		height: 11px;
		margin-top: 10px;
		overflow: visible;
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
	.bio {
		font-size: 1.2rem;
		line-height: 1.65;
	}
	.bio :global(a) {
		color: var(--zhu);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	aside {
		border-left: 1.5px solid var(--ink-line);
		padding-left: clamp(18px, 2vw, 30px);
	}
	.edu {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		line-height: 1.5;
		margin-bottom: 8px;
	}
	.edu-logo {
		width: 42px;
		height: 42px;
		object-fit: contain;
		flex-shrink: 0;
		border: 1px solid var(--ink-line);
		background: var(--paper);
		padding: 4px;
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
		transition: border-color 0.25s ease, color 0.25s ease;
	}
	.skills li:hover {
		border-color: var(--zhu);
		color: var(--zhu);
	}

	/* Work */
	.work {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.row {
		position: relative;
		display: grid;
		grid-template-columns: 48px 1fr 240px;
		gap: 28px;
		padding: 30px 0 30px 20px;
		border-top: 1px solid var(--ink-line);
		align-items: center;
		transition: background 0.35s ease, padding-left 0.35s ease;
	}
	.row::before {
		content: '';
		position: absolute;
		left: 0;
		top: -1px;
		bottom: 0;
		width: 0;
		background: var(--zhu);
		transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.row:hover,
	.row:focus-within {
		background: linear-gradient(90deg, rgba(198, 65, 44, 0.05), transparent 60%);
		padding-left: 32px;
	}
	.row:hover::before,
	.row:focus-within::before {
		width: 4px;
	}
	.row:last-child {
		border-bottom: 1px solid var(--ink-line);
	}
	.idx {
		font-family: var(--font-label);
		font-weight: 900;
		font-size: 1.5rem;
		color: var(--ink-mute);
		transition: color 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
		transform-origin: left center;
	}
	.row:hover .idx,
	.row:focus-within .idx {
		color: var(--zhu);
		transform: scale(1.25);
	}
	.row-title {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.5rem, 3vw, 2.25rem);
		line-height: 1.05;
		letter-spacing: -0.01em;
		transition: color 0.3s ease;
	}
	.row-title:hover,
	.row:hover .row-title,
	.row:focus-within .row-title {
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
		display: block;
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin-bottom: 8px;
	}
	.row-thumb {
		display: block;
		align-self: center;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		border: 1px solid var(--ink-line-strong);
		background: var(--paper-2);
		transition: border-color 0.3s ease;
	}
	.row-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: saturate(0.9) contrast(1.02);
		transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
	}
	.row:hover .row-thumb {
		border-color: var(--zhu);
	}
	.row:hover .row-thumb img {
		transform: scale(1.05);
		filter: none;
	}

	/* Hackathons — ledger: outlined index + top-bar draw on hover */
	.hacks {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 0 clamp(28px, 4vw, 56px);
	}
	.hk {
		position: relative;
		border-top: 2px solid var(--ink);
		padding: 22px 0 30px;
	}
	.hk::before {
		content: '';
		position: absolute;
		top: -2px;
		left: 0;
		height: 2px;
		width: 0;
		background: var(--zhu);
		transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.hk:hover::before {
		width: 100%;
	}
	.hk-n {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: 2.75rem;
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1.5px var(--ink-line-strong);
		display: block;
		margin-bottom: 10px;
		transition: -webkit-text-stroke-color 0.3s ease, color 0.3s ease;
	}
	.hk:hover .hk-n {
		-webkit-text-stroke-color: var(--zhu);
		color: var(--zhu);
	}
	.hk h3 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.25rem, 2vw, 1.6rem);
		line-height: 1.1;
		margin: 0;
	}
	.hk-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 14px;
		align-items: baseline;
		margin: 8px 0 10px;
	}
	.hk-loc {
		font-family: var(--font-label);
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--zhu);
	}
	.hk-date {
		font-family: var(--font-label);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.hk-desc {
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.hk a {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--zhu);
		display: inline-block;
		margin-top: 10px;
	}
	.repos {
		margin-top: 44px;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(1.2rem, 2vw, 1.5rem);
		border-top: 1px solid var(--ink-line);
		padding-top: 24px;
	}

	/* Skills — kinetic marquee */
	.marquees {
		display: flex;
		flex-direction: column;
	}
	.mrow {
		display: flex;
		align-items: center;
		gap: 24px;
		border-top: 1px solid var(--ink-line);
		padding: clamp(8px, 1.4vh, 16px) 0;
	}
	.mrow:last-child {
		border-bottom: 1px solid var(--ink-line);
	}
	.mrow-label {
		flex: 0 0 auto;
		width: clamp(84px, 10vw, 150px);
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--zhu);
	}
	.mviewport {
		flex: 1;
		overflow: hidden;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
	}
	.mtrack {
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
		will-change: transform;
		animation: marquee-x 32s linear infinite;
	}
	.mrow.rev .mtrack {
		animation-direction: reverse;
	}
	.mrow:hover .mtrack {
		animation-play-state: paused;
	}
	.skill {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.75rem, 4vw, 3.25rem);
		letter-spacing: -0.02em;
		padding: 0 0.28em;
		color: var(--ink);
		transition: color 0.2s ease;
		cursor: default;
	}
	.skill:hover {
		color: var(--zhu);
	}
	.sep {
		color: var(--zhu);
		opacity: 0.55;
		font-size: clamp(0.9rem, 1.5vw, 1.3rem);
	}
	@keyframes marquee-x {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-33.333%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mtrack {
			animation: none;
		}
		.mviewport {
			overflow-x: auto;
		}
	}

	/* Experience timeline */
	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
	}
	.timeline::before {
		content: '';
		position: absolute;
		left: 7px;
		top: 6px;
		bottom: 6px;
		width: 2px;
		background: var(--ink-line);
	}
	.tl-item {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		gap: 6px;
		padding: 0 0 clamp(28px, 4vh, 48px) 34px;
	}
	.tl-dot {
		position: absolute;
		left: 0;
		top: 5px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--paper);
		border: 2.5px solid var(--zhu);
	}
	.tl-date {
		font-family: var(--font-label);
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.tl-top {
		display: flex;
		gap: 14px;
		align-items: center;
	}
	.tl-logo {
		width: 44px;
		height: 44px;
		object-fit: contain;
		border: 1px solid var(--ink-line);
		background: var(--paper);
		padding: 4px;
	}
	.tl-role {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.25rem, 2.4vw, 1.75rem);
		line-height: 1.1;
		margin: 0;
	}
	.tl-co {
		font-family: var(--font-label);
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--zhu);
		margin-top: 4px;
	}
	.tl-desc {
		margin-top: 10px;
		line-height: 1.55;
		color: var(--ink-soft);
		max-width: 60ch;
	}
	.tl-badges {
		margin-top: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tl-badges span {
		font-family: var(--font-label);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		border: 1px solid var(--ink-line-strong);
		padding: 3px 9px;
	}
	@media (min-width: 761px) {
		.timeline::before {
			left: 187px;
		}
		.tl-item {
			grid-template-columns: 180px 1fr;
			gap: 40px;
			padding-left: 0;
		}
		.tl-dot {
			left: 180px;
		}
		.tl-date {
			text-align: right;
			padding-right: 44px;
			padding-top: 2px;
		}
	}
	/* Experience empty state */
	.exp-empty {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: clamp(24px, 4vw, 64px);
		align-items: end;
	}
	.exp-lead {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(2.5rem, 6.5vw, 5.5rem);
		line-height: 0.92;
		letter-spacing: -0.03em;
		margin: 0;
	}
	.exp-note {
		line-height: 1.6;
		color: var(--ink-soft);
		max-width: 46ch;
	}
	.exp-cta {
		display: inline-block;
		margin-top: 18px;
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		border-bottom: 2px solid var(--zhu);
		padding-bottom: 3px;
		transition: color 0.25s ease;
	}
	.exp-cta:hover {
		color: var(--zhu);
	}
	@media (max-width: 760px) {
		.exp-empty {
			grid-template-columns: 1fr;
			align-items: start;
		}
	}

	/* Off hours — image galleries */
	.gallery {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: clamp(16px, 2vw, 28px);
	}
	.anime-g {
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
	}
	.favs-g {
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	}
	.card a {
		display: block;
	}
	.frame {
		position: relative;
		overflow: hidden;
		aspect-ratio: 3 / 4;
		border: 1px solid var(--ink-line-strong);
		background: var(--paper-2);
		transition: border-color 0.3s ease;
	}
	.frame.sq {
		aspect-ratio: 1 / 1;
	}
	.frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: saturate(0.9) contrast(1.02);
		transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
	}
	.card a:hover .frame {
		border-color: var(--zhu);
	}
	.card a:hover .frame img {
		transform: scale(1.05);
		filter: none;
	}
	.card-name {
		display: block;
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: 1.05rem;
		line-height: 1.1;
		margin-top: 12px;
		transition: color 0.25s ease;
	}
	.card a:hover .card-name {
		color: var(--zhu);
	}
	.card-quote {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-style: italic;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--ink-soft);
		margin-top: 6px;
	}
	.card-desc {
		display: block;
		font-size: 0.85rem;
		color: var(--ink-soft);
		margin-top: 5px;
	}

	/* Anime carousel (scroll-snap + lens) */
	.anime-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.anime-head .mini-h {
		margin: 32px 0 14px;
	}
	.c-nav {
		display: flex;
		gap: 8px;
	}
	.c-arrow {
		width: 42px;
		height: 42px;
		display: grid;
		place-items: center;
		border: 1.5px solid var(--ink);
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-label);
		font-size: 1.05rem;
		cursor: pointer;
		transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
	}
	.c-arrow:hover {
		background: var(--ink);
		color: var(--paper);
		transform: translateY(-2px);
	}
	.track {
		display: flex;
		gap: 24px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		padding-bottom: 6px;
		margin: 0;
		list-style: none;
		scrollbar-width: none;
	}
	.track::-webkit-scrollbar {
		display: none;
	}
	.acard {
		flex: 0 0 clamp(200px, 24%, 280px);
		scroll-snap-align: start;
	}
	.acard > a {
		display: block;
	}
	.drag-hint {
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin: 12px 0 0;
	}

	/* Contact */
	.contact {
		position: relative;
		text-align: center;
		overflow: hidden;
	}
	.contact::before {
		content: '';
		position: absolute;
		top: 42%;
		left: 50%;
		width: 60%;
		height: 70%;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle, rgba(198, 65, 44, 0.12), transparent 68%);
		filter: blur(50px);
		z-index: 0;
		pointer-events: none;
	}
	.contact > *:not(.ghost) {
		position: relative;
		z-index: 1;
	}
	.cn.ghost {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -54%);
		font-size: clamp(14rem, 34vw, 30rem);
		line-height: 1;
		color: var(--zhu);
		opacity: 0.08;
		z-index: 0;
		pointer-events: none;
	}
	.c-tag {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--zhu);
		margin-bottom: 16px;
	}
	.say {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: var(--type-hero);
		letter-spacing: -0.03em;
		line-height: 0.9;
		margin: 0 0 28px;
	}
	.email {
		display: inline-block;
		font-size: clamp(1.25rem, 3vw, 2rem);
		text-decoration: underline;
		text-underline-offset: 6px;
		text-decoration-thickness: 2px;
		text-decoration-color: var(--zhu);
		transition: color 0.25s ease, text-underline-offset 0.25s ease;
	}
	.email:hover {
		color: var(--zhu);
		text-underline-offset: 10px;
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
	@media (max-width: 980px) {
		.row {
			grid-template-columns: 48px 1fr;
		}
		.row-thumb {
			display: none;
		}
	}
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
	}
</style>
