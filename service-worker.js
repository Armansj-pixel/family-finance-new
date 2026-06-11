const CACHE = "family-finance-v1";
const STATIC = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // Apps Script API calls: always go to network, never cache
  if (e.request.url.includes("script.google.com")) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
