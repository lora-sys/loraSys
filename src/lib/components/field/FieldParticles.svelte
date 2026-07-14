<script lang="ts">
	// Three.js particle field — depth-driven drift, mouse-reactive
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const COUNT = 48;

	const positions = new Float32Array(COUNT * 3);
	const seeds = new Float32Array(COUNT);
	for (let i = 0; i < COUNT; i++) {
		positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
		positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
		positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
		seeds[i] = Math.random();
	}

	let points: THREE.Points | undefined = $state();

	useTask((delta) => {
		if (!points) return;
		const arr = (points.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
		const t = performance.now() * 0.0003;
		for (let i = 0; i < COUNT; i++) {
			const s = seeds[i];
			arr[i * 3 + 1] += Math.sin(t + s * 6.28) * delta * 0.06;
			arr[i * 3 + 0] += Math.cos(t * 0.7 + s * 6.28) * delta * 0.04;
		}
		(points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
	});
</script>

<T.Points bind:ref={points}>
	<T.BufferGeometry>
		<T.BufferAttribute
			attach="attributes-position"
			count={COUNT}
			array={positions}
			itemSize={3}
		/>
	</T.BufferGeometry>
	<T.PointsMaterial
		size={0.035}
		color={0x67e8f9}
		transparent
		opacity={0.4}
		sizeAttenuation
		depthWrite={false}
	/>
</T.Points>