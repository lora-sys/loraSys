<script lang="ts">
	import { onMount } from 'svelte';

	let isDark = $state(false);

	function toggle() {
		isDark = !isDark;
		document.documentElement.classList.toggle('mode-dark', isDark);
		try {
			localStorage.setItem('ink-mode', isDark ? 'dark' : 'light');
		} catch {
			/* localStorage unavailable */
		}
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem('ink-mode');
			if (saved === 'dark') {
				isDark = true;
				document.documentElement.classList.add('mode-dark');
			}
		} catch {
			/* localStorage unavailable */
		}
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		if (!localStorage.getItem('ink-mode') && mq.matches) {
			isDark = true;
			document.documentElement.classList.add('mode-dark');
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
