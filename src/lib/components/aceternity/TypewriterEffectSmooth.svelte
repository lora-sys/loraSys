<script lang="ts">
	import { cn } from '$lib/utils';

	interface Word {
		text: string;
		className?: string;
	}

	interface Props {
		words: Word[];
		className?: string;
		cursorClassName?: string;
	}

	let { words, className, cursorClassName }: Props = $props();

	const wordsArray = $derived(
		words.map((word) => ({
			...word,
			text: word.text.split('')
		}))
	);

	let containerRef: HTMLDivElement;
	let mounted = $state(false);

	$effect(() => {
		mounted = true;
		if (!containerRef) return;

		const bars = containerRef.querySelectorAll<HTMLElement>('.typewriter-bar');
		let charIndex = 0;
		let wordIndex = 0;

		const interval = setInterval(() => {
			if (wordIndex >= wordsArray.length) {
				clearInterval(interval);
				return;
			}

			const currentWord = wordsArray[wordIndex];
			if (charIndex < currentWord.text.length) {
				const bar = bars[wordIndex * 2]; // every other element is a char
				if (bar) {
					bar.style.opacity = '1';
				}
				charIndex++;
			} else {
				charIndex = 0;
				wordIndex++;
			}
		}, 80);

		return () => clearInterval(interval);
	});
</script>

<div class={cn('my-6 flex space-x-1', className)}>
	<div bind:this={containerRef} class="flex overflow-hidden">
		{#each wordsArray as word, wordIdx (wordIdx)}
			<div class="inline-block">
				{#each word.text as char, charIdx (charIdx)}
					<span
						class="typewriter-bar text-black opacity-0 dark:text-white {word.className ?? ''}"
						style="transition: opacity 0.1s ease {charIdx * 0.05}s;"
					>
						{char}
					</span>
				{/each}
				&nbsp;
			</div>
		{/each}
	</div>

	{#if mounted}
		<span
			class={cn(
				'inline-block h-4 w-[4px] animate-pulse rounded-sm bg-blue-500 md:h-6 lg:h-10',
				cursorClassName
			)}
		></span>
	{/if}
</div>
