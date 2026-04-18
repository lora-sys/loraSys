<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		magnification?: number;
		distance?: number;
		mouseX?: number;
		class?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let {
		magnification = 60,
		distance = 160,
		mouseX = Infinity,
		class: className = '',
		children
	}: Props = $props();

	let iconElement: HTMLDivElement | undefined = $state();

	// Calculate distance from mouse and scale accordingly
	let scale = $derived.by(() => {
		if (!iconElement || mouseX === Infinity) return 1;
		const rect = iconElement.getBoundingClientRect();
		const iconCenterX = rect.left + rect.width / 2;
		const dist = Math.abs(mouseX - iconCenterX);
		const maxDist = distance;
		const factor = Math.max(0, 1 - dist / maxDist);
		// Scale from 1 to magnification/38 with factor
		return 1 + (factor * (magnification - 38)) / 38;
	});

	let iconClass = $derived(
		cn(
			'flex aspect-square cursor-pointer items-center justify-center rounded-full transition-all duration-150 ease-out',
			className
		)
	);

	const children_render = $derived(children);
</script>

<div
	bind:this={iconElement}
	class={iconClass}
	style:transform="scale({scale})"
	style:width="{scale * 38}px"
	style:height="{scale * 38}px"
>
	{@render children_render?.()}
</div>
