<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
	import { FontLoader, type Font } from 'three/examples/jsm/loaders/FontLoader.js';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	interface Props {
		text?: string;
		fontUrl?: string;
		size?: number;
		depth?: number;
	}

	let {
		text = 'lora',
		fontUrl = '/fonts/helvetiker_bold.typeface.json',
		size = 4,
		depth = 0.6
	}: Props = $props();

	const { scene } = useThrelte();

	let mesh: THREE.Mesh | null = null;
	let geom: TextGeometry | null = null;
	let mat: THREE.ShaderMaterial | null = null;
	let scrollY = 0;

	if (typeof window !== 'undefined') {
		window.addEventListener(
			'scroll',
			() => {
				scrollY = window.scrollY;
			},
			{ passive: true }
		);
	}

	onMount(() => {
		const loader = new FontLoader();
		loader.load(fontUrl, (font: Font) => {
			const g = new TextGeometry(text, {
				font,
				size,
				depth,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.05,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 5
			});
			g.computeBoundingBox();
			g.center();
			geom = g;

			const m = new THREE.ShaderMaterial({
				uniforms: {
					uTime: { value: 0 },
					uColorA: { value: new THREE.Color('#67e8f9') },
					uColorB: { value: new THREE.Color('#c084fc') },
					uMouse: { value: new THREE.Vector2(0, 0) },
					uOpacity: { value: 1 }
				},
				vertexShader: /* glsl */ `
					uniform float uTime;
					uniform vec2 uMouse;
					varying vec3 vNormal;

					void main() {
						vNormal = normalize(normal);
						vec3 displaced = position;
						float wave = sin(position.y * 1.5 + uTime * 1.2) * 0.08;
						displaced.z += wave;
						displaced.x += sin(position.y * 0.5 + uTime * 0.6) * uMouse.x * 0.15;
						gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
					}
				`,
				fragmentShader: /* glsl */ `
					uniform vec3 uColorA;
					uniform vec3 uColorB;
					uniform float uOpacity;
					varying vec3 vNormal;

					void main() {
						float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 1.5);
						vec3 col = mix(uColorA, uColorB, fresnel);
						gl_FragColor = vec4(col, uOpacity);
					}
				`,
				transparent: true,
				side: THREE.DoubleSide
			});
			mat = m;

			const newMesh = new THREE.Mesh(g, m);
			newMesh.position.z = -12; // park text far from camera so it stays small
			mesh = newMesh;
			scene.add(newMesh);
		});

		const onMove = (e: MouseEvent) => {
			if (mat) {
				mat.uniforms.uMouse.value.x = (e.clientX / window.innerWidth) * 2 - 1;
				mat.uniforms.uMouse.value.y = -(e.clientY / window.innerHeight) * 2 + 1;
			}
		};
		window.addEventListener('mousemove', onMove);
		return () => {
			window.removeEventListener('mousemove', onMove);
			if (mesh) scene.remove(mesh);
			geom?.dispose();
			mat?.dispose();
		};
	});

	useTask((delta) => {
		if (!mat) return;
		mat.uniforms.uTime.value += delta;
		if (mesh) {
			mesh.rotation.y += delta * 0.08;
			mesh.rotation.x = Math.sin(performance.now() * 0.0004) * 0.05;
			// Fade out as user scrolls past hero. Hero is ~1 viewport tall;
			// the text fades to invisible by the start of the manifesto section
			// so it doesn't visually collide with the pull-quote.
			const fadeStart = window.innerHeight * 0.5;
			const fadeEnd = window.innerHeight * 1.2;
			const t = Math.max(0, Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart)));
			mat.uniforms.uOpacity.value = 1 - t;
		}
	});
</script>
