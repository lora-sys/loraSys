<script lang="ts">
	import { DATA } from '$lib/data/resume';
	import Dock from '../magic/Dock.svelte';
	import DockIcon from '../magic/DockIcon.svelte';
	import DockTooltip from '../magic/DockTooltip.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ModeToggle from './ModeToggle.svelte';
</script>

<div
	class="pointer-events-none fixed inset-x-0 bottom-10 z-30 mx-auto mb-4 flex h-full max-h-14 origin-bottom"
>
	<div
		class="fixed inset-x-0 bottom-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"
	></div>
	<Dock
		class="pointer-events-auto relative z-50 mx-auto flex h-full min-h-full transform-gpu items-center gap-2 rounded-full border border-border/50 bg-card/80 px-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-card hover:shadow-[0_0_30px_hsl(45_100%_70%_/0.1)] sm:gap-3 md:gap-4"
	>
		{#snippet children({ magnification, distance, mouseX })}
			{#each DATA.navbar as item}
				<DockIcon {magnification} {mouseX} {distance}>
					<DockTooltip label={item.label}>
						<a
							href={item.href}
							class="flex size-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:bg-gold/20 hover:text-gold hover:shadow-[0_0_15px_hsl(45_100%_70%_/0.3)] focus-visible:ring-2 focus-visible:ring-gold/50"
						>
							<item.icon class="size-[18px]" strokeWidth={1.5} />
						</a>
					</DockTooltip>
				</DockIcon>
			{/each}
			<Separator orientation="vertical" class="h-full" />
			{#each Object.entries(DATA.contact.social)
				.filter(([_, social]) => social.navbar)
				.map(([_, social]) => social) as social}
				<DockIcon {magnification} {mouseX} {distance}>
					<DockTooltip label={social.name}>
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex size-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:bg-gold/20 hover:shadow-[0_0_15px_hsl(45_100%_70%_/0.3)] focus-visible:ring-2 focus-visible:ring-gold/50"
						>
							{#if social?.dark_icon}
								<img src={social.icon} class="size-[18px] dark:hidden" alt={social.name} />
								<img
									src={social.dark_icon}
									class="hidden size-[18px] dark:block"
									alt={social.name}
								/>
							{:else}
								<img src={social.icon} class="size-[18px]" alt={social.name} />
							{/if}
						</a>
					</DockTooltip>
				</DockIcon>
			{/each}
			<Separator orientation="vertical" class="h-full py-2" />
			<DockIcon {magnification} {mouseX} {distance}>
				<ModeToggle />
			</DockIcon>
		{/snippet}
	</Dock>
</div>
