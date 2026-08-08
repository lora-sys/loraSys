<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import ModeToggle from './ModeToggle.svelte';
	import TerminalEasterEgg from './TerminalEasterEgg.svelte';

	type Link = { label: string; href: string; id?: string; route?: string };
	const links: Link[] = [
		{ label: '关于我', href: `${base}/#self`, id: 'self' },
		{ label: '技艺', href: `${base}/#skills`, id: 'skills' },
		{ label: '经历', href: `${base}/#exp`, id: 'exp' },
		{ label: '作品', href: `${base}/#work`, id: 'work' },
		{ label: '闯关', href: `${base}/#hack`, id: 'hack' },
		{ label: '闲余', href: `${base}/#off`, id: 'off' },
		{ label: '日志', href: `${base}/blog`, route: '/blog' },
		{ label: '当下', href: `${base}/now`, route: '/now' },
		{ label: '联络', href: `${base}/#contact`, id: 'contact' }
	];

	let active = $state('');
	let scrolled = $state(false);
	let menuOpen = $state(false);
	let showTerminal = $state(false);

	onMount(() => {
		const onScroll = () => (scrolled = window.scrollY > 40);
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		let io: IntersectionObserver | undefined;
		if ($page.url.pathname === '/') {
			const secs = links
				.filter((l) => l.id)
				.map((l) => document.getElementById(l.id!))
				.filter((el): el is HTMLElement => !!el);
			io = new IntersectionObserver(
				(entries) => {
					for (const e of entries) if (e.isIntersecting) active = e.target.id;
				},
				{ rootMargin: '-45% 0px -50% 0px' }
			);
			secs.forEach((s) => io!.observe(s));
		}
		return () => {
			window.removeEventListener('scroll', onScroll);
			io?.disconnect();
		};
	});

	function isActive(l: Link): boolean {
		if (l.route) return $page.url.pathname.startsWith(l.route);
		return $page.url.pathname === '/' && active === l.id;
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	// Close mobile menu on Escape key
	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && menuOpen) closeMenu();
			if (e.ctrlKey && e.shiftKey && e.key === 'T') {
				e.preventDefault();
				showTerminal = true;
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<nav class="nav" class:scrolled aria-label="Primary">
	<a class="brand" href="{base}/" aria-label="lora — home">
		lora<span class="seal-dot" aria-hidden="true"></span>
	</a>

	<!-- Hamburger button (mobile only) -->
	<button
		class="hamburger"
		class:open={menuOpen}
		onclick={toggleMenu}
		aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
		aria-expanded={menuOpen}
		aria-controls="mobile-menu"
	>
		<span class="hamburger-line"></span>
		<span class="hamburger-line"></span>
		<span class="hamburger-line"></span>
	</button>

	<!-- Desktop links -->
	<div class="links desktop-only">
		{#each links as l}
			<a href={l.href} class:on={isActive(l)} onclick={closeMenu}>{l.label}</a>
		{/each}
	</div>

	<!-- Mobile menu -->
	<div class="mobile-menu" id="mobile-menu" class:open={menuOpen} role="menu">
		<div class="mobile-menu-inner">
			{#each links as l}
				<a
					href={l.href}
					class="mobile-link"
					class:on={isActive(l)}
					onclick={closeMenu}
					role="menuitem"
				>
					{l.label}
				</a>
			{/each}
			<div class="mobile-mode">
				<ModeToggle />
			</div>
		</div>
	</div>

	<!-- Desktop mode toggle -->
	<div class="desktop-mode">
		<ModeToggle />
	</div>
</nav>

<!-- CLI Terminal Easter Egg (client-only) -->
{#if typeof window !== 'undefined'}
	<TerminalEasterEgg bind:visible={showTerminal} />
{/if}

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 45;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		height: 52px;
		padding: 0 clamp(16px, 5vw, 72px);
		background: transparent;
		transition:
			background 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
		border-bottom: 1px solid transparent;
	}
	.nav.scrolled {
		background: color-mix(in srgb, var(--paper) 92%, transparent);
		-webkit-backdrop-filter: blur(12px) saturate(1.2);
		backdrop-filter: blur(12px) saturate(1.2);
		border-bottom-color: var(--ink-line);
	}
	.brand {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: 1.35rem;
		letter-spacing: -0.02em;
		color: var(--ink);
		display: inline-flex;
		align-items: center;
		gap: 7px;
		flex: 0 0 auto;
		opacity: 0;
		transform: translateY(-4px);
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}
	.nav.scrolled .brand {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}
	.seal-dot {
		width: 8px;
		height: 8px;
		background: var(--zhu);
		border-radius: 2px;
		transform: rotate(-6deg);
	}
	.links {
		display: flex;
		align-items: center;
		gap: clamp(10px, 1.4vw, 22px);
		overflow-x: auto;
		scrollbar-width: none;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
	}
	.links::-webkit-scrollbar {
		display: none;
	}
	.links a {
		position: relative;
		font-family: var(--font-label);
		font-weight: 700;
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-mute);
		white-space: nowrap;
		padding: 4px 0;
		transition: color 0.2s ease;
	}
	.links a::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		height: 2px;
		width: 0;
		background: var(--zhu);
		transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.links a:hover {
		color: var(--ink);
	}
	.links a.on {
		color: var(--zhu);
	}
	.links a.on::after,
	.links a:hover::after {
		width: 100%;
	}
	@media (prefers-reduced-motion: reduce) {
		.nav {
			transition: none;
		}
	}

	/* Hamburger button */
	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		width: 36px;
		height: 36px;
		padding: 6px;
		background: transparent;
		border: none;
		cursor: pointer;
		z-index: 50;
	}
	.hamburger-line {
		display: block;
		width: 100%;
		height: 2px;
		background: var(--ink);
		border-radius: 1px;
		transition:
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.2s ease;
		transform-origin: center;
	}
	.hamburger.open .hamburger-line:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}
	.hamburger.open .hamburger-line:nth-child(2) {
		opacity: 0;
	}
	.hamburger.open .hamburger-line:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	/* Mobile menu panel */
	.mobile-menu {
		position: fixed;
		top: 52px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 40;
		background: color-mix(in srgb, var(--paper) 97%, transparent);
		-webkit-backdrop-filter: blur(16px) saturate(1.2);
		backdrop-filter: blur(16px) saturate(1.2);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: clamp(60px, 12vh, 100px);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
			visibility 0.35s;
	}
	.mobile-menu.open {
		opacity: 1;
		visibility: visible;
	}
	.mobile-menu-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.mobile-link {
		font-family: var(--font-serif);
		font-weight: 900;
		font-optical-sizing: auto;
		font-size: clamp(2rem, 7vw, 3.5rem);
		letter-spacing: -0.02em;
		color: var(--ink-soft);
		text-decoration: none;
		line-height: 1.3;
		padding: 10px 24px;
		transition: color 0.25s ease;
		opacity: 0;
		transform: translateY(16px);
	}
	.mobile-menu.open .mobile-link {
		opacity: 1;
		transform: none;
		transition:
			color 0.25s ease,
			opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}
	/* Stagger each link */
	.mobile-menu.open .mobile-link:nth-child(1) {
		transition-delay: 0.05s;
	}
	.mobile-menu.open .mobile-link:nth-child(2) {
		transition-delay: 0.08s;
	}
	.mobile-menu.open .mobile-link:nth-child(3) {
		transition-delay: 0.11s;
	}
	.mobile-menu.open .mobile-link:nth-child(4) {
		transition-delay: 0.14s;
	}
	.mobile-menu.open .mobile-link:nth-child(5) {
		transition-delay: 0.17s;
	}
	.mobile-menu.open .mobile-link:nth-child(6) {
		transition-delay: 0.2s;
	}
	.mobile-menu.open .mobile-link:nth-child(7) {
		transition-delay: 0.23s;
	}
	.mobile-menu.open .mobile-link:nth-child(8) {
		transition-delay: 0.26s;
	}
	.mobile-menu.open .mobile-link:nth-child(9) {
		transition-delay: 0.29s;
	}
	.mobile-menu.open .mobile-link:nth-child(10) {
		transition-delay: 0.32s;
	}
	.mobile-menu.open .mobile-link:nth-child(11) {
		transition-delay: 0.35s;
	}

	.mobile-link:hover,
	.mobile-link.on {
		color: var(--zhu);
	}
	.mobile-mode {
		margin-top: 32px;
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.35s,
			transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.35s;
	}
	.mobile-menu.open .mobile-mode {
		opacity: 1;
		transform: none;
	}

	/* Visibility helpers */
	.desktop-only {
		display: flex;
	}
	.desktop-mode {
		display: flex;
	}

	@media (max-width: 860px) {
		.desktop-only {
			display: none;
		}
		.desktop-mode {
			display: none;
		}
		.hamburger {
			display: flex;
		}
	}

	@media (min-width: 861px) {
		.mobile-menu {
			display: none !important;
		}
	}
</style>
