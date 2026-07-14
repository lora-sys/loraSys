<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';

	let { status, error }: { status?: number; error?: Error & { frame?: string } } = $props();

	let effectiveStatus = $derived(status ?? $page.status);
	let effectiveError = $derived(error?.message ?? $page.error?.message ?? 'Unknown error');

	const errorTitle = $derived(effectiveStatus === 404 ? 'Page Not Found' : 'Internal Server Error');
	const errorHint = $derived(
		effectiveStatus === 404
			? 'The page you are looking for does not exist.'
			: 'Something went wrong on our end.'
	);

	let typedText = $state('');
	let showCursor = $state(true);
	let showNav = $state(false);
	let fullMessage = $derived(`${effectiveStatus} · ${errorTitle} — ${effectiveError}`);

	$effect(() => {
		typedText = '';
		showNav = false;
		let i = 0;
		const interval = setInterval(() => {
			if (i < fullMessage.length) {
				typedText += fullMessage[i];
				i++;
			} else {
				clearInterval(interval);
				showNav = true;
			}
		}, 22);
		return () => clearInterval(interval);
	});

	$effect(() => {
		if (!showNav) return;
		const blink = setInterval(() => (showCursor = !showCursor), 530);
		return () => clearInterval(blink);
	});
</script>

<svelte:head>
	<title>{effectiveStatus} | {errorTitle}</title>
	<meta name="description" content={errorHint} />
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="err">
	<div class="paper-grain" aria-hidden="true"></div>
	<div class="wash" aria-hidden="true"></div>
	<div class="inner">
		<p class="tag">誤 · Error</p>
		<h1>{effectiveStatus}</h1>
		<svg class="brush" viewBox="0 0 320 12" preserveAspectRatio="none" aria-hidden="true">
			<path d="M3 8 C 64 2 128 11 190 5 S 300 3 317 7" fill="none" stroke="var(--zhu)" stroke-width="3" stroke-linecap="round" />
		</svg>
		<p class="msg">
			<span>{typedText}</span>{#if showCursor}<span class="caret"></span>{/if}
		</p>
		{#if showNav}
			<a class="home" href={base + '/'} in:fade>← Back to cover</a>
		{/if}
	</div>
</main>

<style>
	.err {
		position: relative;
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 24px;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-serif);
		overflow: hidden;
	}
	.paper-grain {
		position: fixed;
		inset: 0;
		z-index: 50;
		pointer-events: none;
		mix-blend-mode: multiply;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/></svg>");
	}
	.wash {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background: radial-gradient(45% 45% at 50% 42%, rgba(198, 65, 44, 0.12), transparent 70%);
		filter: blur(50px);
	}
	.inner {
		position: relative;
		z-index: 1;
		text-align: center;
	}
	.tag {
		font-family: var(--font-label);
		font-weight: 700;
		font-size: var(--type-label);
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--zhu);
		margin-bottom: 12px;
	}
	h1 {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(6rem, 22vw, 16rem);
		line-height: 0.8;
		letter-spacing: -0.04em;
		margin: 0;
	}
	.brush {
		display: block;
		width: clamp(160px, 30%, 320px);
		height: 12px;
		margin: 8px auto 0;
		overflow: visible;
	}
	.msg {
		margin-top: 26px;
		font-family: var(--font-label);
		font-size: 0.9rem;
		letter-spacing: 0.04em;
		color: var(--ink-soft);
		min-height: 1.4em;
	}
	.caret {
		display: inline-block;
		width: 8px;
		height: 1em;
		background: var(--zhu);
		vertical-align: text-bottom;
		margin-left: 2px;
	}
	.home {
		display: inline-block;
		margin-top: 28px;
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.06em;
		color: var(--ink);
		border-bottom: 2px solid var(--zhu);
		padding-bottom: 3px;
		transition: color 0.25s;
	}
	.home:hover {
		color: var(--zhu);
	}
</style>
