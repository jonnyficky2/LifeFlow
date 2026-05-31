<<<<<<< HEAD
const CACHE_NAME = "daily-tracker-v1";
=======
const CACHE_NAME = "daily-tracker-v6";
>>>>>>> versi-backup-terbaru

const urlsToCache = [
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  "./",
  "./index.html",
<<<<<<< HEAD
  "./style.css",
  "./script.js",
  "./icon.jpg",
  "./chart.umd.js",
  "./confetti.js",
  "./manifest.json",
  "./quotes.js",
  "./icon2.png"
=======
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
  "./js/quotes.js"
>>>>>>> versi-backup-terbaru
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

<<<<<<< HEAD
=======
self.addEventListener("activate", event => {
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

>>>>>>> versi-backup-terbaru
self.addEventListener(
  "fetch",
  event => {

    event.respondWith(

      caches.match(
        event.request
      )
      .then(response => {

        return (
          response ||
          fetch(event.request)
          .catch(() => {

            return caches.match(
              "./index.html"
            );
          })
        );
      })
    );
  }
<<<<<<< HEAD
);
=======
);
>>>>>>> versi-backup-terbaru
