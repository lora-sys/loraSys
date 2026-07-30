<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import { base } from '$app/paths';
	import * as THREE from 'three';

	let group: THREE.Group = $state()!;
	const gltf = useGltf(`${base}/models/living-seal.glb`);
	let pointerX = 0;
	let pointerY = 0;
	let impulse = 0;
	let reduced = false;
	let mobile = false;
	let children: Array<{ object: THREE.Object3D; origin: THREE.Vector3 }> = [];
	let preparedScene: THREE.Group | undefined = $state();

	const chapters = ['top', 'self', 'skills', 'exp', 'work', 'hack', 'off', 'contact'];
	const poses = [
		{ x: 3.25, y: 0.22, z: -0.2, s: 0.58, rx: 0.02, ry: -0.42, rz: -0.05, e: 0 },
		{ x: 3.2, y: -0.15, z: -0.5, s: 0.5, rx: 0.1, ry: 0.55, rz: 0.08, e: 0.08 },
		{ x: 3.15, y: 0.05, z: -0.6, s: 0.5, rx: -0.08, ry: 1.15, rz: -0.12, e: 0.32 },
		{ x: 3.25, y: -0.25, z: -0.72, s: 0.47, rx: 0.18, ry: 2.0, rz: 0.08, e: 0.12 },
		{ x: 3.15, y: 0.12, z: -0.55, s: 0.55, rx: -0.15, ry: 2.75, rz: -0.1, e: 0.2 },
		{ x: 3.1, y: 0, z: -0.7, s: 0.49, rx: 0.08, ry: 3.55, rz: 0.15, e: 0.28 },
		{ x: 3.05, y: -0.12, z: -0.75, s: 0.46, rx: -0.12, ry: 4.35, rz: -0.12, e: 0.36 },
		{ x: 0, y: -0.1, z: -0.05, s: 0.76, rx: 0.03, ry: 5.15, rz: 0, e: 0 }
	];

	function mix(a: number, b: number, t: number) {
		return a + (b - a) * t;
	}

	function getChapterProgress() {
		const viewportMid = window.innerHeight * 0.5;
		const centers = chapters.map((id) => {
			const element = document.getElementById(id);
			return element ? element.offsetTop + element.offsetHeight * 0.5 : 0;
		});
		const current = window.scrollY + viewportMid;
		let index = 0;
		while (index < centers.length - 1 && current > centers[index + 1]) index += 1;
		const next = Math.min(index + 1, centers.length - 1);
		const span = Math.max(1, centers[next] - centers[index]);
		const t =
			next === index ? 0 : THREE.MathUtils.smoothstep((current - centers[index]) / span, 0, 1);
		return { index, next, t };
	}

	if (typeof window !== 'undefined') {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		mobile = window.matchMedia('(max-width: 760px)').matches;
		window.addEventListener(
			'pointermove',
			(event) => {
				pointerX = event.clientX / window.innerWidth - 0.5;
				pointerY = event.clientY / window.innerHeight - 0.5;
			},
			{ passive: true }
		);
		window.addEventListener('living-seal:impulse', () => (impulse = 1));
	}

	$effect(() => {
		if (!$gltf || preparedScene) return;
		preparedScene = $gltf.scene;
		preparedScene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		});
		children = preparedScene.children.map((object) => ({
			object,
			origin: object.position.clone()
		}));
	});

	useTask((delta) => {
		if (!group || typeof window === 'undefined') return;
		const { index, next, t } = getChapterProgress();
		const a = poses[index];
		const b = poses[next];
		const ease = 1 - Math.pow(0.0008, delta);
		const px = mobile ? 1.45 : mix(a.x, b.x, t);
		const py = mobile ? -0.65 : mix(a.y, b.y, t);
		const scale = (mobile ? 0.39 : mix(a.s, b.s, t)) * (1 + impulse * 0.08);
		group.position.x += (px + pointerX * (mobile ? 0.08 : 0.22) - group.position.x) * ease;
		group.position.y += (py - pointerY * (mobile ? 0.05 : 0.14) - group.position.y) * ease;
		group.position.z += (mix(a.z, b.z, t) - group.position.z) * ease;
		group.scale.lerp(new THREE.Vector3(scale, scale, scale), ease);
		group.rotation.x += (mix(a.rx, b.rx, t) - pointerY * 0.1 - group.rotation.x) * ease;
		group.rotation.y += (mix(a.ry, b.ry, t) + pointerX * 0.14 - group.rotation.y) * ease;
		group.rotation.z += (mix(a.rz, b.rz, t) - group.rotation.z) * ease;
		if (!reduced) group.rotation.y += delta * 0.035;

		const explode = reduced ? 0 : mix(a.e, b.e, t);
		for (const { object, origin } of children) {
			const direction = origin.clone().normalize();
			object.position.lerp(origin.clone().addScaledVector(direction, explode), ease);
		}
		impulse = Math.max(0, impulse - delta * 2.5);
	});
</script>

<T.Group bind:ref={group}>
	{#if preparedScene}<T is={preparedScene} />{/if}
</T.Group>
