<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		prompt?: string;
		path?: string;
		tone?: 'green' | 'magenta' | 'amber';
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		prompt = '$',
		path,
		tone = 'green',
		class: _class = '',
		children
	}: Props = $props();

	const toneClass = $derived(
		tone === 'magenta'
			? 'text-[hsl(330_85%_65%)]'
			: tone === 'amber'
				? 'text-[hsl(45_100%_70%)]'
				: 'text-[hsl(var(--term-green))]'
	);
</script>

<div
	class={cn(
		'inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500',
		_class
	)}
>
	<span class={toneClass}>{prompt}</span>
	{#if path}
		<span class="text-zinc-400">{path}</span>
	{/if}
	{#if children}
		<span class="text-zinc-300">@render</span>
		{@render children()}
	{/if}
</div>