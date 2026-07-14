<script lang="ts">
	// Typewriter reveal — wired with svelte-typewriter
	import Typewriter from 'svelte-typewriter';

	interface Props {
		text: string;
		speed?: number;
	}
	let { text, speed = 50 }: Props = $props();

	let key = $derived(text);
</script>

{#key key}
	<Typewriter {speed} cursor={false}>
		{text}
	</Typewriter>
{/key}