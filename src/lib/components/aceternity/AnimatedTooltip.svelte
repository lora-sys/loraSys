<script lang="ts">
	import { cn } from '$lib/utils';

	interface TooltipItem {
		id: number;
		name: string;
		designation: string;
		image: string;
	}

	interface Props {
		items: TooltipItem[];
		className?: string;
	}

	let { items, className }: Props = $props();

	let hoveredIndex: number | null = $state(null);
	let containerEl: HTMLDivElement;
	let x = $state(0);

	function handleMouseMove(event: MouseEvent) {
		const target = event.currentTarget as HTMLElement;
		const halfWidth = target.offsetWidth / 2;
		x = event.offsetX - halfWidth;
	}
</script>

<div class={cn('group relative flex flex-row', className)}>
	{#each items as item, idx (item.name)}
		<div
			class="relative -mr-4"
			role="listitem"
			onmouseenter={() => (hoveredIndex = item.id)}
			onmouseleave={() => (hoveredIndex = null)}
			onmousemove={handleMouseMove}
		>
			{#if hoveredIndex === item.id}
				<div
					class="absolute -left-1/2 -top-16 z-50 flex flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
					style="transform: translateX(calc({x}px + 50%)) translateX(-50%);"
				>
					<div
						class="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
					></div>
					<div
						class="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent"
					></div>
					<p class="text-white">{item.name}</p>
					<p class="text-neutral-400">{item.designation}</p>
				</div>
			{/if}

			<img
				src={item.image}
				alt={item.name}
				class="h-12 w-12 rounded-full border-2 border-transparent object-cover transition duration-200 group-hover:border-white"
			/>
		</div>
	{/each}
</div>
