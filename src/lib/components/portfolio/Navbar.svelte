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
		class="pointer-events-auto relative z-50 mx-auto flex h-full min-h-full transform-gpu items-center gap-0.5 rounded-full bg-background px-1 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] sm:gap-1 md:gap-2 "
	>
		{#snippet children({ magnification, distance, mouseX })}
			{#each DATA.navbar as item}
				<DockIcon {magnification} {mouseX} {distance}>
					<DockTooltip label={item.label}>
						<a
							href={item.href}
							class="flex size-12 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
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
							class="flex size-12 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
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
