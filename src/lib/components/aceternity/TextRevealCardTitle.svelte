<script lang="ts">
	let { className, children }: Props = $props();
	interface Props {
		className?: string;
		children?: import('svelte').Snippet;
	}
</script>

<h2 class={className ?? 'mb-2 text-lg text-white'}>
	{@render children?.()}
</h2>
