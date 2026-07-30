<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import * as THREE from 'three';
	import LivingSealModel from './LivingSealModel.svelte';

	interface Props {
		enabled?: boolean;
	}
	let { enabled = true }: Props = $props();
</script>

{#if enabled}
	<div class="living-stage" aria-hidden="true">
		<Canvas
			dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
			toneMapping={THREE.ACESFilmicToneMapping}
			shadows
		>
			<T.PerspectiveCamera makeDefault position={[0, 0, 8.2]} fov={48} near={0.1} far={50} />
			<T.HemisphereLight args={[0xfff5df, 0x3d1b17, 1.7]} />
			<T.DirectionalLight position={[4, 6, 6]} intensity={4.2} color="#fff0cf" castShadow />
			<T.PointLight position={[-4, 1, 4]} intensity={18} distance={12} color="#a82319" />
			<T.PointLight position={[3, -4, 3]} intensity={9} distance={10} color="#d2a85f" />
			<LivingSealModel />
		</Canvas>
	</div>
{/if}

<style>
	.living-stage {
		position: fixed;
		inset: 52px 0 0;
		z-index: 1;
		pointer-events: none;
		contain: strict;
		filter: saturate(0.94) contrast(1.04);
	}
	@media (max-width: 760px) {
		.living-stage {
			opacity: 0.24;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.living-stage {
			opacity: 0.45;
		}
	}
</style>
