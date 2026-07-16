<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	interface Props {
		orbSize?: number;
	}

	let { orbSize = 1.5 }: Props = $props();

	const particles = Array.from({ length: 200 }).map(() => ({
		x: (Math.random() - 0.5) * 6,
		y: (Math.random() - 0.5) * 4,
		z: (Math.random() - 0.5) * 4,
		phase: Math.random() * Math.PI * 2,
		speed: 0.3 + Math.random() * 0.7
	}));

	let orb = $state<THREE.Mesh | undefined>(undefined);
	let elapsed = 0;

	useTask((delta) => {
		elapsed += delta;
		if (!orb) return;
		orb.scale.setScalar(1 + Math.sin(elapsed * 0.6) * 0.04);
		const mat = orb.material as THREE.ShaderMaterial;
		if (mat.uniforms?.uTime) mat.uniforms.uTime.value = elapsed;
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 4]} fov={55}>
	<T.AmbientLight intensity={0.5} />
	<T.PointLight position={[2, 2, 2]} intensity={2} color="#67e8f9" />
	<T.PointLight position={[-2, -1, 1]} intensity={1.5} color="#c084fc" />
	<T.PointLight position={[0, -2, 1]} intensity={1.2} color="#fcd34d" />
</T.PerspectiveCamera>

<!-- Central gradient orb — cyan → purple → amber via fresnel + time -->
<T.Mesh bind:ref={orb}>
	<T.SphereGeometry args={[orbSize, 64, 64]} />
	<T.ShaderMaterial
		transparent={true}
		depthWrite={false}
		uniforms={{
			uTime: { value: 0 }
		}}
		vertexShader={`
			varying vec3 vNormal;
			varying vec3 vView;
			void main() {
				vNormal = normalize(normal);
				vec4 mv = modelViewMatrix * vec4(position, 1.0);
				vView = -normalize(mv.xyz);
				gl_Position = projectionMatrix * mv;
			}
		`}
		fragmentShader={`
			uniform float uTime;
			varying vec3 vNormal;
			varying vec3 vView;
			void main() {
				float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 1.5);
				vec3 cyan = vec3(0.4, 0.9, 1.0);
				vec3 purple = vec3(0.75, 0.5, 1.0);
				vec3 amber = vec3(1.0, 0.85, 0.5);
				float t = sin(uTime * 0.4) * 0.5 + 0.5;
				vec3 col = mix(cyan, purple, fresnel);
				col = mix(col, amber, fresnel * t * 0.3);
				float alpha = 0.4 + fresnel * 0.5;
				gl_FragColor = vec4(col, alpha);
			}
		`}
	/>
</T.Mesh>

<!-- Dense particle cloud for the "densification" climax -->
{#each particles as p}
	<T.Mesh position={[p.x, p.y, p.z]}>
		<T.SphereGeometry args={[0.018, 6, 6]} />
		<T.MeshBasicMaterial color="#c084fc" transparent={true} opacity={0.7} />
	</T.Mesh>
{/each}
