<script lang="ts">
	interface Props {
		className?: string;
		children?: import('svelte').Snippet;
	}
	let { className, children }: Props = $props();
</script>

<p class={className ?? 'text-sm text-[#a9a9a9]'}>
	{@render children?.()}
</p>
