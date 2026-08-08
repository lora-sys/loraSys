<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { DATA } from '$lib/data/resume';
	import InkWash from '$lib/components/ink/InkWash.svelte';
	import InkParticles from '$lib/components/ink/InkParticles.svelte';
	import Lens from '$lib/components/magic/lens/lens.svelte';
	import ContributionGraph from '$lib/components/portfolio/ContributionGraph.svelte';
	import BackToTop from '$lib/components/ui/back-to-top/back-to-top.svelte';
	import type { WorkItem } from '$lib/types';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	// SmoothCursor state
	let cursorVisible = $state(false);
	let cursorX = $state(0);
	let cursorY = $state(0);
	let cursorScale = $state(0);
	let targetX = 0;
	let targetY = 0;
	let cursorRaf: number;

	function animateCursor() {
		const dx = targetX - cursorX;
		const dy = targetY - cursorY;
		cursorX += dx * 0.22;
		cursorY += dy * 0.22;
		cursorScale += (1 - cursorScale) * 0.25;
		cursorRaf = requestAnimationFrame(animateCursor);
	}

	// Shared helpers
	function img(path: string): string {
		if (!path.startsWith('/') || path.startsWith(base)) return path;
		return base + path;
	}
	function onImgError(e: Event, title: string) {
		const im = e.currentTarget as HTMLImageElement;
		im.onerror = null;
		im.src = coverFallback(title);
	}
	function coverFallback(title: string): string {
		const safe = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
		const initial = (safe.trim().charAt(0) || 'L').toUpperCase();
		const t = safe.slice(0, 22);
		return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%25' height='100%25' fill='%23ece7db'/><text x='28' y='128' font-family='Georgia,serif' font-size='108' font-weight='900' fill='%23c0392b' opacity='0.85'>${initial}</text><line x1='28' y1='146' x2='292' y2='146' stroke='%231a1815' stroke-width='1.2'/><text x='28' y='172' font-family='Georgia,serif' font-size='14' font-weight='700' fill='%231a1815'>${t}</text></svg>`;
	}

	const socials = Object.values(DATA.contact.social).filter((s) => s.url);
	const contactSocials = socials.filter((s) =>
		['GitHub', 'LinkedIn', 'X', 'email'].includes(s.name)
	);

	const contents = [
		{ n: '01', cn: '己', title: '关于我', note: '我是谁', href: '#self', total: 8 },
		{ n: '02', cn: '技', title: '技艺', note: '技术栈', href: '#skills', total: 8 },
		{ n: '03', cn: '歷', title: '经历', note: '工作经历', href: '#exp', total: 8 },
		{
			n: '04',
			cn: '作',
			title: '精选作品',
			note: `${DATA.projects.length} 个项目`,
			href: '#work',
			total: 8
		},
		{ n: '05', cn: '戰', title: '闯关记录', note: 'ETH · Monad', href: '#hack', total: 8 },
		{ n: '06', cn: '閒', title: '闲余时光', note: '动漫 & 更多', href: '#off', total: 8 },
		{ n: '07', cn: '記', title: '速记', note: '一手笔记', href: '#notes', total: 8 },
		{ n: '08', cn: '聯', title: '打个招呼', note: '', href: '#contact', total: 8 }
	];

	const skillGroups = [
		{ label: 'Languages', items: ['TypeScript', 'Python', 'JavaScript', 'Java', 'Solidity'] },
		{
			label: 'Frameworks',
			items: ['React', 'Next.js', 'Svelte', 'SvelteKit', 'Node.js', 'TailwindCSS']
		},
		{ label: 'Tools & Domains', items: ['PostgreSQL', 'Docker', 'AI Agents', 'Web3'] }
	];

	const work = DATA.work as WorkItem[];

	let animeTrack: HTMLElement | undefined = $state();
	let animeProg = $state(0);
	let autoOK = false;
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
	function onAnimeKey(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			animeScroll(-1);
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			animeScroll(1);
		}
	}

	let contribData: any = $state(null);
	let contribLoading = $state(true);
	let contribError = $state(false);

	function loadContributions() {
		fetch(`${base}/api/contributions`)
			.then((r) => r.json())
			.then((d) => {
				contribData = d;
				contribLoading = false;
			})
			.catch(() => {
				contribError = true;
				contribLoading = false;
			});
	}

	let scrolled = $state(false);
	let reduceMotion = $state(true);
	let showWash = $state(false);
	let show3d = $state(false);
	let SealStage: any = $state(undefined);
	let animReady = $state(false);
	let motionCleanup = () => {};
	let magCleanupsRef: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> =
		[];
	let lastScrollY = 0;
	let lastScrollTime = 0;

	function killMotion() {
		if (!gsap) return;
		if (ScrollTrigger) ScrollTrigger.getAll().forEach((s: any) => s.kill());
		gsap.killTweensOf(
			'.seal, .mast .word, .hero-left > *, .index-h, .index li, .pull, .sec-head, .brush path, .row, .hk, .card, .tl-item, .hx, .fav, .mrow, .count'
		);
		gsap.set('.seal', { clearProps: 'all' });
		gsap.set('.mast .word', { clearProps: 'all' });
		gsap.set('.hero-left > *', { clearProps: 'all' });
		gsap.set('.index-h, .index li, .pull', { clearProps: 'all' });
		gsap.set('.sec-head', { clearProps: 'all' });
		gsap.set('.brush path', { clearProps: 'all' });
		gsap.set('.row', { clearProps: 'all' });
		gsap.set('.hk, .card, .tl-item, .hx, .fav', { clearProps: 'all' });
		gsap.set('.mrow', { clearProps: 'all' });
		gsap.set('.count', { clearProps: 'all' });
		document.querySelectorAll('.brush path').forEach((p) => {
			const path = p as SVGPathElement;
			const len = path.getTotalLength();
			gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
		});
	}

	function initMotion() {
		if (!gsap) return;
		gsap.fromTo(
			'.seal',
			{ scale: 2.8, opacity: 0, rotate: -30, filter: 'blur(8px)' },
			{
				scale: 1,
				opacity: 1,
				rotate: -4,
				filter: 'blur(0px)',
				duration: 0.8,
				ease: 'back.out(1.4)',
				delay: 0.1
			}
		);
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
		(gsap.utils.toArray('.sec') as HTMLElement[]).forEach((sec) => {
			const head = sec.querySelector('.sec-head');
			if (head)
				gsap.from(head, {
					y: 16,
					duration: 0.45,
					ease: 'power3.out',
					scrollTrigger: { trigger: sec, start: 'top 80%' }
				});
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
		(gsap.utils.toArray('.row') as HTMLElement[]).forEach((row) => {
			gsap.from(row, {
				y: 12,
				duration: 0.35,
				ease: 'power2.out',
				scrollTrigger: { trigger: row, start: 'top 90%' }
			});
		});
		(gsap.utils.toArray('.hk, .card, .tl-item, .hx, .fav') as HTMLElement[]).forEach((el) => {
			gsap.from(el, {
				y: 12,
				duration: 0.35,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 92%',
					once: true,
					onRefresh: (self: any) => self.animation.play()
				}
			});
		});
		(gsap.utils.toArray('.count') as HTMLElement[]).forEach((el) => {
			const target = Number(el.dataset.count || '0');
			const obj = { v: 0 };
			if (ScrollTrigger)
				ScrollTrigger.create({
					trigger: el,
					start: 'top 75%',
					once: true,
					onEnter: () =>
						gsap.to(obj, {
							v: target,
							duration: 1.0,
							ease: 'power2.out',
							onUpdate: () => (el.textContent = String(Math.round(obj.v)))
						})
				});
		});
		const magCleanups: Array<{
			el: HTMLElement;
			move: (e: MouseEvent) => void;
			leave: () => void;
		}> = [];
		const magEls = gsap.utils.toArray(
			'.c-arrow, .socials a, .row-title, .row-links a, .seal-trigger, .now-link, .index li a'
		);
		(magEls as HTMLElement[]).forEach((el) => {
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
			magCleanups.push({ el, move, leave });
		});
		if (ScrollTrigger) ScrollTrigger.refresh();
		magCleanupsRef = magCleanups;
	}

	function startMotion() {
		motionCleanup();
		initMotion();
	}

	onMount(() => {
		loadContributions();
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const desktop = window.matchMedia('(min-width: 861px)').matches;
		const probe = document.createElement('canvas');
		show3d = Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
		if (show3d) {
			const loadSeal = () =>
				void import('$lib/components/ink/LivingSealStage.svelte').then((m) => {
					SealStage = m.default;
				});
			if ('requestIdleCallback' in window) window.requestIdleCallback(loadSeal, { timeout: 1200 });
			else globalThis.setTimeout(loadSeal, 320);
		}
		reduceMotion = reduce;
		showWash = !reduce && desktop;
		autoOK = !reduce;
		if (autoOK) animeAuto(true);

		const onScroll = () => {
			scrolled = document.documentElement.scrollTop > 600;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		lastScrollY = document.documentElement.scrollTop;
		lastScrollTime = Date.now();

		const onImgLoad = (img: HTMLImageElement) => {
			const mark = () => img.classList.add('loaded');
			if (img.complete && img.naturalWidth > 0) mark();
			else {
				img.addEventListener('load', mark, { once: true });
				img.addEventListener('error', mark, { once: true });
			}
			requestAnimationFrame(() => {
				if (img.complete && img.naturalWidth > 0 && !img.classList.contains('loaded')) mark();
			});
		};
		document.querySelectorAll('img').forEach(onImgLoad);

		// SmoothCursor
		if (desktop && !('ontouchstart' in window) && !reduce) {
			cursorVisible = true;
			cursorX = window.innerWidth / 2;
			cursorY = window.innerHeight / 2;
			cursorScale = 1;
			animateCursor();
			document.addEventListener('mousemove', (e) => {
				targetX = e.clientX;
				targetY = e.clientY;
			});
		}

		if (!reduce) {
			gsap.registerPlugin(ScrollTrigger);
			startMotion();
			setTimeout(() => {
				animReady = true;
			}, 2200);
		}

		return () => {
			window.removeEventListener('scroll', onScroll);
			clearInterval(animeTimer);
			motionCleanup();
			if (cursorRaf) cancelAnimationFrame(cursorRaf);
			document.body.style.cursor = '';
			cursorVisible = false;
		};
	});

	function replayAnimations() {
		if (!gsap) return;
		window.scrollTo({ top: 0, behavior: 'instant' });
		requestAnimationFrame(() => {
			motionCleanup();
			killMotion();
			requestAnimationFrame(() => {
				startMotion();
			});
		});
	}

	const builtDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
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

<div class="edition">
	{#if show3d && SealStage}
		<SealStage />
	{:else}
		<div class="seal-fallback" aria-hidden="true">
			<span class="fallback-loop"></span>
			<span class="fallback-body"><i></i><i></i><i></i></span>
		</div>
	{/if}
	<a href="#main" class="skip-link">Skip to content</a>
	<div class="scroll-progress" aria-hidden="true"></div>
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="ink-wash" aria-hidden="true"></div>
	{#if showWash}<InkWash />{/if}

	<!-- SmoothCursor -->
	{#if cursorVisible}
		<div
			class="smooth-cursor"
			style="left: {cursorX}px; top: {cursorY}px; transform: scale({cursorScale}) translate(-50%, -50%);"
			aria-hidden="true"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
				<path d="M13 13l6 6" />
			</svg>
		</div>
	{/if}

	<header class="mast">
		<a class="logo" href="#top" aria-label="lora — home">
			<span class="word">{DATA.name}</span>
			<span class="seal" aria-hidden="true">lora</span>
		</a>
		<p class="ed-line">
			在建造中记录<br />
			<b>2026 版 — <span class="count" data-count={DATA.repoCount}>{DATA.repoCount}</span> 个仓库</b
			>
		</p>
	</header>

	<div class="band">
		<span>进化的建造者</span>
		<span class="z">AI Agents · 全栈 · Web3</span>
		<a href={DATA.url}>github.com/lora-sys</a>
	</div>

	<main id="main">
		<section id="top" data-chapter="序" class="hero">
			{#if !reduceMotion}<InkParticles />{/if}
			<div class="hero-left">
				<div class="hero-meta">
					<span class="tag">Cover · 序</span>
					<span class="rule"></span>
					<span class="folio"
						>P.01<span class="folio-sep">/</span><span class="folio-total">08</span></span
					>
				</div>
				<h1>构建<br /><span class="em">系统</span><br />让它<span class="z">进化。</span></h1>
				<p class="dek">{DATA.description}</p>
				<div class="hero-divider" aria-hidden="true"></div>
				<ul class="hero-bullets">
					<li>
						<span class="arrow">→</span> 构建 <b>AI 智能体</b><span class="tag"
							>LangGraph · MCP</span
						>
					</li>
					<li>
						<span class="arrow">→</span> 参与 <b>Monad Blitz</b> 原型<span class="tag"
							>48 小时冲刺</span
						>
					</li>
					<li>
						<span class="arrow">→</span> <b>{DATA.repoCount} 个仓库</b> 持续增长<span class="tag"
							>一直在打造</span
						>
					</li>
				</ul>
			</div>
			<nav class="index" aria-label="Contents">
				<button
					class="seal-trigger"
					type="button"
					onclick={() => window.dispatchEvent(new CustomEvent('living-seal:impulse'))}
				>
					<span class="seal-trigger-dot" aria-hidden="true"></span>
					Touch the artifact
					<span aria-hidden="true">↗</span>
				</button>
				<p class="index-h">In This Issue</p>
				<ul>
					{#each contents as c}
						<li>
							<a href={c.href}>
								<span class="l"
									><span class="n">{c.n}</span>{c.cn} &nbsp;{c.title}{#if c.note}<em>
											— {c.note}</em
										>{/if}</span
								>
								<span class="p"
									>{c.n}<span class="p-sep">/</span><span class="p-total"
										>{c.total.toString().padStart(2, '0')}</span
									></span
								>
							</a>
						</li>
					{/each}
				</ul>
				<p class="pull">
					"Turning ambitious ideas into <b>reality</b> — always building, learning, and shipping."
				</p>
				<a class="now-link" href={`${base}/now`}>
					<span>持续建造中 — /now</span>
					<span class="now-arrow" aria-hidden="true">→</span>
				</a>
				<a class="hero-cta" href={`${base}/#work`}>
					<span>查看作品</span>
					<span aria-hidden="true">↓</span>
				</a>
			</nav>
			<span class="hero-watermark" aria-hidden="true">Edition<br />2026</span>
		</section>

		<section id="self" data-chapter="己" class="sec">
			<div class="sec-head">
				<span class="cn">己</span>
				<div class="sec-title">
					<h2>关于我</h2>
					{@render brush()}
				</div>
				<span class="folio"
					>P.02<span class="folio-sep">/</span><span class="folio-total">08</span></span
				>
			</div>
			<div class="self-grid">
				<div class="bio">{@html DATA.summaryHtml}</div>
				<aside>
					<p class="mini-h" id="education">教育背景</p>
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
				</aside>
				<div class="contrib-embed">
					{#if contribLoading}<p class="contrib-loading">加载贡献数据…</p>
					{:else if contribData}<ContributionGraph data={contribData} />
					{:else if contribError}<p class="contrib-loading">贡献图谱加载失败</p>{/if}
				</div>
			</div>
		</section>

		<section id="skills" data-chapter="技" class="sec skills">
			<div class="sec-head">
				<span class="cn">技</span>
				<div class="sec-title">
					<h2>技艺</h2>
					{@render brush()}
				</div>
				<span class="folio"
					>P.03<span class="folio-sep">/</span><span class="folio-total">08</span></span
				>
			</div>
			<div class="marquees">
				{#each skillGroups as g, gi}
					<div class="mrow" class:rev={gi % 2 === 1}>
						<span class="mrow-label">{g.label}</span>
						<div class="mviewport">
							<div class="mtrack">
								{#each [...g.items, ...g.items, ...g.items] as s}
									<span class="skill">{s}</span><span class="sep">✦</span>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section id="exp" data-chapter="歷" class="sec">
			<div class="sec-head">
				<span class="cn">歷</span>
				<div class="sec-title">
					<h2>经历</h2>
					{@render brush()}
				</div>
				<span class="folio"
					>P.03<span class="folio-sep">/</span><span class="folio-total">08</span></span
				>
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
								{#if w.badges?.length}<div class="tl-badges">
										{#each w.badges as b}<span>{b}</span>{/each}
									</div>{/if}
							</div>
						</li>
					{/each}
				</ol>
			{:else}
				<div class="exp-open">
					<div class="exp-status">
						<span class="status-dot" aria-hidden="true"></span>
						<span class="status-label">开放合作机会</span>
					</div>
					<div class="exp-grid">
						<div class="exp-stat">
							<span class="exp-num"
								><span class="count" data-count={DATA.repoCount}>{DATA.repoCount}</span></span
							>
							<span class="exp-cap">GitHub 公开仓库</span>
						</div>
						<div class="exp-stat">
							<span class="exp-num"><span class="count" data-count="4">4</span></span>
							<span class="exp-cap">完成的闯关（ETH Beijing · Monad ×2 · agent jams）</span>
						</div>
						<div class="exp-stat">
							<span class="exp-num">∞</span>
							<span class="exp-cap">持续进化的项目</span>
						</div>
					</div>
					<div class="exp-actions">
						<a class="exp-cta exp-cta-primary" href={`mailto:${DATA.contact.email}`}>联系我 →</a>
						<a class="exp-cta" href={`${base}/resume.pdf`} target="_blank" rel="noreferrer"
							>下载简历 ↓</a
						>
					</div>
					<p class="exp-note">
						目前正专注于 AI 智能体、Web3 和全栈系统的交叉领域。正式的工作经历会在合适的时机开启 —
						在此之前，上面的项目就是最好的记录。
					</p>
				</div>
			{/if}
		</section>

		<section id="work" data-chapter="作" class="sec">
			<div class="sec-head">
				<span class="cn">作</span>
				<div class="sec-title">
					<h2>精选作品</h2>
					{@render brush()}
				</div>
				<span class="folio"
					>P.04<span class="folio-sep">/</span><span class="folio-total">08</span></span
				>
			</div>
			<div class="work-intro">
				<p>从第一性原理到可运行产品的精选系统。</p>
				<span>2025—2026 · AI / WEB3 / 全栈</span>
			</div>
			<ol class="work">
				{#each DATA.projects as p, i}
					<li class="row featured" style={`--project-index:${i}`}>
						<span class="idx">{String(i + 1).padStart(2, '0')}</span>
						<div class="row-main">
							<span class="row-date">{p.dates}</span>
							<a class="row-title" href={p.href} target="_blank" rel="noreferrer">{p.title}</a>
							<p class="row-desc">{p.description}</p>
							<p class="row-tech">
								{#each p.technologies as t}
									<span>{t}</span>
								{/each}
							</p>
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
									decoding="async"
									fetchpriority="low"
									onerror={(e) => onImgError(e, p.title)}
								/>
							</a>
						{/if}
					</li>
				{/each}
			</ol>
		</section>

		<section id="hack" data-chapter="戰" class="sec">
			<div class="sec-head">
				<span class="cn">戰</span>
				<div class="sec-title">
					<h2>闯关记录</h2>
					{@render brush()}
				</div>
				<span class="folio"
					>P.05<span class="folio-sep">/</span><span class="folio-total">08</span></span
				>
			</div>
			<ol class="hx-list">
				{#each DATA.hackathons as h, i}
					<li class="hx">
						<span class="hx-idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
						<div class="hx-body">
							<h3 class="hx-title">{h.title}</h3>
							<p class="hx-meta"><span class="hx-loc">{h.location}</span> · {h.dates}</p>
							<p class="hx-desc">{h.description}</p>
							<div class="hx-links">
								{#each h.links as l}<a href={l.href} target="_blank" rel="noreferrer">{l.title} →</a
									>{/each}
								{#if h.links.length === 0}
									<a
										href={`mailto:${DATA.contact.email}?subject=${encodeURIComponent(h.title + ' details')}`}
										>Ask for details →</a
									>
								{/if}
							</div>
						</div>
					</li>
				{/each}
			</ol>
			<p class="repos">
				<span class="count" data-count={DATA.repoCount}>{DATA.repoCount}</span> 个 GitHub 公开仓库 —
				AI 智能体、Web3 dApps, full-stack applications.
			</p>
		</section>

		<section id="off" data-chapter="閒" class="sec">
			<div class="sec-head">
				<span class="cn">閒</span>
				<div class="sec-title">
					<h2>闲余时光</h2>
					{@render brush()}
				</div>
				<span class="folio"
					>P.06<span class="folio-sep">/</span><span class="folio-total">08</span></span
				>
			</div>
			<div class="anime-head">
				<p class="mini-h">动漫</p>
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
				onkeydown={onAnimeKey}
				role="region"
				aria-label="Anime collection"
				tabindex="0"
			>
				{#each DATA.anime as a}
					<li class="acard">
						<a href={a.link} target="_blank" rel="noreferrer" aria-label={a.name}>
							<Lens zoomFactor={1.5} lensSize={150} class="rounded-none">
								{#snippet children()}
									<div class="frame">
										<img
											src={img(a.image)}
											alt={a.name}
											width="280"
											height="373"
											loading="lazy"
											decoding="async"
											fetchpriority="low"
										/>
										<span class="anime-no"
											>{String(DATA.anime.indexOf(a) + 1).padStart(2, '00')}</span
										>
										<span class="anime-quote">"{a.quote}"</span>
									</div>
								{/snippet}
							</Lens>
							<b class="card-name">{a.name}</b>
							<span class="anime-meta">存档 · 闲余时刻</span>
						</a>
					</li>
				{/each}
			</ul>
			<div class="track-foot">
				<div class="track-bar">
					<span class="track-bar-fill" style="transform: scaleX({animeProg})"></span>
				</div>
				<p class="drag-hint">↔ 拖拽 · 悬停放大</p>
			</div>
			<div class="off-manifesto" aria-label="闲余手记">
				<span>随身携带的故事</span>
				<strong>长在片尾之后。</strong>
				<em>閒 · 好奇心也是工作的一部分</em>
			</div>
			<div class="favorites-head">
				<div>
					<p class="mini-h">私藏</p>
					<h3>长久回响的<br />信号陈列柜。</h3>
				</div>
				<p>反复回到桌前的电影、音乐、游戏和想法。</p>
			</div>
			<ul class="favs-mosaic">
				{#each DATA.favorites as f, i}
					<li class="fav" class:featured-fav={i === 0} style="--fav-delay: {i * 0.06}s">
						<a href={f.href} target="_blank" rel="noreferrer" class="fav-link">
							<div class="fav-img">
								<img
									src={img(f.background)}
									alt={f.name}
									width="400"
									height="225"
									loading="lazy"
									decoding="async"
									fetchpriority="low"
								/>
							</div>
							<div class="fav-cap">
								<span class="fav-index">{String(i + 1).padStart(2, '0')}</span>
								<b>{f.name}</b>
								<span>{f.description}</span>
								<em>open ↗</em>
							</div>
							<div class="fav-shimmer"></div>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<!-- 速记 NOTES -->
		<section id="notes" data-chapter="記" class="sec notes">
			<div class="sec-head">
				<span class="cn">記</span>
				<div class="sec-title">
					<h2>速记</h2>
					{@render brush()}
				</div>
				<span class="folio"
					>P.07<span class="folio-sep">/</span><span class="folio-total">08</span></span
				>
			</div>
			<p class="notes-dek">一手笔记 · 持续生长中</p>
			<div class="notes-grid">
				{#each DATA.notes as n, i}
					<article class="note-card" style="--note-delay: {i * 0.06}s">
						<div class="note-header">
							<time class="note-date" datetime={n.date}>{n.date}</time>
							<div class="note-tags">
								{#each n.tags as t}<span class="note-tag">{t}</span>{/each}
							</div>
						</div>
						<h3 class="note-title">{n.title}</h3>
						<p class="note-summary">{n.summary}</p>
						<div class="note-line" aria-hidden="true"></div>
					</article>
				{/each}
			</div>
		</section>

		<section id="contact" data-chapter="聯" class="sec contact">
			<span class="cn ghost" aria-hidden="true">聯</span>
			<p class="c-tag">聯 · 打个招呼</p>
			<h2 class="say">打个招呼。</h2>
			<p class="email-wrap">
				<a class="email" href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>
			</p>
			<div class="contact-cta">
				<p>有项目想法或合作机会？<br /><em>让我们一起建造。</em></p>
				<a class="cta-btn" href={`mailto:${DATA.contact.email}?subject=合作机会`}>
					开始对话 <span aria-hidden="true">→</span>
				</a>
			</div>
			<ul class="socials">
				{#each contactSocials as s}
					<li>
						<a href={s.url} target="_blank" rel="noopener noreferrer" class="social-link">
							{#if s.icon}<img src={s.icon} alt="" class="social-icon" aria-hidden="true" />{/if}
							<span class="social-name">{s.name}</span>
							<span class="social-arrow">→</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</main>

	<footer class="colophon">
		<div class="col-l">
			<span class="col-mark">◆</span>
			<span class="col-title">{DATA.name} — 在建造中记录</span>
			<span class="col-edition">2026 版</span>
		</div>
		<div class="col-c">
			<p class="col-set">Set in <em>Fraunces</em> &amp; <em>Archivo</em></p>
			<p class="col-print">
				Hand-inked · {DATA.education[0]?.school ?? "Xi'an Mingde Institute of Technology"}
			</p>
		</div>
		<div class="col-r">
			<span class="col-built">Built {builtDate}</span>
			<a href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a>
			<a href={DATA.url} target="_blank" rel="noreferrer">github.com/lora-sys →</a>
		</div>
	</footer>

	<BackToTop threshold={600} />

	{#if animReady && !reduceMotion}
		<button
			onclick={replayAnimations}
			class="replay-btn"
			class:visible={animReady}
			aria-label="重播入场动画"
			title="重播入场动画"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
				<path d="M21 3v5h-5" />
				<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
				<path d="M8 16H3v5" />
			</svg>
			<span>重播</span>
		</button>
	{/if}
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
	.mast,
	.band,
	main,
	.colophon {
		position: relative;
		z-index: 2;
	}
	.seal-fallback {
		position: fixed;
		right: -4vw;
		top: 18vh;
		z-index: 1;
		width: min(28vw, 360px);
		aspect-ratio: 0.72;
		opacity: 0.13;
		pointer-events: none;
		mix-blend-mode: multiply;
	}
	.fallback-loop {
		position: absolute;
		left: 50%;
		top: 0;
		width: 34%;
		aspect-ratio: 1;
		border: clamp(5px, 0.7vw, 10px) solid var(--zhu);
		border-radius: 50%;
		transform: translateX(-50%);
		box-shadow:
			inset 0 0 0 clamp(4px, 0.5vw, 8px) var(--paper),
			inset 0 0 0 clamp(6px, 0.8vw, 12px) var(--ink);
	}
	.fallback-body {
		position: absolute;
		inset: 22% 10% 0;
		display: grid;
		grid-template-rows: 1fr 1.25fr 1.5fr;
		gap: 5%;
		transform: rotate(-4deg);
	}
	.fallback-body i {
		display: block;
		border: 2px solid var(--ink);
		background: linear-gradient(135deg, var(--zhu), rgba(198, 65, 44, 0.2));
		box-shadow: 8px 8px 0 rgba(26, 24, 21, 0.22);
	}

	.smooth-cursor {
		position: fixed;
		z-index: 100;
		pointer-events: none;
		will-change: transform;
		color: var(--zhu);
		opacity: 0.6;
		transition: opacity 0.3s;
	}

	.skip-link {
		position: absolute;
		top: -100%;
		left: var(--page-x);
		z-index: 9999;
		padding: 8px 16px;
		background: var(--ink);
		color: var(--paper);
		font-family: var(--font-label);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-decoration: none;
		border-radius: 0 0 4px 4px;
		transition: top 0.2s ease;
	}
	.skip-link:focus {
		top: 0;
		outline: 2px solid var(--zhu);
		outline-offset: -2px;
	}

	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		height: 3px;
		width: 100%;
		background: var(--ink);
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
			radial-gradient(
				50% 45% at 88% 8%,
				var(--ink-wash-1, rgba(26, 24, 21, 0.14)),
				transparent 70%
			),
			radial-gradient(
				38% 38% at 12% 96%,
				var(--ink-wash-2, rgba(198, 65, 44, 0.08)),
				transparent 70%
			);
		filter: blur(30px);
	}

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
		font-style: normal;
		font-size: 22px;
		line-height: 1;
		letter-spacing: -0.04em;
		text-align: center;
		transform: rotate(-4deg);
		box-shadow: inset 0 0 0 2.5px rgba(243, 239, 230, 0.32);
		filter: blur(0px);
		transition: filter 0.6s ease;
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
		color: var(--ink);
	}

	.hero {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: clamp(32px, 5vw, 72px);
		padding: clamp(40px, 8vh, 96px) 0 var(--page-y);
		align-items: center;
		position: relative;
		overflow: hidden;
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
		color: var(--ink);
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
	h1 .em {
		font-weight: 700;
		font-style: normal;
		font-size: clamp(2.75rem, 7vw, 6.5rem);
		color: var(--zhu);
		position: relative;
		display: inline-block;
		padding-bottom: 0.12em;
		letter-spacing: -0.02em;
	}
	h1 .em::after {
		content: '';
		position: absolute;
		left: -2%;
		right: -2%;
		bottom: 0.04em;
		height: 0.14em;
		background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'><path d='M2 8 C 40 3 90 9 140 4 S 190 3 198 6' fill='none' stroke='%231a1815' stroke-width='1.4' stroke-linecap='round' opacity='0.7'/></svg>")
			no-repeat center / 100% 100%;
		pointer-events: none;
	}
	h1 .z {
		font-weight: 700;
		font-size: clamp(2.75rem, 7vw, 6.5rem);
		color: var(--zhu);
		letter-spacing: -0.02em;
	}
	.dek {
		font-size: var(--type-dek);
		line-height: 1.65;
		max-width: 46ch;
		margin-top: 26px;
		color: var(--ink);
	}
	.hero-divider {
		width: 48px;
		height: 1.5px;
		background: var(--ink);
		opacity: 0.4;
		margin-top: 28px;
		margin-bottom: 22px;
	}

	.hero-bullets {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.hero-bullets li {
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex-wrap: wrap;
		font-size: 1.02rem;
		line-height: 1.45;
		color: var(--ink);
	}
	.hero-bullets .arrow {
		color: var(--zhu);
		font-weight: 700;
		flex: 0 0 auto;
	}
	.hero-bullets b {
		font-weight: 700;
	}
	.hero-bullets .tag {
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-mute);
		padding-left: 8px;
		border-left: 1px solid var(--ink-line);
	}

	.index {
		border-left: 1.5px solid var(--ink-line);
		margin-top: 210px;
		padding-left: clamp(18px, 2vw, 30px);
		padding-right: clamp(10px, 1.4vw, 20px);
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--paper) 94%, transparent) 0 48%,
			color-mix(in srgb, var(--paper) 26%, transparent) 100%
		);
	}
	.index-h {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.28em;
		text-transform: uppercase;
		margin-bottom: 12px;
	}
	.seal-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 9px;
		margin: 0 0 14px;
		padding: 10px 0;
		border: 0;
		border-top: 1px solid var(--ink-line-strong);
		border-bottom: 1px solid var(--ink-line-strong);
		background: color-mix(in srgb, var(--paper) 68%, transparent);
		color: var(--ink);
		font-family: var(--font-label);
		font-size: 0.67rem;
		font-weight: 700;
		letter-spacing: 0.19em;
		text-transform: uppercase;
		cursor: pointer;
		backdrop-filter: blur(7px);
		transition:
			color 180ms ease,
			letter-spacing 280ms ease;
	}
	.seal-trigger:hover {
		color: var(--zhu);
		letter-spacing: 0.22em;
	}
	.seal-trigger > :last-child {
		margin-left: auto;
	}
	.seal-trigger-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--zhu);
		box-shadow: 0 0 0 0 rgba(192, 57, 43, 0.34);
		animation: sealPulse 2.4s ease-out infinite;
	}
	@keyframes sealPulse {
		60%,
		100% {
			box-shadow: 0 0 0 9px rgba(192, 57, 43, 0);
		}
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
		color: var(--ink-mute);
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
		font-variant-numeric: tabular-nums;
	}
	.index .p-sep {
		opacity: 0.4;
		margin: 0 2px;
	}
	.index .p-total {
		opacity: 0.55;
	}
	.pull {
		font-style: italic;
		font-size: 1.15rem;
		line-height: 1.35;
		margin-top: 26px;
	}
	.pull b {
		font-style: normal;
		color: var(--ink);
		border-bottom: 2px solid var(--zhu);
		padding-bottom: 1px;
	}
	.now-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 16px;
		padding: 6px 0;
		font-family: var(--font-label);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink);
		border-bottom: 1px solid var(--ink);
		transition:
			color 0.25s ease,
			border-color 0.25s ease,
			gap 0.25s ease;
	}
	.now-link:hover {
		color: var(--zhu);
		border-color: var(--zhu);
		gap: 12px;
	}
	.now-link .now-arrow {
		transition: transform 0.25s ease;
	}
	.now-link:hover .now-arrow {
		transform: translateX(3px);
	}
	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 16px;
		margin-left: 16px;
		padding: 8px 20px;
		font-family: var(--font-label);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--paper);
		background: var(--ink);
		border: 1.5px solid var(--ink);
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.hero-cta:hover {
		background: var(--zhu);
		border-color: var(--zhu);
		gap: 14px;
	}
	.now-link:hover .now-arrow {
		transform: translateX(2px);
	}
	.hero-watermark {
		position: absolute;
		right: -0.04em;
		bottom: 0;
		font-family: var(--font-serif);
		font-size: min(48vw, 42rem);
		font-weight: 900;
		line-height: 0.8;
		color: rgba(198, 65, 44, 0.035);
		pointer-events: none;
		user-select: none;
	}

	.sec {
		padding: clamp(60px, 10vh, 100px) 0;
		border-top: 2px solid var(--ink);
		position: relative;
	}
	.sec-head {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: clamp(16px, 2vw, 28px);
		align-items: baseline;
		margin-bottom: clamp(32px, 5vh, 48px);
	}
	.sec-head .cn {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(3rem, 8vw, 7rem);
		line-height: 0.82;
		color: var(--ink);
		letter-spacing: -0.04em;
	}
	.sec-title h2 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1;
		letter-spacing: -0.02em;
		margin: 0;
	}
	.brush {
		width: 100%;
		height: 12px;
		margin-top: 8px;
	}
	.folio {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.16em;
		color: var(--ink-mute);
	}

	.self-grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: clamp(24px, 4vw, 48px);
	}
	.bio {
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--ink-soft);
		max-width: 68ch;
	}
	.bio :global(p) {
		margin-bottom: 1em;
	}
	.bio :global(p:last-child) {
		margin-bottom: 0;
	}
	.bio :global(strong) {
		color: var(--ink);
	}
	.bio :global(a) {
		color: var(--zhu);
		text-underline-offset: 3px;
	}
	.edu {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid var(--ink-line);
	}
	.edu-logo {
		flex: 0 0 auto;
		border-radius: 4px;
		object-fit: contain;
	}
	.edu a {
		font-weight: 700;
		color: var(--ink);
		text-decoration: none;
	}
	.edu a:hover {
		color: var(--zhu);
	}
	.edu .years {
		font-family: var(--font-label);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--ink-mute);
	}
	.contrib-embed {
		margin-top: 32px;
		grid-column: 1 / -1;
	}

	.marquees {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.mrow {
		display: grid;
		grid-template-columns: 120px 1fr;
		align-items: center;
		gap: 16px;
		overflow: hidden;
	}
	.mrow.rev .mviewport {
		direction: rtl;
	}
	.mrow.rev .mviewport > div {
		direction: ltr;
	}
	.mrow-label {
		font-family: var(--font-label);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.mviewport {
		overflow: hidden;
	}
	.mtrack {
		display: flex;
		gap: 16px;
		white-space: nowrap;
		animation: marquee 30s linear infinite;
	}
	.mviewport:hover .mtrack {
		animation-play-state: paused;
	}
	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-33.33%);
		}
	}
	.skill {
		font-family: var(--font-label);
		font-size: clamp(1.4rem, 3vw, 2.2rem);
		font-weight: 900;
		color: var(--ink-soft);
		letter-spacing: -0.01em;
	}
	.sep {
		color: var(--ink-line-strong);
		font-size: 0.8em;
	}

	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.tl-item {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 16px;
		padding: 22px 0 30px;
		border-top: 2px solid var(--ink);
		position: relative;
		transition: padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.tl-item:hover {
		padding-left: 12px;
	}
	.tl-dot {
		position: absolute;
		top: 0;
		left: 120px;
		width: 10px;
		height: 10px;
		background: var(--zhu);
		border-radius: 50%;
		transform: translate(-50%, -6px);
		transition: transform 0.3s, box-shadow 0.3s;
	}
	.tl-item:hover .tl-dot {
		transform: translate(-50%, -6px) scale(1.4);
		box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.15);
	}
	.tl-date {
		font-family: var(--font-label);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-mute);
		padding-top: 4px;
	}
	.tl-role {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: 1.2rem;
		letter-spacing: -0.01em;
		margin: 0;
	}
	.tl-co {
		font-size: 0.85rem;
		color: var(--ink-soft);
		margin: 2px 0 0;
	}
	.tl-desc {
		font-size: 0.9rem;
		color: var(--ink-soft);
		margin: 8px 0 0;
		line-height: 1.5;
	}
	.tl-badges {
		display: flex;
		gap: 8px;
		margin-top: 10px;
		flex-wrap: wrap;
	}
	.tl-badges span {
		font-family: var(--font-label);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		border: 1px solid var(--ink-line);
		padding: 3px 10px;
		border-radius: 2px;
		color: var(--ink-mute);
	}

	.exp-open {
		padding: 32px 0;
	}
	.exp-status {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 28px;
	}
	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--zhu);
		animation: statusPulse 2s ease-out infinite;
	}
	@keyframes statusPulse {
		60%,
		100% {
			box-shadow: 0 0 0 8px rgba(198, 65, 44, 0);
		}
	}
	.status-label {
		font-family: var(--font-label);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--zhu);
	}
	.exp-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		margin-bottom: 28px;
	}
	.exp-stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.exp-num {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: clamp(2rem, 4vw, 3rem);
		line-height: 1;
		color: var(--ink);
	}
	.exp-cap {
		font-size: 0.82rem;
		color: var(--ink-soft);
		line-height: 1.4;
	}
	.exp-actions {
		display: flex;
		gap: 12px;
		margin-bottom: 20px;
	}
	.exp-cta {
		font-family: var(--font-label);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 10px 20px;
		border: 1px solid var(--ink-line);
		text-decoration: none;
		color: var(--ink-soft);
		transition: all 0.25s ease;
	}
	.exp-cta:hover {
		border-color: var(--zhu);
		color: var(--zhu);
	}
	.exp-cta-primary {
		background: var(--zhu);
		color: var(--paper);
		border-color: var(--zhu);
	}
	.exp-cta-primary:hover {
		background: var(--ink);
		border-color: var(--ink);
	}
	.exp-note {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--ink-soft);
		max-width: 60ch;
	}

	.work-intro {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: clamp(24px, 4vh, 40px);
	}
	.work-intro p {
		font-size: 1.1rem;
		color: var(--ink-soft);
	}
	.work-intro span {
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.work {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.row {
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: 16px;
		padding: 28px 0;
		border-top: 1.5px solid var(--ink-line);
		position: relative;
		transition: padding-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.row:hover {
		padding-left: 16px;
	}
	.row-title {
		position: relative;
		display: inline-block;
	}
	.row-title::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		width: 0;
		height: 1.5px;
		background: var(--zhu);
		transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.row:hover .row-title::after {
		width: 100%;
	}
	.row.featured {
		grid-template-columns: 56px 1fr 320px;
		padding: 36px 40px;
		border-top: 2px solid var(--ink);
		border-bottom: 2px solid var(--ink);
		background: linear-gradient(120deg, rgba(198, 65, 44, 0.04), transparent 60%);
		transition: background 0.4s;
	}
	.row.featured:hover {
		background: linear-gradient(120deg, rgba(198, 65, 44, 0.08), transparent 50%);
	}
	.row-thumb {
		display: block;
		overflow: hidden;
		border-radius: 2px;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
	.row.featured:hover .row-thumb {
		transform: scale(1.03);
	}
	.row-thumb img {
		display: block;
		width: 100%;
		height: 200px;
		object-fit: cover;
		filter: grayscale(15%) contrast(1.02);
		transition:
			filter 0.4s,
			transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
	.row.featured:hover .row-thumb img {
		filter: grayscale(0%) contrast(1);
		transform: scale(1.06);
	}
	.row:not(.featured):last-child {
		border-bottom: 1.5px solid var(--ink-line);
	}
	.idx {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.65rem;
		letter-spacing: 0.14em;
		color: var(--ink-mute);
		padding-top: 4px;
		-webkit-text-stroke: 0.5px var(--ink-line);
	}
	.row-title {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: clamp(1.1rem, 2vw, 1.5rem);
		letter-spacing: -0.01em;
		color: var(--ink);
		text-decoration: none;
		transition: color 0.3s;
	}
	.row-title:hover {
		color: var(--zhu);
	}
	.row-desc {
		font-size: 0.9rem;
		color: var(--ink-soft);
		margin: 6px 0 0;
		line-height: 1.5;
	}
	.row-tech {
		font-family: var(--font-label);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin: 10px 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.row-tech span {
		padding: 2px 8px;
		border: 1px solid var(--ink-line);
		border-radius: 2px;
		font-size: 0.58rem;
		letter-spacing: 0.06em;
		transition: all 0.2s;
	}
	.row.featured:hover .row-tech span {
		border-color: var(--ink-soft);
		color: var(--ink-soft);
	}
	.row-links {
		display: flex;
		gap: 16px;
		margin-top: 10px;
	}
	.row-links a {
		font-family: var(--font-label);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: all 0.25s;
	}
	.row-links a:hover {
		color: var(--zhu);
		border-bottom-color: var(--zhu);
	}
	.row-thumb {
		display: block;
		overflow: hidden;
		border-radius: 2px;
		border: 1px solid var(--ink-line);
		text-decoration: none;
	}
	.row-thumb img {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.6s ease;
	}
	.row-thumb:hover img {
		transform: scale(1.03);
	}

	.hx-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.hx {
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: 16px;
		padding: 22px 0 30px;
		border-top: 2px solid var(--ink);
		position: relative;
	}
	.hx-idx {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.65rem;
		letter-spacing: 0.14em;
		color: var(--ink-mute);
		padding-top: 6px;
	}
	.hx-title {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: 1.3rem;
		letter-spacing: -0.01em;
		margin: 0;
	}
	.hx-meta {
		font-family: var(--font-label);
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin: 4px 0 0;
	}
	.hx-desc {
		font-size: 0.9rem;
		color: var(--ink-soft);
		margin: 8px 0 0;
		line-height: 1.5;
	}
	.hx-links {
		display: flex;
		gap: 16px;
		margin-top: 12px;
		flex-wrap: wrap;
	}
	.hx-links a {
		font-family: var(--font-label);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: all 0.25s;
	}
	.hx-links a:hover {
		color: var(--zhu);
		border-bottom-color: var(--zhu);
	}
	.repos {
		margin-top: 28px;
		font-family: var(--font-label);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.repos .count {
		color: var(--ink);
		font-weight: 900;
	}

	.anime-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}
	.anime-head .mini-h {
		margin: 0;
	}
	.c-nav {
		display: flex;
		gap: 8px;
	}
	.c-arrow {
		width: 36px;
		height: 36px;
		display: grid;
		place-items: center;
		border: 1px solid var(--ink-line);
		background: transparent;
		color: var(--ink-soft);
		font-size: 1rem;
		cursor: pointer;
		border-radius: 2px;
		transition: all 0.25s;
	}
	.c-arrow:hover {
		border-color: var(--zhu);
		color: var(--zhu);
	}
	.track {
		display: flex;
		gap: 20px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		padding-bottom: 8px;
		scrollbar-width: none;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.track::-webkit-scrollbar {
		display: none;
	}
	.acard {
		flex: 0 0 auto;
		scroll-snap-align: start;
		width: 280px;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.acard:hover {
		transform: translateY(-6px);
	}
	.acard a {
		text-decoration: none;
		color: inherit;
		display: block;
	}
	.frame {
		position: relative;
		overflow: hidden;
		border-radius: 2px;
		border: 1px solid var(--ink-line);
		aspect-ratio: 280 / 373;
	}
	.frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.anime-no {
		position: absolute;
		top: 10px;
		left: 10px;
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		color: var(--paper);
		background: rgba(26, 24, 21, 0.6);
		padding: 3px 8px;
		border-radius: 2px;
	}
	.anime-quote {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 12px;
		font-size: 0.78rem;
		font-style: italic;
		color: var(--paper);
		background: linear-gradient(transparent, rgba(26, 24, 21, 0.7));
	}
	.card-name {
		display: block;
		margin-top: 10px;
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: 1.05rem;
		letter-spacing: -0.01em;
	}
	.anime-meta {
		font-family: var(--font-label);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.track-foot {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 12px;
	}
	.track-bar {
		flex: 1;
		height: 2px;
		background: var(--ink-line);
		overflow: hidden;
	}
	.track-bar-fill {
		height: 100%;
		background: var(--zhu);
		transform-origin: 0 50%;
	}
	.drag-hint {
		font-family: var(--font-label);
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin: 0;
	}
	.off-manifesto {
		margin-top: 48px;
		padding: clamp(32px, 6vh, 48px) 0;
		border-top: 2px solid var(--ink);
		border-bottom: 2px solid var(--ink);
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.off-manifesto span {
		font-family: var(--font-label);
		font-size: var(--type-label);
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.off-manifesto strong {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: clamp(1.8rem, 4vw, 3rem);
		letter-spacing: -0.02em;
		color: var(--ink);
	}
	.off-manifesto em {
		font-style: italic;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}

	.favorites-head {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		align-items: end;
		margin-top: clamp(40px, 7vh, 64px);
		margin-bottom: 24px;
	}
	.favorites-head h3 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: clamp(1.3rem, 2.5vw, 2rem);
		line-height: 1.2;
		letter-spacing: -0.01em;
		margin: 8px 0 0;
	}
	.favorites-head p {
		font-size: 0.9rem;
		color: var(--ink-soft);
		line-height: 1.5;
	}
	.favs-mosaic {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.fav {
		position: relative;
	}
	.fav-link {
		text-decoration: none;
		color: inherit;
		display: block;
		position: relative;
		overflow: hidden;
		border-radius: 2px;
	}
	.fav-img {
		overflow: hidden;
		aspect-ratio: 16 / 9;
	}
	.fav-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.6s ease;
	}
	.fav:hover .fav-img img {
		transform: scale(1.04);
	}
	.fav-cap {
		position: absolute;
		inset: 0;
		padding: 16px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		background: linear-gradient(transparent 40%, rgba(26, 24, 21, 0.75));
		opacity: 0;
		transition: opacity 0.35s ease;
	}
	.fav:hover .fav-cap {
		opacity: 1;
	}
	.fav-index {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.6rem;
		letter-spacing: 0.12em;
		color: var(--paper);
		opacity: 0.7;
	}
	.fav-cap b {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: 1rem;
		color: var(--paper);
		margin-top: 4px;
	}
	.fav-cap span {
		font-size: 0.75rem;
		color: var(--paper);
		opacity: 0.85;
		margin-top: 2px;
	}
	.fav-cap em {
		font-size: 0.65rem;
		font-style: normal;
		color: var(--zhu);
		margin-top: 4px;
	}
	.fav-shimmer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			105deg,
			transparent 40%,
			rgba(255, 255, 255, 0.06) 45%,
			transparent 50%
		);
		background-size: 200% 100%;
		animation: shimmer 4s infinite;
	}
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
	.fav.featured-fav {
		grid-column: 1 / -1;
	}
	.fav.featured-fav .fav-img {
		aspect-ratio: 2.35 / 1;
	}
	.fav.featured-fav .fav-cap {
		opacity: 1;
		background: linear-gradient(90deg, rgba(26, 24, 21, 0.55) 0%, transparent 70%);
	}
	.fav.featured-fav .fav-cap b {
		font-size: clamp(1.2rem, 2.5vw, 1.8rem);
	}

	.notes-dek {
		font-family: var(--font-label);
		font-size: var(--type-label);
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--ink-mute);
		margin: -20px 0 32px;
	}
	.notes-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}
	.note-card {
		padding: 24px;
		border: 1px solid var(--ink-line);
		border-radius: 2px;
		background: var(--paper);
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
		opacity: 0;
		transform: translateY(12px);
		animation: noteIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: var(--note-delay, 0s);
	}
	@keyframes noteIn {
		to {
			opacity: 1;
			transform: none;
		}
	}
	.note-card:hover {
		border-color: var(--ink-line-strong);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
	}
	.note-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	.note-date {
		font-family: var(--font-label);
		font-size: 0.65rem;
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
		font-size: 0.58rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--zhu);
		border: 1px solid rgba(198, 65, 44, 0.2);
		padding: 2px 8px;
		border-radius: 2px;
	}
	.note-title {
		font-family: var(--font-serif);
		font-weight: 900;
		font-size: 1.05rem;
		letter-spacing: -0.01em;
		margin: 0 0 8px;
		line-height: 1.3;
	}
	.note-summary {
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--ink-soft);
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.note-line {
		height: 1px;
		background: var(--ink-line);
		margin-top: 14px;
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.note-card:hover .note-line {
		transform: scaleX(1);
	}

	.contact {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(24px, 4vw, 48px);
	}
	.contact .cn.ghost {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(6rem, 18vw, 16rem);
		line-height: 0.7;
		color: var(--ink-line);
		letter-spacing: -0.04em;
	}
	.c-tag {
		font-family: var(--font-label);
		font-size: var(--type-label);
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--zhu);
		margin: 0 0 16px;
	}
	.say {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1;
		letter-spacing: -0.02em;
		margin: 0 0 24px;
	}
	.email-wrap {
		margin: 0 0 32px;
	}
	.email {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: clamp(1.2rem, 2.5vw, 1.8rem);
		color: var(--ink);
		text-decoration: none;
		border-bottom: 2px solid var(--zhu);
		padding-bottom: 2px;
		transition: color 0.25s;
	}
	.email:hover {
		color: var(--zhu);
	}
	.contact-cta {
		margin-bottom: 32px;
		padding: 24px 0;
		border-top: 1px solid var(--ink-line);
		border-bottom: 1px solid var(--ink-line);
	}
	.contact-cta p {
		font-size: 1rem;
		color: var(--ink-soft);
		margin: 0 0 16px;
		line-height: 1.6;
	}
	.contact-cta em {
		font-style: normal;
		color: var(--ink);
		font-weight: 700;
	}
	.cta-btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 24px;
		font-family: var(--font-label);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--paper);
		background: var(--ink);
		border: 1.5px solid var(--ink);
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.cta-btn:hover {
		background: var(--zhu);
		border-color: var(--zhu);
		gap: 18px;
	}
	.socials {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.social-link {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
		border-top: 1px solid var(--ink-line);
		text-decoration: none;
		color: var(--ink-soft);
		transition: color 0.25s;
		cursor: pointer;
	}
	.social-link:last-child {
		border-bottom: 1px solid var(--ink-line);
	}
	.social-link:hover {
		color: var(--zhu);
	}
	.social-icon {
		width: 22px;
		height: 22px;
		flex: 0 0 auto;
	}
	.social-name {
		font-family: var(--font-label);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.social-arrow {
		margin-left: auto;
		font-size: 1.1rem;
	}

	.colophon {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 24px;
		padding: 24px 0;
		margin-top: clamp(48px, 9vh, 80px);
		border-top: 2px solid var(--ink);
		font-family: var(--font-label);
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.col-mark {
		color: var(--zhu);
		margin-right: 8px;
	}
	.col-title {
		font-weight: 700;
		color: var(--ink);
	}
	.col-c {
		text-align: center;
	}
	.col-r {
		text-align: right;
	}
	.col-r a {
		color: var(--ink-soft);
		text-decoration: none;
		transition: color 0.25s;
	}
	.col-r a:hover {
		color: var(--zhu);
	}

	.replay-btn {
		position: fixed;
		bottom: 24px;
		left: 24px;
		z-index: 40;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		background: var(--paper);
		color: var(--ink);
		border: 1px solid var(--ink-line);
		border-radius: 100px;
		font-family: var(--font-label);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		white-space: nowrap;
		opacity: 0;
		transform: translateY(8px) scale(0.9);
		pointer-events: none;
		transition:
			opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}
	.replay-btn.visible {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}
	.replay-btn:hover {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}
	.replay-btn svg {
		flex: 0 0 auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.mtrack {
			animation: none;
		}
		.fav-shimmer {
			animation: none;
		}
	}

	@media (max-width: 980px) {
		.hero {
			grid-template-columns: 1fr;
		}
		.index {
			margin-top: 48px;
		}
		.self-grid {
			grid-template-columns: 1fr;
		}
		.row.featured {
			grid-template-columns: 1fr;
		}
		.row-thumb {
			display: none;
		}
		.favs-mosaic {
			grid-template-columns: repeat(2, 1fr);
		}
		.colophon {
			grid-template-columns: 1fr;
			text-align: left;
		}
		.contact {
			grid-template-columns: 1fr;
		}
		.contact .cn.ghost {
			font-size: clamp(4rem, 14vw, 8rem);
		}
	}

	@media (max-width: 640px) {
		.work-intro {
			flex-direction: column;
			gap: 8px;
		}
		.exp-grid {
			grid-template-columns: 1fr;
		}
		.hx {
			grid-template-columns: 1fr;
		}
		.tl-dot {
			display: none;
		}
		.tl-item {
			grid-template-columns: 1fr;
			padding-left: 16px;
		}
	}
</style>
