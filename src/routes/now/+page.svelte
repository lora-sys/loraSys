<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>/now — What Lora Sys Is Focused On Right Now</title>
	<meta
		name="description"
		content="Current focus of Lora Sys (Sikandar Bhide): what I'm shipping, learning, and exploring right now. The /now page is a living snapshot."
	/>
	<link rel="canonical" href="https://lora-sys.github.io/loraSys/now" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="/now — Lora Sys" />
	<meta
		property="og:description"
		content="Current focus of Lora Sys (Sikandar Bhide) — what I'm shipping, learning, and exploring right now."
	/>
	<meta property="og:url" content="https://lora-sys.github.io/loraSys/now" />
	<meta property="og:image" content="https://lora-sys.github.io/loraSys/og-cover.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="/now — Lora Sys" />
	<meta
		name="twitter:description"
		content="What I'm shipping, learning, and exploring right now."
	/>
</svelte:head>

<main class="relative min-h-screen pb-32 pt-32">
	<div class="mx-auto w-full max-w-[1400px] px-6 md:px-10">
		<!-- Scene label -->
		<div class="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-500">
			<span class="text-emerald-400">scene</span>=N / <span class="text-zinc-300">now</span>
		</div>

		<!-- Giant title with split composition -->
		<div class="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
			<h1
				class="font-heading text-[clamp(4rem,14vw,10rem)] font-bold leading-[0.86] tracking-[-0.04em] text-foreground md:col-span-8"
			>
				/now
				<span class="text-zinc-500">.live()</span>
			</h1>
			<div class="flex flex-col justify-end gap-4 md:col-span-4">
				<p class="font-heading text-lg leading-snug text-zinc-300 md:text-xl">
					A living snapshot — what I'm shipping, learning, and exploring right now.
				</p>
				<dl class="grid grid-cols-2 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em]">
					<dt class="text-zinc-500">updated</dt>
					<dd class="text-cyan-300">2026-07</dd>
					<dt class="text-zinc-500">cadence</dt>
					<dd class="text-zinc-300">monthly</dd>
				</dl>
			</div>
		</div>

		<div class="mt-16 border-t border-zinc-800/40"></div>

		<!-- Sections grid -->
		<div class="mt-12 grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-12">
			<!-- Currently Building -->
			<section class="md:col-span-6">
				<div class="flex items-baseline gap-3">
					<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
						01 /
					</span>
					<h2
						class="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
					>
						Building
					</h2>
				</div>
				<ul class="mt-6 space-y-4">
					<li class="group flex items-baseline gap-3">
						<span class="mt-1 font-mono text-emerald-400">→</span>
						<div>
							<div class="text-zinc-200 transition group-hover:text-cyan-300">
								lora-sys portfolio — this site
							</div>
							<div class="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
								active · daily
							</div>
						</div>
					</li>
					<li class="group flex items-baseline gap-3">
						<span class="mt-1 font-mono text-emerald-400">→</span>
						<div>
							<div class="text-zinc-200 transition group-hover:text-cyan-300">
								AI agent orchestration experiments
							</div>
							<div class="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
								active · weekly
							</div>
						</div>
					</li>
				</ul>
			</section>

			<!-- Currently Learning -->
			<section class="md:col-span-6">
				<div class="flex items-baseline gap-3">
					<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan-300">
						02 /
					</span>
					<h2
						class="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
					>
						Learning
					</h2>
				</div>
				<ul class="mt-6 space-y-4">
					<li class="group flex items-baseline gap-3">
						<span class="mt-1 font-mono text-cyan-300">→</span>
						<div>
							<div class="text-zinc-200 transition group-hover:text-cyan-300">
								Three.js + GLSL shaders
							</div>
							<div class="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
								depth · spatial
							</div>
						</div>
					</li>
					<li class="group flex items-baseline gap-3">
						<span class="mt-1 font-mono text-cyan-300">→</span>
						<div>
							<div class="text-zinc-200 transition group-hover:text-cyan-300">
								LangGraph + multi-agent systems
							</div>
							<div class="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
								agents · coordination
							</div>
						</div>
					</li>
				</ul>
			</section>

			<!-- Currently Reading -->
			<section class="md:col-span-6">
				<div class="flex items-baseline gap-3">
					<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-purple-400">
						03 /
					</span>
					<h2
						class="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
					>
						Reading
					</h2>
				</div>
				<ul class="mt-6 space-y-4">
					<li class="group flex items-baseline gap-3">
						<span class="mt-1 font-mono text-purple-300">→</span>
						<div>
							<div class="text-zinc-200 transition group-hover:text-cyan-300">
								Designing Data-Intensive Applications
							</div>
							<div class="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
								book · systems
							</div>
						</div>
					</li>
				</ul>
			</section>

			<!-- Currently Vibing -->
			<section class="md:col-span-6">
				<div class="flex items-baseline gap-3">
					<span class="font-mono text-[11px] uppercase tracking-[0.32em] text-amber-300">
						04 /
					</span>
					<h2
						class="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
					>
						Vibing
					</h2>
				</div>
				<ul class="mt-6 space-y-4">
					<li class="group flex items-baseline gap-3">
						<span class="mt-1 font-mono text-amber-300">→</span>
						<div>
							<div class="text-zinc-200 transition group-hover:text-cyan-300">
								Tame Impala — Currents
							</div>
							<div class="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
								music · on repeat
							</div>
						</div>
					</li>
				</ul>
			</section>
		</div>

		<!-- Back link + page index -->
		<div
			class="mt-24 flex items-center justify-between border-t border-zinc-800/40 pt-6"
		>
			<a
				href={base + '/'}
				class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-cyan-300"
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
			<span class="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-600">
				04 sections · last updated 2026-07
			</span>
		</div>
	</div>
</main>