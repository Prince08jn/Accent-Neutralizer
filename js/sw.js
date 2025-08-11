// Service Worker for Offline Functionality
const CACHE_NAME = 'accent-neutralizer-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache for offline access
const STATIC_FILES = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/styles/components.css',
  '/styles/advanced.css',
  '/styles/home-enhancements.css',
  '/js/main.js',
  '/js/transcription.js',
  '/js/translation.js',
  '/js/meetings.js',
  '/js/analytics.js',
  '/js/team.js',
  '/js/settings.js',
  '/js/ai-features.js',
  '/js/websocket.js',
  '/js/offline-manager.js',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                console.log('Caching dynamic content:', request.url);
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(() => {
            // Network failed, try to serve offline fallback
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // For other requests, return a custom offline response
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data function
async function syncOfflineData() {
  try {
    console.log('Syncing offline data...');
    
    // Open IndexedDB and get queued data
    const db = await openDB();
    const queuedItems = await getQueuedItems(db);
    
    for (const item of queuedItems) {
      await syncItem(item);
    }
    
    // Clear synced items from queue
    await clearSyncedItems(db);
    
    console.log('Offline data synced successfully');
  } catch (error) {
    console.error('Failed to sync offline data:', error);
    throw error;
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AccentNeutralizerDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getQueuedItems(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['queue'], 'readonly');
    const objectStore = transaction.objectStore('queue');
    const request = objectStore.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function syncItem(item) {
  // Simulate API call to sync item
  console.log('Syncing item:', item);
  
  // In a real implementation, you would make actual API calls here
  await new Promise(resolve => setTimeout(resolve, 1000));
}

function clearSyncedItems(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['queue'], 'readwrite');
    const objectStore = transaction.objectStore('queue');
    const request = objectStore.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Push notifications for updates
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Accent Neutralizer', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
