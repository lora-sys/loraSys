<script lang="ts">
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import AnimeSection from '$lib/components/portfolio/AnimeSection.svelte';
	import HackathonCard from '$lib/components/portfolio/HackathonCard.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { DATA } from '$lib/data/resume';
	import FavoritesSection from '$lib/components/portfolio/FavoriteSection.svelte';
	import TerminalHero from '$lib/components/magic/terminal/terminal-hero.svelte';
	import BentoGrid from '$lib/components/magic/bento-grid/bento-grid.svelte';
	import BentoGridItem from '$lib/components/aceternity/BentoGridItem.svelte';
	import ShineBorder from '$lib/components/magic/shine-border/shine-border.svelte';
	import NeonGradientCard from '$lib/components/magic/neon-gradient-card/neon-gradient-card.svelte';
	import IconCloud from '$lib/components/magic/icon-cloud/icon-cloud.svelte';
	import Marquee from '$lib/components/magic/marquee/marquee.svelte';
	import RetroGrid from '$lib/components/magic/retro-grid/retro-grid.svelte';
	import AnimatedGradientText from '$lib/components/magic/animated-gradient-text/animated-gradient-text.svelte';
	import InteractiveHoverButton from '$lib/components/magic/interactive-hover-button/interactive-hover-button.svelte';
	import ArcTimeline from '$lib/components/magic/arc-timeline/arc-timeline.svelte';

	let BLUR_FADE_DELAY = 0.04;

	// Work data grouped by year for Arc Timeline
	const workTimeline = (() => {
		const grouped: Record<string, typeof DATA.work> = {};
		for (const w of DATA.work) {
			const year = w.start.split(' ')[1] || w.start;
			if (!grouped[year]) grouped[year] = [];
			grouped[year].push(w);
		}
		return Object.entries(grouped)
			.sort(([a], [b]) => Number(b) - Number(a))
			.map(([year, items]) => ({
				time: year,
				steps: items.map((w) => ({
					icon: 'briefcase',
					content: `${w.title} @ ${w.company}`
				}))
			}));
	})();

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

<main class="flex min-h-[100dvh] flex-col space-y-24">
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
			<h2 class="text-xl font-bold">About</h2>
		</BlurFade>
		<BlurFade delay={BLUR_FADE_DELAY * 1.4}>
			<div
				class="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert"
			>
				{@html DATA.summaryHtml}
			</div>
		</BlurFade>
	</section>

	<!-- ==================== WORK EXPERIENCE ==================== -->
	<section id="work">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">Work Experience</h2>
			</BlurFade>
			{#each DATA.work as work, id}
				<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
					<ResumeCard {...work} />
				</BlurFade>
			{/each}
		</div>
		<!-- Arc Timeline visualization -->
		<BlurFade delay={BLUR_FADE_DELAY * 2}>
			<div class="mt-8 overflow-hidden rounded-xl border border-border/30 bg-card/20 p-4">
				<ArcTimeline
					data={workTimeline}
					defaultActiveStep={{ time: workTimeline[0]?.time, stepIndex: 0 }}
				/>
			</div>
		</BlurFade>
	</section>

	<!-- ==================== EDUCATION ==================== -->
	<section id="education">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">Education</h2>
			</BlurFade>
			{#each DATA.education as edu, id}
				<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
					<ResumeCard
						href={edu.href}
						logoUrl={edu.logoUrl}
						company={edu.school}
						title={edu.degree}
						start={edu.start}
						end={edu.end}
					/>
				</BlurFade>
			{/each}
		</div>
	</section>

	<!-- ==================== SKILLS (Icon Cloud) ==================== -->
	<section id="skills">
		<div class="w-full space-y-12 py-16">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="flex flex-col items-center justify-center space-y-6 text-center">
					<div class="space-y-4">
						<div
							class="inline-block rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
						>
							Tech Stack
						</div>
						<h2 class="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
							Skills & Technologies
						</h2>
						<p class="text-muted-foreground md:text-lg">
							Tools and technologies I use to bring ideas to life
						</p>
					</div>
				</div>
			</BlurFade>
			<BlurFade delay={BLUR_FADE_DELAY * 1.5}>
				<div class="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
					<div class="flex justify-center">
						<IconCloud images={skillImages} class="mx-auto" />
					</div>
					<div class="flex flex-wrap justify-center gap-2 lg:max-w-sm">
						{#each DATA.skills as skill, id}
							<BlurFade delay={BLUR_FADE_DELAY * 1.8 + id * 0.05}>
								<Badge
									class="cursor-default rounded-lg border border-term-green/30 bg-term-green/5 px-3 py-1.5 font-mono text-xs text-term-green transition-all duration-300 hover:scale-105 hover:border-term-green/60 hover:shadow-[0_0_12px_rgba(34,197,94,0.15)]"
								>
									{skill}
								</Badge>
							</BlurFade>
						{/each}
					</div>
				</div>
			</BlurFade>
		</div>
	</section>

	<!-- ==================== PROJECTS (Bento + Shine/Neon) ==================== -->
	<section id="projects">
		<div class="w-full space-y-16 py-16">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="flex flex-col items-center justify-center space-y-6 text-center">
					<div class="space-y-4">
						<div
							class="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
						>
							Featured Work
						</div>
						<h2 class="font-sans text-4xl font-bold tracking-tight sm:text-5xl">
							Check out my latest work
						</h2>
						<p
							class="mx-auto max-w-2xl text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
						>
							I've worked on a variety of projects, from simple websites to complex web
							applications. Here are a few of my favorites.
						</p>
					</div>
				</div>
			</BlurFade>

			<div class="mx-auto max-w-7xl">
				<BentoGrid>
					{#each DATA.projects as project, id}
						{#if id === 0}
							<!-- Featured project: Shine Border -->
							<BentoGridItem
								title={project.title}
								description={project.description}
								className="md:col-span-2 md:row-span-2"
							>
								{#snippet header()}
									<div class="group relative h-full w-full overflow-hidden rounded-t-xl">
										<ShineBorder
											shineColor={['#22c55e', '#9c40ff', '#ffaa40']}
											borderWidth={2}
											duration={10}
										/>
										<a
											href={project.href || '#'}
											class="relative block aspect-[16/9] h-full min-h-[18rem] w-full overflow-hidden transition-transform duration-500 group-hover:scale-105"
										>
											{#if project.video}
												<video
													class="h-full w-full object-cover"
													src={project.video}
													autoplay loop muted playsinline
													preload="metadata"
												></video>
											{:else}
												<img
													class="h-full w-full object-cover"
													src={project.image}
													alt={project.title}
													loading="lazy"
												/>
											{/if}
										</a>
									</div>
								{/snippet}
								{#snippet icon()}
									<div class="mb-3 flex flex-wrap gap-2">
										{#each project.technologies.slice(0, 4) as tag}
											<Badge
												class="rounded-md border border-term-green/30 bg-term-green/5 px-3 py-1 font-mono text-xs text-term-green"
											>
												{tag}
											</Badge>
										{/each}
									</div>
								{/snippet}
							</BentoGridItem>
						{:else}
							<!-- Normal project: Neon Gradient Card wrapper -->
							<BentoGridItem
								title={project.title}
								description={project.description}
								className={id === 1 ? 'md:row-span-2' : ''}
							>
								{#snippet header()}
									<NeonGradientCard
										class="h-full"
										neonColors={{
											firstColor: id % 2 === 0 ? '#22c55e' : '#9c40ff',
											secondColor: id % 2 === 0 ? '#06b6d4' : '#ffaa40'
										}}
										borderRadius={16}
									>
										<a
											href={project.href || '#'}
											class="relative block aspect-[16/9] h-full min-h-[12rem] w-full overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-105"
										>
											{#if project.video}
												<video
													class="h-full w-full rounded-xl object-cover"
													src={project.video}
													autoplay loop muted playsinline
													preload="metadata"
												></video>
											{:else}
												<img
													class="h-full w-full rounded-xl object-cover"
													src={project.image}
													alt={project.title}
													loading="lazy"
												/>
											{/if}
										</a>
									</NeonGradientCard>
								{/snippet}
								{#snippet icon()}
									<div class="mb-3 flex flex-wrap gap-2">
										{#each project.technologies.slice(0, 3) as tag}
											<Badge
												class="rounded-md border border-border/50 bg-card/80 px-3 py-1 font-mono text-xs text-card-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
											>
												{tag}
											</Badge>
										{/each}
										{#if project.technologies.length > 3}
											<Badge
												class="rounded-md border border-border/50 bg-card/80 px-3 py-1 font-mono text-xs text-card-foreground"
											>
												+{project.technologies.length - 3}
											</Badge>
										{/if}
									</div>
								{/snippet}
							</BentoGridItem>
						{/if}
					{/each}
				</BentoGrid>
			</div>
		</div>
	</section>

	<!-- ==================== HACKATHONS ==================== -->
	<section id="hackathons">
		<div class="w-full space-y-12 py-12">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="flex flex-col items-center justify-center space-y-4 text-center">
					<div class="space-y-2">
						<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
							Hackathons
						</div>
						<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">I like building things</h2>
						<p
							class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
						>
							During my time in university, I attended {DATA.hackathons.length}+ hackathons.
							People from around the country would come together and build incredible things
							in 2-3 days.
						</p>
					</div>
				</div>
			</BlurFade>
			<BlurFade delay={BLUR_FADE_DELAY * 2}>
				<ul class="mb-4 ml-4 divide-y divide-dashed border-l">
					{#each DATA.hackathons as project}
						<BlurFade delay={BLUR_FADE_DELAY}>
							<HackathonCard
								title={project.title}
								description={project.description}
								descriptionHtml={project.descriptionHtml}
								dates={project.dates}
								location={project.location}
								image={project.image}
								links={project.links}
							/>
						</BlurFade>
					{/each}
				</ul>
			</BlurFade>
		</div>
	</section>

	<!-- ==================== ANIME (isolated) ==================== -->
	<section id="anime" class="anime-isolated">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<AnimeSection />
		</BlurFade>
	</section>

	<!-- ==================== FAVORITES ==================== -->
	<section id="favorites">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<FavoritesSection />
		</BlurFade>
	</section>

	<!-- ==================== CONTACT ==================== -->
	<section id="contact">
		<div class="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
			<BlurFade delay={BLUR_FADE_DELAY * 2}>
				<div class="space-y-6">
					<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
						Contact
					</div>
					<h2 class="text-3xl font-bold tracking-tight sm:text-5xl">Get in Touch</h2>
					<p
						class="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
					>
						Want to chat? Just shoot me a dm
						<a href={DATA.contact.social.X.url} class="text-blue-500 hover:underline">
							with a direct question on twitter
						</a>
						and I'll respond whenever I can.
					</p>
					<div class="flex justify-center pt-4">
						<a href={DATA.contact.social.X.url} target="_blank" rel="noopener noreferrer">
							<InteractiveHoverButton class="rounded-full border border-term-green/30 bg-term-green/5 px-8 py-3 font-mono text-sm text-term-green">
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
				<span class="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
					{DATA.name}
				</span>
			</AnimatedGradientText>
			<div class="flex items-center gap-4">
				{#each Object.entries(DATA.contact.social) as [_, social]}
					<a
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						class="text-muted-foreground transition-colors hover:text-foreground"
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
			<p class="font-mono text-xs text-muted-foreground">
				&copy; {new Date().getFullYear()} {DATA.name}. Built with SvelteKit & MagicUI.
			</p>
		</div>
	</footer>
</main>
