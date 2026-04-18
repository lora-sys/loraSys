<script lang="ts">
	interface Props {
		title?: string;
		href?: string;
	}

	let { title, href }: Props = $props();
</script>

<div
	class="pointer-events-none z-[60] flex h-80 w-96 items-center justify-center opacity-0 transition duration-500 group-hover/pin:opacity-100"
>
	<div class=" inset-0 -mt-7 h-full w-full flex-none">
		<div class="absolute inset-x-0 top-0 flex justify-center">
			{#if href}
				<a
					{href}
					target={'_blank'}
					rel="noopener noreferrer"
					class="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10"
				>
					<span class="relative z-20 inline-block py-0.5 text-xs font-bold text-white">
						{title}
					</span>
				</a>
			{/if}
		</div>

		<div
			class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
			style="perspective: 1000px; transform: rotateX(70deg) translateZ(0);"
		>
			<div
				class="animate-ping-perspective absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
			></div>
		</div>
	</div>
</div>

<style>
	@keyframes ping-perspective {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1);
		}
	}
	.animate-ping-perspective {
		animation: ping-perspective 6s ease-out infinite;
	}
</style>
