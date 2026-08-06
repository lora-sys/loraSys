<script lang="ts">
	import { onMount } from 'svelte';

	let isDark = $state(false);

	function toggle() {
		isDark = !isDark;
		document.documentElement.classList.toggle('mode-dark', isDark);
		document.documentElement.classList.toggle('dark', isDark);
		try {
			localStorage.setItem('ink-mode', isDark ? 'dark' : 'light');
		} catch {
			/* localStorage unavailable */
		}
	}

	// Dark mode CSS — injected at runtime to bypass Tailwind JIT purging.
	// Tailwind's PostCSS plugin strips CSS selectors it can't match to utility
	// classes, which removes html.mode-dark rules from both .css and .svelte files.
	const DARK_CSS = `
		html.mode-dark,
		html.mode-dark :root {
			--ink: #f3efe6;
			--ink-soft: #b5afa6;
			--ink-mute: #8a857c;
			--paper: #1a1815;
			--paper-2: #24211c;
			--zhu: #e0473a;
			--ink-line: rgba(243, 239, 230, 0.12);
			--ink-line-strong: rgba(243, 239, 230, 0.25);
		}
		html.mode-dark body {
			background: var(--paper);
			color: var(--ink);
		}
		html.mode-dark ::-webkit-scrollbar-thumb {
			background: #3f3a33;
		}
		html.mode-dark ::-webkit-scrollbar-thumb:hover {
			background: #5a544b;
		}
		html.mode-dark ::selection {
			background: rgba(224, 71, 58, 0.3);
		}
		html.mode-dark .ink-wash {
			opacity: 0.6;
		}
		html.mode-dark .cursor-glow {
			background: radial-gradient(circle, rgba(224, 71, 58, 0.1) 0%, transparent 70%);
		}
		html.mode-dark .edition { color: var(--ink); }
		html.mode-dark .mast { border-bottom-color: var(--ink); }
		html.mode-dark .ed-line { color: var(--ink-soft); }
		html.mode-dark .ed-line b { color: var(--ink); }
		html.mode-dark .band { color: var(--ink-soft); }
		html.mode-dark .logo .word { color: var(--ink); }
		html.mode-dark .logo .seal-dot { background: var(--zhu); }
		html.mode-dark .back-to-top {
			border-color: var(--ink-line-strong);
			background: var(--paper);
			color: var(--ink);
		}
		html.mode-dark .back-to-top:hover {
			background: var(--ink);
			color: var(--paper);
			border-color: var(--ink);
		}
		html.mode-dark .paper-grain { opacity: 0.4; }
		html.mode-dark .page-transition { background: var(--paper); }
		html.mode-dark .nav { border-bottom-color: var(--ink-line); }
		html.mode-dark .nav .links a { color: var(--ink-mute); }
		html.mode-dark .nav .links a:hover,
		html.mode-dark .nav .links a.on { color: var(--zhu); }
		html.mode-dark .mode-toggle {
			border-color: var(--ink-line-strong);
			color: var(--ink);
		}
		html.mode-dark .mode-toggle:hover {
			background: var(--ink);
			border-color: var(--ink);
			color: var(--paper);
		}
		html.mode-dark .blog,
		html.mode-dark .blog-post-wrap {
			background: var(--paper);
			color: var(--ink);
		}
		html.mode-dark .blog .tag,
		html.mode-dark .blog-post-wrap .tag { color: var(--zhu); }
		html.mode-dark .blog h1 .dim,
		html.mode-dark .blog-post-wrap h1 .dim { color: var(--ink-mute); }
		html.mode-dark .blog .dek,
		html.mode-dark .blog-post-wrap .dek { color: var(--ink-soft); }
		html.mode-dark .blog .meta dt,
		html.mode-dark .blog-post-wrap .meta dt { color: var(--ink-mute); }
		html.mode-dark .blog .meta dd,
		html.mode-dark .blog-post-wrap .meta dd { color: var(--zhu); }
		html.mode-dark .blog .rule,
		html.mode-dark .blog-post-wrap .rule { background: var(--ink); }
		html.mode-dark .blog .row,
		html.mode-dark .blog-post-wrap .row { border-top-color: var(--ink-line); }
		html.mode-dark .blog .row:last-child,
		html.mode-dark .blog-post-wrap .row:last-child { border-bottom-color: var(--ink-line); }
		html.mode-dark .blog .date,
		html.mode-dark .blog-post-wrap .date { color: var(--ink-mute); }
		html.mode-dark .blog .desc,
		html.mode-dark .blog-post-wrap .desc { color: var(--ink-soft); }
		html.mode-dark .blog .cats span,
		html.mode-dark .blog-post-wrap .cats span {
			border-color: var(--ink-line-strong);
			color: var(--ink-soft);
		}
		html.mode-dark .blog .cats span:hover,
		html.mode-dark .blog-post-wrap .cats span:hover {
			border-color: var(--zhu);
			color: var(--zhu);
		}
		html.mode-dark .blog .foot,
		html.mode-dark .blog-post-wrap .foot {
			border-top-color: var(--ink);
			color: var(--ink-soft);
		}
		html.mode-dark .blog .back,
		html.mode-dark .blog-post-wrap .back { color: var(--ink); }
		html.mode-dark .blog .rss {
			border-color: var(--ink-line-strong);
			color: var(--zhu);
		}
		html.mode-dark .blog .rss:hover {
			background: var(--zhu);
			color: var(--paper);
		}
		html.mode-dark .year-pills { border-top-color: var(--ink-line); }
		html.mode-dark .blog-post-wrap .prose { color: var(--ink); }
		html.mode-dark .blog-post-wrap .prose a { color: var(--zhu); }
		html.mode-dark .blog-post-wrap .prose strong { color: var(--ink); }
		html.mode-dark .blog-post-wrap .prose blockquote {
			border-left-color: var(--zhu);
			color: var(--ink-mute);
		}
		html.mode-dark .blog-post-wrap .prose code:not(pre code) {
			background: rgba(224, 71, 58, 0.12);
			color: #e0473a;
		}
		html.mode-dark .blog-post-wrap .prose pre {
			border-color: rgba(224, 71, 58, 0.18);
		}
		html.mode-dark .blog-post-wrap .prose thead {
			border-bottom-color: var(--ink-line);
		}
		html.mode-dark .blog-post-wrap .prose td,
		html.mode-dark .blog-post-wrap .prose th {
			border-color: var(--ink-line);
		}
		html.mode-dark .now {
			color: var(--ink);
			background: var(--paper);
		}
		html.mode-dark .now .tag { color: var(--zhu); }
		html.mode-dark .now h1 .dim { color: var(--ink-mute); }
		html.mode-dark .now .dek { color: var(--ink-soft); }
		html.mode-dark .now .meta dt { color: var(--ink-mute); }
		html.mode-dark .now .meta dd { color: var(--zhu); }
		html.mode-dark .now .rule { background: var(--ink); }
		html.mode-dark .now .s-head { border-top-color: var(--ink); }
		html.mode-dark .now li { border-top-color: var(--ink-line); }
		html.mode-dark .now li:last-child { border-bottom-color: var(--ink-line); }
		html.mode-dark .now .it-m { color: var(--ink-mute); }
		html.mode-dark .now .foot { border-top-color: var(--ink); color: var(--ink-soft); }
		html.mode-dark .now .back { color: var(--ink); }
		html.mode-dark .err {
			color: var(--ink);
			background: var(--paper);
		}
		html.mode-dark .err .tag { color: var(--zhu); }
		html.mode-dark .err .msg { color: var(--ink-soft); }
		html.mode-dark .err .home { color: var(--ink); }
		html.mode-dark .err .wash {
			background: radial-gradient(45% 45% at 50% 42%, rgba(224, 71, 58, 0.14), transparent 70%);
		}
		html.mode-dark .err .splash {
			background: radial-gradient(circle, rgba(224, 71, 58, 0.08) 0%, transparent 70%);
		}
		html.mode-dark .err .splash-sm {
			background: radial-gradient(circle, rgba(243, 239, 230, 0.04) 0%, transparent 70%);
		}

		/* ============================================================
		   HomePage (墨刊 · HomePage.svelte) dark mode
		   ============================================================ */
		html.mode-dark .mast,
		html.mode-dark .band { border-bottom-color: var(--ink-line); }
		html.mode-dark .hero,
		html.mode-dark .sec,
		html.mode-dark .anime,
		html.mode-dark .favorites,
		html.mode-dark .contact,
		html.mode-dark .timeline,
		html.mode-dark .work { color: var(--ink); }
		html.mode-dark .cn.ghost { color: var(--ink-line); }
		html.mode-dark .sec-head .cn { color: var(--zhu); }
		html.mode-dark .sec-title h2,
		html.mode-dark .hero h1,
		html.mode-dark .say { color: var(--ink); }
		html.mode-dark .hero-bullets li,
		html.mode-dark .row-title,
		html.mode-dark .tl-role,
		html.mode-dark .hx-title,
		html.mode-dark .note-title,
		html.mode-dark .email { color: var(--ink); }
		html.mode-dark .hero-bullets b,
		html.mode-dark .row-desc,
		html.mode-dark .tl-desc,
		html.mode-dark .tl-co,
		html.mode-dark .hx-desc,
		html.mode-dark .bio,
		html.mode-dark .note-summary,
		html.mode-dark .work-intro p,
		html.mode-dark .fav-cap b,
		html.mode-dark .fav-cap span { color: var(--ink-soft); }
		html.mode-dark .index-h,
		html.mode-dark .pull,
		html.mode-dark .say,
		html.mode-dark .anime-quote,
		html.mode-dark .favorites-head p,
		html.mode-dark .notes-dek,
		html.mode-dark .exp-cap,
		html.mode-dark .anime-meta { color: var(--ink-soft); }
		html.mode-dark .index li a,
		html.mode-dark .now-link,
		html.mode-dark .seal-trigger,
		html.mode-dark .c-arrow,
		html.mode-dark .row-links a,
		html.mode-dark .hx-links a,
		html.mode-dark .social-name,
		html.mode-dark .social-link { color: var(--ink-soft); }
		html.mode-dark .index li a:hover,
		html.mode-dark .index li a.on,
		html.mode-dark .now-link:hover,
		html.mode-dark .seal-trigger:hover,
		html.mode-dark .c-arrow:hover,
		html.mode-dark .row-links a:hover,
		html.mode-dark .hx-links a:hover,
		html.mode-dark .social-link:hover { color: var(--zhu); }
		html.mode-dark .exp-num { color: var(--ink); }
		html.mode-dark .status-label { color: var(--zhu); }
		html.mode-dark .note-date,
		html.mode-dark .row-tech,
		html.mode-dark .hx-meta,
		html.mode-dark .idx,
		html.mode-dark .hx-idx,
		html.mode-dark .anime-no,
		html.mode-dark .fav-index { color: var(--ink-mute); }
		html.mode-dark .hero-meta .rule,
		html.mode-dark .brush,
		html.mode-dark .note-line,
		html.mode-dark .rule { background: var(--ink-line); }
		html.mode-dark .row,
		html.mode-dark .row:not(.featured):last-child,
		html.mode-dark .tl-item,
		html.mode-dark .hx,
		html.mode-dark .social-link,
		html.mode-dark .elsewhere-link { border-top-color: var(--ink-line); border-bottom-color: var(--ink-line); }
		html.mode-dark .row.featured,
		html.mode-dark .hx { border-top-color: var(--ink); border-bottom-color: var(--ink); }
		html.mode-dark .row.featured { background: linear-gradient(120deg, rgba(224, 71, 58, 0.08), transparent 60%); }
		html.mode-dark .hk,
		html.mode-dark .card,
		html.mode-dark .note-card,
		html.mode-dark .fav-link,
		html.mode-dark .acard { border-color: var(--ink-line); background: var(--paper-2); }
		html.mode-dark .hk:hover,
		html.mode-dark .card:hover { border-color: var(--ink-line-strong); box-shadow: 0 8px 30px rgba(0,0,0,0.25); }
		html.mode-dark .note-card:hover { border-color: var(--ink-line-strong); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
		html.mode-dark .exp-cta { border-color: var(--ink-line); color: var(--ink-soft); }
		html.mode-dark .exp-cta:hover { border-color: var(--zhu); color: var(--zhu); }
		html.mode-dark .exp-cta-primary { background: var(--zhu); color: var(--paper); border-color: var(--zhu); }
		html.mode-dark .exp-cta-primary:hover { background: var(--ink); border-color: var(--ink); }
		html.mode-dark .fav-cap { background: linear-gradient(transparent 40%, rgba(243, 239, 230, 0.7)); }
		html.mode-dark .fav:hover .fav-cap { background: linear-gradient(transparent 40%, rgba(243, 239, 230, 0.75)); }
		html.mode-dark .fav.featured-fav .fav-cap { background: linear-gradient(90deg, rgba(243, 239, 230, 0.5) 0%, transparent 70%); }
		html.mode-dark .fav-shimmer {
			background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, transparent 50%);
		}
		html.mode-dark .hero-watermark { color: var(--ink-line-strong); }
		html.mode-dark .scroll-progress { background: var(--ink); }
		html.mode-dark .paper-grain {
			mix-blend-mode: screen;
			opacity: 0.25;
		}
		html.mode-dark .ink-wash {
			background:
				radial-gradient(50% 45% at 88% 8%, rgba(243, 239, 230, 0.06), transparent 70%),
				radial-gradient(38% 38% at 12% 96%, rgba(224, 71, 58, 0.08), transparent 70%);
		}
		html.mode-dark .smooth-cursor { color: var(--ink); }
		html.mode-dark .colophon { border-top-color: var(--ink-line); }
		html.mode-dark .colophon span,
		html.mode-dark .colophon a { color: var(--ink-soft); }
		html.mode-dark .colophon .col-title,
		html.mode-dark .colophon .count { color: var(--ink); }
		html.mode-dark .colophon a:hover { color: var(--zhu); }
		html.mode-dark .skip-link:focus { outline-color: var(--zhu); }
		html.mode-dark .track::-webkit-scrollbar-thumb { background: #3f3a33; }

		html:not(.mode-dark) ::selection {
			background: rgba(198, 65, 44, 0.22);
			color: var(--ink);
		}
		html.mode-dark ::selection {
			background: rgba(224, 71, 58, 0.3);
		}
	`;

	onMount(() => {
		// Inject dark mode CSS at runtime — bypasses Tailwind JIT purging
		const style = document.createElement('style');
		style.id = 'ink-dark-mode';
		style.textContent = DARK_CSS;
		document.head.appendChild(style);

		try {
			const saved = localStorage.getItem('ink-mode');
			if (saved === 'dark') {
				isDark = true;
				document.documentElement.classList.add('mode-dark', 'dark');
			}
		} catch {
			/* localStorage unavailable */
		}
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		if (!localStorage.getItem('ink-mode') && mq.matches) {
			isDark = true;
			document.documentElement.classList.add('mode-dark', 'dark');
		}
	});
</script>

<button
	onclick={toggle}
	class="mode-toggle"
	aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={isDark ? '亮刊' : '墨刊'}
>
	<span class="mode-label">{isDark ? '亮' : '墨'}</span>
	<span class="mode-sub">{isDark ? '亮刊' : '墨刊'}</span>
</button>

<style>
	.mode-toggle {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 12px;
		border: 1px solid var(--ink-line-strong);
		background: transparent;
		cursor: pointer;
		font-family: var(--font-label);
		transition:
			background 0.25s ease,
			border-color 0.25s ease,
			color 0.25s ease;
		border-radius: 2px;
	}
	.mode-label {
		font-weight: 900;
		font-size: 1rem;
		line-height: 1;
		transition: color 0.25s ease;
	}
	.mode-sub {
		font-weight: 700;
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		opacity: 0.7;
	}
	.mode-toggle:hover {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}
</style>
