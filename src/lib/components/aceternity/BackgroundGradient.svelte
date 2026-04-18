<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		className?: string;
		containerClassName?: string;
		animate?: boolean;
		children?: import('svelte').Snippet;
	}

	let { className, containerClassName, animate = true, children }: Props = $props();

	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});
</script>

<div class={cn('group relative p-[4px]', containerClassName)}>
	{#if animate && mounted}
		<div
			class="absolute inset-0 z-[1] rounded-3xl opacity-60 blur-xl transition duration-500 group-hover:opacity-100"
			style="background: radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316); background-size: 400% 400%; animation: gradient-shift 5s ease infinite reverse;"
		></div>
		<div
			class="absolute inset-0 z-[1] rounded-3xl"
			style="background: radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316); background-size: 400% 400%; animation: gradient-shift 5s ease infinite reverse;"
		></div>
	{/if}

	<div class={cn('relative z-10', className)}>
		{@render children?.()}
	</div>
</div>

<style>
	@keyframes gradient-shift {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
