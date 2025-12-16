const PUBLIC_CACHE_NAME = 'polyglot-public-v1';

// Files from the public folder that should be cached permanently
const PUBLIC_FILES = [
  '/polyglot/junda_frequency_list.json',
  '/polyglot/wiktionary.tsv'
];

// Runtime cache for app shell and other assets
const RUNTIME_CACHE = 'polyglot-runtime';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PUBLIC_CACHE_NAME).then((cache) => {
      // Cache public files permanently
      return cache.addAll(PUBLIC_FILES);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Clean up old caches but keep the public cache
          if (cacheName !== PUBLIC_CACHE_NAME && 
              cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for:
  // 1. Chrome extension requests
  // 2. Non-HTTP(S) requests
  // 3. API calls (LLM endpoints)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Skip caching for API calls (OpenAI, Firebase, etc.)
  if (url.hostname.includes('openai.com') ||
      url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis.com') ||
      url.pathname.includes('/api/')) {
    return;
  }

  event.respondWith(
    (async () => {
      // Check if this is a public file (should never be re-fetched)
      const isPublicFile = PUBLIC_FILES.some(file => url.pathname.endsWith(file.split('/').pop()));
      
      if (isPublicFile) {
        // For public files, always use cache first, never update
        const cachedResponse = await caches.match(request, { cacheName: PUBLIC_CACHE_NAME });
        if (cachedResponse) {
          return cachedResponse;
        }
        // If not in cache yet, fetch and cache
        const response = await fetch(request);
        const cache = await caches.open(PUBLIC_CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      }

      // For other resources, use network-first strategy with runtime cache fallback
      try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, response.clone());
        }
        
        return response;
      } catch (error) {
        // If network fails, try to serve from cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If not in cache, return error
        throw error;
      }
    })()
  );
});
