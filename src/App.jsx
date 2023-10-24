import { useCallback, useState } from 'react';
import './App.css';
import { useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [isSWReady, setIsSWReady] = useState(false);

  const sendMessage = useCallback(() => {
    setCount((prev) => prev + 1);
    if (!isSWReady) {
      return;
    }

    if (navigator.serviceWorker.controller) {
      const input = {
        type: 'COUNT',
        count: count + 1,
      };
      navigator.serviceWorker.controller.postMessage(input, {});
    } else {
      console.log(
        'navigator.serviceWorker NOT AVAILABLE',
        navigator.serviceWorker
      );
      navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage({
          type: 'COUNT',
          count: count + 1,
        });
      });
    }
  }, [count, isSWReady]);

  useEffect(() => {
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      console.log('New service worker has taken control');
      location.reload();
    });
    navigator.serviceWorker.ready.then((registration) => {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, count } = event.data;
        if (type === 'INIT_COUNT') {
          setCount(count);
          setIsSWReady(true);
        }
      });

      console.log(navigator.serviceWorker.controller, 'controller');

      registration.active.postMessage({
        type: 'GET_COUNT',
      });
    });
  }, []);

  return (
    <>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={sendMessage}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
