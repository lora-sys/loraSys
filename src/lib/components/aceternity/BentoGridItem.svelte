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
		'group/bento relative row-span-1 flex h-full cursor-pointer flex-col justify-between space-y-4 overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50',
		className
	)}
>
	{#if header}{@render header()}{:else}
		<div
			class="min-h-[8rem] w-full flex-1 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 transition-all duration-300 group-hover/bento:scale-105"
		></div>
	{/if}
	<div class="transition-all duration-300 group-hover/bento:translate-x-1">
		{#if icon}{@render icon()}{/if}
		{#if title}
			<div
				class="mb-3 mt-2 font-sans text-xl font-bold text-foreground transition-colors duration-300 group-hover/bento:text-primary"
			>
				{title}
			</div>
		{/if}
		{#if description}
			<div class="text-sm leading-relaxed text-muted-foreground">
				{description}
			</div>
		{/if}
		{@render children?.()}
	</div>
</div>
