<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import type { Vector3, PerspectiveCamera } from 'three';

	const { camera } = useThrelte();

	let mouseX = 0;
	let mouseY = 0;
	let scrollY = 0;

	if (typeof window !== 'undefined') {
		window.addEventListener('mousemove', (e) => {
			mouseX = (e.clientX / window.innerWidth) * 2 - 1;
			mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
		});
		window.addEventListener(
			'scroll',
			() => {
				scrollY = window.scrollY;
			},
			{ passive: true }
		);
	}

	useTask((delta) => {
		if (!camera.current) return;
		const spatial = (
			window as unknown as {
				__spatialCamera?: {
					target: { x: number; y: number; z: number };
					lookAt: Vector3;
				};
			}
		).__spatialCamera;
		if (!spatial) return;

		const cam = camera.current as PerspectiveCamera;

		// Mouse-orbit is most felt in the hero. Fade it out as the user
		// scrolls past the first viewport so it doesn't fight the
		// ScrollTrigger waypoints.
		const orbitWeight = Math.max(0, 1 - scrollY / window.innerHeight);

		// Subtle offsets — max ±0.5 units on each axis. Lerp toward target.
		const targetX = spatial.target.x + mouseX * 0.5 * orbitWeight;
		const targetY = spatial.target.y + mouseY * 0.3 * orbitWeight;

		const lerp = 1 - Math.pow(0.001, delta);
		cam.position.x += (targetX - cam.position.x) * lerp;
		cam.position.y += (targetY - cam.position.y) * lerp;
		cam.position.z += (spatial.target.z - cam.position.z) * lerp;
		cam.lookAt(spatial.lookAt);
	});
</script>