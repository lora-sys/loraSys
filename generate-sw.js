import { generateSW } from 'workbox-build';

const swDest = './static/sw.js';

generateSW({
  swDest,
  globDirectory: './static',
  globPatterns: [
    '**/*.{js,css,html,png,jpg,jpeg,webp,svg,woff,woff2}'
  ],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
        cacheKeyWillBeUsed: async ({ request }) => {
          return `${request.url}?v=1`;
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/i\.pinimg\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'pinterest-images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/pub-83c5db439b40468498f97946200806f7\.r2\.dev\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'portfolio-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/cdn\.magicui\.design\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'magic-ui-assets',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
  ],
  skipWaiting: true,
  clientsClaim: true,
}).then(({ count, size, warnings }) => {
  if (warnings.length > 0) {
    console.warn('Warnings encountered while generating a service worker:', warnings);
  }
  console.log(`✅ Service worker generated successfully!
📊 Cached ${count} files, totaling ${(size / 1024 / 1024).toFixed(2)} MB`);
}).catch((error) => {
  console.error('❌ Error generating service worker:', error);
});