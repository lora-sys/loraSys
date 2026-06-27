<script lang="ts">
	import { page } from '$app/stores';
	import { DATA } from '$lib/data/resume';
	import Command from '$lib/components/magic/command/command.svelte';
	import { slide } from 'svelte/transition';
	import { base } from '$app/paths';

	let currentPath = $derived($page.url.pathname);
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ label: 'Home', href: `${base}/` },
		{ label: 'Blog', href: `${base}/blog` },
		{ label: 'Projects', href: `${base}/#projects` },
		{ label: 'Skills', href: `${base}/#skills` },
		{ label: 'About', href: `${base}/#about` },
		{ label: 'Contact', href: `${base}/#contact` }
	];

	function isActive(href: string): boolean {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header
	class="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-lg"
>
	<nav class="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
		<!-- Left: Logo + Breadcrumb -->
		<div class="flex items-center gap-6">
			<a
				href={base + '/'}
				class="font-mono font-pixel-square text-sm font-bold text-term-green transition-colors duration-200 hover:text-term-green/70"
			>
				{DATA.name}<span class="animate-pulse">_</span>
			</a>
			<ul class="hidden items-center gap-1 sm:flex">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							class="rounded-md px-3 py-1.5 font-mono text-xs transition-all duration-200
								{isActive(item.href)
								? 'bg-term-green/10 text-term-green'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Right: Path indicator + Command + Hamburger -->
		<div class="flex items-center gap-3">
			<span class="hidden font-mono text-xs text-muted-foreground md:block">
				~{currentPath}
			</span>
			<Command />
			<!-- Hamburger (mobile only) -->
			<button
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
				class="flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-card/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if mobileMenuOpen}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					{/if}
				</svg>
			</button>
		</div>
	</nav>

	<!-- Mobile dropdown menu -->
	{#if mobileMenuOpen}
		<div
			class="border-t border-border/40 bg-background/95 backdrop-blur-lg sm:hidden"
			transition:slide={{ duration: 200 }}
		>
			<ul class="flex flex-col px-6 py-2">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							onclick={closeMobileMenu}
							class="block rounded-md px-3 py-2.5 font-mono text-sm transition-all duration-200
								{isActive(item.href)
								? 'bg-term-green/10 text-term-green'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</header>
