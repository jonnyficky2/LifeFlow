const CACHE_NAME = "daily-tracker-v1";

const urlsToCache = [
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./icon.jpg",
  "./manifest.json",
  "./icon2.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

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
);
