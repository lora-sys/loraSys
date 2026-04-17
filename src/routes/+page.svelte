<script lang="ts">
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import AnimeSection from '$lib/components/portfolio/AnimeSection.svelte';
	import HackathonCard from '$lib/components/portfolio/HackathonCard.svelte';
	import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { DATA } from '$lib/data/resume';
	import FavoritesSection from '$lib/components/portfolio/FavoriteSection.svelte';
	import { Spotlight } from '$lib/components/aceternity';
	import { TextGenerateEffect } from '$lib/components/aceternity';
	import { onMount } from 'svelte';

	let BLUR_FADE_DELAY = 0.04;

	let avatarEl: HTMLDivElement | undefined = $state();
	let mouseX = $state(0);
	let mouseY = $state(0);

	onMount(() => {
		function handleMouseMove(e: MouseEvent) {
			if (avatarEl) {
				const rect = avatarEl.getBoundingClientRect();
				mouseX = (e.clientX - rect.left - rect.width / 2) * 0.08;
				mouseY = (e.clientY - rect.top - rect.height / 2) * 0.08;
			}
		}
		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	});
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

	<meta name="google-site-verification" content="your-google-verification-code" />
	<meta name="yandex-verification" content="your-yandex-verification-code" />
</svelte:head>
<main class="flex min-h-[100dvh] flex-col space-y-10">
	<section id="hero">
		<!-- Hero with Spotlight background -->
		<div class="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
			<Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="hsl(45 100% 70% / 0.3)" />

			<!-- Radial gradient overlay -->
			<div class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(240_6%_5%/0.8)_70%)]"></div>

			<div class="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
				<BlurFade delay={BLUR_FADE_DELAY} yOffset={6}>
					<p class="mb-4 text-sm font-medium uppercase tracking-widest text-gold sm:text-base">
						{DATA.location}
					</p>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 2} yOffset={8}>
					<h1 class="font-sans text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl/none">
						{DATA.name}
					</h1>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 3} yOffset={6}>
					<div class="mt-6 flex items-center justify-center">
						<span class="mr-2 h-px w-12 bg-gold"></span>
						<span class="text-lg font-medium text-muted-foreground sm:text-xl">
							Software Engineer & Entrepreneur
						</span>
						<span class="ml-2 h-px w-12 bg-gold"></span>
					</div>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 4} yOffset={6}>
					<div class="mt-10">
						<TextGenerateEffect
							words={DATA.description}
							className="text-base sm:text-lg md:text-xl lg:text-2xl"
						/>
					</div>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 5} yOffset={6}>
					<div class="mt-12 flex items-center justify-center gap-6">
						<!-- Magnetic avatar -->
						<div
							bind:this={avatarEl}
							class="group/avatar relative"
						>
							<div
								class="transition-transform duration-300 ease-out group-hover/avatar:scale-105"
								style="transform: translate({mouseX}px, {mouseY}px)"
							>
								<Avatar.Root class="size-32 border-2 border-gold/50 shadow-[0_0_30px_hsl(45_100%_70%_/0.2)] sm:size-40">
									<Avatar.Image alt={DATA.name} src={DATA.avatarUrl} />
									<Avatar.Fallback class="bg-gradient-to-br from-gold/20 to-transparent text-gold font-bold text-2xl sm:text-3xl">
										{DATA.initials}
									</Avatar.Fallback>
								</Avatar.Root>
							</div>
							<!-- Glow ring -->
							<div class="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover/avatar:opacity-100"
								style="background: radial-gradient(circle, hsl(45_100%_70%_/0.15) 0%, transparent 70%); transform: scale(1.2);">
							</div>
						</div>
					</div>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 6} yOffset={6}>
					<div class="mt-8 flex flex-wrap justify-center gap-3">
						{#each Object.values(DATA.contact.social) as link}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:border-gold/50 hover:text-gold"
							>
								{link.name}
							</a>
						{/each}
					</div>
				</BlurFade>
			</div>

			<!-- Scroll indicator -->
			<BlurFade delay={BLUR_FADE_DELAY * 8} yOffset={4}>
				<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
					<svg class="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</div>
			</BlurFade>
		</div>
	</section>
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
	</section>
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
						title={edu.school}
						subtitle={edu.degree}
						start={edu.start}
						end={edu.end}
					/>
				</BlurFade>
			{/each}
		</div>
	</section>
	<section id="skills">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">Skills</h2>
			</BlurFade>
			<div class="flex flex-wrap gap-1">
				{#each DATA.skills as skill, id}
					<BlurFade delay={BLUR_FADE_DELAY * id + 0.002}>
						<Badge>{skill}</Badge>
					</BlurFade>
				{/each}
			</div>
		</div>
	</section>
	<section id="projects">
		<div class="w-full space-y-12 py-12">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="flex flex-col items-center justify-center space-y-4 text-center">
					<div class="space-y-2">
						<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
							My Projects
						</div>
						<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
							Check out my latest work
						</h2>
						<p
							class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
						>
							I&apos;ve worked on a variety of projects, from simple websites to complex web
							applications. Here are a few of my favorites.
						</p>
					</div>
				</div>
			</BlurFade>
			<div class="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
				{#each DATA.projects as project, id}
					<BlurFade delay={BLUR_FADE_DELAY * 1.5 + id * 0.05}>
						<ProjectCard
							href={project.href}
							title={project.title}
							description={project.description}
							descriptionHtml={project.descriptionHtml}
							dates={project.dates}
							tags={project.technologies}
							image={project.image}
							video={project.video}
							links={project.links}
						/>
					</BlurFade>
				{/each}
			</div>
		</div>
	</section>
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
							During my time in university, I attended{' '}
							{DATA.hackathons.length}+ hackathons. People from around the country would come
							together and build incredible things in 2-3 days. It was eye-opening to see the
							endless possibilities brought to life by a group of motivated and passionate
							individuals.
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
	<section id="anime">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<AnimeSection />
		</BlurFade>
	</section>
	<section id="favorites">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<FavoritesSection />
		</BlurFade>
	</section>
	<section id="contact">
		<div class="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
			<BlurFade delay={BLUR_FADE_DELAY * 2}>
				<div class="space-y-3">
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
						and I&apos;ll respond whenever I can. I will ignore all soliciting.
					</p>
				</div>
			</BlurFade>
		</div>
	</section>
</main>
