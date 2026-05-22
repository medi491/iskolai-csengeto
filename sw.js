const CACHE_NAME = 'csengeto-v10'; // Átírva v10-re, hogy a telefon biztosan frissítsen

// Csak a saját, belső fájljaidat gyorsítótárazzuk!
const ASSETS = [
  'index.html',
  'manifest.json',
  'in.mp3',
  'out.mp3',
  'icon.png'  // Az ikont is elmenti offline használatra
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => console.error("Cache hiba:", err));
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
