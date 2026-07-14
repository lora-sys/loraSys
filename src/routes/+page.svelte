<script lang="ts">
	import { DATA } from '$lib/data/resume';
	import AnimeSection from '$lib/components/portfolio/AnimeSection.svelte';
	import FavoritesSection from '$lib/components/portfolio/FavoriteSection.svelte';
	import { Canvas } from '@threlte/core';
	import SkillOrbit from '$lib/components/spatial/SkillOrbit.svelte';
	import HackathonTimeline3D from '$lib/components/spatial/HackathonTimeline3D.svelte';
	import ContactOrb3D from '$lib/components/spatial/ContactOrb3D.svelte';
	import ManifestoAccent3D from '$lib/components/spatial/ManifestoAccent3D.svelte';
	import FooterBurst3D from '$lib/components/spatial/FooterBurst3D.svelte';
	import LazyScene from '$lib/components/spatial/LazyScene.svelte';
	import TiltCard from '$lib/components/spatial/TiltCard.svelte';
	import EntryReveal from '$lib/components/spatial/EntryReveal.svelte';
	import * as THREE from 'three';

	interface Props {}
	let {}: Props = $props();

	const skillImages = [
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
		'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg'
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
	<!-- ==================== HERO (01 / lora) ==================== -->
	<section
		id="hero"
		class="hero-stage relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 pb-16"
	>
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

		<div
			class="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-8 px-6 py-10 md:grid-cols-12 md:gap-6 md:px-10 md:py-16"
		>
			<div class="relative col-span-1 flex flex-col justify-center md:col-span-12 lg:col-span-7">
				<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
					<span class="text-emerald-400">$</span> whoami
				</span>

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
						class="group inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/40 px-4 py-2 font-mono text-xs text-zinc-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
					>
						<span class="text-cyan-300">gh:</span>
						<span>{DATA.url.replace('https://', '')}</span>
						<span class="text-zinc-600 transition group-hover:translate-x-0.5">→</span>
					</a>
					{#if DATA.contact?.social?.X}
						<a
							href={DATA.contact.social.X.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/40 px-4 py-2 font-mono text-xs text-zinc-200 transition hover:border-cyan-400/50 hover:text-cyan-300"
						>
							<span class="text-cyan-300">x:</span>
							<span>@{DATA.contact.social.X.url.split('/').pop()}</span>
						</a>
					{/if}
				</div>
			</div>

			<div class="hidden lg:col-span-5 lg:block">
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

		<div
			class="relative z-10 mx-auto mt-6 flex w-full max-w-[1400px] items-center justify-between px-6 md:px-10"
		>
			<span class="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">
				scroll → manifesto
			</span>
			<span class="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">01 / 09</span>
		</div>
	</section>

	<!-- ==================== MANIFESTO (02 / credo) ==================== -->
	<section
		id="about"
		class="relative isolate overflow-hidden py-24 md:py-40"
	>
		<div class="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-10">
			<div class="md:col-span-7">
				<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
					<span class="text-emerald-400">scene</span>=02 / credo
				</span>
				<EntryReveal delay={0.15} y={20}>
					<blockquote
						class="mt-6 font-heading text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
					>
						<span class="text-emerald-400">"</span>Builder of evolving
						<span class="text-zinc-500 line-through decoration-zinc-700">ideas</span>
						<span
							class="bg-gradient-to-r from-cyan-300 via-purple-400 to-amber-200 bg-clip-text text-transparent"
							>systems</span
						>. Always building, learning, and shipping.<span class="text-emerald-400">"</span>
					</blockquote>
				</EntryReveal>
			</div>

			<div class="flex flex-col gap-8 md:col-span-4 md:col-start-9 md:pt-12">
				<EntryReveal delay={0.3} y={12}>
					<LazyScene
						class="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"
					>
						<Canvas
							dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
							toneMapping={THREE.ACESFilmicToneMapping}
						>
							<ManifestoAccent3D count={5} />
						</Canvas>
					</LazyScene>
				</EntryReveal>

				<EntryReveal delay={0.4} y={12}>
					<dl
						class="grid grid-cols-2 gap-y-6 font-mono text-xs uppercase tracking-[0.18em]"
					>
						<dt class="text-zinc-500">base</dt>
						<dd class="text-zinc-300">{DATA.location}</dd>

						<dt class="text-zinc-500">craft</dt>
						<dd class="text-zinc-300">full-stack · agents</dd>

						<dt class="text-zinc-500">focus</dt>
						<dd class="text-zinc-300">AI · Web3 · DX</dd>

						<dt class="text-zinc-500">repos</dt>
						<dd class="text-cyan-300">103+ public</dd>

						<dt class="text-zinc-500">hackathons</dt>
						<dd class="text-cyan-300">Monad · ETH Beijing</dd>
					</dl>
				</EntryReveal>

				<EntryReveal delay={0.5} y={12}>
					<div
						class="prose prose-invert max-w-full text-pretty font-mono text-sm leading-relaxed text-zinc-400 prose-a:font-bold prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline"
					>
						{@html DATA.summaryHtml}
					</div>
				</EntryReveal>
			</div>
		</div>

		<div
			class="mx-auto mt-16 flex w-full max-w-[1400px] items-center justify-between border-t border-zinc-800/40 px-6 pt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600 md:px-10"
		>
			<span>02 / 09</span>
			<span>scroll → trained</span>
		</div>
	</section>

	<!-- ==================== EDUCATION (03 / trained) ==================== -->
	{#if DATA.education.length > 0}
		<section id="education" class="relative isolate overflow-hidden py-24 md:py-32">
			<div class="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-10">
				<div class="md:col-span-5">
					<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
						<span class="text-emerald-400">scene</span>=03 / trained
					</span>
					<h2
						class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
					>
						Trained<br />
						<span class="text-zinc-500">at.</span>
					</h2>
				</div>

				<div class="md:col-span-7">
					<div
						class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40 font-mono text-xs"
					>
						{#each DATA.education as edu, id}
							<a
								href={edu.href}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-baseline gap-3 border-b border-zinc-800/60 px-4 py-4 transition last:border-b-0 hover:bg-zinc-900/40"
							>
								{#if edu.logoUrl}
									<div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800">
										<img src={edu.logoUrl} alt={edu.school} class="h-5 w-5 object-contain" loading="lazy" />
									</div>
								{/if}
								<div class="flex flex-1 flex-col">
									<span
										class="text-zinc-200 transition group-hover:text-cyan-300"
										>{edu.school}</span
									>
									<span class="text-xs text-zinc-500">{edu.degree}</span>
								</div>
								<span class="shrink-0 font-mono text-[10px] text-zinc-500"
									>{edu.start} → {edu.end}</span
								>
								<span class="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-300"
									>→</span
								>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- ==================== SKILLS (04 / tools) ==================== -->
	<section id="skills" class="relative isolate overflow-hidden py-24 md:py-32">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<div class="grid grid-cols-1 gap-12 md:grid-cols-12">
				<div class="md:col-span-5">
					<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
						<span class="text-emerald-400">scene</span>=04 / tools
					</span>
					<h2
						class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
					>
						Tools I<br />
						<span class="text-zinc-500">reach for.</span>
					</h2>
					<p class="mt-6 max-w-[40ch] font-mono text-sm text-zinc-400">
						A working set — opinionated where it matters, pragmatic everywhere else.
					</p>
				</div>
				<div class="md:col-span-7">
					<!-- Local 3D Canvas — skill icons orbit around a central anchor -->
					<LazyScene
						class="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"
					>
						<Canvas
							dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
							toneMapping={THREE.ACESFilmicToneMapping}
						>
							<SkillOrbit images={skillImages} radius={2.4} iconSize={0.65} />
						</Canvas>
					</LazyScene>

					<div class="mt-8 flex flex-wrap items-center gap-2">
						{#each DATA.skills as skill}
							<span
								class="rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-1.5 font-mono text-xs text-zinc-200 transition hover:scale-105 hover:border-cyan-400/40 hover:text-cyan-300"
							>
								{skill}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ==================== PROJECTS (05 / built) ==================== -->
	<section id="projects" class="relative isolate overflow-hidden py-24 md:py-32">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
				<span class="text-emerald-400">scene</span>=05 / built
			</span>
			<h2
				class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
			>
				Things I've<br />
				<span class="text-zinc-500">built.</span>
			</h2>
			<p class="mt-6 max-w-[60ch] font-mono text-sm text-zinc-400">
				A selection — interactive terminals, full-stack apps, AI agents, dApps. Click any card to open.
			</p>

			<!-- Asymmetric bento grid: first project full-width, rest 2-up -->
			<div class="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
				{#each DATA.projects as project, i}
					<TiltCard class={i === 0 ? 'md:col-span-6 md:row-span-2' : 'md:col-span-3'} maxTilt={5}>
						<a
							href={project.href}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative block h-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/40 transition hover:border-cyan-400/40"
						>
							<!-- Terminal-style header -->
							<div
								class="flex items-center justify-between gap-2 border-b border-zinc-800/60 px-4 py-2.5"
							>
								<div class="flex gap-1.5">
									<div class="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
									<div class="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
									<div class="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
								</div>
								<span class="font-mono text-[11px] text-zinc-500">
									{project.title.toLowerCase().replace(/\s+/g, '-')}.tsx
								</span>
								{#if project.dates}
									<span class="font-mono text-[10px] text-zinc-500">{project.dates}</span>
								{:else}
									<span></span>
								{/if}
							</div>

							<div class={'p-6 ' + (i === 0 ? 'md:p-8' : '')}>
								<div class="mb-3 flex items-center gap-2 font-mono text-sm leading-none">
									<span class="text-zinc-600">//</span>
									<span class="font-semibold tracking-tight text-zinc-200">{project.title}</span>
								</div>

								<p class="mb-4 font-mono text-[13px] leading-relaxed text-zinc-400">
									{project.description}
								</p>

								{#if project.image && i === 0}
									<div class="mb-4 overflow-hidden rounded-lg border border-zinc-800/60">
										<img
											src={project.image}
											alt={project.title}
											class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
											loading="lazy"
										/>
									</div>
								{:else if project.video}
									<div class="mb-4 overflow-hidden rounded-lg border border-zinc-800/60">
										<video
											src={project.video}
											class="h-32 w-full object-cover"
											autoplay
											loop
											muted
											playsinline
											preload="metadata"
										></video>
									</div>
								{/if}

								<div class="mb-4 flex flex-wrap gap-1.5">
									{#each project.technologies.slice(0, 5) as tech}
										<span
											class="rounded border border-zinc-800/80 bg-zinc-900/50 px-2 py-0.5 font-mono text-[10px] text-zinc-300"
										>
											{tech}
										</span>
									{/each}
								</div>

								<div class="flex items-center gap-2 font-mono text-xs text-zinc-500">
									<span class="text-cyan-300">$</span>
									<span>open</span>
									<span
										class="text-cyan-300 underline decoration-cyan-500/20 underline-offset-4 group-hover:decoration-cyan-400/50"
									>
										{project.href.replace(/^https?:\/\//, '')}
									</span>
								</div>
							</div>
						</a>
					</TiltCard>
				{/each}
			</div>
		</div>
	</section>

	<!-- ==================== HACKATHONS (06 / events) ==================== -->
	{#if DATA.hackathons.length > 0}
		<section id="hackathons" class="relative isolate overflow-hidden py-24 md:py-32">
			<div class="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-10">
				<div class="md:col-span-5">
					<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
						<span class="text-emerald-400">scene</span>=06 / events
					</span>
					<h2
						class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
					>
						I like building<br />
						<span class="text-zinc-500">things.</span>
					</h2>
					<p class="mt-6 max-w-[40ch] font-mono text-sm text-zinc-400">
						{DATA.hackathons.length}+ hackathons — Monad, ETH Beijing, online AI agent jams, and more.
					</p>
				</div>

				<div class="md:col-span-7">
					<!-- Local 3D Canvas — curved glowing timeline -->
					<LazyScene
						class="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"
					>
						<Canvas
							dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
							toneMapping={THREE.ACESFilmicToneMapping}
						>
							<HackathonTimeline3D count={DATA.hackathons.length} />
						</Canvas>
					</LazyScene>

					<ol class="relative mt-10 space-y-3 border-l border-zinc-800/80 pl-8 md:pl-12">
						{#each DATA.hackathons as project, idx}
							<li class="group relative">
								<span
									class="absolute -left-[2.05rem] top-2 inline-block size-2.5 rounded-full bg-cyan-400/80 ring-4 ring-cyan-400/10 transition group-hover:ring-cyan-400/30 md:-left-[3.05rem]"
								></span>
								<a
									href={project.links?.[0]?.href ?? '#'}
									target="_blank"
									rel="noopener noreferrer"
									class="block rounded p-3 transition hover:bg-zinc-900/30"
								>
									<div class="flex flex-wrap items-baseline gap-2 font-mono text-sm">
										<span class="text-zinc-500">{project.dates}</span>
										<span class="text-zinc-200 transition group-hover:text-cyan-300"
											>{project.title}</span
										>
										{#if project.location}
											<span class="text-zinc-500">· {project.location}</span>
										{/if}
									</div>
									{#if project.description}
										<p class="mt-1 font-mono text-xs text-zinc-500">{project.description}</p>
									{/if}
								</a>
							</li>
						{/each}
					</ol>
				</div>
			</div>
		</section>
	{/if}

	<!-- ==================== ANIME (07 / culture) ==================== -->
	<section id="anime" class="anime-isolated relative isolate overflow-hidden py-24 md:py-32">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
				<span class="text-emerald-400">scene</span>=07 / culture
			</span>
			<p class="mt-4 font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
				<span class="text-cyan-300">$</span> cd ~/favorites/anime
			</p>
			<div class="mt-10">
				<AnimeSection />
			</div>
		</div>
	</section>

	<!-- ==================== FAVORITES (08 / favorites) ==================== -->
	<section id="favorites" class="relative isolate overflow-hidden py-24 md:py-32">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
				<span class="text-emerald-400">scene</span>=08 / favorites
			</span>
			<p class="mt-4 font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
				<span class="text-cyan-300">$</span> cat ~/favorites/*.json
			</p>
			<div class="mt-10">
				<FavoritesSection />
			</div>
		</div>
	</section>

	<!-- ==================== CONTACT (09 / hello) ==================== -->
	<section id="contact" class="relative isolate overflow-hidden py-24 md:py-40">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<div class="grid grid-cols-1 gap-12 md:grid-cols-12">
				<div class="md:col-span-7">
					<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
						<span class="text-purple-400">scene</span>=09 / hello
					</span>
					<h2
						class="mt-6 font-heading text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.92] tracking-[-0.04em] text-foreground"
					>
						Say<br />
						<span
							class="bg-gradient-to-r from-cyan-300 via-purple-400 to-amber-200 bg-clip-text text-transparent"
							>hello.</span
						>
					</h2>
					<p class="mt-8 max-w-[50ch] font-mono text-sm leading-relaxed text-zinc-400">
						Want to chat? DM me
						<a href={DATA.contact.social.X.url} class="text-cyan-300 hover:underline">on X</a>,
						or use the form. I respond when I can.
					</p>
					<div class="mt-8 flex flex-wrap items-center gap-3">
						<a
							href={DATA.contact.social.X.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/5 px-6 py-3 font-mono text-sm text-cyan-300 transition hover:bg-cyan-400/10"
						>
							Say Hello
						</a>
						<a
							href="/api/resume"
							target="_blank"
							class="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/40 px-6 py-3 font-mono text-sm text-cyan-300 transition hover:border-cyan-400/40"
						>
							$ cat resume.json
						</a>
					</div>
				</div>
				<div class="md:col-span-5 md:pt-12">
					<!-- Local 3D Canvas — gradient orb + dense particle cloud climax -->
					<LazyScene
						class="relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-800/60"
					>
						<Canvas
							dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
							toneMapping={THREE.ACESFilmicToneMapping}
						>
							<ContactOrb3D orbSize={1.5} />
						</Canvas>
						<!-- Form overlays the orb so visitors can act on the climax -->
						<div class="pointer-events-none absolute inset-0 flex items-end justify-center p-6">
							<form
								action="mailto:lorasys@outlook.com"
								method="post"
								enctype="text/plain"
								class="pointer-events-auto w-full max-w-md space-y-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-4 backdrop-blur-md"
							>
								<input
									type="text"
									name="name"
									placeholder="Name"
									class="w-full rounded-lg border border-zinc-700/60 bg-zinc-900/60 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-500 transition hover:border-zinc-600 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
								/>
								<input
									type="email"
									name="email"
									placeholder="Email"
									class="w-full rounded-lg border border-zinc-700/60 bg-zinc-900/60 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-500 transition hover:border-zinc-600 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
								/>
								<textarea
									name="message"
									placeholder="Message"
									rows="3"
									class="w-full resize-none rounded-lg border border-zinc-700/60 bg-zinc-900/60 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-500 transition hover:border-zinc-600 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
								></textarea>
								<button
									type="submit"
									class="w-full rounded-full border border-zinc-700 bg-zinc-900/60 px-8 py-3 font-mono text-sm text-cyan-300 transition hover:border-cyan-400/40"
								>
									$ send_message
								</button>
							</form>
						</div>
					</LazyScene>
				</div>
			</div>
		</div>
	</section>

	<!-- ==================== FOOTER ==================== -->
	<footer class="relative overflow-hidden border-t border-zinc-800/40 py-16">
		<!-- 3D particle burst fires once on entry, fades to black -->
		<LazyScene class="pointer-events-none absolute inset-0">
			<Canvas
				dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
				toneMapping={THREE.ACESFilmicToneMapping}
			>
				<FooterBurst3D count={150} />
			</Canvas>
		</LazyScene>

		<div class="relative z-10 flex flex-col items-center gap-6">
			<p class="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{DATA.name}</p>
			<div class="flex items-center gap-4">
				{#each Object.entries(DATA.contact.social) as [_, social]}
					<a
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-zinc-400 transition-colors hover:text-cyan-300"
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