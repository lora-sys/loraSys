<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import Lens from '$lib/components/magic/lens/lens.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { DATA } from '$lib/data/resume';
	import { base } from '$app/paths';

	let { zoomFactor = 1.15, lensSize = 140 } = $props();

	function imgPath(path: string): string {
		return path.startsWith('/') ? base + path : path;
	}
</script>

<section id="anime" class="py-16 md:py-20">
	<div class="space-y-8">
		<h2 class="text-2xl font-bold tracking-tight text-foreground">Anime</h2>

		<Carousel.Root class="w-full" opts={{ align: 'start', loop: true }}>
			<Carousel.Content>
				{#each DATA.anime as anime}
					<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
						<div class="p-3">
							<Lens {zoomFactor} {lensSize}>
								{#snippet children()}
									<div
										class="group relative aspect-[2/3] overflow-hidden rounded-xl bg-card/50 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-black/30"
									>
										<img
											src={imgPath(anime.image)}
											alt={anime.name}
											class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
											decoding="async"
										/>
									</div>
								{/snippet}
							</Lens>
							<div class="mt-5 space-y-2">
								<h3 class="text-lg font-semibold text-foreground">{anime.name}</h3>
								<p class="text-sm text-zinc-500">"{anime.quote}"</p>
								<Button
									variant="outline"
									size="sm"
									class="border-zinc-700/60 bg-transparent text-sm hover:bg-zinc-800/50"
								>
									<a href={anime.link} target="_blank" rel="noopener noreferrer">
										{anime.buttonText}
									</a>
								</Button>
							</div>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
</section>
