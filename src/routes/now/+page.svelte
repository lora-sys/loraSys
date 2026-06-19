<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>/now — lora</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-20">
	<div class="mb-8 inline-flex items-center gap-2 font-mono font-pixel-square text-xs">
		<span class="text-emerald-400">$</span>
		<span class="text-zinc-400">cat /now</span>
	</div>

	<h1
		class="font-mono font-pixel-square text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
	>
		/now
	</h1>
	<p class="mt-2 font-mono text-sm text-zinc-500">Last updated: June 2026</p>

	<div class="mt-12 space-y-10">
		<section>
			<h2 class="font-mono text-sm font-bold uppercase tracking-wider text-emerald-400">
				Currently Building
			</h2>
			<ul class="mt-4 space-y-3 font-mono text-sm text-zinc-400">
				<li class="flex items-start gap-3">
					<span class="mt-1 text-emerald-400">&rarr;</span>
					<span>lora-sys portfolio — personal website</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 text-emerald-400">&rarr;</span>
					<span>More projects coming soon...</span>
				</li>
			</ul>
		</section>

		<section>
			<h2 class="font-mono text-sm font-bold uppercase tracking-wider text-emerald-400">
				Currently Learning
			</h2>
			<ul class="mt-4 space-y-3 font-mono text-sm text-zinc-400">
				<li class="flex items-start gap-3">
					<span class="mt-1 text-emerald-400">&rarr;</span>
					<span>AI Agents, Web3, and full-stack development</span>
				</li>
			</ul>
		</section>

		<section>
			<h2 class="font-mono text-sm font-bold uppercase tracking-wider text-emerald-400">
				Currently Reading
			</h2>
			<ul class="mt-4 space-y-3 font-mono text-sm text-zinc-400">
				<li class="flex items-start gap-3">
					<span class="mt-1 text-emerald-400">&rarr;</span>
					<span>To be updated...</span>
				</li>
			</ul>
		</section>
	</div>

	<div class="mt-16 border-t border-zinc-800 pt-8">
		<a
			href={base + '/'}
			class="inline-flex items-center gap-2 font-mono text-sm text-zinc-500 transition-colors hover:text-emerald-400"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m12 19-7-7 7-7" />
				<path d="M19 12H5" />
			</svg>
			cd ..
		</a>
	</div>
</div>
