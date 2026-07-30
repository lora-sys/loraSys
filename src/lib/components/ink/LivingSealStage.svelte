<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import * as THREE from 'three';
	import LivingSealModel from './LivingSealModel.svelte';

	interface Props {
		enabled?: boolean;
	}
	let { enabled = true }: Props = $props();
	let ready = $state(false);
	const compact = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;
</script>

{#if enabled}
	<div class="living-stage" class:ready aria-hidden="true" data-model-ready={ready}>
		<div class="stage-status">
			<span></span>
			Loading 3D artifact
		</div>
		<Canvas
			dpr={compact ? 1 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
			toneMapping={THREE.ACESFilmicToneMapping}
			shadows={!compact}
		>
			<T.PerspectiveCamera makeDefault position={[0, 0, 8.2]} fov={48} near={0.1} far={50} />
			<T.HemisphereLight args={[0xfff5df, 0x3d1b17, compact ? 2.2 : 1.7]} />
			<T.DirectionalLight
				position={[4, 6, 6]}
				intensity={compact ? 3.4 : 4.2}
				color="#fff0cf"
				castShadow={!compact}
			/>
			<T.PointLight
				position={[-4, 1, 4]}
				intensity={compact ? 12 : 18}
				distance={12}
				color="#a82319"
			/>
			{#if !compact}<T.PointLight
					position={[3, -4, 3]}
					intensity={9}
					distance={10}
					color="#d2a85f"
				/>{/if}
			<LivingSealModel onready={() => (ready = true)} />
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
	.stage-status {
		position: absolute;
		right: clamp(20px, 7vw, 100px);
		top: 18%;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: var(--font-label);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--zhu);
		transition: opacity 0.3s ease;
	}
	.stage-status span {
		width: 8px;
		height: 8px;
		border: 1px solid currentColor;
		border-radius: 50%;
		animation: stagePulse 0.9s ease-in-out infinite alternate;
	}
	.living-stage.ready .stage-status {
		opacity: 0;
	}
	@keyframes stagePulse {
		to {
			transform: scale(1.7);
			opacity: 0.25;
		}
	}
	@media (max-width: 760px) {
		.living-stage {
			opacity: 0.82;
		}
		.stage-status {
			right: 16px;
			top: 14%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.living-stage {
			opacity: 0.45;
		}
	}
</style>
