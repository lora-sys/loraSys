import { writeFile } from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Node does not expose FileReader, but GLTFExporter uses it for GLB blobs.
globalThis.FileReader = class {
	readAsArrayBuffer(blob) {
		blob.arrayBuffer().then((value) => {
			this.result = value;
			this.onloadend?.();
		});
	}
	readAsDataURL(blob) {
		blob.arrayBuffer().then((value) => {
			this.result = `data:${blob.type};base64,${Buffer.from(value).toString('base64')}`;
			this.onloadend?.();
		});
	}
};

const root = new THREE.Group();
root.name = 'living_seal';

const ink = new THREE.MeshStandardMaterial({
	name: 'oxidized_ink_metal',
	color: 0x1b1917,
	metalness: 0.72,
	roughness: 0.42
});
const cinnabar = new THREE.MeshStandardMaterial({
	name: 'cinnabar_lacquer',
	color: 0xa82319,
	metalness: 0.12,
	roughness: 0.3
});
const brass = new THREE.MeshStandardMaterial({
	name: 'muted_brass',
	color: 0x9b7135,
	metalness: 0.82,
	roughness: 0.3
});

function mesh(name, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
	const value = new THREE.Mesh(geometry, material);
	value.name = name;
	value.position.set(...position);
	value.rotation.set(...rotation);
	value.castShadow = true;
	value.receiveShadow = true;
	root.add(value);
	return value;
}

// Cinnabar core, dark protective shell and raised lower stamp face.
mesh('seal_core', new RoundedBoxGeometry(2.65, 2.75, 1.35, 5, 0.22), cinnabar, [0, 0, 0]);
mesh('seal_shell_top', new RoundedBoxGeometry(2.82, 0.42, 1.52, 5, 0.15), ink, [0, 1.1, 0]);
mesh('seal_shell_bottom', new RoundedBoxGeometry(2.82, 0.52, 1.52, 5, 0.15), ink, [0, -1.08, 0]);
mesh('seal_shell_left', new RoundedBoxGeometry(0.42, 1.75, 1.52, 5, 0.14), ink, [-1.2, 0.02, 0]);
mesh('seal_shell_right', new RoundedBoxGeometry(0.42, 1.75, 1.52, 5, 0.14), ink, [1.2, 0.02, 0]);
mesh('stamp_face', new RoundedBoxGeometry(1.95, 0.95, 0.18, 4, 0.1), cinnabar, [0, -0.57, 0.78]);

// Architectural ribs expose the red core and make each part independently animatable.
for (const side of [-1, 1]) {
	mesh(
		`upper_rib_${side < 0 ? 'left' : 'right'}`,
		new RoundedBoxGeometry(0.34, 1.18, 0.18, 3, 0.06),
		ink,
		[side * 0.7, 0.42, 0.8]
	);
	mesh(
		`circuit_bar_${side < 0 ? 'left' : 'right'}`,
		new RoundedBoxGeometry(0.12, 0.72, 0.1, 2, 0.025),
		brass,
		[side * 0.87, 0.38, 0.93]
	);
}
mesh('central_spine', new RoundedBoxGeometry(0.42, 1.45, 0.2, 3, 0.06), ink, [0, 0.43, 0.82]);
mesh('central_brass_key', new RoundedBoxGeometry(0.1, 0.58, 0.09, 2, 0.02), brass, [0, 0.35, 0.96]);

// Geometric L monogram on the stamp face.
mesh(
	'monogram_L_vertical',
	new RoundedBoxGeometry(0.22, 0.58, 0.1, 2, 0.025),
	ink,
	[-0.15, -0.56, 0.93]
);
mesh(
	'monogram_L_horizontal',
	new RoundedBoxGeometry(0.68, 0.22, 0.1, 2, 0.025),
	ink,
	[0.08, -0.75, 0.93]
);

// Neck and modular ring handle.
mesh('neck', new THREE.CylinderGeometry(0.45, 0.56, 0.34, 32), ink, [0, 1.55, 0]);
mesh('neck_cinnabar_band', new THREE.CylinderGeometry(0.58, 0.58, 0.2, 32), cinnabar, [0, 1.78, 0]);
mesh('handle_ring', new THREE.TorusGeometry(0.68, 0.19, 16, 48), ink, [0, 2.48, 0], [0, 0, 0]);
mesh('handle_inner_glow', new THREE.TorusGeometry(0.5, 0.055, 12, 48), cinnabar, [0, 2.48, 0.02]);
mesh('handle_join', new RoundedBoxGeometry(0.35, 0.54, 0.42, 4, 0.08), ink, [0, 2.02, 0]);

// Small brass registration marks.
for (const x of [-1.08, 1.08]) {
	mesh(
		`registration_${x < 0 ? 'left' : 'right'}`,
		new RoundedBoxGeometry(0.11, 0.11, 0.08, 2, 0.02),
		brass,
		[x, -0.42, 0.94]
	);
}

root.updateMatrixWorld(true);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(root, {
	binary: true,
	trs: true,
	onlyVisible: true,
	includeCustomExtensions: false
});

await writeFile(new URL('../static/models/living-seal.glb', import.meta.url), Buffer.from(glb));
console.log(`living-seal.glb: ${(glb.byteLength / 1024).toFixed(1)} KiB`);
