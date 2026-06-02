const CACHE_NAME = "daily-tracker-v8";

const urlsToCache = [
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  "./",
  "./index.html",
  "./offline.html",
  "./css/style.css",
  "./js/main.js",
  "./js/core/state.js",
  "./js/core/storage.js",
  "./js/core/utils.js",
  "./js/task/task.js",
  "./js/task/calendar.js",
  "./js/habit/habit.js",
  "./js/stats/stats.js",
  "./js/core/notes.js",
  "./js/modules/share.js",
  "./js/ui/modal.js",
  "./js/ui/section.js",
  "./js/modules/theme.js",
  "./assets/icons/icon.jpg",
  "./assets/libs/chart.umd.js",
  "./assets/libs/confetti.js",
  "./manifest.json",
  "./js/core/quotes.js"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Hapus cache versi lama
          }
        })
      );
    })
  );
});

const isNavigationRequest = request =>
  request.mode === "navigate" ||
  (request.method === "GET" && request.headers.get("accept")?.includes("text/html"));

self.addEventListener("fetch", event => {
  const request = event.request;

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match("./offline.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      return (
        response ||
        fetch(request).then(networkResponse => {
          if (request.method === "GET") {
            caches.open(CACHE_NAME).then(cache => cache.put(request, networkResponse.clone()));
          }
          return networkResponse;
        })
      ).catch(() => {
        if (request.destination === "image") {
          return new Response(null, { status: 404 });
        }
        return caches.match("./offline.html");
      });
    })
  );
});
