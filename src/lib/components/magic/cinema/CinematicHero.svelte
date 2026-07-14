<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import TerminalHero from '$lib/components/magic/terminal/terminal-hero.svelte';
	import SceneLabel from '$lib/components/magic/cinema/SceneLabel.svelte';
	import { DATA } from '$lib/data/resume';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let mounted = $state(browser ? false : true);
	let reduced = $state(false);

	onMount(() => {
		mounted = true;
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	const marqueeSkills = [
		'TypeScript',
		'Python',
		'Svelte',
		'Next.js',
		'AI Agents',
		'Solidity',
		'Web3',
		'Docker',
		'PostgreSQL',
		'TailwindCSS',
		'Node.js'
	];

	const letters = 'lora'.split('');
</script>

<section
	id="hero"
	class="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 pb-16 {className}"
>
	<!-- Scene header strip -->
	<div class="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 md:px-10">
		<SceneLabel prompt="scene=01" path="/hero">
			{#snippet children()}
				<span>reel_01</span>
			{/snippet}
		</SceneLabel>
		<div class="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 md:flex">
			<span class="size-1.5 animate-pulse rounded-full bg-emerald-400"></span>
			<span>rec</span>
			<span class="text-zinc-700">·</span>
			<span>{DATA.location}</span>
		</div>
	</div>

	<!-- Main composition: asymmetric split -->
	<div
		class="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-8 px-6 py-10 md:grid-cols-12 md:gap-6 md:px-10 md:py-16"
	>
		<!-- LEFT: Giant display type as hero -->
		<div class="relative col-span-1 flex flex-col justify-center md:col-span-7 lg:col-span-8">
			<div
				class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500"
				style:opacity={mounted || reduced ? 1 : 0}
				style:transform={mounted || reduced ? 'translateY(0)' : 'translateY(8px)'}
				style:transition="opacity .6s cubic-bezier(.22,1,.36,1) .05s, transform .6s cubic-bezier(.22,1,.36,1) .05s"
			>
				<span class="text-emerald-400">$</span> whoami
			</div>

			<!-- Giant name -->
			<h1
				class="mt-4 font-heading text-[clamp(5rem,18vw,14rem)] font-bold leading-[0.82] tracking-[-0.04em] text-foreground"
				aria-label={DATA.name}
			>
				{#each letters as letter, i (i)}
					<span
						class="inline-block"
						style:opacity={mounted || reduced ? 1 : 0}
						style:transform={mounted || reduced ? 'translateY(0)' : 'translateY(110%)'}
						style:transition="opacity .9s cubic-bezier(.22,1,.36,1) {0.12 + i * 0.06}s, transform .9s cubic-bezier(.22,1,.36,1) {0.12 + i * 0.06}s"
					>{letter}</span>
				{/each}
			</h1>

			<!-- Manifesto line -->
			<p
				class="mt-6 max-w-[42ch] font-heading text-balance text-lg leading-snug text-zinc-300 md:text-xl lg:text-2xl"
				style:opacity={mounted || reduced ? 1 : 0}
				style:transform={mounted || reduced ? 'translateY(0)' : 'translateY(14px)'}
				style:transition="opacity .9s cubic-bezier(.22,1,.36,1) .55s, transform .9s cubic-bezier(.22,1,.36,1) .55s"
			>
				Builder of evolving systems.<br />
				<span class="text-zinc-500"
					>Turning ambitious ideas into reality. Always building, learning, shipping.</span
				>
			</p>

			<!-- Meta row: links -->
			<div
				class="mt-8 flex flex-wrap items-center gap-3"
				style:opacity={mounted || reduced ? 1 : 0}
				style:transform={mounted || reduced ? 'translateY(0)' : 'translateY(14px)'}
				style:transition="opacity .9s cubic-bezier(.22,1,.36,1) .75s, transform .9s cubic-bezier(.22,1,.36,1) .75s"
			>
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

		<!-- RIGHT: terminal sidekick (asymmetric, lower) -->
		<div
			class="relative col-span-1 mt-6 flex items-end justify-center md:col-span-5 md:mt-0 md:items-end md:justify-end lg:col-span-4"
			style:opacity={mounted || reduced ? 1 : 0}
			style:transform={mounted || reduced
				? 'translateY(0) rotate(0deg)'
				: 'translateY(20px) rotate(1deg)'}
			style:transition="opacity 1.1s cubic-bezier(.22,1,.36,1) .35s, transform 1.1s cubic-bezier(.22,1,.36,1) .35s"
		>
			<div
				class="w-full max-w-[28rem] [transform:perspective(1400px)_rotateY(-6deg)_rotateX(2deg)]"
			>
				<TerminalHero />
			</div>
		</div>
	</div>

	<!-- Marquee strip (cinematic bottom band) -->
	<div
		class="relative z-10 mt-4 w-full overflow-hidden border-y border-zinc-800/40 bg-zinc-950/30 py-3"
		aria-hidden="true"
	>
		<div class="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500"
			style:--duration="38s">
			{#each [...marqueeSkills, ...marqueeSkills] as s}
				<span class="inline-flex items-center gap-3">
					<span class="text-emerald-400/60">●</span>
					{s}
				</span>
			{/each}
		</div>
	</div>

	<!-- Scroll cue -->
	<div
		class="relative z-10 mx-auto mt-6 flex w-full max-w-[1400px] items-center justify-between px-6 md:px-10"
	>
		<span class="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">
			scroll → manifesto
		</span>
		<span class="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">01 / 06</span>
	</div>
</section>