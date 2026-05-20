<script lang="ts">
	import { DATA } from '$lib/data/resume';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ArrowRightIcon } from '@lucide/svelte';
	import { base } from '$app/paths';

	function imgPath(path: string): string {
		return path.startsWith('/') ? base + path : path;
	}
</script>

<section id="favorites" class="py-12">
	<div class="space-y-6">
		<h2 class="text-2xl font-bold tracking-tight">Favorites</h2>
		<div
			class="grid w-full auto-rows-[16rem] grid-cols-1 gap-4 md:auto-rows-[20rem] md:grid-cols-2 lg:grid-cols-3"
		>
			{#each DATA.favorites as item}
				{#if item.isSpotify}
					<Dialog.Root>
						<Dialog.Trigger class="w-full cursor-pointer border-0 bg-transparent p-0 text-left">
							<div
								class="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
							>
								<img
									src={imgPath(item.background)}
									alt={item.name}
									class="absolute inset-0 h-full w-full object-cover"
									loading="lazy"
									decoding="async"
								/>
								<div class="bg-gradient-to-b from-black/80 via-black/50 to-transparent p-4">
									<item.icon class="h-10 w-10 font-bold text-yellow-400" />
									<h3 class="mt-2 text-xl font-bold text-foreground">{item.name}</h3>
								</div>
								<!-- 悬停黑遮罩 -->
								<div
									class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								>
									<p class="max-w-lg text-center font-medium text-foreground">{item.description}</p>
									<div class="mt-4 flex items-center gap-1 font-bold text-yellow-400 text-sm">
										{item.cta}
										<ArrowRightIcon class="h-4 w-4" />
									</div>
								</div>
							</div>
						</Dialog.Trigger>
						<Dialog.Content class="max-h-[80vh] overflow-y-auto">
							<Dialog.Header>
								<Dialog.Title>{item.name}</Dialog.Title>
								<Dialog.Description>{item.description}</Dialog.Description>
							</Dialog.Header>
							<div class="mt-4">
								<iframe
									src={item.href}
									width="100%"
									height="352"
									frameborder="0"
									allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
									loading="lazy"
									title="{item.name} Spotify playlist"
									style="border-radius: 12px"
								></iframe>
							</div>
						</Dialog.Content>
					</Dialog.Root>
				{:else}
					<a
						href={item.href || '#'}
						class="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
					>
						<img
							src={imgPath(item.background)}
							alt={item.name}
							class="absolute inset-0 h-full w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
						<div class="bg-gradient-to-b from-black/80 via-black/50 to-transparent p-4">
							<item.icon class="h-10 w-10 font-bold text-yellow-400" />
							<h3 class="mt-2 text-xl font-bold text-foreground">{item.name}</h3>
						</div>
						<!-- 悬停黑遮罩 -->
						<div
							class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<p class="max-w-lg text-center font-medium text-foreground">{item.description}</p>
							<div class="mt-4 flex items-center gap-1 font-bold text-yellow-400 text-sm">
								{item.cta}
								<ArrowRightIcon class="h-4 w-4" />
							</div>
						</div>
					</a>
				{/if}
			{/each}
		</div>
	</div>
</section>
