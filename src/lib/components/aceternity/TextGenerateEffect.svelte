<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		words: string;
		className?: string;
	}

	let { words, className }: Props = $props();

	const wordsArray = $derived(words.match(/[^\s]+(?:\s+|$)/g) ?? []);
</script>

<div class={cn('font-bold', className)}>
	<div class="mt-4">
		<div class="text-2xl leading-snug tracking-wide text-foreground whitespace-pre-wrap">
			{#each wordsArray as token, idx (idx)}
				<span
					class="animate-text-reveal inline opacity-0"
					style="animation-delay: {idx * 0.15}s"
				>
					{token}
				</span>
			{/each}
		</div>
	</div>
</div>

<style>
	@keyframes text-reveal {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.animate-text-reveal {
		animation: text-reveal 2s ease-out forwards;
	}
</style>
