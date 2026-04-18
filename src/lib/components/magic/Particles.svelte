<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	// Generate 50 particle positions once
	const particles = Array.from({ length: 50 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 3 + 1,
		opacity: Math.random() * 0.5 + 0.1,
		delay: Math.random() * 8,
		duration: Math.random() * 10 + 8
	}));
</script>

<div class={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
	{#each particles as p (p.id)}
		<div
			class="absolute rounded-full"
			style="
				left: {p.x}%;
				top: {p.y}%;
				width: {p.size}px;
				height: {p.size}px;
				opacity: {p.opacity};
				background: hsl(45 100% 70% / 0.4);
				animation: particle-float {p.duration}s {p.delay}s ease-in-out infinite;
				will-change: transform, opacity;
			"
		></div>
	{/each}
</div>

<style>
	@keyframes particle-float {
		0%,
		100% {
			transform: translateY(0) scale(1);
			opacity: 0.3;
		}
		25% {
			transform: translateY(-20px) scale(1.1);
			opacity: 0.6;
		}
		50% {
			transform: translateY(-10px) scale(0.95);
			opacity: 0.4;
		}
		75% {
			transform: translateY(-30px) scale(1.05);
			opacity: 0.5;
		}
	}
</style>
