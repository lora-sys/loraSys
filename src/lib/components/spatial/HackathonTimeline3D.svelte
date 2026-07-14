<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		count?: number;
	}

	let { count = 4 }: Props = $props();

	// Build a curved 3D path. Each anchor spreads on x, y, and z so the
	// curve sweeps through space rather than running flat.
	const curve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(-2.4, 0.6, 1.2),
		new THREE.Vector3(-0.8, -0.4, -0.4),
		new THREE.Vector3(0.8, 0.5, -1.2),
		new THREE.Vector3(2.4, -0.3, 0.6)
	]);

	const points = curve.getPoints(count - 1);
	const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.015, 8, false);

	let spheres = $state<(THREE.Mesh | undefined)[]>([]);
	let elapsed = 0;

	useTask((delta) => {
		elapsed += delta;
		spheres.forEach((s, i) => {
			if (!s) return;
			const phase = (elapsed * 1.2 + i * 0.4) % (Math.PI * 2);
			const scale = 1 + Math.sin(phase) * 0.25;
			s.scale.setScalar(scale);
			const mat = s.material as THREE.MeshStandardMaterial;
			mat.emissiveIntensity = 1.6 + Math.sin(phase) * 0.6;
		});
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={50}>
	<T.AmbientLight intensity={0.4} />
	<T.PointLight position={[0, 0, 4]} intensity={2} color="#67e8f9" />
	<T.PointLight position={[3, -2, 1]} intensity={1.2} color="#c084fc" />
</T.PerspectiveCamera>

<T.Mesh geometry={tubeGeom}>
	<T.MeshBasicMaterial color="#22d3ee" transparent={true} opacity={0.4} />
</T.Mesh>

{#each points as point, i}
	<T.Mesh bind:ref={spheres[i]} position={[point.x, point.y, point.z]}>
		<T.SphereGeometry args={[0.14, 24, 24]} />
		<T.MeshStandardMaterial
			color="#67e8f9"
			emissive="#67e8f9"
			emissiveIntensity={1.8}
			toneMapped={false}
		/>
	</T.Mesh>
{/each}

{#each Array.from({ length: 80 }) as _, i}
	{@const a = (i / 80) * Math.PI * 2}
	{@const r = 3 + Math.sin(i * 0.7) * 1.5}
	<T.Mesh position={[Math.cos(a) * r, Math.sin(i * 0.3) * 1.2, Math.sin(a) * r - 1.5]}>
		<T.SphereGeometry args={[0.02, 6, 6]} />
		<T.MeshBasicMaterial color="#9c40ff" transparent={true} opacity={0.6} />
	</T.Mesh>
{/each}