const CACHE_NAME = 'csengeto-v3';

// Most már a helyi fájlokat menti le offline használatra
const ASSETS = [
  'index.html',
  'manifest.json',
  'becsengetes.mp3',
  'kicsengetes.mp3',
  'https://mixkit.co', // Biztonsági tartalék
  'https://flaticon.com'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
