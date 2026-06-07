const CACHE = 'cd-eats-v2';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/data.js',
  './js/db.js',
  './js/map.js',
  './js/diary.js',
  './js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(FILES.map(f => c.add(f).catch(() => {})));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  // Only cache our own origin
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE).then(c => {
          try { c.put(e.request, clone); } catch(_) {}
        });
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
