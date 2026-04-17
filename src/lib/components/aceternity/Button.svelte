<script lang="ts">
	import { cn } from '$lib/utils';
	import MovingBorder from './MovingBorder.svelte';

	interface Props {
		borderRadius?: string;
		containerClassName?: string;
		borderClassName?: string;
		duration?: number;
		className?: string;
		children?: import('svelte').Snippet;
	}

	let {
		borderRadius = '1.75rem',
		containerClassName,
		borderClassName,
		duration = 2000,
		className,
		children
	}: Props = $props();
</script>

<button
	class={cn(
		'relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl',
		containerClassName
	)}
	style="border-radius: {borderRadius};"
>
	<div class="absolute inset-0" style="border-radius: calc({borderRadius} * 0.96);">
		<MovingBorder {duration} rx="30%" ry="30%">
			<div
				class={cn(
					'h-20 w-20 bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)] opacity-[0.8]',
					borderClassName
				)}
			></div>
		</MovingBorder>
	</div>

	<div
		class={cn(
			'relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl',
			className
		)}
		style="border-radius: calc({borderRadius} * 0.96);"
	>
		{@render children?.()}
	</div>
</button>
