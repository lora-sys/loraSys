<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
		class?: string;
		glowColor?: string;
	}

	let { children, class: className, glowColor = 'rgba(34,197,94,0.15)', ...props }: Props = $props();

	let mouseX = $state(0);
	let mouseY = $state(0);
	let isHovered = $state(false);

	function handleMouseMove(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		isHovered = true;
	}
</script>

<div
	class={cn(
		'group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5',
		className
	)}
	onmousemove={handleMouseMove}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	role="presentation"
	{...props}
>
	<!-- Glow effect that follows mouse -->
	{#if isHovered}
		<div
			class="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
			style="background: radial-gradient(250px circle at {mouseX}px {mouseY}px, {glowColor}, transparent 70%);"
		></div>
	{/if}

	<div class="relative z-10">
		{@render children()}
	</div>
</div>
