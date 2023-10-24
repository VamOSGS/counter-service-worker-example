// self.addEventListener('install', () => {
//   caches.open('counter-cache').then((cache) => {
//     cache
//       .match('count')
//       .then((response) => {
//         if (response) {
//           return response.text();
//         }
//         return '0';
//       })
//       .then((currentValue) => {
//         const count = parseInt(currentValue, 10);
//         self.clients.matchAll().then((clients) => {
//           console.log('clients', clients);
//           clients.forEach((client) => {
//             console.log('SEND MESSAGE FROM SW', count);
//             client.postMessage({ type: 'INIT_COUNT', count });
//           });
//         });
//       });
//   });
// });

self.addEventListener('activate', () => {
  self.clients.matchAll().then((clients) => {
    console.log('activate clients', clients);
    clients.forEach((client) => {
      client.postMessage({ type: 'SW_ACTIVATED' });
    });
  });
});

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
