const CACHE_NAME = 'auction-pwa-v14-session-allocation-return-undo';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest?v=14',
  './icon/rk-icon-192-v12.png',
  './icon/rk-icon-512-v12.png',
  './icon/rk-apple-touch-v12.png',
  './icon/rk-favicon-v12.png',
  './assets/rk-splash-v12.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        const results = await Promise.allSettled(
          APP_SHELL.map(url => cache.add(url))
        );
        const failed = results
          .map((result, index) => ({ result, url: APP_SHELL[index] }))
          .filter(item => item.result.status === 'rejected');

        if (failed.length) {
          console.warn('[PWA V14] Some optional files were not cached:', failed);
        }
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            caches.open(CACHE_NAME)
              .then(cache => cache.put('./index.html', response.clone()));
          }
          return response;
        })
        .catch(async () =>
          (await caches.match('./index.html')) ||
          (await caches.match('./'))
        )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok) {
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
