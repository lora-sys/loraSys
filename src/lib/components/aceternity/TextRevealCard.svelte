<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import Stars from './Sparkles.svelte';

	interface Props {
		text: string;
		revealText: string;
		className?: string;
		children?: import('svelte').Snippet;
	}

	let { text, revealText, className, children }: Props = $props();

	let widthPercentage = $state(0);
	let cardRef: HTMLDivElement;
	let left = $state(0);
	let localWidth = $state(0);
	let isMouseOver = $state(false);

	onMount(() => {
		if (cardRef) {
			const rect = cardRef.getBoundingClientRect();
			left = rect.left;
			localWidth = rect.width;
		}
	});

	function mouseMoveHandler(event: MouseEvent) {
		event.preventDefault();
		const { clientX } = event;
		if (cardRef) {
			const relativeX = clientX - left;
			widthPercentage = Math.max(0, Math.min(100, (relativeX / localWidth) * 100));
		}
	}

	function mouseLeaveHandler() {
		isMouseOver = false;
		widthPercentage = 0;
	}
	function mouseEnterHandler() {
		isMouseOver = true;
	}

	const rotateDeg = $derived((widthPercentage - 50) * 0.1);
</script>

<div
	onmouseenter={mouseEnterHandler}
	onmouseleave={mouseLeaveHandler}
	onmousemove={mouseMoveHandler}
	bind:this={cardRef}
	class={cn(
		'relative w-[40rem] max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#1d1c20] p-8',
		className
	)}
>
	{@render children?.()}

	<div class="relative flex h-40 items-center overflow-hidden">
		<!-- Reveal text -->
		<div
			class="absolute z-20 bg-[#1d1c20] will-change-transform"
			style="
				width: 100%;
				clip-path: inset(0 {100 - widthPercentage}% 0 0);
				opacity: {isMouseOver ? (widthPercentage > 0 ? 1 : 0) : widthPercentage > 0 ? 1 : 0};
				transition: {isMouseOver ? 'none' : 'opacity 0.4s'};
			"
		>
			<p
				class="bg-gradient-to-b from-white to-neutral-300 bg-clip-text py-10 text-base font-bold text-transparent sm:text-[3rem]"
			>
				{revealText}
			</p>
		</div>

		<!-- Moving light bar -->
		<div
			class="absolute z-50 h-40 w-[8px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent will-change-transform"
			style="
				left: {widthPercentage}%;
				rotate: {rotateDeg}deg;
				opacity: {widthPercentage > 0 ? 1 : 0};
				transition: {isMouseOver ? 'none' : 'opacity 0.4s'};
			"
		></div>

		<!-- Main text -->
		<div
			class="overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]"
		>
			<p
				class="bg-[#323238] bg-clip-text py-10 text-base font-bold text-transparent sm:text-[3rem]"
			>
				{text}
			</p>
			<Stars />
		</div>
	</div>
</div>
