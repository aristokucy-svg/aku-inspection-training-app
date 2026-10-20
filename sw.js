self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('train-app-v1').then((cache) => {
            const files = ['./index.html'];
            for(let i=1; i<=41; i++) {
                files.push('./images/' + i + '.png');
            }
            return cache.addAll(files).catch(() => {});
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request).catch(() => {});
        })
    );
});
