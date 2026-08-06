import Lenis from 'lenis';

/**
 * Lenis singleton — shared across the app.
 * Initialized once in +layout.svelte, destroyed on unmount.
 */
let _instance: Lenis | null = null;
let _rafId: number | null = null;

export function getLenis(): Lenis | null {
	return _instance;
}

export function initLenis(): Lenis {
	if (_instance) return _instance;

	const lenis = new Lenis({
		duration: 1.2,
		smoothWheel: true,
		gestureOrientation: 'vertical',
		lerp: 0.08
	});
	_instance = lenis;

	const raf = (time: number) => {
		lenis.raf(time);
		_rafId = requestAnimationFrame(raf);
	};
	_rafId = requestAnimationFrame(raf);

	return lenis;
}

export function destroyLenis(): void {
	if (_rafId !== null) {
		cancelAnimationFrame(_rafId);
		_rafId = null;
	}
	_instance?.destroy();
	_instance = null;
}
