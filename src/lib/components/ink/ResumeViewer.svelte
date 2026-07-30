<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let open = $state(false);
	let canEmbedPdf = $state(false);
	let trigger: HTMLButtonElement = $state()!;
	let closeButton: HTMLButtonElement = $state()!;

	const resumeUrl = `${base}/resume.pdf`;
	const previewUrl = `${base}/images/resume-preview.png`;

	function showViewer() {
		open = true;
		requestAnimationFrame(() => closeButton?.focus());
	}

	function hideViewer() {
		open = false;
		requestAnimationFrame(() => trigger?.focus());
	}

	onMount(() => {
		const embedQuery = window.matchMedia('(min-width: 721px)');
		const updateEmbed = () => (canEmbedPdf = embedQuery.matches);
		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && open) hideViewer();
		};
		updateEmbed();
		embedQuery.addEventListener('change', updateEmbed);
		window.addEventListener('keydown', onKeydown);
		return () => {
			embedQuery.removeEventListener('change', updateEmbed);
			window.removeEventListener('keydown', onKeydown);
		};
	});

	$effect(() => {
		if (!open || typeof document === 'undefined') return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});
</script>

<button
	bind:this={trigger}
	type="button"
	class="resume-trigger"
	class:active={open}
	onclick={showViewer}
	aria-haspopup="dialog"
	aria-expanded={open}
	aria-label="Open résumé viewer"
>
	<span class="resume-trigger-mark" aria-hidden="true">履</span>
	<span class="resume-trigger-copy">
		<b>Resume</b>
		<small>View · Download</small>
	</span>
	<span class="resume-trigger-arrow" aria-hidden="true">↗</span>
</button>

{#if open}
	<div class="resume-layer" transition:fade={{ duration: 220 }}>
		<button
			class="resume-backdrop"
			type="button"
			onclick={hideViewer}
			aria-label="Close résumé viewer"
		></button>

		<div
			class="resume-panel"
			role="dialog"
			aria-modal="true"
			aria-labelledby="resume-title"
			transition:fly={{ y: 34, duration: 480, opacity: 0 }}
		>
			<header class="resume-head">
				<div class="resume-heading">
					<span class="resume-kicker">CURRICULUM VITAE · 履歷</span>
					<h2 id="resume-title">The working record.</h2>
				</div>
				<div class="resume-status" aria-label="Document information">
					<span><i></i> Available</span>
					<span>PDF · 1 PAGE · 236 KB</span>
				</div>
				<button
					bind:this={closeButton}
					type="button"
					class="resume-close"
					onclick={hideViewer}
					aria-label="Close résumé viewer">×</button
				>
			</header>

			<div class="resume-body">
				<div class="resume-preview">
					<div class="resume-paper">
						<img src={previewUrl} alt="Preview of Zhao Yanbing's résumé" width="595" height="842" />
						{#if canEmbedPdf}
							<iframe
								src={`${resumeUrl}#view=FitH&toolbar=0&navpanes=0`}
								title="Zhao Yanbing résumé PDF preview"
								loading="lazy"
							></iframe>
						{/if}
					</div>
					<span class="resume-page-no">01 / 01</span>
				</div>

				<aside class="resume-actions">
					<p class="resume-note">
						A concise record of the systems I build, the tools I use, and the direction I am moving
						in.
					</p>
					<div class="resume-action-list">
						<a href={resumeUrl} target="_blank" rel="noreferrer">
							<span>Open full screen</span><b>↗</b>
						</a>
						<a href={resumeUrl} download="Zhao_Yanbing_Resume.pdf" class="primary">
							<span>Download PDF</span><b>↓</b>
						</a>
					</div>
					<div class="resume-folio" aria-hidden="true">
						<span>Last updated</span>
						<strong>2026</strong>
						<em>趙</em>
					</div>
				</aside>
			</div>
		</div>
	</div>
{/if}

<style>
	.resume-trigger {
		position: fixed;
		right: clamp(14px, 2vw, 28px);
		bottom: clamp(14px, 2vw, 28px);
		z-index: 80;
		display: grid;
		grid-template-columns: 42px auto 20px;
		align-items: center;
		gap: 10px;
		min-width: 196px;
		padding: 7px 10px 7px 7px;
		border: 1px solid var(--ink-line-strong);
		background: color-mix(in srgb, var(--paper) 92%, transparent);
		color: var(--ink);
		box-shadow: 0 10px 32px rgba(26, 24, 21, 0.1);
		backdrop-filter: blur(14px);
		font-family: var(--font-label);
		text-align: left;
		transition:
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.35s ease,
			border-color 0.25s ease;
	}
	.resume-trigger:hover {
		transform: translateY(-4px);
		border-color: var(--zhu);
		box-shadow: 0 16px 40px rgba(26, 24, 21, 0.16);
	}
	.resume-trigger:active {
		transform: translateY(-1px) scale(0.985);
	}
	.resume-trigger-mark {
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		background: var(--zhu);
		color: var(--paper);
		font-family: var(--font-cn);
		font-size: 1.15rem;
		transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.resume-trigger:hover .resume-trigger-mark {
		transform: rotate(-7deg) scale(1.05);
	}
	.resume-trigger-copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.resume-trigger-copy b {
		font-size: 0.78rem;
		letter-spacing: 0.06em;
	}
	.resume-trigger-copy small {
		color: var(--ink-mute);
		font-size: 0.58rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.resume-trigger-arrow {
		color: var(--zhu);
		transition: transform 0.3s ease;
	}
	.resume-trigger:hover .resume-trigger-arrow {
		transform: translate(3px, -3px);
	}

	.resume-layer {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: grid;
		place-items: end center;
		padding: clamp(12px, 2vw, 28px);
	}
	.resume-backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		background: rgba(26, 24, 21, 0.64);
		backdrop-filter: blur(9px);
	}
	.resume-panel {
		position: relative;
		width: min(1180px, 100%);
		height: min(88vh, 880px);
		display: grid;
		grid-template-rows: auto 1fr;
		overflow: hidden;
		border: 1px solid rgba(243, 239, 230, 0.35);
		background: var(--paper);
		color: var(--ink);
		box-shadow: 0 30px 100px rgba(0, 0, 0, 0.35);
	}
	.resume-panel::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.14;
		background-image: repeating-linear-gradient(
			90deg,
			transparent 0 48px,
			rgba(26, 24, 21, 0.05) 49px
		);
	}
	.resume-head {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: 1fr auto 48px;
		gap: 28px;
		align-items: center;
		padding: 18px clamp(18px, 3vw, 40px);
		border-bottom: 1px solid var(--ink-line-strong);
	}
	.resume-kicker {
		font-family: var(--font-label);
		font-size: 0.62rem;
		letter-spacing: 0.24em;
		color: var(--zhu);
	}
	.resume-heading h2 {
		margin: 4px 0 0;
		font-family: var(--font-serif);
		font-size: clamp(1.55rem, 3vw, 2.8rem);
		line-height: 1;
		letter-spacing: -0.025em;
	}
	.resume-status {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-family: var(--font-label);
		font-size: 0.58rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-mute);
	}
	.resume-status span:first-child {
		color: var(--ink);
	}
	.resume-status i {
		display: inline-block;
		width: 7px;
		height: 7px;
		margin-right: 6px;
		border-radius: 50%;
		background: var(--zhu);
		box-shadow: 0 0 0 5px rgba(192, 57, 43, 0.12);
	}
	.resume-close {
		width: 44px;
		height: 44px;
		border: 1px solid var(--ink-line-strong);
		background: transparent;
		color: var(--ink);
		font-family: var(--font-label);
		font-size: 1.6rem;
		line-height: 1;
		transition:
			background 0.25s,
			color 0.25s,
			transform 0.35s;
	}
	.resume-close:hover {
		background: var(--ink);
		color: var(--paper);
		transform: rotate(7deg);
	}

	.resume-body {
		position: relative;
		z-index: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(260px, 0.36fr);
	}
	.resume-preview {
		position: relative;
		min-height: 0;
		display: grid;
		place-items: center;
		padding: clamp(18px, 3vw, 34px);
		overflow: hidden;
		background: #d9d3c7;
	}
	.resume-paper {
		position: relative;
		height: 100%;
		max-height: 710px;
		aspect-ratio: 595 / 842;
		background: white;
		box-shadow:
			14px 18px 0 rgba(26, 24, 21, 0.12),
			0 20px 60px rgba(26, 24, 21, 0.18);
		overflow: hidden;
	}
	.resume-paper img,
	.resume-paper iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.resume-paper img {
		object-fit: contain;
		background: white;
	}
	.resume-paper iframe {
		z-index: 2;
		background: white;
	}
	.resume-page-no {
		position: absolute;
		right: 18px;
		bottom: 14px;
		font-family: var(--font-label);
		font-size: 0.6rem;
		letter-spacing: 0.18em;
		color: var(--ink-soft);
	}
	.resume-actions {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: clamp(28px, 4vw, 52px);
		border-left: 1px solid var(--ink-line-strong);
		overflow: hidden;
	}
	.resume-note {
		margin: 0;
		font-family: var(--font-serif);
		font-size: clamp(1.25rem, 2vw, 1.8rem);
		line-height: 1.25;
	}
	.resume-action-list {
		margin-top: 36px;
		border-top: 2px solid var(--ink);
	}
	.resume-action-list a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 17px 4px;
		border-bottom: 1px solid var(--ink-line-strong);
		font-family: var(--font-label);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition:
			padding 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			color 0.25s,
			background 0.25s;
	}
	.resume-action-list a:hover {
		padding-inline: 12px;
		color: var(--zhu);
	}
	.resume-action-list a.primary:hover {
		background: var(--zhu);
		color: var(--paper);
	}
	.resume-action-list b {
		font-size: 1rem;
	}
	.resume-folio {
		position: relative;
		margin-top: auto;
		display: flex;
		flex-direction: column;
		font-family: var(--font-label);
		text-transform: uppercase;
	}
	.resume-folio span {
		font-size: 0.58rem;
		letter-spacing: 0.16em;
		color: var(--ink-mute);
	}
	.resume-folio strong {
		font-family: var(--font-serif);
		font-size: clamp(4rem, 8vw, 7.5rem);
		line-height: 0.78;
		letter-spacing: -0.06em;
	}
	.resume-folio em {
		position: absolute;
		right: -0.12em;
		bottom: -0.4em;
		z-index: -1;
		font-family: var(--font-cn);
		font-size: 9rem;
		font-style: normal;
		color: rgba(192, 57, 43, 0.07);
	}

	@media (max-width: 720px) {
		.resume-trigger {
			min-width: 0;
			grid-template-columns: 38px 18px;
		}
		.resume-trigger-copy {
			display: none;
		}
		.resume-trigger-mark {
			width: 38px;
			height: 38px;
		}
		.resume-layer {
			padding: 0;
		}
		.resume-panel {
			width: 100%;
			height: calc(100dvh - 18px);
			border-width: 1px 0 0;
		}
		.resume-head {
			grid-template-columns: 1fr 44px;
			gap: 10px;
			padding: 14px 16px;
		}
		.resume-status {
			display: none;
		}
		.resume-body {
			grid-template-columns: 1fr;
			overflow-y: auto;
		}
		.resume-preview {
			min-height: 68vh;
			padding: 18px 12px 32px;
		}
		.resume-paper {
			width: min(100%, 440px);
			height: auto;
			max-height: none;
		}
		.resume-paper iframe {
			display: none;
		}
		.resume-actions {
			min-height: 46vh;
			border-left: 0;
			border-top: 1px solid var(--ink-line-strong);
			padding: 28px 20px;
		}
		.resume-folio {
			margin-top: 64px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.resume-trigger,
		.resume-trigger-mark,
		.resume-trigger-arrow,
		.resume-close {
			transform: none !important;
		}
	}
</style>
