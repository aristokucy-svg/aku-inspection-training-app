self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('train-app-v1').then((cache) => {
            const files = ['./', './index.html'];
            for (let i = 1; i <= 41; i++) {
                files.push('./images/' + i + '.png');
            }
            files.push('./icon.svg');
            return cache.addAll(files).catch(() => {});
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open('train-app-v1').then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return networkResponse;
                })
                .catch(() => caches.match('./index.html'));
        })
    );
});
