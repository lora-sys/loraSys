<script lang="ts">
	import { DATA } from '$lib/data/resume';
	import { onMount } from 'svelte';

	interface Props {}
	let {}: Props = $props();

	// For mobile: scene label + index
	const SCENES = [
		{ id: 'hero', label: 'lora', index: '01' },
		{ id: 'manifesto', label: 'credo', index: '02' },
		{ id: 'education', label: 'trained', index: '03' },
		{ id: 'skills', label: 'tools', index: '04' },
		{ id: 'projects', label: 'built', index: '05' },
		{ id: 'hackathons', label: 'events', index: '06' },
		{ id: 'anime', label: 'culture', index: '07' },
		{ id: 'favorites', label: 'favorites', index: '08' },
		{ id: 'contact', label: 'hello', index: '09' },
		{ id: 'footer', label: 'end_credit', index: '10' }
	];
</script>

<svelte:head>
	<title>{DATA.name}</title>
	<meta name="description" content={DATA.description} />
	<meta property="og:title" content={DATA.name} />
	<meta property="og:description" content={DATA.description} />
	<meta property="og:url" content={DATA.url} />
	<meta property="og:site_name" content={DATA.name} />
	<meta property="og:image" content={DATA.img} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta name="robots" content="index, follow" />
	<meta
		name="googlebot"
		content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
	/>
	<meta name="twitter:title" content={DATA.name} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={DATA.img} />
	<meta name="twitter:description" content={DATA.description} />
</svelte:head>

<main class="relative">
	<!-- ==================== HERO ==================== -->
	<section
		id="hero"
		class="hero-stage relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 pb-16"
	>
		<!-- Scene label + status -->
		<div
			class="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 md:px-10"
		>
			<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
				<span class="text-emerald-400">scene</span>=01 / hero · <span class="text-zinc-300">lora</span>
			</span>
			<div
				class="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 md:flex"
			>
				<span class="size-1.5 animate-pulse rounded-full bg-emerald-400"></span>
				<span>rec</span>
				<span class="text-zinc-700">·</span>
				<span>{DATA.location}</span>
			</div>
		</div>

		<!-- Main composition -->
		<div
			class="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-8 px-6 py-10 md:grid-cols-12 md:gap-6 md:px-10 md:py-16"
		>
			<!-- LEFT: Type as hero (visible on mobile, layered over 3D on desktop) -->
			<div class="relative col-span-1 flex flex-col justify-center md:col-span-12 lg:col-span-7">
				<span
					class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500"
				>
					<span class="text-emerald-400">$</span> whoami
				</span>

				<!-- The giant name — mirrors the 3D text behind it on desktop, is the hero on mobile -->
				<h1
					class="mt-4 font-heading text-[clamp(5rem,18vw,14rem)] font-bold leading-[0.82] tracking-[-0.04em] text-foreground mix-blend-difference"
					aria-label={DATA.name}
				>
					{DATA.name}
				</h1>

				<p class="mt-6 max-w-[42ch] font-heading text-lg leading-snug text-zinc-200 md:text-xl lg:text-2xl">
					Builder of evolving systems.<br />
					<span class="text-zinc-500"
						>Turning ambitious ideas into reality. Always building, learning, shipping.</span
					>
				</p>

				<div class="mt-8 flex flex-wrap items-center gap-3">
					<a
						href={DATA.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/40 px-4 py-2 font-mono text-xs text-zinc-200 transition hover:border-emerald-500/50 hover:text-emerald-400"
					>
						<span class="text-emerald-400">gh:</span>
						<span>{DATA.url.replace('https://', '')}</span>
						<span class="text-zinc-600 transition group-hover:translate-x-0.5">→</span>
					</a>
					{#if DATA.contact?.social?.X}
						<a
							href={DATA.contact.social.X.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/40 px-4 py-2 font-mono text-xs text-zinc-200 transition hover:border-emerald-500/50 hover:text-emerald-400"
						>
							<span class="text-emerald-400">x:</span>
							<span>@{DATA.contact.social.X.url.split('/').pop()}</span>
						</a>
					{/if}
				</div>
			</div>

			<!-- RIGHT (desktop only): hint of what 3D is showing -->
			<div class="hidden lg:col-span-5 lg:block">
				<!-- 3D canvas fills this area visually; HTML placeholder for now -->
				<div class="flex h-full items-end justify-end">
					<p
						class="max-w-[20ch] text-right font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-600"
					>
						drag · scroll · watch<br />
						<span class="text-zinc-400">three.js · threlte · glsl</span>
					</p>
				</div>
			</div>
		</div>

		<!-- Page index strip -->
		<div
			class="relative z-10 mx-auto mt-6 flex w-full max-w-[1400px] items-center justify-between px-6 md:px-10"
		>
			<span class="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">
				scroll → manifesto
			</span>
			<span class="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">01 / 09</span>
		</div>
	</section>

	<!-- ==================== PLACEHOLDER SECTIONS (skeleton) ==================== -->
	{#each SCENES.slice(1, -1) as scene}
		<section id={scene.id === 'manifesto' ? 'about' : scene.id} class="relative isolate overflow-hidden py-24 md:py-40">
			<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
				<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
					<span class="text-emerald-400">scene</span>={scene.index} / {scene.label}
				</span>
				<h2
					class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
				>
					{section_title(scene.id)}
				</h2>
			</div>
		</section>
	{/each}

	<!-- ==================== FOOTER ==================== -->
	<footer class="relative overflow-hidden border-t border-border/40 py-16">
		<div class="relative z-10 flex flex-col items-center gap-6">
			<p class="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{DATA.name}</p>
			<div class="flex items-center gap-4">
				{#each Object.entries(DATA.contact.social) as [_, social]}
					<a
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-zinc-400 transition-colors hover:text-foreground"
						aria-label={social.name}
					>
						{#if social?.dark_icon}
							<img src={social.icon} class="size-5 dark:hidden" alt={social.name} />
							<img src={social.dark_icon} class="hidden size-5 dark:block" alt={social.name} />
						{:else}
							<img src={social.icon} class="size-5" alt={social.name} />
						{/if}
					</a>
				{/each}
			</div>
			<p class="font-mono text-xs text-zinc-400">
				&copy; {new Date().getFullYear()} {DATA.name}. Built with lora.
			</p>
		</div>
	</footer>
</main>

<script context="module" lang="ts">
	function section_title(id: string): string {
		const map: Record<string, string> = {
			manifesto: 'Builder of evolving systems.',
			education: 'Trained at.',
			skills: 'Tools I reach for.',
			projects: "Things I've built.",
			hackathons: 'I like building things.',
			anime: '$ cd ~/favorites/anime',
			favorites: '$ cat ~/favorites/*.json',
			contact: 'Say hello.'
		};
		return map[id] ?? id;
	}
</script>