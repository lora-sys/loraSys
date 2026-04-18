<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	interface Testimonial {
		quote: string;
		name: string;
		title: string;
	}

	interface Props {
		items: Testimonial[];
		direction?: 'left' | 'right';
		speed?: 'fast' | 'normal' | 'slow';
		pauseOnHover?: boolean;
		className?: string;
	}

	let {
		items,
		direction = 'left',
		speed = 'fast',
		pauseOnHover = true,
		className
	}: Props = $props();

	let containerRef: HTMLDivElement;
	let scrollerRef: HTMLUListElement;
	let isPaused = $state(false);

	const speedMap = { fast: '20s', normal: '40s', slow: '80s' };

	onMount(() => {
		if (containerRef && scrollerRef) {
			const scrollerContent = Array.from(scrollerRef.children);
			scrollerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true);
				if (scrollerRef) {
					scrollerRef.appendChild(duplicatedItem);
				}
			});
			if (containerRef) {
				containerRef.style.setProperty(
					'--animation-direction',
					direction === 'left' ? 'forwards' : 'reverse'
				);
				containerRef.style.setProperty('--animation-duration', speedMap[speed]);
			}
		}
	});
</script>

<div
	bind:this={containerRef}
	class={cn('relative z-20 overflow-hidden', className)}
	onmouseenter={() => (isPaused = true)}
	onmouseleave={() => (isPaused = false)}
>
	<ul
		bind:this={scrollerRef}
		class={cn(
			'flex min-h-full gap-4 py-4',
			isPaused ? '' : 'animate-scroll',
			direction === 'left' ? 'flex-row' : 'flex-row-reverse'
		)}
		style="--animation-duration: {speedMap[speed]}; --animation-direction: {direction === 'left'
			? 'forwards'
			: 'reverse'};"
	>
		{#each items as item, idx (`item-${idx}`)}
			<li
				class="relative w-[350px] max-w-full flex-shrink-0 rounded-2xl border border-border bg-card p-6 shadow-sm"
			>
				<blockquote>
					<p class="mb-4 text-sm text-foreground">{item.quote}</p>
					<footer class="mt-4">
						<p class="font-semibold text-foreground">{item.name}</p>
						<p class="text-xs text-muted-foreground">{item.title}</p>
					</footer>
				</blockquote>
			</li>
		{/each}
	</ul>
</div>

<style>
	@keyframes scroll {
		to {
			transform: translateX(calc(-50% - 0.5rem));
		}
	}
	.animate-scroll {
		animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear
			infinite;
	}
</style>
