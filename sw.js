const CACHE_NAME = 'calories-cachees-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Calculateur-de-calories192.png',
  '/Calculateur-de-calories512.png'
];

// Installation du service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Mise à jour du cache
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestion des notifications push (optionnel)
self.addEventListener('push', function(event) {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/Calculateur-de-calories192.png',
      badge: '/Calculateur-de-calories192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Calories Cachées', options)
    );
  }
});

// Gestion du clic sur notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
