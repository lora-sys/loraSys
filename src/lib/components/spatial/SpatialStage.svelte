<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import ParticleField from './ParticleField.svelte';
	import Text3D from './Text3D.svelte';

	interface Props {
		enabled?: boolean;
	}

	let { enabled = true }: Props = $props();
</script>

{#if enabled}
	<div class="pointer-events-none fixed inset-0 z-0">
		<Canvas
			dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
			toneMapping={1}
		>
			<T.PerspectiveCamera makeDefault position={[0, 0, 8]} fov={55}>
				<T.PointLight position={[5, 5, 5]} intensity={2} color="#67e8f9" />
				<T.PointLight position={[-5, -3, 3]} intensity={1.5} color="#c084fc" />
				<T.AmbientLight intensity={0.15} />
			</T.PerspectiveCamera>

			<ParticleField count={3000} radius={14} color="#9c40ff" opacity={0.7} />
			<Text3D text="lora" size={3.2} depth={0.5} />
		</Canvas>
	</div>
{/if}