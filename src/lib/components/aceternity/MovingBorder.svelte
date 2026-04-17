<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		duration?: number;
		rx?: string;
		ry?: string;
		children?: import('svelte').Snippet;
	}

	let { duration = 2000, rx = '0', ry = '0', children }: Props = $props();

	let pathElement: SVGRectElement;
	let progress = $state(0);
	let animationFrameId: number;

	onMount(() => {
		const animate = (time: number) => {
			if (!pathElement) return;
			const length = pathElement.getTotalLength();
			const pxPerMillisecond = length / duration;
			const newProgress = (time * pxPerMillisecond) % length;
			progress = newProgress === 0 ? 0 : newProgress;
			animationFrameId = requestAnimationFrame(animate);
		};
		animationFrameId = requestAnimationFrame(animate);
	});

	onDestroy(() => {
		if (typeof cancelAnimationFrame === 'function') {
			cancelAnimationFrame(animationFrameId);
		}
	});

	let x = $derived.by(() => {
		if (!pathElement) return 0;
		const point = pathElement.getPointAtLength(progress);
		return point.x;
	});

	let y = $derived.by(() => {
		if (!pathElement) return 0;
		const point = pathElement.getPointAtLength(progress);
		return point.y;
	});
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	preserveAspectRatio="none"
	class="absolute h-full w-full"
	width="100%"
	height="100%"
>
	<rect bind:this={pathElement} fill="none" width="100%" height="100%" {rx} {ry} />
</svg>

<div
	class="pointer-events-none absolute left-0 top-0"
	style="transform: translateX({x}px) translateY({y}px) translateX(-50%) translateY(-50%)"
>
	{@render children?.()}
</div>
