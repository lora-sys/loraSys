<script lang="ts">
	interface Props {
		className?: string;
	}

	let { className }: Props = $props();

	const stars = Array.from({ length: 140 }, (_, i) => ({
		id: i,
		top: Math.random() * 100,
		left: Math.random() * 100,
		delay: Math.random() * 20,
		duration: Math.random() * 10 + 20,
		size: 2
	}));
</script>

<div class="absolute inset-0 z-40 {className}">
	{#each stars as star (star.id)}
		<span
			class="absolute inline-block rounded-full animate-star"
			style="
				top: {star.top}%;
				left: {star.left}%;
				width: {star.size}px;
				height: {star.size}px;
				animation-delay: {star.delay}s;
				animation-duration: {star.duration}s;
			"
		></span>
	{/each}
</div>

<style>
	@keyframes star-float {
		0%,
		100% {
			opacity: 0;
			transform: translate(0, 0) scale(1);
		}
		25% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
			transform: translate(-10px, -15px) scale(1.2);
		}
		75% {
			opacity: 0.8;
		}
	}
	.animate-star {
		background-color: white;
		animation: star-float linear infinite;
	}
</style>
