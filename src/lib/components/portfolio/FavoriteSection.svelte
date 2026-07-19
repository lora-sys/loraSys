<script lang="ts">
	import { DATA } from '$lib/data/resume';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ArrowRightIcon } from '@lucide/svelte';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { inview } from 'svelte-inview';
	import { cn } from '$lib/utils';

	function imgPath(path: string): string {
		return path.startsWith('/') ? base + path : path;
	}

	interface FavoriteItem {
		name: string;
		description: string;
		background: string;
		href: string;
		cta: string;
		icon: typeof ArrowRightIcon;
		isSpotify: boolean;
	}
</script>

<section id="favorites" class="py-20 md:py-28">
	<!-- Section header -->
	<div class="mb-10 md:mb-14">
		<p
			class="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a857c]"
			use:inview={{
				rootMargin: '-40px',
				unobserveOnEnter: true
			}}
			oninview_change={({ detail }) => {
				if (detail.inView) {
					detail.node.style.opacity = '1';
					detail.node.style.transform = 'translateY(0)';
				}
			}}
			style:opacity="0"
			style:transform="translateY(8px)"
			style:transition="opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
		>
			<span class="text-[#c6412c]">✦</span> Favorites
		</p>
		<h2
			class="mt-3 font-heading text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight text-foreground"
			use:inview={{
				rootMargin: '-40px',
				unobserveOnEnter: true
			}}
			oninview_change={({ detail }) => {
				if (detail.inView) {
					detail.node.style.opacity = '1';
					detail.node.style.transform = 'translateY(0)';
				}
			}}
			style:opacity="0"
			style:transform="translateY(12px)"
			style:transition="opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s"
		>
			Things I love
		</h2>
		<p
			class="mt-3 max-w-md text-base text-[#8a857c]"
			use:inview={{
				rootMargin: '-40px',
				unobserveOnEnter: true
			}}
			oninview_change={({ detail }) => {
				if (detail.inView) {
					detail.node.style.opacity = '1';
					detail.node.style.transform = 'translateY(0)';
				}
			}}
			style:opacity="0"
			style:transform="translateY(12px)"
			style:transition="opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s"
		>
			A curated collection of the stories, sounds, and ideas that shape how I see the world.
		</p>
	</div>

	<div
		class="grid w-full auto-rows-[16rem] grid-cols-1 gap-4 md:auto-rows-[20rem] md:grid-cols-2 lg:grid-cols-3"
	>
		{#each DATA.favorites as item, i}
			{@const isSpotify = (item as FavoriteItem).isSpotify}
			{@const delay = i * 0.06}
			{#if isSpotify}
				<Dialog.Root>
					<Dialog.Trigger
						class="favorite-card group relative h-full w-full cursor-pointer border-0 bg-transparent p-0 text-left"
						use:inview={{
							rootMargin: '-60px',
							unobserveOnEnter: true
						}}
						oninview_change={({ detail }) => {
							if (detail.inView) {
								detail.node.style.opacity = '1';
								detail.node.style.transform = 'translateY(0)';
							}
						}}
						style:opacity="0"
						style:transform="translateY(20px)"
						style:transition="opacity 0.7s ease {delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3,
						1) {delay}s"
					>
						<div
							class="favorite-card-inner relative flex h-full flex-col justify-between overflow-hidden rounded-2xl transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/30"
						>
							<img
								src={imgPath(item.background)}
								alt={item.name}
								class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								loading="lazy"
								decoding="async"
							/>
							<!-- Layered gradient: top vignette + bottom heavy -->
							<div
								class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/75"
							></div>
							<!-- Subtle color wash on hover -->
							<div
								class="absolute inset-0 bg-[#c6412c]/0 transition-colors duration-500 ease-out group-hover:bg-[#c6412c]/[0.07]"
							></div>
							<!-- Top-left shimmer line -->
							<div
								class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							></div>
							<div class="relative z-10 flex flex-col justify-end p-5 md:p-6">
								<item.icon class="h-8 w-8 text-yellow-400 drop-shadow-lg" />
								<h3 class="mt-2.5 text-lg font-bold tracking-tight text-zinc-100">{item.name}</h3>
							</div>
							<!-- Hover overlay -->
							<div
								class="duration-400 pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 p-5 opacity-0 backdrop-blur-sm transition-all ease-out group-hover:opacity-100"
							>
								<p
									class="max-w-sm translate-y-2 text-center text-sm leading-relaxed text-zinc-200 transition-transform duration-500 ease-out group-hover:translate-y-0"
								>
									{item.description}
								</p>
								<div
									class="mt-4 flex translate-y-2 items-center gap-1.5 text-xs font-bold tracking-wide text-yellow-400 transition-transform delay-75 duration-500 ease-out group-hover:translate-y-0"
								>
									{item.cta}
									<ArrowRightIcon class="h-3.5 w-3.5" />
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
					target="_blank"
					rel="noopener noreferrer"
					class="favorite-card group relative flex h-full flex-col justify-between overflow-hidden"
					use:inview={{
						rootMargin: '-60px',
						unobserveOnEnter: true
					}}
					oninview_change={({ detail }) => {
						if (detail.inView) {
							detail.node.style.opacity = '1';
							detail.node.style.transform = 'translateY(0)';
						}
					}}
					style:opacity="0"
					style:transform="translateY(20px)"
					style:transition="opacity 0.7s ease {delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) {delay}s"
				>
					<div
						class="favorite-card-inner relative flex h-full flex-col justify-between overflow-hidden rounded-2xl transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/30"
					>
						<img
							src={imgPath(item.background)}
							alt={item.name}
							class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
							loading="lazy"
							decoding="async"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/75"
						></div>
						<div
							class="absolute inset-0 bg-[#c6412c]/0 transition-colors duration-500 ease-out group-hover:bg-[#c6412c]/[0.07]"
						></div>
						<div
							class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>
						<div class="relative z-10 flex flex-col justify-end p-5 md:p-6">
							<item.icon class="h-8 w-8 text-yellow-400 drop-shadow-lg" />
							<h3 class="mt-2.5 text-lg font-bold tracking-tight text-zinc-100">{item.name}</h3>
						</div>
						<div
							class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 p-5 opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:opacity-100"
						>
							<p
								class="max-w-sm translate-y-2 text-center text-sm leading-relaxed text-zinc-200 transition-transform duration-500 ease-out group-hover:translate-y-0"
							>
								{item.description}
							</p>
							<div
								class="mt-4 flex translate-y-2 items-center gap-1.5 text-xs font-bold tracking-wide text-yellow-400 transition-transform duration-500 ease-out group-hover:[&]:translate-y-0"
							>
								{item.cta}
								<ArrowRightIcon class="h-3.5 w-3.5" />
							</div>
						</div>
					</div>
				</a>
			{/if}
		{/each}
	</div>
</section>

<style>
	.favorite-card {
		display: block;
		outline: none;
	}

	.favorite-card-inner {
		will-change: transform;
	}

	.favorite-card:focus-visible .favorite-card-inner {
		ring: 2px solid rgba(198, 65, 44, 0.5);
		ring-offset: 2px;
	}
</style>
