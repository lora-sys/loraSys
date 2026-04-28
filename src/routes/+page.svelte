<script lang="ts">
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import AnimeSection from '$lib/components/portfolio/AnimeSection.svelte';
	import HackathonCard from '$lib/components/portfolio/HackathonCard.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { DATA } from '$lib/data/resume';
	import FavoritesSection from '$lib/components/portfolio/FavoriteSection.svelte';
	import { Spotlight } from '$lib/components/aceternity';
	import { TextGenerateEffect } from '$lib/components/aceternity';
	import { BentoGrid, BentoGridItem } from '$lib/components/aceternity';
	import Particles from '$lib/components/magic/Particles.svelte';
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
<main class="flex min-h-[100dvh] flex-col space-y-24">
	<section id="hero">
		<!-- Hero with Parallax background -->
		<div class="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
			<!-- Parallax layers -->
			<div class="absolute inset-0 z-0">
				<div
					class="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
				></div>
				<div
					class="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl"
				></div>
				<div
					class="absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse rounded-full bg-accent/10 blur-3xl"
					style="animation-delay: 2s;"
				></div>
			</div>

			<Spotlight
				className="-top-40 left-0 md:left-60 md:-top-20"
				fill="hsl(var(--primary) / 0.15)"
			/>
			<Particles className="opacity-30" />

			<!-- Radial gradient overlay -->
			<div
				class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.9)_70%)]"
			></div>

			<div class="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
				<BlurFade delay={BLUR_FADE_DELAY} yOffset={6}>
					<p class="mb-6 text-sm font-medium uppercase tracking-widest text-primary sm:text-base">
						{DATA.location}
					</p>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 2} yOffset={8}>
					<h1
						class="font-sans text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl/none"
					>
						{DATA.name}
					</h1>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 3} yOffset={6}>
					<div class="mt-8 flex items-center justify-center">
						<span class="mr-3 h-px w-16 bg-gradient-to-r from-transparent to-primary"></span>
						<span class="text-lg font-medium text-muted-foreground sm:text-xl">
							Software Engineer & Entrepreneur
						</span>
						<span class="ml-3 h-px w-16 bg-gradient-to-r from-primary to-transparent"></span>
					</div>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 4} yOffset={6}>
					<div class="mt-12">
						<TextGenerateEffect
							words={DATA.description}
							className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground"
						/>
					</div>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 5} yOffset={6}>
					<div class="mt-16 flex items-center justify-center gap-8">
						<!-- Enhanced magnetic avatar -->
						<div bind:this={avatarEl} class="group/avatar relative cursor-pointer">
							<div
								class="transition-all duration-500 ease-out group-hover/avatar:rotate-3 group-hover/avatar:scale-110"
								style="transform: translate({mouseX}px, {mouseY}px)"
							>
								<Avatar.Root
									class="size-36 border-2 border-primary/30 shadow-[0_0_40px_hsl(var(--primary)/0.3)] transition-all duration-300 group-hover/avatar:shadow-[0_0_60px_hsl(var(--primary)/0.5)] sm:size-44"
								>
									<Avatar.Image alt={DATA.name} src={DATA.avatarUrl} />
									<Avatar.Fallback
										class="bg-gradient-to-br from-primary/20 to-accent/20 text-3xl font-bold text-primary sm:text-4xl"
									>
										{DATA.initials}
									</Avatar.Fallback>
								</Avatar.Root>
							</div>
							<!-- Enhanced glow ring -->
							<div
								class="absolute inset-0 rounded-full opacity-0 transition-all duration-500 group-hover/avatar:scale-125 group-hover/avatar:opacity-100"
								style="background: radial-gradient(circle, hsl(var(--primary)/0.2) 0%, transparent 70%);"
							></div>
							<!-- Floating particles around avatar -->
							<div class="pointer-events-none absolute inset-0">
								<div
									class="absolute left-2 top-2 h-2 w-2 animate-ping rounded-full bg-primary/40"
								></div>
								<div
									class="absolute right-3 top-4 h-1 w-1 animate-ping rounded-full bg-accent/40"
									style="animation-delay: 1s;"
								></div>
								<div
									class="absolute bottom-3 left-4 h-1.5 w-1.5 animate-ping rounded-full bg-primary/30"
									style="animation-delay: 2s;"
								></div>
							</div>
						</div>
					</div>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 6} yOffset={6}>
					<div class="mt-12 flex flex-wrap justify-center gap-4">
						{#each Object.values(DATA.contact.social) as link}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="group relative rounded-full border border-border/50 bg-card/50 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] focus-visible:ring-2 focus-visible:ring-primary/50"
							>
								<span class="relative z-10">{link.name}</span>
								<div
									class="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								></div>
							</a>
						{/each}
					</div>
				</BlurFade>
			</div>

			<!-- Enhanced scroll indicator -->
			<BlurFade delay={BLUR_FADE_DELAY * 8} yOffset={4}>
				<div class="absolute bottom-8 left-1/2 -translate-x-1/2">
					<div class="flex flex-col items-center gap-2 text-muted-foreground/60">
						<span class="text-xs font-medium uppercase tracking-wider">Scroll</span>
						<div class="relative">
							<div class="flex h-10 w-6 justify-center rounded-full border-2 border-current">
								<div class="mt-2 h-3 w-1 animate-bounce rounded-full bg-current"></div>
							</div>
							<div
								class="absolute inset-0 animate-ping rounded-full border-2 border-current opacity-20"
							></div>
						</div>
					</div>
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
						title={edu.degree}
						start={edu.start}
						end={edu.end}
					/>
				</BlurFade>
			{/each}
		</div>
	</section>
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
				<div class="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
					{#each DATA.skills as skill, id}
						<BlurFade delay={BLUR_FADE_DELAY * 1.8 + id * 0.05}>
							<Badge
								class="cursor-pointer rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm font-medium text-card-foreground backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/10"
							>
								{skill}
							</Badge>
						</BlurFade>
					{/each}
				</div>
			</BlurFade>
		</div>
	</section>
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
							I&apos;ve worked on a variety of projects, from simple websites to complex web
							applications. Here are a few of my favorites.
						</p>
					</div>
				</div>
			</BlurFade>

			<!-- Enhanced Bento Grid for Projects -->
			<div class="mx-auto max-w-7xl">
				<BentoGrid>
					{#each DATA.projects as project, id}
						<BentoGridItem
							title={project.title}
							description={project.description}
							className={id === 0 ? 'md:col-span-2 md:row-span-2' : id === 1 ? 'md:row-span-2' : ''}
						>
							{#snippet header()}
								<a
									href={project.href || '#'}
									class="relative block aspect-[16/9] h-full min-h-[18rem] w-full overflow-hidden rounded-t-xl transition-transform duration-500 focus-visible:ring-2 focus-visible:ring-primary/50 group-hover:scale-105"
									style="aspect-ratio: 16 / 9;"
								>
									{#if project.video}
										<video
											class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
											src={project.video}
											autoplay
											loop
											muted
											playsinline
											preload="metadata"
										></video>
									{:else}
										<img
											class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
											src={project.image}
											alt={project.title}
											loading="lazy"
										/>
									{/if}
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
									></div>
								</a>
							{/snippet}
							{#snippet icon()}
								<div class="mb-3 flex flex-wrap gap-2">
									{#each project.technologies.slice(0, 3) as tag}
										<Badge
											class="rounded-md border border-border/50 bg-card/80 px-3 py-1 text-xs font-medium text-card-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
										>
											{tag}
										</Badge>
									{/each}
									{#if project.technologies.length > 3}
										<Badge
											class="rounded-md border border-border/50 bg-card/80 px-3 py-1 text-xs font-medium text-card-foreground"
										>
											+{project.technologies.length - 3}
										</Badge>
									{/if}
								</div>
							{/snippet}
						</BentoGridItem>
					{/each}
				</BentoGrid>
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
