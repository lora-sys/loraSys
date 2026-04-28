// Service Worker for caching static assets
const STATIC_CACHE = 'portfolio-static-v1';
const DYNAMIC_CACHE = 'portfolio-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = ['/', '/manifest.json', '/favicon.png'];

// Install event - cache static assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => {
				return cache.addAll(STATIC_ASSETS);
			})
			.then(() => self.skipWaiting())
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => self.clients.claim())
	);
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') return;

	// Handle different types of requests
	if (url.origin === location.origin) {
		// Same-origin requests
		event.respondWith(
			caches.match(request).then((cachedResponse) => {
				if (cachedResponse) {
					return cachedResponse;
				}

				return fetch(request).then((response) => {
					// Don't cache non-successful responses
					if (!response.ok) return response;

					// Cache static assets
					if (
						request.destination === 'script' ||
						request.destination === 'style' ||
						request.destination === 'image' ||
						request.destination === 'font' ||
						url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff|woff2)$/i)
					) {
						const responseClone = response.clone();
						caches.open(STATIC_CACHE).then((cache) => {
							cache.put(request, responseClone);
						});
					}

					return response;
				});
			})
		);
	} else {
		// External requests - cache fonts and images
		if (
			url.hostname.includes('fonts.googleapis.com') ||
			url.hostname.includes('fonts.gstatic.com') ||
			url.hostname.includes('i.pinimg.com') ||
			url.hostname.includes('pub-83c5db439b40468498f97946200806f7.r2.dev') ||
			url.hostname.includes('cdn.magicui.design')
		) {
			event.respondWith(
				caches.match(request).then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse;
					}

					return fetch(request).then((response) => {
						if (response.ok) {
							const responseClone = response.clone();
							caches.open(DYNAMIC_CACHE).then((cache) => {
								cache.put(request, responseClone);
							});
						}
						return response;
					});
				})
			);
		}
	}
});
