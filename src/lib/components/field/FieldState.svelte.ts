// FIELD state machine — depth progress + active node
// Svelte 5 runes.

export type DepthLayer = 0 | 1 | 2 | 3 | 4;

export interface FieldNode {
	id: string;
	layer: DepthLayer;
	text: string;
	kind: 'claim' | 'meta' | 'project' | 'idea' | 'reach';
	href?: string;
	mailto?: string;
	blurb?: string;
	breathePeriod: number; // seconds
	breatheOffset: number; // 0..1 phase
}

function createFieldState() {
	let depthProgress = $state(0); // 0 (layer 0) to 1 (layer 4)
	let activeNodeId = $state<string | null>(null);
	let audioEnabled = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	function setDepth(p: number) {
		depthProgress = Math.max(0, Math.min(1, p));
	}

	function openNode(id: string) {
		activeNodeId = activeNodeId === id ? null : id;
	}

	function closeNode() {
		activeNodeId = null;
	}

	function toggleAudio() {
		audioEnabled = !audioEnabled;
	}

	function setMouse(x: number, y: number) {
		mouseX = x;
		mouseY = y;
	}

	return {
		get depthProgress() {
			return depthProgress;
		},
		get activeNodeId() {
			return activeNodeId;
		},
		get audioEnabled() {
			return audioEnabled;
		},
		get mouseX() {
			return mouseX;
		},
		get mouseY() {
			return mouseY;
		},
		get currentLayer() {
			return Math.round(depthProgress * 4) as DepthLayer;
		},
		setDepth,
		openNode,
		closeNode,
		toggleAudio,
		setMouse
	};
}

export const field = createFieldState();