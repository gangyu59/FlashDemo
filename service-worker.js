const CACHE_NAME = 'v1';
const CACHE_FILES = [
    '/',
    '/index.html',
    '/css/style.css',
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

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CACHE_FILES);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});