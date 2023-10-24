addEventListener('message', (event) => {
  console.log('Message received:', event.data);

  if (event.data.type === 'COUNT') {
    console.log('COUNT', event.data.count);
    caches.open('counter-cache').then((cache) => {
      return cache.put('count', new Response(event.data.count.toString()));
    });
  } else if (event.data.type === 'GET_COUNT') {
    caches.open('counter-cache').then((cache) => {
      cache
        .match('count')
        .then((response) => {
          if (response) {
            return response.text();
          }
          return '0';
        })
        .then((currentValue) => {
          const count = parseInt(currentValue, 10);
          event.source.postMessage({ type: 'INIT_COUNT', count });
        });
    });
  }
});
