// ============================================================
// PHOTOSYRNIK — SERVICE WORKER (ОФЛАЙН-РЕЖИМ)
// ============================================================

const CACHE_NAME = 'photosyrnik-v3';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/portfolio.html',
    '/prices.html',
    '/contacts.html',
    '/login.html',
    '/admin.html',
    '/private/client.html',
    '/css/style.css',
    '/js/main.js',
    '/js/sw.js',
    '/manifest.json',
    '/offline.html',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;700;900&display=swap'
];

// ===== УСТАНОВКА =====
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// ===== ЗАПРОСЫ =====
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.hostname.includes('google-analytics') || url.hostname.includes('doubleclick')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    fetch(request).then(freshResponse => {
                        if (freshResponse && freshResponse.status === 200) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, freshResponse);
                            });
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }

                return fetch(request)
                    .then(response => {
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, clone);
                            });
                        }
                        return response;
                    })
                    .catch(() => {
                        if (request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        return new Response('Нет интернета', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// ===== АКТИВАЦИЯ =====
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});
