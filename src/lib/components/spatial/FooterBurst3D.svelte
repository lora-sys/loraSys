<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		count?: number;
	}

	let { count = 150 }: Props = $props();

	// Particles burst outward from origin once when scene enters,
	// then drift + fade. Velocities pre-baked so motion is consistent
	// across re-mounts.
	const particles = Array.from({ length: count }).map(() => {
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		const speed = 0.3 + Math.random() * 1.2;
		return {
			vx: Math.sin(phi) * Math.cos(theta) * speed,
			vy: Math.sin(phi) * Math.sin(theta) * speed * 0.5,
			vz: Math.cos(phi) * speed,
			size: 0.015 + Math.random() * 0.025,
			hue: Math.random() < 0.7 ? 'cyan' : 'purple'
		};
	});

	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		positions[i * 3] = 0;
		positions[i * 3 + 1] = 0;
		positions[i * 3 + 2] = 0;
	}

	const geom = new THREE.BufferGeometry();
	geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const mat = new THREE.PointsMaterial({
		size: 0.04,
		sizeAttenuation: true,
		transparent: true,
		opacity: 1,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		color: new THREE.Color('#67e8f9')
	});

	const points = new THREE.Points(geom, mat);

	let elapsed = 0;

	useTask((delta) => {
		elapsed += delta;
		const pos = geom.attributes.position.array as Float32Array;
		for (let i = 0; i < count; i++) {
			pos[i * 3] += particles[i].vx * delta;
			pos[i * 3 + 1] += particles[i].vy * delta;
			pos[i * 3 + 2] += particles[i].vz * delta;
		}
		geom.attributes.position.needsUpdate = true;
		// Fade out over 4 seconds, then stay invisible
		mat.opacity = Math.max(0, 1 - elapsed / 4);
		points.rotation.y += delta * 0.05;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 3]} fov={55}>
	<T.AmbientLight intensity={0.5} />
	<T.PointLight position={[0, 0, 3]} intensity={1.5} color="#c084fc" />
</T.PerspectiveCamera>

<T is={points} />
