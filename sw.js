const CACHE_NAME = "lifeflow-v17"; // Increment cache version for new file structure

const urlsToCache = [
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  "./",
  "./index.html",
  "./offline.html",
  "./css/style.css",
  // Assets
  "./assets/icons/icon.svg",
  "./assets/icons/people.png",
  "./assets/libs/chart.umd.js",
  "./assets/libs/confetti.js",
  "./manifest.json",
  // Core JS files
  "./js/main.js",
  "./js/core/state.js",
  "./js/core/quotes.js",
  "./js/core/utils.js",
  "./js/core/storage.js",
  "./js/core/notes.js",
  "./js/core/constant.js",
  "./js/core/xp.js",
  "./js/habit/habit.js",
  "./js/habit/habitStats.js",
  "./js/task/task.js",
  "./js/task/calendar.js",
  "./js/task/filter.js",
  "./js/task/taskStats.js",
  "./js/stats/stats.js",
  "./js/stats/chart.js",
  "./js/stats/heatmap.js",
  "./js/stats/streak.js",
  "./js/modules/settings.js",
  "./js/modules/focus.js",
  "./js/modules/cloud-sync.js",
  "./js/modules/firebase-config.js",
  "./js/modules/share.js",
  "./js/modules/theme.js",
  "./js/modules/modal.js",
  "./js/modules/pwa.js",
  "./js/modules/notification.js",
  "./js/navbar/navbar.js",
  "./js/ui/modal.js",
  "./js/ui/section.js",
  "./js/ui/animation.js",
  "./js/ui/splash.js",
  "./js/ui/toast.js",
  "./js/pwa/install.js",
  "./js/pwa/offline.js",
  "./js/pwa/sw-register.js"
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
  const url = new URL(request.url);

  // Bypass Firebase, Google Auth, dan URL Redirect agar login tidak loop/refresh terus
  if (
    url.hostname.includes("firebase") ||
    url.hostname.includes("googleapis") ||
    url.pathname.includes("/__/auth") ||
    url.pathname.includes("firebase-config.js") || // Jangan cache config agar export selalu up-to-date
    url.hostname.includes("googleusercontent.com") || 
    url.searchParams.has("__firebase_request_key") ||
    url.searchParams.has("apiKey") ||
    !url.href.startsWith(self.location.origin)
  ) {
    return;
  }

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
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
      if (response) {
        return response;
      }
      return fetch(request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || request.method !== "GET") {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return networkResponse;
      });
    }).catch(() => {
      if (request.destination === "image") {
        return new Response(null, { status: 404 });
      }
      return caches.match("./offline.html");
    })
  );
});
