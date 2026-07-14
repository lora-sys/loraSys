<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		images: string[];
		radius?: number;
		iconSize?: number;
	}

	let { images, radius = 2.5, iconSize = 0.7 }: Props = $props();

	let textures = $state<THREE.Texture[]>([]);

	$effect(() => {
		// SVG → canvas → texture. TextureLoader can't decode SVG.
		const promises = images.map(async (url): Promise<THREE.Texture> => {
			try {
				const res = await fetch(url);
				const svg = await res.text();
				const blob = new Blob([svg], { type: 'image/svg+xml' });
				const blobUrl = URL.createObjectURL(blob);

				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.src = blobUrl;
				await img.decode();

				const size = 128;
				const canvas = document.createElement('canvas');
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext('2d')!;
				ctx.clearRect(0, 0, size, size);
				ctx.drawImage(img, 0, 0, size, size);

				const tex = new THREE.CanvasTexture(canvas);
				tex.colorSpace = THREE.SRGBColorSpace;
				tex.needsUpdate = true;
				URL.revokeObjectURL(blobUrl);
				return tex;
			} catch (e) {
				console.warn('[SkillOrbit] failed to load', url, e);
				return new THREE.Texture();
			}
		});
		Promise.all(promises).then((loaded) => {
			textures = loaded;
		});
	});

	const items = $derived(
		textures.map((tex, i) => {
			const angle = (i / Math.max(textures.length, 1)) * Math.PI * 2;
			return {
				tex,
				baseX: Math.cos(angle) * radius,
				baseY: Math.sin(angle) * radius * 0.5,
				baseZ: Math.sin(angle * 2) * 0.4
			};
		})
	);

	let groupRef = $state<THREE.Group | undefined>(undefined);

	useTask((delta) => {
		if (!groupRef) return;
		groupRef.rotation.y += delta * 0.12;
	});
</script>

<T.Group bind:ref={groupRef}>
	<T.AmbientLight intensity={0.7} />
	<T.PointLight position={[0, 0, 5]} intensity={2} color="#67e8f9" />

	{#each items as item, i}
		<T.Mesh
			position={[item.baseX, item.baseY, item.baseZ]}
			rotation.y={i * 0.5}
			rotation.x={0.2}
		>
			<T.PlaneGeometry args={[iconSize, iconSize]} />
			<T.MeshBasicMaterial map={item.tex} transparent={true} side={THREE.DoubleSide} />
		</T.Mesh>
	{/each}

	<T.Mesh position={[0, 0, 0]}>
		<T.SphereGeometry args={[0.18, 24, 24]} />
		<T.MeshBasicMaterial color="#c084fc" />
	</T.Mesh>
</T.Group>