<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {}

	let {}: Props = $props();

	// Build a "broken" mesh from multiple small cubes that drift apart
	// and re-attach. Each fragment has its own rotation + offset velocity.
	const fragments = Array.from({ length: 12 }).map((_, i) => {
		const phi = Math.acos(2 * Math.random() - 1);
		const theta = Math.random() * Math.PI * 2;
		const r = 0.6 + Math.random() * 0.6;
		return {
			basePos: new THREE.Vector3(
				Math.sin(phi) * Math.cos(theta) * r,
				Math.sin(phi) * Math.sin(theta) * r,
				Math.cos(phi) * r
			),
			vel: new THREE.Vector3(
				(Math.random() - 0.5) * 0.3,
				(Math.random() - 0.5) * 0.3,
				(Math.random() - 0.5) * 0.3
			),
			rotSpeed: new THREE.Vector3(
				(Math.random() - 0.5) * 1.2,
				(Math.random() - 0.5) * 1.2,
				(Math.random() - 0.5) * 1.2
			),
			scale: 0.08 + Math.random() * 0.06,
			phase: Math.random() * Math.PI * 2
		};
	});

	const cubes = $state<(THREE.Mesh | undefined)[]>([]);
	let elapsed = 0;
	let glitchAmount = 1;

	useTask((delta) => {
		elapsed += delta;
		// Periodic "glitch" — every 2.5s, fragments blast outward briefly
		const cycle = elapsed % 2.5;
		glitchAmount = cycle < 0.2 ? 3.5 - cycle * 16 : 1;
		cubes.forEach((c, i) => {
			if (!c) return;
			const f = fragments[i];
			const offset = f.vel
				.clone()
				.multiplyScalar(elapsed * 0.05 * glitchAmount);
			c.position.copy(f.basePos).add(offset);
			c.rotation.x = f.rotSpeed.x * elapsed;
			c.rotation.y = f.rotSpeed.y * elapsed;
			c.rotation.z = f.rotSpeed.z * elapsed;
		});
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50}>
	<T.AmbientLight intensity={0.4} />
	<T.PointLight position={[2, 2, 2]} intensity={2} color="#67e8f9" />
	<T.PointLight position={[-2, -1, 1]} intensity={1.2} color="#c084fc" />
</T.PerspectiveCamera>

{#each fragments as f, i}
	<T.Mesh bind:ref={cubes[i]} position={[f.basePos.x, f.basePos.y, f.basePos.z]}>
		<T.BoxGeometry args={[f.scale, f.scale, f.scale]} />
		<T.MeshStandardMaterial
			color="#67e8f9"
			emissive="#67e8f9"
			emissiveIntensity={0.8}
			wireframe={true}
		/>
	</T.Mesh>
{/each}