self.addEventListener("install", (event) => {
    console.log("Service Worker installed");
    event.waitUntil(
        caches.open("app-cache").then((cache) => {
            return cache.addAll(["/", "/offline.html"]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match("/offline.html"))
    );
});
