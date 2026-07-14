<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
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

		gsap.registerPlugin(ScrollTrigger);

		lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
		});

		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => lenis?.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);

		const spatial = (
			window as unknown as {
				__spatialCamera?: {
					target: { x: number; y: number; z: number };
					lookAt: Vector3;
				};
			}
		).__spatialCamera;

		if (spatial) {
			const t1 = gsap.to(spatial.target, {
				z: 4,
				y: -0.5,
				ease: 'none',
				scrollTrigger: {
					trigger: '#about',
					start: 'top bottom',
					end: 'top top',
					scrub: 0.5
				}
			});
			triggers.push(t1.scrollTrigger!);

			const t2 = gsap.to(spatial.target, {
				z: 2.5,
				y: -1.5,
				scrollTrigger: {
					trigger: '#skills',
					start: 'top bottom',
					end: 'top top',
					scrub: 0.5
				}
			});
			triggers.push(t2.scrollTrigger!);

			const t3 = gsap.to(spatial.target, {
				z: 6,
				y: 0,
				scrollTrigger: {
					trigger: '#projects',
					start: 'top bottom',
					end: 'top top',
					scrub: 0.5
				}
			});
			triggers.push(t3.scrollTrigger!);

			const t4 = gsap.to(spatial.target, {
				z: 7,
				y: 1,
				scrollTrigger: {
					trigger: '#contact',
					start: 'top bottom',
					end: 'top top',
					scrub: 0.5
				}
			});
			triggers.push(t4.scrollTrigger!);
		}
	});

	onDestroy(() => {
		triggers.forEach((t) => t.kill());
		lenis?.destroy();
	});
</script>

{@render children?.()}