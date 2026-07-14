<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		maxTilt?: number;
		class?: string;
		children?: Snippet;
	}

	let { maxTilt = 6, class: _class = '', children }: Props = $props();

	let wrapper: HTMLDivElement | undefined = $state();
	let inner: HTMLDivElement | undefined = $state();
	let raf = 0;
	let targetX = 0;
	let targetY = 0;
	let currentX = 0;
	let currentY = 0;

	function onMove(e: MouseEvent) {
		if (!wrapper) return;
		const rect = wrapper.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width; // 0..1
		const y = (e.clientY - rect.top) / rect.height; // 0..1
		// Center-relative: -1..1
		const nx = x * 2 - 1;
		const ny = y * 2 - 1;
		// Invert y because positive rotateX tilts bottom toward viewer
		targetY = nx * maxTilt;
		targetX = -ny * maxTilt;
		if (!raf) tick();
	}

	function onLeave() {
		targetX = 0;
		targetY = 0;
		if (!raf) tick();
	}

	function tick() {
		// damp toward target
		currentX += (targetX - currentX) * 0.15;
		currentY += (targetY - currentY) * 0.15;
		if (inner) {
			inner.style.transform = `perspective(1200px) rotateX(${currentX.toFixed(
				2
			)}deg) rotateY(${currentY.toFixed(2)}deg) translateZ(0)`;
		}
		if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
			raf = requestAnimationFrame(tick);
		} else {
			raf = 0;
		}
	}
</script>

<div
	bind:this={wrapper}
	onmousemove={onMove}
	onmouseleave={onLeave}
	role="presentation"
	class={'tilt-wrapper relative ' + _class}
>
	<div bind:this={inner} class="tilt-inner will-change-transform" style:transform="perspective(1200px) rotateX(0deg) rotateY(0deg)">
		{#if children}{@render children()}{/if}
	</div>
</div>

<style>
	.tilt-wrapper {
		transform-style: preserve-3d;
	}
	.tilt-inner {
		transition: box-shadow 0.3s ease;
		transform-style: preserve-3d;
	}
	.tilt-wrapper:hover .tilt-inner {
		box-shadow:
			0 30px 60px -20px rgba(0, 0, 0, 0.6),
			0 0 40px -10px rgba(103, 232, 249, 0.25);
	}
</style>