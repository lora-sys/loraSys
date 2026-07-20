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
