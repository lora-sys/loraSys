<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		count?: number;
		radius?: number;
		color?: string;
		opacity?: number;
	}

	let { count = 3000, radius = 12, color = '#9c40ff', opacity = 0.85 }: Props = $props();

	const positions = new Float32Array(count * 3);
	const initial = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		// Spherical distribution — denser at center, sparser at edges
		const r = Math.pow(Math.random(), 0.6) * radius;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		const x = r * Math.sin(phi) * Math.cos(theta);
		const y = r * Math.sin(phi) * Math.sin(theta);
		const z = r * Math.cos(phi);
		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;
		initial[i * 3] = x;
		initial[i * 3 + 1] = y;
		initial[i * 3 + 2] = z;
	}

	const geom = new THREE.BufferGeometry();
	geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const mat = new THREE.PointsMaterial({
		color: new THREE.Color(color),
		size: 0.025,
		sizeAttenuation: true,
		transparent: true,
		opacity,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	const points = new THREE.Points(geom, mat);

	let t = 0;
	useTask((delta) => {
		t += delta * 0.05;
		points.rotation.y = t * 0.3;
		points.rotation.x = Math.sin(t * 0.5) * 0.05;
	});
</script>

<T is={points} />