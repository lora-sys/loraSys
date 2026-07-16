<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Lenis from 'lenis';
	import type { Vector3 } from 'three';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let lenis: Lenis | null = null;
	let triggers: ScrollTrigger[] = [];

	onMount(() => {
		if (!browser) return;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mobile = window.matchMedia('(max-width: 767px)').matches;
		if (reduced || mobile) return;

		try {
			gsap.registerPlugin(ScrollTrigger);
			console.log('[spatial] GSAP plugin registered');
		} catch (e) {
			console.error('[spatial] GSAP register failed', e);
			return;
		}

		// SpatialStage publishes __spatialCamera in its own onMount. Children
		// mount before parents, but two sibling components' onMounts may race.
		// Wait one frame to ensure SpatialStage has run first.
		const init = () => {
			try {
				lenis = new Lenis({
					duration: 1.2,
					easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
				});
				console.log('[spatial] Lenis initialized');
			} catch (e) {
				console.error('[spatial] Lenis init failed', e);
			}

			if (lenis) {
				lenis.on('scroll', ScrollTrigger.update);
				gsap.ticker.add((time: number) => lenis?.raf(time * 1000));
				gsap.ticker.lagSmoothing(0);
			}

			const spatial = (
				window as unknown as {
					__spatialCamera?: {
						target: { x: number; y: number; z: number };
						lookAt: Vector3;
					};
				}
			).__spatialCamera;

			console.log('[spatial] spatial camera target:', spatial ? 'present' : 'MISSING');

			if (spatial) {
				const create = (
					target: { x: number; y: number; z: number },
					z: number,
					y: number,
					triggerId: string
				) => {
					const t = gsap.to(target, {
						z,
						y,
						ease: 'none',
						scrollTrigger: {
							trigger: `#${triggerId}`,
							start: 'top bottom',
							end: 'top top',
							scrub: 0.5
						}
					});
					if (t.scrollTrigger) triggers.push(t.scrollTrigger);
				};

				create(spatial.target, 4, -0.5, 'about');
				create(spatial.target, 2.5, -1.5, 'skills');
				create(spatial.target, 6, 0, 'projects');
				create(spatial.target, 7, 1, 'contact');

				console.log('[spatial] ScrollTriggers created:', triggers.length);
			}
		};

		requestAnimationFrame(() => requestAnimationFrame(init));
	});

	onDestroy(() => {
		triggers.forEach((t) => t.kill());
		lenis?.destroy();
	});
</script>

{@render children?.()}
