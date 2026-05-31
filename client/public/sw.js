// NurseNote AI — Service Worker
// Caches all static assets; Groq API calls always go to network.

const CACHE = 'nursenote-v1';

const STATIC_EXTENSIONS = [
  '.js', '.css', '.html', '.woff', '.woff2', '.png', '.svg', '.ico', '.json',
];

function isStaticAsset(url) {
  const u = new URL(url);
  // Never cache Groq API
  if (u.hostname === 'api.groq.com') return false;
  // Cache Google Fonts
  if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') return true;
  // Cache same-origin requests with static extensions
  if (u.origin === self.location.origin) {
    return STATIC_EXTENSIONS.some((ext) => u.pathname.endsWith(ext)) || u.pathname === '/';
  }
  return false;
}

// Install: pre-cache app shell
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(['/', '/manifest.json', '/icon-192.png', '/icon-512.png'])
        .catch(() => {}), // Ignore failures — files may not exist yet during dev
    ),
  );
});

// Activate: delete old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

// Fetch: cache-first for static assets, network-only for Groq
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Groq API — always network, never cache
  if (url.hostname === 'api.groq.com') return;

  if (isStaticAsset(request.url)) {
    e.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') return response;
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
          return response;
        });
      }),
    );
    return;
  }

  // Navigation requests — serve app shell for SPA routing
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/').then((r) => r || Response.error())),
    );
  }
});
