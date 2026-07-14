// AGENT state machine — single source of truth for the whole site.
// Svelte 5 runes. Desktop + mobile both consume this.

export type RoomId = '01' | '02' | '03' | '04' | '05' | '06';

export type AgentMode = 'idle' | 'speaking' | 'awaiting' | 'transition';

export interface AgentState {
	room: RoomId;
	mode: AgentMode;
	audioEnabled: boolean;
	intent: string | null;
	uptimeMs: number;
}

function createAgentState() {
	let room = $state<RoomId>('01');
	let mode = $state<AgentMode>('idle');
	let audioEnabled = $state(false);
	let intent = $state<string | null>(null);
	let uptimeMs = $state(0);

	function setRoom(next: RoomId) {
		if (next === room) return;
		mode = 'transition';
		intent = null;
		setTimeout(() => {
			room = next;
			mode = next === '01' ? 'idle' : 'awaiting';
		}, 600);
	}

	function setMode(next: AgentMode) {
		mode = next;
	}

	function toggleAudio() {
		audioEnabled = !audioEnabled;
	}

	function parseIntent(input: string): RoomId | null {
		const k = input.trim().toLowerCase();
		if (k === 'work' || k === 'projects' || k === 'ships') return '03';
		if (k === 'self' || k === 'who' || k === 'about') return '02';
		if (k === 'blog' || k === 'writing' || k === 'posts') return '04';
		if (k === 'now' || k === 'today' || k === 'current') return '05';
		if (k === 'email' || k === 'contact' || k === 'write' || k === 'reach') return '06';
		if (k === 'home' || k === 'manifest' || k === 'start') return '01';
		return null;
	}

	return {
		get room() {
			return room;
		},
		get mode() {
			return mode;
		},
		get audioEnabled() {
			return audioEnabled;
		},
		get intent() {
			return intent;
		},
		get uptimeMs() {
			return uptimeMs;
		},
		setRoom,
		setMode,
		toggleAudio,
		parseIntent,
		setIntent(next: string | null) {
			intent = next;
		},
		tick() {
			uptimeMs = Date.now();
		}
	};
}

export const agent = createAgentState();