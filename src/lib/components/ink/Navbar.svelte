<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	type Link = { label: string; href: string; id?: string; route?: string };
	const links: Link[] = [
		{ label: 'Self', href: `${base}/#self`, id: 'self' },
		{ label: 'Skills', href: `${base}/#skills`, id: 'skills' },
		{ label: 'Experience', href: `${base}/#exp`, id: 'exp' },
		{ label: 'Work', href: `${base}/#work`, id: 'work' },
		{ label: 'Hackathons', href: `${base}/#hack`, id: 'hack' },
		{ label: 'Off Hours', href: `${base}/#off`, id: 'off' },
		{ label: 'Blog', href: `${base}/blog`, route: '/blog' },
		{ label: 'Now', href: `${base}/now`, route: '/now' },
		{ label: 'Contact', href: `${base}/#contact`, id: 'contact' }
	];

	let active = $state('');
	let scrolled = $state(false);

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
</script>

<nav class="nav" class:scrolled aria-label="Primary">
	<a class="brand" href="{base}/" aria-label="lora — home">
		lora<span class="seal-dot" aria-hidden="true"></span>
	</a>
	<div class="links">
		{#each links as l}
			<a href={l.href} class:on={isActive(l)}>{l.label}</a>
		{/each}
	</div>
</nav>

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
</style>
