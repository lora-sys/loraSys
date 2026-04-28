<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		className?: string;
		children?: import('svelte').Snippet;
	}

	let { className, children }: Props = $props();
</script>

<div
	class={cn('mx-auto grid max-w-7xl auto-rows-[28rem] grid-cols-1 gap-4 md:grid-cols-3', className)}
>
	{@render children?.()}
</div>
