// service-worker.js

// Initialize the cache when the service worker is installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('counter-cache').then((cache) => {
      return cache.put('counter', new Response('0'));
    })
  );
});

// Listen for messages from the main application
self.addEventListener('message', (event) => {
  const { action, value } = event.data;

  if (action === 'increment' || action === 'decrement') {
    // Get the current counter value from the cache
    caches
      .open('counter-cache')
      .then((cache) => {
        return cache.match('counter');
      })
      .then((response) => {
        return response.text();
      })
      .then((currentValue) => {
        let newValue = parseInt(currentValue, 10);

        // Update the counter based on the action
        if (action === 'increment') {
          newValue++;
        } else if (action === 'decrement') {
          newValue--;
        }

        // Store the new counter value in the cache
        caches.open('counter-cache').then((cache) => {
          cache.put('counter', new Response(newValue.toString()));
        });

        // Send the updated value back to the main application
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ action: 'update', value: newValue });
          });
        });
      });
  }
});
