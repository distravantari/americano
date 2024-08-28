// service-worker.js

// Install event - caching static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // You can cache assets here if needed
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/css/style.css',
          '/js/app.js',
          // Add other assets you want to cache
        ]);
      })
    );
  });
  
  // Activate event
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
  });
  
  // Fetch event - serving cached content
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  