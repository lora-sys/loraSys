<script lang="ts">
	// Typewriter reveal — Round 2 will wire svelte-typewriter
	interface Props {
		text: string;
		speed?: number;
	}
	let { text, speed = 60 }: Props = $props();
	let shown = $state('');
	$effect(() => {
		shown = text;
	});
</script>

<span class="voice">{shown}</span>

<style>
	.voice {
		font-family: inherit;
		color: inherit;
	}
</style>