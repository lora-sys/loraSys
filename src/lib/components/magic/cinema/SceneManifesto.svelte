<script lang="ts">
	import ScrollScene from '$lib/components/magic/cinema/ScrollScene.svelte';
	import SceneLabel from '$lib/components/magic/cinema/SceneLabel.svelte';
	import { DATA } from '$lib/data/resume';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<section id="about" class="relative isolate overflow-hidden py-24 md:py-40 {className}">
	<div class="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-10">
		<!-- LEFT: scene label + giant pull-quote -->
		<div class="md:col-span-7">
			<ScrollScene delay={0.05}>
				<SceneLabel prompt="scene=02" path="/manifesto" />
			</ScrollScene>

			<ScrollScene delay={0.15} y={32}>
				<blockquote
					class="mt-6 font-heading text-[clamp(2rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground"
				>
					<span class="text-emerald-400">"</span>Builder of evolving
					<span class="text-zinc-500 line-through decoration-zinc-700">ideas</span>
					<span class="bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-200 bg-clip-text text-transparent"
						>systems</span
					>. Always building, learning, and shipping.<span class="text-emerald-400">"</span>
				</blockquote>
			</ScrollScene>
		</div>

		<!-- RIGHT: meta stack -->
		<div class="flex flex-col gap-8 md:col-span-4 md:col-start-9 md:pt-12">
			<ScrollScene delay={0.25}>
				<dl class="grid grid-cols-2 gap-y-6 font-mono text-xs uppercase tracking-[0.18em]">
					<dt class="text-zinc-500">base</dt>
					<dd class="text-zinc-300">{DATA.location}</dd>

					<dt class="text-zinc-500">craft</dt>
					<dd class="text-zinc-300">full-stack · agents</dd>

					<dt class="text-zinc-500">focus</dt>
					<dd class="text-zinc-300">AI · Web3 · DX</dd>

					<dt class="text-zinc-500">repos</dt>
					<dd class="text-emerald-400">103+ public</dd>

					<dt class="text-zinc-500">hackathons</dt>
					<dd class="text-emerald-400">Monad · ETH Beijing</dd>
				</dl>
			</ScrollScene>

			<ScrollScene delay={0.4}>
				<div
					class="prose prose-invert max-w-full text-pretty font-mono text-sm leading-relaxed text-zinc-400 prose-a:font-bold prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline"
				>
					{@html DATA.summaryHtml}
				</div>
			</ScrollScene>
		</div>
	</div>

	<!-- Page index strip -->
	<div
		class="mx-auto mt-16 flex w-full max-w-[1400px] items-center justify-between border-t border-zinc-800/40 px-6 pt-6 font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600 md:px-10"
	>
		<span>02 / 06</span>
		<span>scroll → work</span>
	</div>
</section>