<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';

	let { status, error }: { status?: number; error?: Error & { frame?: string } } = $props();

	// Fall back to $page store if props not passed (SvelteKit 2 compat)
	let effectiveStatus = $derived(status ?? $page.status);
	let effectiveError = $derived(error?.message ?? $page.error?.message ?? 'Unknown error');

	const errorTitle = $derived(effectiveStatus === 404 ? 'Page Not Found' : 'Internal Server Error');
	const errorIcon = $derived(effectiveStatus === 404 ? '404' : '500');
	const errorHint = $derived(
		effectiveStatus === 404
			? 'The page you are looking for does not exist.'
			: 'Something went wrong on our end.'
	);

	let typedText = $state('');
	let showCursor = $state(true);
	let showNav = $state(false);
	let fullMessage = $derived(`$ ${effectiveStatus} ${errorTitle} // ${effectiveError}`);

	$effect(() => {
		let i = 0;
		let interval = setInterval(() => {
			if (i < fullMessage.length) {
				typedText += fullMessage[i];
				i++;
			} else {
				clearInterval(interval);
				showNav = true;
			}
		}, 20);
		return () => clearInterval(interval);
	});

	$effect(() => {
		if (showNav) {
			let blink = setInterval(() => {
				showCursor = !showCursor;
			}, 530);
			return () => clearInterval(blink);
		}
	});
</script>

<svelte:head>
	<title>{effectiveStatus} | {errorTitle}</title>
	<meta name="description" content={errorHint} />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[#07070a] p-4">
	<!-- Terminal Window -->
	<div
		class="w-full max-w-lg overflow-hidden rounded-lg border border-zinc-800 bg-[#111116] shadow-2xl shadow-emerald-500/5"
	>
		<!-- Title Bar -->
		<div class="flex items-center gap-2 border-b border-zinc-800 bg-[#0c0c12] px-4 py-3">
			<div class="flex items-center gap-1.5">
				<span class="size-2.5 rounded-full bg-red-500/80"></span>
				<span class="size-2.5 rounded-full bg-yellow-500/80"></span>
				<span class="size-2.5 rounded-full bg-emerald-500/80"></span>
			</div>
			<span class="ml-3 font-mono text-[10px] text-zinc-500">error.log — {effectiveStatus}</span>
		</div>

		<!-- Terminal Body -->
		<div class="space-y-6 p-6 font-mono">
			<!-- Error icon / ASCII art -->
			<div class="flex justify-center">
				<pre class="font-pixel-square leading-tight text-emerald-400/90">
					{#if effectiveStatus === 404}
						<span class="block text-center text-xs leading-relaxed sm:text-sm"
							>{`    ██████╗  ██████╗ ██╗  ██╗
    ╚══██╔╝ ██╔═══╝ ██║  ██║
      ██║   ██║     ███████║
      ██║   ██║     ╚══██║
      ██║   ╚██████╗   ██║
      ╚═╝    ╚═════╝   ╚═╝`}</span
						>
					{:else}
						<span class="block text-center text-xs leading-relaxed sm:text-sm"
							>{`    ███████╗ ██████╗  ██████╗
    ██╔════╝██╔═══██╗██╔══██╗
    ███████╗██║   ██║██████╔╝
    ╚════██║██║   ██║██╔══██╗
    ███████║╚██████╔╝██║  ██║
    ╚══════╝ ╚═════╝ ╚═╝  ╚═╝`}</span
						>
					{/if}
				</pre>
			</div>

			<!-- Status code badge -->
			<div class="flex justify-center">
				<span
					class="inline-block rounded border border-zinc-700 bg-zinc-900/50 px-4 py-1 font-pixel-square text-2xl font-bold text-zinc-100 sm:text-3xl"
				>
					{errorIcon}
				</span>
			</div>

			<!-- Typing animation -->
			<div class="rounded border border-zinc-800 bg-zinc-900/30 p-4">
				<div class="flex items-start gap-2">
					<span class="text-emerald-400">&gt;</span>
					<div class="flex-1">
						<span class="text-zinc-300">{typedText}</span>
						{#if showCursor}
							<span class="inline-block h-4 w-2 bg-emerald-400 align-text-bottom"></span>
						{/if}
					</div>
				</div>
				{#if showNav}
					<div class="mt-2 flex items-center gap-2 text-zinc-500">
						<span class="text-emerald-400">$</span>
						<span class="text-zinc-400">exit </span>
						<a
							href={base + '/'}
							class="text-emerald-400 underline decoration-emerald-400/30 underline-offset-2 transition-colors hover:decoration-emerald-400"
						>
							cd ~
						</a>
					</div>
				{/if}
			</div>

			<!-- Navigation link -->
			{#if showNav}
				<div class="flex justify-center pt-2" in:fade>
					<a
						href={base + '/'}
						class="group inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-6 py-2.5 font-pixel-square text-sm text-emerald-400 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_12px_rgba(52,211,153,0.12)]"
					>
						<span class="text-zinc-500 group-hover:text-emerald-400">$</span>
						cd ~/home
						<span class="inline-block animate-pulse text-zinc-500">_</span>
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
