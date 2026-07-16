<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import ParticleField from './ParticleField.svelte';
	import Text3D from './Text3D.svelte';
	import CameraRig from './CameraRig.svelte';

	interface Props {
		enabled?: boolean;
	}

	let { enabled = true }: Props = $props();

	onMount(() => {
		if (!enabled) return;
		// Expose camera target so SpatialScroll's ScrollTrigger can update it
		(
			window as unknown as {
				__spatialCamera: {
					target: { x: number; y: number; z: number };
					lookAt: THREE.Vector3;
				};
			}
		).__spatialCamera = {
			target: { x: 0, y: 0, z: 8 },
			lookAt: new THREE.Vector3(0, 0, 0)
		};
	});
</script>

{#if enabled}
	<div class="pointer-events-none fixed inset-0 z-0">
		<Canvas
			dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
			toneMapping={THREE.ACESFilmicToneMapping}
		>
			<T.PerspectiveCamera makeDefault position={[0, 0, 8]} fov={55} near={0.1} far={100}>
				<T.PointLight position={[5, 5, 5]} intensity={2.5} color="#67e8f9" />
				<T.PointLight position={[-5, -3, 3]} intensity={1.8} color="#c084fc" />
				<T.PointLight position={[0, -8, 2]} intensity={1} color="#fcd34d" />
				<T.AmbientLight intensity={0.2} />
			</T.PerspectiveCamera>

			<CameraRig />

			<ParticleField count={3000} radius={14} color="#9c40ff" opacity={0.7} />
			<Text3D text="lora" size={3.2} depth={0.5} />
		</Canvas>
	</div>
{/if}
