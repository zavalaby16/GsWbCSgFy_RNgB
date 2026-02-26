const CACHE_NAME = "monkey-game-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Instalación: Guarda todo en la memoria
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activación: Borra cachés viejas si cambias el nombre (v1 a v2)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch: El corazón del modo offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en caché, lo devuelve. Si no, lo busca en internet.
      return response || fetch(event.request).catch(() => {
        // Si falla internet y no está en caché, intenta devolver el index.html
        return caches.match("./index.html");
      });
    })
  );
});
