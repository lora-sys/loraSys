<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import Lens from '$lib/components/magic/lens/lens.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { DATA } from '$lib/data/resume';
	import Autoplay from 'embla-carousel-autoplay';
	let plugins = [Autoplay()];
	let { zoomFactor = 1.5, lensSize = 200 } = $props();
</script>

<section id="anime" class="py-12">
	<div class="space-y-6">
		<h2 class="text-2xl font-bold tracking-tight">Anime</h2>

		<Carousel.Root class="w-full" opts={{ align: 'start', loop: true }} {plugins}>
			<Carousel.Content>
				{#each DATA.anime as anime, index}
					<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
						<div class="p-2">
							<Lens {zoomFactor} {lensSize}>
								{#snippet children()}
									<div class="relative aspect-[3/4] overflow-hidden rounded-xl">
										<img
											src={anime.image}
											alt={anime.name}
											class="h-full w-full object-cover"
											loading="lazy"
											decoding="async"
										/>
									</div>
								{/snippet}
							</Lens>
							<div class="mt-4 space-y-2">
								<h3 class="text-lg font-semibold">{anime.name}</h3>
								<p class="text-sm text-muted-foreground">"{anime.quote}"</p>
								<Button variant="outline" size="sm" asChild>
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
