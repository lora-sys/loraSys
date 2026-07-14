<script lang="ts">
	import AnimeSection from '$lib/components/portfolio/AnimeSection.svelte';
	import EduCard from '$lib/components/portfolio/EduCard.svelte';
	import LogCard from '$lib/components/portfolio/LogCard.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { DATA } from '$lib/data/resume';
	import FavoritesSection from '$lib/components/portfolio/FavoriteSection.svelte';
	import TerminalCard from '$lib/components/portfolio/TerminalCard.svelte';
	import IconCloud from '$lib/components/magic/icon-cloud/icon-cloud.svelte';
	import RetroGrid from '$lib/components/magic/retro-grid/retro-grid.svelte';
	import AnimatedGradientText from '$lib/components/magic/animated-gradient-text/animated-gradient-text.svelte';
	import InteractiveHoverButton from '$lib/components/magic/interactive-hover-button/interactive-hover-button.svelte';

	import CinematicHero from '$lib/components/magic/cinema/CinematicHero.svelte';
	import SceneManifesto from '$lib/components/magic/cinema/SceneManifesto.svelte';
	import ScrollScene from '$lib/components/magic/cinema/ScrollScene.svelte';
	import SceneLabel from '$lib/components/magic/cinema/SceneLabel.svelte';

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
	<!-- ==================== HERO ==================== -->
	<CinematicHero />

	<!-- ==================== MANIFESTO / ABOUT ==================== -->
	<SceneManifesto />

	<!-- ==================== EDUCATION ==================== -->
	{#if DATA.education.length > 0}
		<section id="education" class="relative isolate overflow-hidden py-24 md:py-32">
			<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
				<ScrollScene>
					<SceneLabel prompt="scene=04" path="/education" />
				</ScrollScene>
				<ScrollScene delay={0.1} y={20}>
					<h2
						class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
					>
						Trained<br />
						<span class="text-zinc-500">at.</span>
					</h2>
				</ScrollScene>

				<div class="mt-10 space-y-3 border-l border-zinc-700/60 pl-5 md:pl-8">
					{#each DATA.education as edu, id}
						<ScrollScene delay={0.15 + id * 0.05}>
							<EduCard
								school={edu.school}
								degree={edu.degree}
								start={edu.start}
								end={edu.end}
								logoUrl={edu.logoUrl}
								href={edu.href}
							/>
						</ScrollScene>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- ==================== SKILLS ==================== -->
	<section id="skills" class="relative isolate overflow-hidden py-24 md:py-32">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<div class="grid grid-cols-1 gap-12 md:grid-cols-12">
				<div class="md:col-span-5">
					<ScrollScene>
						<SceneLabel prompt="scene=05" path="/skills" />
					</ScrollScene>
					<ScrollScene delay={0.1} y={20}>
						<h2
							class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
						>
							Tools I<br />
							<span class="text-zinc-500">reach for.</span>
						</h2>
					</ScrollScene>
					<ScrollScene delay={0.2}>
						<p class="mt-6 max-w-[40ch] font-mono text-sm text-zinc-400">
							A working set — opinionated where it matters, pragmatic everywhere else.
						</p>
					</ScrollScene>
				</div>
				<div class="md:col-span-7">
					<ScrollScene delay={0.15}>
						<div class="flex justify-center md:justify-end">
							<IconCloud images={skillImages} class="mx-auto md:mx-0" />
						</div>
					</ScrollScene>
					<ScrollScene delay={0.25}>
						<div class="mt-8 flex flex-wrap items-center justify-center gap-2 md:justify-end">
							{#each DATA.skills as skill}
								<Badge
									class="cursor-default rounded-lg border border-zinc-700 bg-zinc-800/40 px-3 py-1.5 font-mono text-xs text-zinc-200 transition hover:scale-105 hover:border-emerald-500/40 hover:text-emerald-400"
								>
									{skill}
								</Badge>
							{/each}
						</div>
					</ScrollScene>
				</div>
			</div>
		</div>
	</section>

	<!-- ==================== PROJECTS ==================== -->
	<section id="projects" class="relative isolate overflow-hidden py-24 md:py-32">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<ScrollScene>
				<SceneLabel prompt="scene=06" path="/projects" />
			</ScrollScene>
			<ScrollScene delay={0.1} y={20}>
				<h2
					class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
				>
					Things I've<br />
					<span class="text-zinc-500">built.</span>
				</h2>
			</ScrollScene>
			<ScrollScene delay={0.15}>
				<p class="mt-6 max-w-[60ch] font-mono text-sm text-zinc-400">
					A selection — interactive terminals, full-stack apps, AI agents, dApps. Click any card to
					open.
				</p>
			</ScrollScene>

			<div class="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each DATA.projects as project, i}
					<ScrollScene delay={0.1 + i * 0.05} y={28}>
						<TerminalCard
							title={project.title}
							description={project.description}
							technologies={project.technologies}
							href={project.href}
							video={project.video}
							image={project.image}
							dates={project.dates}
						/>
					</ScrollScene>
				{/each}
			</div>
		</div>
	</section>

	<!-- ==================== HACKATHONS ==================== -->
	{#if DATA.hackathons.length > 0}
		<section id="hackathons" class="relative isolate overflow-hidden py-24 md:py-32">
			<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
				<ScrollScene>
					<SceneLabel prompt="scene=07" path="/hackathons.log" />
				</ScrollScene>
				<ScrollScene delay={0.1} y={20}>
					<h2
						class="mt-6 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
					>
						I like building<br />
						<span class="text-zinc-500">things.</span>
					</h2>
				</ScrollScene>
				<ScrollScene delay={0.15}>
					<p class="mt-6 max-w-[60ch] font-mono text-sm text-zinc-400">
						{DATA.hackathons.length}+ hackathons — Monad, ETH Beijing, online AI agent jams, and
						more.
					</p>
				</ScrollScene>
				<ScrollScene delay={0.2}>
					<div
						class="mt-12 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40 p-3 font-mono text-xs"
					>
						{#each DATA.hackathons as project, idx}
							<LogCard
								title={project.title}
								description={project.description}
								descriptionHtml={project.descriptionHtml}
								dates={project.dates}
								location={project.location}
								image={project.image}
								links={project.links}
								pid={idx + 1000}
							/>
						{/each}
					</div>
				</ScrollScene>
			</div>
		</section>
	{/if}

	<!-- ==================== ANIME ==================== -->
	<section id="anime" class="anime-isolated relative isolate overflow-hidden py-24 md:py-32">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<ScrollScene>
				<SceneLabel prompt="scene=08" path="/favorites/anime" />
			</ScrollScene>
			<ScrollScene delay={0.1}>
				<AnimeSection />
			</ScrollScene>
		</div>
	</section>

	<!-- ==================== FAVORITES ==================== -->
	<section id="favorites" class="relative isolate overflow-hidden py-24 md:py-32">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<ScrollScene>
				<SceneLabel prompt="scene=09" path="/favorites" />
			</ScrollScene>
			<ScrollScene delay={0.1}>
				<FavoritesSection />
			</ScrollScene>
		</div>
	</section>

	<!-- ==================== CONTACT ==================== -->
	<section id="contact" class="relative isolate overflow-hidden py-24 md:py-40">
		<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
			<div class="grid grid-cols-1 gap-12 md:grid-cols-12">
				<div class="md:col-span-7">
					<ScrollScene>
						<SceneLabel prompt="scene=10" path="/contact.sh" tone="magenta" />
					</ScrollScene>
					<ScrollScene delay={0.1} y={28}>
						<h2
							class="mt-6 font-heading text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.92] tracking-[-0.04em] text-foreground"
						>
							Say<br />
							<span
								class="bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-200 bg-clip-text text-transparent"
								>hello.</span
							>
						</h2>
					</ScrollScene>
					<ScrollScene delay={0.2}>
						<p class="mt-8 max-w-[50ch] font-mono text-sm leading-relaxed text-zinc-400">
							Want to chat? DM me
							<a
								href={DATA.contact.social.X.url}
								class="text-emerald-400 hover:underline">on X</a
							>, or use the form. I respond when I can.
						</p>
					</ScrollScene>
					<ScrollScene delay={0.3}>
						<div class="mt-8 flex flex-wrap items-center gap-3">
							<a href={DATA.contact.social.X.url} target="_blank" rel="noopener noreferrer">
								<InteractiveHoverButton
									class="rounded-full border border-zinc-700 bg-zinc-900/40 px-8 py-3 font-mono text-sm text-emerald-400"
								>
									Say Hello
								</InteractiveHoverButton>
							</a>
							<a
								href="/api/resume"
								target="_blank"
								class="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/40 px-8 py-3 font-mono text-sm text-emerald-400 transition hover:border-emerald-500/40"
							>
								$ cat resume.json
							</a>
						</div>
					</ScrollScene>
				</div>
				<div class="md:col-span-5 md:pt-12">
					<ScrollScene delay={0.25}>
						<form
							action="mailto:lorasys@outlook.com"
							method="post"
							enctype="text/plain"
							class="space-y-4"
						>
							<input
								type="text"
								name="name"
								placeholder="Name"
								class="w-full rounded-lg border border-zinc-700/60 bg-zinc-900/40 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-500 transition hover:border-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							/>
							<input
								type="email"
								name="email"
								placeholder="Email"
								class="w-full rounded-lg border border-zinc-700/60 bg-zinc-900/40 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-500 transition hover:border-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							/>
							<textarea
								name="message"
								placeholder="Message"
								rows="4"
								class="w-full resize-none rounded-lg border border-zinc-700/60 bg-zinc-900/40 px-4 py-3 font-mono text-sm text-zinc-200 placeholder-zinc-500 transition hover:border-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							></textarea>
							<button
								type="submit"
								class="w-full rounded-full border border-zinc-700 bg-zinc-900/40 px-8 py-3 font-mono text-sm text-emerald-400 transition hover:border-emerald-500/40"
							>
								$ send_message
							</button>
						</form>
					</ScrollScene>
				</div>
			</div>
		</div>
	</section>

	<!-- ==================== FOOTER ==================== -->
	<footer class="relative overflow-hidden border-t border-border/40 py-16">
		<RetroGrid class="opacity-20" />
		<div class="relative z-10 flex flex-col items-center gap-6">
			<AnimatedGradientText speed={1.5} colorFrom="#22c55e" colorTo="#9c40ff">
				<span class="font-heading font-bold text-2xl tracking-tight sm:text-3xl">{DATA.name}</span>
			</AnimatedGradientText>
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
				&copy; {new Date().getFullYear()} {DATA.name}. Built with Lora.
			</p>
		</div>
	</footer>
</main>