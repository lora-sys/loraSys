import type { Action } from 'svelte/action';

/** Fade-up reveal on scroll using IntersectionObserver. */
export const reveal: Action<HTMLElement> = (node) => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);
	return {
		destroy() {
			observer.disconnect();
		}
	};
};
