const CACHE_NAME = 'flash-demo-cache-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/manifest.json',
    '/static/js/main.js',
    '/static/js/particleAnimation.js',
    '/static/js/3dCube.js',
    '/static/js/svgPath.js',
    '/static/js/fireworks.js',
    '/static/js/dataViz.js',
    '/static/js/fluidSim.js',
    '/static/js/neonText.js',
    '/static/js/carousel.js',
    '/static/js/parallax.js',
    '/static/js/globe.js',
];

self.addEventListener('install', event => {
    // Force this service worker to become active immediately
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache:', CACHE_NAME);
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())  // Take control of all open tabs
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).then(fetchResponse => {
                // Cache new requests dynamically
                if (fetchResponse && fetchResponse.status === 200) {
                    const responseClone = fetchResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return fetchResponse;
            });
        })
    );
});
