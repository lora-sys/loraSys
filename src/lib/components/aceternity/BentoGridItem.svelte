<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		className?: string;
		title?: string;
		description?: string;
		children?: import('svelte').Snippet;
		header?: import('svelte').Snippet;
		icon?: import('svelte').Snippet;
	}

	let { className, title, description, children, header, icon }: Props = $props();
</script>

<div
	class={cn(
		'group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-transparent bg-card p-4 shadow-sm transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none',
		className
	)}
>
	{#if header}{@render header()}{:else}
		<div
			class="min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"
		></div>
	{/if}
	<div class="transition duration-200 group-hover/bento:translate-x-2">
		{#if icon}{@render icon()}{/if}
		{#if title}
			<div class="mb-2 mt-2 font-serif text-xl font-bold text-foreground">
				{title}
			</div>
		{/if}
		{#if description}
			<div class="text-sm text-muted-foreground">
				{description}
			</div>
		{/if}
		{@render children?.()}
	</div>
</div>
