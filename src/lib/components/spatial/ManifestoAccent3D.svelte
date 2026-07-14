<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		count?: number;
	}

	let { count = 5 }: Props = $props();

	// Mix of geometric primitives orbiting at different radii
	const shapes = Array.from({ length: count }).map((_, i) => ({
		kind: i % 3, // 0=icosahedron, 1=tetrahedron, 2=octahedron
		baseAngle: (i / count) * Math.PI * 2,
		radius: 1.2 + (i % 2) * 0.4,
		size: 0.18 + (i % 3) * 0.04,
		speed: 0.3 + (i % 3) * 0.15,
		yOffset: (i - count / 2) * 0.3
	}));

	let groupRef = $state<THREE.Group | undefined>(undefined);

	useTask((delta) => {
		if (groupRef) groupRef.rotation.y += delta * 0.15;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 3.5]} fov={50}>
	<T.AmbientLight intensity={0.6} />
	<T.PointLight position={[2, 2, 2]} intensity={1.5} color="#67e8f9" />
	<T.PointLight position={[-2, -1, 1]} intensity={1} color="#c084fc" />
</T.PerspectiveCamera>

<T.Group bind:ref={groupRef}>
	{#each shapes as s, i}
		{@const x = Math.cos(s.baseAngle) * s.radius}
		{@const z = Math.sin(s.baseAngle) * s.radius * 0.4}
		{@const y = s.yOffset}
		<T.Mesh position={[x, y, z]} rotation={[i * 0.7, i * 1.1, i * 0.3]}>
			{#if s.kind === 0}
				<T.IcosahedronGeometry args={[s.size, 0]} />
			{:else if s.kind === 1}
				<T.TetrahedronGeometry args={[s.size, 0]} />
			{:else}
				<T.OctahedronGeometry args={[s.size, 0]} />
			{/if}
			<T.MeshStandardMaterial
				color="#67e8f9"
				emissive="#67e8f9"
				emissiveIntensity={0.6}
				wireframe={true}
			/>
		</T.Mesh>
	{/each}

	<!-- Subtle background ambient particles -->
	{#each Array.from({ length: 40 }) as _, i}
		{@const a = (i / 40) * Math.PI * 2}
		{@const r = 2 + Math.sin(i * 0.5) * 0.8}
		<T.Mesh position={[Math.cos(a) * r, (i % 8) * 0.15 - 0.5, Math.sin(a) * r - 1]}>
			<T.SphereGeometry args={[0.012, 6, 6]} />
			<T.MeshBasicMaterial color="#9c40ff" transparent={true} opacity={0.6} />
		</T.Mesh>
	{/each}
</T.Group>