const CACHE_NAME = 'electionguide-v1';
const ASSETS = [
  '/',
  '/app.html',
  '/src/css/app.css',
  '/src/js/app.js',
  '/src/js/api.js',
  '/src/js/ui.js',
  '/src/js/auth.js',
  '/src/js/state.js',
  '/src/js/login.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
