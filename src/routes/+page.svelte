<script lang="ts">
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import AnimeSection from '$lib/components/portfolio/AnimeSection.svelte';
	import EduCard from '$lib/components/portfolio/EduCard.svelte';
	import LogCard from '$lib/components/portfolio/LogCard.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { DATA } from '$lib/data/resume';
	import FavoritesSection from '$lib/components/portfolio/FavoriteSection.svelte';
	import TerminalHero from '$lib/components/magic/terminal/terminal-hero.svelte';
	import TerminalCard from '$lib/components/portfolio/TerminalCard.svelte';
	import IconCloud from '$lib/components/magic/icon-cloud/icon-cloud.svelte';
	import RetroGrid from '$lib/components/magic/retro-grid/retro-grid.svelte';
	import AnimatedGradientText from '$lib/components/magic/animated-gradient-text/animated-gradient-text.svelte';
	import InteractiveHoverButton from '$lib/components/magic/interactive-hover-button/interactive-hover-button.svelte';

	let BLUR_FADE_DELAY = 0.04;

	// Skill icon image URLs for Icon Cloud
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

<main class="flex min-h-[100dvh] flex-col space-y-16 md:space-y-24">
	<!-- ==================== HERO ==================== -->
	<section id="hero" class="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
		<div class="relative z-10 mx-auto w-full max-w-3xl px-6">
			<BlurFade delay={BLUR_FADE_DELAY} yOffset={6}>
				<TerminalHero />
			</BlurFade>
		</div>
	</section>

	<!-- ==================== ABOUT ==================== -->
	<section id="about">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<div
				class="mb-4 inline-block rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 font-mono font-pixel-square text-xs text-emerald-400"
			>
				<span class="text-zinc-500">~/</span>whoami
			</div>
		</BlurFade>
		<BlurFade delay={BLUR_FADE_DELAY * 1.4}>
			<div
				class="prose prose-invert max-w-full text-pretty font-mono text-sm leading-relaxed text-zinc-400 prose-a:font-bold prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline"
			>
				{@html DATA.summaryHtml}
			</div>
		</BlurFade>
	</section>

	<!-- ==================== WORK EXPERIENCE ==================== -->
	<section id="work">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="mb-4 inline-flex items-center gap-2 font-mono font-pixel-square text-xs">
					<span class="text-emerald-400">$</span>
					<span class="text-zinc-400">ls -la /experience/</span>
				</div>
			</BlurFade>
			<BlurFade delay={BLUR_FADE_DELAY * 1.2}>
				<div class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
					<div class="mb-2 flex items-baseline gap-2 px-2 font-mono text-[10px] text-zinc-500">
						<span class="w-[9ch]">permissions</span>
						<span class="w-[14ch]">start</span>
						<span class="w-[14ch]">end</span>
						<span>name</span>
					</div>
					<div class="space-y-0.5">
						<p class="px-2 py-4 font-mono text-xs text-zinc-500">No work experience yet</p>
					</div>
				</div>
			</BlurFade>
		</div>
	</section>

	<!-- ==================== EDUCATION ==================== -->
	<section id="education">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="mb-4 inline-flex items-center gap-2 font-mono font-pixel-square text-xs">
					<span class="text-emerald-400">$</span>
					<span class="text-zinc-400">cat /education/*.json</span>
				</div>
			</BlurFade>
			<div class="space-y-2 border-l border-zinc-700 pl-4">
				{#each DATA.education as edu, id}
					<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
						<EduCard
							school={edu.school}
							degree={edu.degree}
							start={edu.start}
							end={edu.end}
							logoUrl={edu.logoUrl}
							href={edu.href}
						/>
					</BlurFade>
				{/each}
			</div>
		</div>
	</section>

	<!-- ==================== SKILLS (Icon Cloud) ==================== -->
	<section id="skills">
		<div class="w-full space-y-8 py-8 md:space-y-12 md:py-16">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="flex flex-col items-center justify-center space-y-6 text-center">
					<div class="space-y-4">
						<div
							class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 font-mono font-pixel-grid text-xs text-emerald-400"
						>
							<span class="text-zinc-500">~/</span>skills --list
						</div>
						<h2 class="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							Skills & Technologies
						</h2>
						<p class="font-mono text-sm text-zinc-400">
							Tools and technologies I use to build things
						</p>
					</div>
				</div>
			</BlurFade>
			<BlurFade delay={BLUR_FADE_DELAY * 1.5}>
				<div class="flex justify-center">
					<IconCloud images={skillImages} class="mx-auto" />
				</div>
			</BlurFade>
			<BlurFade delay={BLUR_FADE_DELAY * 1.5}>
				<div class="flex flex-wrap items-center justify-center gap-2">
					{#each DATA.skills as skill, id}
						<BlurFade delay={BLUR_FADE_DELAY * 1.8 + id * 0.05}>
							<Badge
								class="cursor-default rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 font-mono text-xs text-zinc-200 transition-all duration-300 hover:scale-105 hover:border-emerald-500/40 hover:text-emerald-400 hover:shadow-[0_0_12px_rgba(52,211,153,0.12)]"
							>
								{skill}
							</Badge>
						</BlurFade>
					{/each}
				</div>
			</BlurFade>
		</div>
	</section>

	<!-- ==================== PROJECTS (Bento + Shine/Neon) ==================== -->
	<section id="projects">
		<div class="w-full space-y-8 py-8 md:space-y-16 md:py-16">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="flex flex-col items-center justify-center space-y-6 text-center">
					<div class="space-y-4">
						<div
							class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 font-mono font-pixel-grid text-xs text-emerald-400"
						>
							<span class="text-zinc-500">~/</span>projects
						</div>
						<h2 class="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							Check out my latest work
						</h2>
						<p
							class="mx-auto max-w-2xl text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
						>
							I've worked on a variety of projects, from simple websites to complex web
							applications. Here are a few of my favorites.
						</p>
					</div>
				</div>
			</BlurFade>

			<div class="grid w-full auto-rows-[28rem] grid-cols-1 gap-4 md:grid-cols-2">
				{#each DATA.projects as project}
					<TerminalCard
						title={project.title}
						description={project.description}
						technologies={project.technologies}
						href={project.href}
						video={project.video}
						image={project.image}
						dates={project.dates}
					/>
				{/each}
			</div>
		</div>
	</section>
	<!-- ==================== HACKATHONS ==================== -->
	<section id="hackathons">
		<div class="w-full space-y-12 py-12">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="flex flex-col items-center justify-center space-y-4 text-center">
					<div class="space-y-2">
						<div
							class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 font-mono font-pixel-circle text-xs text-emerald-400"
						>
							<span class="text-zinc-500">~/</span>hackathons.log
						</div>
						<h2 class="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							I like building things
						</h2>
						<p class="font-mono text-sm text-zinc-400">
							During my time in university, I attended {DATA.hackathons.length}+ hackathons.
						</p>
					</div>
				</div>
			</BlurFade>
			<BlurFade delay={BLUR_FADE_DELAY * 2}>
				<div
					class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 font-mono text-xs"
				>
					{#each DATA.hackathons as project, idx}
						<BlurFade delay={BLUR_FADE_DELAY}>
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
						</BlurFade>
					{/each}
				</div>
			</BlurFade>
		</div>
	</section>

	<!-- ==================== ANIME (isolated) ==================== -->
	<section id="anime" class="anime-isolated">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<div class="mb-6 inline-flex items-center gap-2 font-mono font-pixel-circle text-xs">
				<span class="text-emerald-400">$</span>
				<span class="text-zinc-400">cd ~/favorites/anime</span>
			</div>
			<AnimeSection />
		</BlurFade>
	</section>

	<!-- ==================== FAVORITES ==================== -->
	<section id="favorites">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<div class="mb-6 inline-flex items-center gap-2 font-mono font-pixel-triangle text-xs">
				<span class="text-emerald-400">$</span>
				<span class="text-zinc-400">cat ~/favorites/*.json</span>
			</div>
			<FavoritesSection />
		</BlurFade>
	</section>

	<!-- ==================== CONTACT ==================== -->
	<section id="contact">
		<div class="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
			<BlurFade delay={BLUR_FADE_DELAY * 2}>
				<div class="space-y-6">
					<div
						class="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 font-mono font-pixel-triangle text-xs text-emerald-400"
					>
						<span class="text-zinc-500">~/</span>contact.sh
					</div>
					<h2 class="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
						Get in Touch
					</h2>
					<p class="mx-auto max-w-[600px] font-mono text-sm text-zinc-400">
						Want to chat? Just shoot me a dm
						<a href={DATA.contact.social.X.url} class="text-emerald-400 hover:underline">
							with a direct question on twitter
						</a>
						and I'll respond whenever I can.
					</p>
					<div class="flex justify-center pt-4">
						<a href={DATA.contact.social.X.url} target="_blank" rel="noopener noreferrer">
							<InteractiveHoverButton
								class="rounded-full border border-zinc-700 bg-zinc-800/50 px-8 py-3 font-mono text-sm text-emerald-400"
							>
								Say Hello
							</InteractiveHoverButton>
						</a>
					</div>
				</div>
			</BlurFade>
		</div>
	</section>

	<!-- ==================== FOOTER ==================== -->
	<footer class="relative overflow-hidden border-t border-border/40 py-16">
		<RetroGrid class="opacity-20" />
		<div class="relative z-10 flex flex-col items-center gap-6">
			<AnimatedGradientText speed={1.5} colorFrom="#22c55e" colorTo="#9c40ff">
				<span class="font-heading font-pixel-circle text-2xl font-bold tracking-tight sm:text-3xl">
					{DATA.name}
				</span>
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
				&copy; {new Date().getFullYear()}
				{DATA.name}. Built with Lora.
			</p>
		</div>
	</footer>
</main>
