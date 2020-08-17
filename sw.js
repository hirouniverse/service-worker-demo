const CACHE_NAME = 'cache-v1'
const RUNTIME = 'runtime';
const TARGET_CACHING_URL = [
  '/',
  '/scripts/app.js',
]

self.addEventListener('install', function(event) {
  console.log('proceeding installation...')  
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('cache opened...')
      return cache.addAll(TARGET_CACHING_URL)
    })
    .then(self.skipWaiting())
    .catch(function(err) {
    })
  )
})

self.addEventListener('activate', function(event) {
  console.log('proceeding activation...')
  const currentCaches = [CACHE_NAME, RUNTIME];
  event.waitUntil(
    caches.keys()
    .then(function(cacheNames) {
      return cacheNames.filter(function(cacheName) {
        return !currentCaches.includes(cacheName)
      })
    })
    .then(function(cachesToDelete) {
      return Promise.all(cachesToDelete.map(function(cacheToDelete) {
        return caches.delete(cacheToDelete)
      }))
    })
    .then(function() {
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', function(event) {
  console.log('proceeding fetch...')
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(function(cachedResponse) {
        if (cachedResponse) {
          return cachedResponse
        }

        return caches.open(RUNTIME).then(function(cache) {
          return fetch(event.request).then(function(response) {
            return cache.put(event.request, response.clone()).then(function() {
              return response
            })
          })
        })
      })
    )
  }
})
