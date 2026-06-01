// ============================================================
// sw.js - Service Worker for PWA offline support
// Caches key assets on install and serves them when offline
// ============================================================

// Cache version name - update this string to force cache refresh
const CACHE_NAME = "student-portal-v1";

// List of files to cache when the service worker is first installed
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
];

// ─── Install Event ────────────────────────────────────────────
// Fired when the service worker is first installed.
// Opens the cache and stores the listed assets.
self.addEventListener("install", (event) => {
  console.log("[SW] Installing Service Worker...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );

  // Immediately activate without waiting for old SW to finish
  self.skipWaiting();
});

// ─── Activate Event ───────────────────────────────────────────
// Fired when the service worker becomes active.
// Cleans up any old caches from previous versions.
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating Service Worker...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // Find old caches
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name); // Delete old caches
          })
      );
    })
  );

  // Take control of all open pages immediately
  self.clients.claim();
});

// ─── Fetch Event ─────────────────────────────────────────────
// Fired on every network request made by the app.
// Strategy: Cache First - serve from cache if available,
// otherwise fetch from network and cache the response.
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests (POST, PUT, DELETE etc. go straight to network)
  if (event.request.method !== "GET") return;

  // Skip API calls - always fetch those from network for fresh data
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network and cache for next time
      return fetch(event.request).then((networkResponse) => {
        // Only cache valid successful responses
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }

        // Clone the response - it can only be consumed once
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});