<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import type { Vector3, PerspectiveCamera } from 'three';

	const { camera } = useThrelte();

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
		const lerp = 1 - Math.pow(0.001, delta);
		cam.position.x += (spatial.target.x - cam.position.x) * lerp;
		cam.position.y += (spatial.target.y - cam.position.y) * lerp;
		cam.position.z += (spatial.target.z - cam.position.z) * lerp;
		cam.lookAt(spatial.lookAt);
	});
</script>