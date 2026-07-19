<script lang="ts">
	// INK EDITION (墨刊) — redo #5. Round 1 · commit 3 (motion).
	import { onMount } from 'svelte';
	import { DATA } from '$lib/data/resume';
	import InkWash from '$lib/components/ink/InkWash.svelte';
	import Lens from '$lib/components/magic/lens/lens.svelte';
	import { base } from '$app/paths';

	/** Resolve image paths relative to the deployment base.
	 *  Vite-imported assets already include base; runtime strings from data need it prepended. */
	function img(path: string): string {
		if (!path.startsWith('/') || path.startsWith(base)) return path;
		return base + path;
	}

	let animeTrack: HTMLElement | undefined = $state();
	let animeProg = $state(0);
	let autoOK = $state(false);
	let animeTimer: ReturnType<typeof setInterval> | undefined;

	function animeScroll(dir: number) {
		if (!animeTrack) return;
		const card = animeTrack.querySelector('.acard') as HTMLElement | null;
		const amount = card ? card.offsetWidth + 24 : 300;
		animeTrack.scrollBy({ left: dir * amount, behavior: 'smooth' });
	}
	function updateAnimeProg() {
		if (!animeTrack) return;
		const max = animeTrack.scrollWidth - animeTrack.clientWidth;
		animeProg = max > 0 ? animeTrack.scrollLeft / max : 0;
	}
	function animeAuto(on: boolean) {
		clearInterval(animeTimer);
		if (!on) return;
		animeTimer = setInterval(() => {
			if (!animeTrack) return;
			const atEnd = animeTrack.scrollLeft + animeTrack.clientWidth >= animeTrack.scrollWidth - 6;
			if (atEnd) animeTrack.scrollTo({ left: 0, behavior: 'smooth' });
			else animeScroll(1);
		}, 2500);
	}

	const socials = Object.values(DATA.contact.social).filter((s) => s.url);

	// Graceful INK cover if an (external) project image 404s.
	function coverFallback(title: string): string {
		const t = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').slice(0, 22);
		return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%25' height='100%25' fill='%23ece7db'/><text x='18' y='46' font-family='Georgia,serif' font-size='22' font-weight='900' fill='%231a1815'>${t}</text><text x='18' y='182' font-family='monospace' font-size='11' letter-spacing='2' fill='%23c6412c'>lora://project</text></svg>`;
	}
	function onImgError(e: Event, title: string) {
		const img = e.currentTarget as HTMLImageElement;
		img.onerror = null;
		img.src = coverFallback(title);
	}

	// Contents index doubles as navigation.
	const contents = [
		{ n: '01', cn: '己', title: 'The Self', note: 'who & why', href: '#self', page: 'P.02' },
		{
			n: '02',
			cn: '技',
			title: 'Skills',
			note: 'what I build with',
			href: '#skills',
			page: 'P.03'
		},
		{ n: '03', cn: '歷', title: 'Experience', note: 'work history', href: '#exp', page: 'P.04' },
		{
			n: '04',
			cn: '作',
			title: 'Selected Work',
			note: `${DATA.projects.length} projects`,
			href: '#work',
			page: 'P.06'
		},
		{ n: '05', cn: '戰', title: 'Hackathons', note: 'ETH · Monad', href: '#hack', page: 'P.09' },
		{ n: '06', cn: '閒', title: 'Off Hours', note: 'anime & more', href: '#off', page: 'P.12' },
		{ n: '07', cn: '聯', title: 'Say Hello', note: '', href: '#contact', page: 'P.16' }
	];

	// Skills grouped for the kinetic marquee (presentation grouping of flat DATA.skills).
	const skillGroups = [
		{ label: 'Languages', items: ['TypeScript', 'Python', 'JavaScript', 'Java', 'Solidity'] },
		{
			label: 'Frameworks',
			items: ['React', 'Next.js', 'Svelte', 'SvelteKit', 'Node.js', 'TailwindCSS']
		},
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
	let scrolled = $state(false);

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const desktop = window.matchMedia('(min-width: 861px)').matches;
		showWash = !reduce && desktop;
		autoOK = !reduce;
		if (autoOK) animeAuto(true);

		// Scroll progress bar + back-to-top visibility (Svelte handles BTT via class:visible)
		const prog = document.querySelector('.scroll-progress') as HTMLElement | null;
		const onScroll = () => {
			const el = document.documentElement;
			const max = el.scrollHeight - el.clientHeight;
			const p = max > 0 ? el.scrollTop / max : 0;
			if (prog) prog.style.transform = `scaleX(${p})`;
			scrolled = el.scrollTop > 600;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		// Image fade-in on load (handles cached images via rAF fallback)
		const onImgLoad = (img: HTMLImageElement) => {
			const mark = () => img.classList.add('loaded');
			if (img.complete && img.naturalWidth > 0) {
				mark();
			} else {
				img.addEventListener('load', mark, { once: true });
				img.addEventListener('error', mark, { once: true });
			}
			requestAnimationFrame(() => {
				if (img.complete && img.naturalWidth > 0 && !img.classList.contains('loaded')) {
					mark();
				}
			});
		};
		document.querySelectorAll('img').forEach(onImgLoad);

		let cleanup = () => {};
		if (!reduce) {
			(async () => {
				try {
					const gsapMod = await import('gsap');
					const stMod = await import('gsap/dist/ScrollTrigger');
					const gsap: typeof import('gsap').gsap =
						(gsapMod as any).gsap ?? (gsapMod as any).default;
					const ScrollTrigger: typeof import('gsap/dist/ScrollTrigger').ScrollTrigger =
						(stMod as any).ScrollTrigger ?? (stMod as any).default;
					gsap.registerPlugin(ScrollTrigger);

					// Entry: seal stamp with ink-splash feel
					gsap.from('.seal', {
						scale: 3,
						opacity: 0,
						rotate: -30,
						duration: 0.6,
						ease: 'back.out(1.8)',
						delay: 0.1
					});
					gsap.from('.mast .word', { yPercent: 24, opacity: 0, duration: 0.7, ease: 'power3.out' });
					gsap.from('.hero-left > *', {
						y: 26,
						opacity: 0,
						duration: 0.7,
						stagger: 0.09,
						ease: 'power3.out',
						delay: 0.1
					});
					gsap.from('.index-h, .index li, .pull', {
						y: 16,
						opacity: 0,
						duration: 0.6,
						stagger: 0.05,
						ease: 'power2.out',
						delay: 0.35
					});

					// Per-section: header rise + brush-underline draw
					gsap.utils.toArray<HTMLElement>('.sec').forEach((sec) => {
						const head = sec.querySelector('.sec-head');
						if (head) {
							gsap.from(head, {
								y: 30,
								opacity: 0,
								duration: 0.7,
								ease: 'power3.out',
								scrollTrigger: { trigger: sec, start: 'top 80%' }
							});
						}
						const brush = sec.querySelector<SVGPathElement>('.brush path');
						if (brush) {
							const len = brush.getTotalLength();
							gsap.set(brush, { strokeDasharray: len, strokeDashoffset: len });
							gsap.to(brush, {
								strokeDashoffset: 0,
								duration: 0.9,
								ease: 'power2.inOut',
								scrollTrigger: { trigger: sec, start: 'top 74%' }
							});
						}
					});
					gsap.utils.toArray<HTMLElement>('.row').forEach((row) => {
						gsap.from(row, {
							y: 24,
							opacity: 0,
							duration: 0.55,
							ease: 'power2.out',
							scrollTrigger: { trigger: row, start: 'top 90%' }
						});
					});

					// Staggered reveals — exclude .acard (anime cards already visible on load)
					gsap.utils.toArray<HTMLElement>('.hk, .card, .tl-item, .hx, .fav').forEach((el) => {
						const tween = gsap.from(el, {
							y: 22,
							opacity: 0,
							duration: 0.5,
							ease: 'power2.out',
							scrollTrigger: {
								trigger: el,
								start: 'top 92%',
								once: true,
								onRefresh: (self: any) => self.animation.play()
							}
						});
					});
					gsap.utils.toArray<HTMLElement>('.mrow').forEach((el, i) => {
						gsap.from(el, {
							xPercent: i % 2 ? 5 : -5,
							opacity: 0,
							duration: 0.6,
							ease: 'power2.out',
							scrollTrigger: { trigger: el, start: 'top 92%' }
						});
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
						const leave = () =>
							gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
						el.addEventListener('mousemove', move);
						el.addEventListener('mouseleave', leave);
					});

					ScrollTrigger.refresh();
					cleanup = () => ScrollTrigger.getAll().forEach((s: any) => s.kill());
				} catch (err) {
					console.warn('[ink] motion init failed, static fallback', err);
				}
			})();
		}

		// Cursor glow (desktop only, non-reduced-motion)
		const glow = document.querySelector('.cursor-glow') as HTMLElement | null;
		let mouseTimer: ReturnType<typeof setTimeout> | undefined;
		if (glow && desktop && !reduce) {
			const onMove = (e: MouseEvent) => {
				glow.style.left = e.clientX + 'px';
				glow.style.top = e.clientY + 'px';
				glow.classList.add('active');
				clearTimeout(mouseTimer);
				mouseTimer = setTimeout(() => glow.classList.remove('active'), 1500);
			};
			window.addEventListener('mousemove', onMove, { passive: true });
		}
		return () => {
			window.removeEventListener('scroll', onScroll);
			clearInterval(animeTimer);
			cleanup();
		};
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
	<div class="scroll-progress" aria-hidden="true"></div>
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="ink-wash" aria-hidden="true"></div>
	{#if showWash}<InkWash />{/if}
	<div class="cursor-glow" aria-hidden="true"></div>
	<div class="page-transition" aria-hidden="true"></div>
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
		<section id="top" data-chapter="序" class="hero">
			<div class="hero-left">
				<div class="hero-meta">
					<span class="tag">Cover · 序</span>
					<span class="rule"></span>
					<span class="folio">P.01</span>
				</div>
				<h1>
					I build<br /><span class="it">systems</span><br />that <span class="z">learn.</span>
				</h1>
				<p class="dek">{DATA.description}</p>
			</div>
			<nav class="index" aria-label="Contents">
				<p class="index-h">In This Issue</p>
				<ul>
					{#each contents as c}
						<li>
							<a href={c.href}>
								<span class="l"
									><span class="n">{c.n}</span>
									{c.cn} &nbsp;{c.title}{#if c.note}<em> — {c.note}</em>{/if}</span
								>
								<span class="p">{c.page}</span>
							</a>
						</li>
					{/each}
				</ul>
				<p class="pull">
					“Turning ambitious ideas into <b>reality</b> — always building, learning, and shipping.”
				</p>
			</nav>
		</section>

		<!-- 己 THE SELF -->
		<section id="self" data-chapter="己" class="sec">
			<div class="sec-head">
				<span class="cn">己</span>
				<div class="sec-title">
					<h2>The Self</h2>
					{@render brush()}
				</div>
				<span class="folio">P.02</span>
			</div>
			<div class="self-grid">
				<div class="bio">{@html DATA.summaryHtml}</div>
				<aside>
					<p class="mini-h" id="education">Education</p>
					{#each DATA.education as e}
						<div class="edu">
							{#if e.logoUrl}<img
									class="edu-logo"
									src={e.logoUrl}
									alt={e.school}
									width="42"
									height="42"
									loading="lazy"
								/>{/if}
							<div>
								<a href={e.href}>{e.school}</a><br /><em>{e.degree}</em><br /><span class="years"
									>{e.start} — {e.end}</span
								>
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
		<section id="skills" data-chapter="技" class="sec skills">
			<div class="sec-head">
				<span class="cn">技</span>
				<div class="sec-title">
					<h2>Skills</h2>
					{@render brush()}
				</div>
				<span class="folio">P.03</span>
			</div>
			<div class="marquees">
				{#each skillGroups as g, gi}
					<div class="mrow" class:rev={gi % 2 === 1}>
						<span class="mrow-label">{g.label}</span>
						<div class="mviewport">
							<div class="mtrack">
								{#each [...g.items, ...g.items, ...g.items] as s}<span class="skill">{s}</span><span
										class="sep">✦</span
									>{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- 歷 EXPERIENCE -->
		<section id="exp" data-chapter="歷" class="sec">
			<div class="sec-head">
				<span class="cn">歷</span>
				<div class="sec-title">
					<h2>Experience</h2>
					{@render brush()}
				</div>
				<span class="folio">P.04</span>
			</div>
			{#if work.length}
				<ol class="timeline">
					{#each work as w}
						<li class="tl-item">
							<span class="tl-dot" aria-hidden="true"></span>
							<div class="tl-date">{w.start} — {w.end}</div>
							<div class="tl-body">
								<div class="tl-top">
									{#if w.logoUrl}<img
											class="tl-logo"
											src={w.logoUrl}
											alt={w.company}
											width="44"
											height="44"
											loading="lazy"
										/>{/if}
									<div>
										<h3 class="tl-role">{w.title}</h3>
										<p class="tl-co">
											{w.company}{#if w.location}
												· {w.location}{/if}
										</p>
									</div>
								</div>
								{#if w.description}<p class="tl-desc">{w.description}</p>{/if}
								{#if w.badges?.length}
									<div class="tl-badges">
										{#each w.badges as b}<span>{b}</span>{/each}
									</div>
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
							repositories, hackathons (ETH Beijing, Monad), and self-directed systems. The next
							entry here is open.
						</p>
						<a class="exp-cta" href={`mailto:${DATA.contact.email}`}>Let's talk →</a>
					</div>
				</div>
			{/if}
		</section>

		<!-- 作 SELECTED WORK -->
		<section id="work" data-chapter="作" class="sec">
			<div class="sec-head">
				<span class="cn">作</span>
				<div class="sec-title">
					<h2>Selected Work</h2>
					{@render brush()}
				</div>
				<span class="folio">P.04</span>
			</div>
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
								{#each p.links as l}<a href={l.href} target="_blank" rel="noreferrer">{l.type} →</a
									>{/each}
							</p>
						</div>
						{#if p.image}
							<a
								class="row-thumb"
								href={p.href}
								target="_blank"
								rel="noreferrer"
								tabindex="-1"
								aria-hidden="true"
							>
								<img
									src={img(p.image)}
									alt=""
									width="320"
									height="200"
									loading="lazy"
									onerror={(e) => onImgError(e, p.title)}
								/>
							</a>
						{/if}
					</li>
				{/each}
			</ol>
		</section>

		<!-- 戰 HACKATHONS -->
		<section id="hack" data-chapter="戰" class="sec">
			<div class="sec-head">
				<span class="cn">戰</span>
				<div class="sec-title">
					<h2>Hackathons &amp; Signals</h2>
					{@render brush()}
				</div>
				<span class="folio">P.09</span>
			</div>
			<ol class="hx-list">
				{#each DATA.hackathons as h, i}
					<li class="hx">
						<span class="hx-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
						<div class="hx-body">
							<h3 class="hx-title">{h.title}</h3>
							<p class="hx-meta"><span class="hx-loc">{h.location}</span> · {h.dates}</p>
							<p class="hx-desc">{h.description}</p>
							{#each h.links as l}<a href={l.href} target="_blank" rel="noreferrer">{l.title} →</a
								>{/each}
						</div>
					</li>
				{/each}
			</ol>
			<p class="repos">
				<span class="count" data-count="103">103</span> public repositories on GitHub — AI agents, Web3
				dApps, full-stack applications.
			</p>
		</section>

		<!-- 閒 OFF HOURS -->
		<section id="off" data-chapter="閒" class="sec">
			<div class="sec-head">
				<span class="cn">閒</span>
				<div class="sec-title">
					<h2>Off Hours</h2>
					{@render brush()}
				</div>
				<span class="folio">P.12</span>
			</div>
			<div class="anime-head">
				<p class="mini-h">Anime</p>
				<div class="c-nav">
					<button class="c-arrow" aria-label="Previous" onclick={() => animeScroll(-1)}>←</button>
					<button class="c-arrow" aria-label="Next" onclick={() => animeScroll(1)}>→</button>
				</div>
			</div>
			<ul
				class="track"
				bind:this={animeTrack}
				onscroll={updateAnimeProg}
				onmouseenter={() => animeAuto(false)}
				onmouseleave={() => autoOK && animeAuto(true)}
			>
				{#each DATA.anime as a}
					<li class="acard">
						<a href={a.link} target="_blank" rel="noreferrer" aria-label={a.name}>
							<Lens zoomFactor={1.5} lensSize={150} class="rounded-none">
								{#snippet children()}
									<div class="frame">
										<img src={img(a.image)} alt={a.name} width="280" height="373" loading="lazy" />
									</div>
								{/snippet}
							</Lens>
							<b class="card-name">{a.name}</b>
							<em class="card-quote">“{a.quote}”</em>
						</a>
					</li>
				{/each}
			</ul>
			<div class="track-foot">
				<div class="track-bar">
					<span class="track-bar-fill" style="transform: scaleX({animeProg})"></span>
				</div>
				<p class="drag-hint">↔ drag · hover to magnify</p>
			</div>
			<p class="mini-h">Favorites</p>
			<ul class="favs-mosaic">
				{#each DATA.favorites as f, i}
					<li class="fav" style="--fav-delay: {i * 0.06}s">
						<a href={f.href} target="_blank" rel="noreferrer" class="fav-link">
							<div class="fav-img">
								<img src={img(f.background)} alt={f.name} width="400" height="225" loading="lazy" />
							</div>
							<div class="fav-cap">
								<b>{f.name}</b>
								<span>{f.description}</span>
							</div>
							<div class="fav-shimmer"></div>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<!-- 聯 CONTACT -->
		<section id="contact" data-chapter="聯" class="sec contact">
			<span class="cn ghost" aria-hidden="true">聯</span>
			<p class="c-tag">聯 · Say Hello</p>
			<h2 class="say">Say hello.</h2>
			<a class="email" href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>
			<ul class="socials">
				{#each socials as s}
					<li>
						<a href={s.url} target="_blank" rel="noopener noreferrer" class="social-link">
							{#if s.icon}
								<img src={s.icon} alt="" class="social-icon" aria-hidden="true" />
							{/if}
							<span class="social-name">{s.name}</span>
							<span class="social-arrow">→</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</main>

	<footer>
		<span>◆ {DATA.name} — Field Notes on Building</span>
		<span>Edition 2026</span>
		<a href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>
	</footer>

	<!-- Back to top -->
	<button
		onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
		class="back-to-top"
		aria-label="Back to top"
		class:visible={scrolled}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m18 15-6-6-6 6" />
		</svg>
	</button>
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
	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		height: 3px;
		width: 100%;
		background: var(--zhu);
		transform: scaleX(0);
		transform-origin: 0 50%;
		z-index: 60;
		will-change: transform;
	}
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
		transition:
			border-color 0.25s ease,
			color 0.25s ease;
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
		transition:
			background 0.35s ease,
			padding-left 0.35s ease;
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
		transition:
			color 0.3s ease,
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
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
		transition:
			border-color 0.3s ease,
			box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.row-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: saturate(0.85) contrast(1.02);
		transition:
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.5s ease;
	}
	.row:hover .row-thumb {
		border-color: var(--zhu);
		box-shadow: 0 8px 30px rgba(198, 65, 44, 0.12);
	}
	.row:hover .row-thumb img {
		transform: scale(1.08);
		filter: saturate(1.1) contrast(1.05);
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
		transition:
			-webkit-text-stroke-color 0.3s ease,
			color 0.3s ease;
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
		.reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
		.acard:hover .frame,
		.fav-img img,
		.c-arrow:hover,
		.c-arrow:active {
			transform: none !important;
		}
		.socials a::after {
			transition: none;
		}
		.fav > a::after {
			display: none;
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

	/* Hackathons — full-width editorial index (not cards) */
	.hx-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.hx {
		position: relative;
		display: grid;
		grid-template-columns: clamp(56px, 7vw, 110px) 1fr;
		gap: clamp(16px, 3vw, 44px);
		align-items: start;
		border-top: 2px solid var(--ink);
		padding: clamp(20px, 3vh, 34px) 0 clamp(20px, 3vh, 34px) 18px;
		transition: padding-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.hx:last-child {
		border-bottom: 2px solid var(--ink);
	}
	.hx::before {
		content: '';
		position: absolute;
		left: 0;
		top: -2px;
		bottom: 0;
		width: 0;
		background: var(--zhu);
		transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.hx:hover {
		padding-left: 30px;
	}
	.hx:hover::before {
		width: 3px;
	}
	.hx-idx {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: clamp(2rem, 4vw, 3.5rem);
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1.5px var(--ink-line-strong);
		transition:
			-webkit-text-stroke-color 0.3s ease,
			color 0.3s ease;
	}
	.hx:hover .hx-idx {
		-webkit-text-stroke-color: var(--zhu);
		color: var(--zhu);
	}
	.hx-title {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(1.6rem, 3.6vw, 2.75rem);
		line-height: 1.02;
		letter-spacing: -0.02em;
		margin: 0;
		transition: color 0.3s ease;
	}
	.hx:hover .hx-title {
		color: var(--zhu);
	}
	.hx-meta {
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin-top: 10px;
	}
	.hx-loc {
		color: var(--zhu);
	}
	.hx-desc {
		line-height: 1.55;
		color: var(--ink-soft);
		margin-top: 12px;
		max-width: 66ch;
	}
	.hx a {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--zhu);
		display: inline-block;
		margin-top: 12px;
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
		transition:
			transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.4s ease;
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
		transition:
			background 0.25s ease,
			color 0.25s ease,
			transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.c-arrow:hover {
		background: var(--ink);
		color: var(--paper);
		transform: translateY(-2px);
	}
	.c-arrow:active {
		transform: scale(0.92);
	}
	.track {
		display: flex;
		gap: 24px;
		overflow-x: auto;
		scroll-snap-type: x proximity;
		scroll-behavior: smooth;
		padding-bottom: 6px;
		margin: 0;
		list-style: none;
		scrollbar-width: none;
		cursor: grab;
		scroll-padding: 0 16px;
	}
	.track:active {
		cursor: grabbing;
	}
	.track::-webkit-scrollbar {
		display: none;
	}
	.track:hover {
		scroll-snap-type: x mandatory;
	}
	.acard {
		flex: 0 0 clamp(200px, 24%, 280px);
		scroll-snap-align: start;
	}
	.acard > a {
		display: block;
	}
	.acard .frame {
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.acard:hover .frame {
		transform: scale(1.03);
	}
	.acard .card-name {
		transition: color 0.25s ease;
	}
	.acard:hover .card-name {
		color: var(--zhu);
	}
	.acard .card-quote {
		transition: opacity 0.3s ease;
	}
	.acard:hover .card-quote {
		opacity: 0.8;
	}
	.track-foot {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-top: 16px;
	}
	.track-bar {
		flex: 1;
		height: 2px;
		background: var(--ink-line);
		position: relative;
		overflow: hidden;
	}
	.track-bar-fill {
		position: absolute;
		inset: 0;
		background: var(--zhu);
		transform-origin: 0 50%;
		transform: scaleX(0);
		transition: transform 0.15s ease-out;
	}
	.drag-hint {
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin: 0;
		white-space: nowrap;
		transition: opacity 0.3s ease;
	}
	.track:hover ~ .track-foot .drag-hint {
		opacity: 0.5;
	}

	/* Global image loading */
	@keyframes imgReveal {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.frame img,
	.fav-img img,
	.row-thumb img,
	.edu-logo,
	.tl-logo {
		background: var(--paper-2);
		opacity: 0;
		animation: imgReveal 0.5s ease forwards;
	}
	.frame img.loaded,
	.fav-img img.loaded,
	.row-thumb img.loaded,
	.edu-logo.loaded,
	.tl-logo.loaded {
		opacity: 1;
		animation: none;
	}

	/* Social links with icons */
	.socials {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: clamp(16px, 3vw, 28px);
		list-style: none;
		margin: 28px 0 0;
		padding: 0;
	}
	.social-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		color: var(--ink);
		padding: 8px 14px;
		border: 1px solid var(--ink-line-strong);
		border-radius: 100px;
		background: transparent;
		transition:
			background 0.3s ease,
			border-color 0.3s ease,
			color 0.3s ease,
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.social-link:hover {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
		transform: translateY(-2px);
	}
	.social-icon {
		width: 16px;
		height: 16px;
		object-fit: contain;
		filter: none;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}
	.social-link:hover .social-icon {
		opacity: 1;
	}
	.social-icon-svg {
		width: 16px;
		height: 16px;
	}
	.social-name {
		white-space: nowrap;
	}
	.social-arrow {
		font-size: 0.85em;
		opacity: 0.5;
		transition:
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.3s ease;
	}
	.social-link:hover .social-arrow {
		transform: translateX(3px);
		opacity: 1;
	}
	.favs-mosaic {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 168px;
		gap: 14px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.fav {
		margin: 0;
		opacity: 0;
		transform: translateY(16px);
		animation: favReveal 0.7s ease forwards;
		animation-delay: var(--fav-delay, 0s);
	}
	@keyframes favReveal {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.fav:first-child {
		grid-row: span 2;
	}
	.fav:nth-child(4) {
		grid-column: span 2;
	}
	.fav-link {
		position: relative;
		display: block;
		height: 100%;
		overflow: hidden;
		border: 1px solid var(--ink-line-strong);
		border-radius: 0.75rem;
		transition:
			border-color 0.3s ease,
			transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.4s ease;
	}
	.fav-img {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		overflow: hidden;
	}
	.fav-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.88) contrast(1.03);
		transition:
			transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.4s ease;
	}
	.fav-link:hover .fav-img img {
		transform: scale(1.06);
		filter: none;
	}
	.fav-link:hover {
		border-color: var(--zhu);
		transform: translateY(-3px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
	}
	.fav-cap {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 32px 16px 14px;
		background: linear-gradient(transparent, rgba(26, 24, 21, 0.4) 40%, rgba(26, 24, 21, 0.9));
		color: var(--paper);
		z-index: 2;
		transition: padding-bottom 0.4s ease;
	}
	.fav-cap b {
		display: block;
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: 1.2rem;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}
	.fav-cap span {
		display: block;
		font-size: 0.72rem;
		color: rgba(243, 239, 230, 0.82);
		margin-top: 4px;
		line-height: 1.35;
		max-width: 90%;
	}
	/* Vermilion shimmer line on hover */
	.fav-shimmer {
		position: absolute;
		inset-x: 0;
		top: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(198, 65, 44, 0.4), transparent);
		opacity: 0;
		transition: opacity 0.4s ease;
		z-index: 3;
	}
	.fav-link:hover .fav-shimmer {
		opacity: 1;
	}
	/* Hover mask overlay */
	.fav-link::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(26, 24, 21, 0);
		transition: background 0.4s ease;
		pointer-events: none;
		z-index: 1;
		border-radius: inherit;
	}
	.fav-link:hover::after {
		background: rgba(26, 24, 21, 0.35);
	}
	@media (max-width: 640px) {
		.favs-mosaic {
			grid-template-columns: repeat(2, 1fr);
			grid-auto-rows: 150px;
		}
		.fav:first-child {
			grid-row: span 2;
			grid-column: span 2;
		}
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
		transition:
			color 0.25s ease,
			text-underline-offset 0.25s ease;
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

	/* Back to top button */
	.back-to-top {
		position: fixed;
		bottom: 28px;
		right: 28px;
		z-index: 55;
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		border: 1.5px solid var(--ink-line-strong);
		border-radius: 50%;
		background: var(--paper);
		color: var(--ink);
		cursor: pointer;
		opacity: 0;
		transform: translateY(10px) scale(0.9);
		pointer-events: none;
		transition:
			opacity 0.35s ease,
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.25s ease,
			border-color 0.25s ease;
	}
	.back-to-top.visible {
		opacity: 1;
		transform: translateY(0) scale(1);
		pointer-events: auto;
	}
	.back-to-top:hover {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
		transform: translateY(-2px) scale(1.05);
	}
	.back-to-top:active {
		transform: scale(0.92);
	}

	/* Page transition overlay */
	.page-transition {
		position: fixed;
		inset: 0;
		background: var(--paper);
		z-index: 100;
		pointer-events: none;
		opacity: 0;
	}

	/* Cursor glow — vermilion light follows mouse */
	.cursor-glow {
		position: fixed;
		width: 300px;
		height: 300px;
		border-radius: 50%;
		pointer-events: none;
		z-index: 0;
		background: radial-gradient(circle, rgba(198, 65, 44, 0.06) 0%, transparent 70%);
		transform: translate(-50%, -50%);
		transition: opacity 0.4s ease;
		opacity: 0;
		will-change: left, top;
	}
	.cursor-glow.active {
		opacity: 1;
	}
	/* Chapter watermark — large faint section numbers */
	.sec::before {
		content: attr(data-chapter);
		position: absolute;
		top: -20px;
		right: -10px;
		font-family: var(--font-label);
		font-weight: 900;
		font-size: clamp(6rem, 14vw, 12rem);
		line-height: 1;
		color: var(--ink);
		opacity: 0.025;
		pointer-events: none;
		z-index: 0;
		letter-spacing: -0.04em;
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
		.links {
			scroll-padding: 0 16px;
		}
	}
	/* Nav scroll hint — fade edges */
	.links {
		position: relative;
	}
	.links::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 24px;
		background: linear-gradient(90deg, transparent, var(--paper));
		pointer-events: none;
		transition: opacity 0.3s ease;
	}
	.nav.scrolled .links::after {
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--paper) 92%, transparent)
		);
	}
	/* Skills section — prevent title clipping under fixed nav */
	#skills {
		scroll-margin-top: 90px;
	}
</style>
