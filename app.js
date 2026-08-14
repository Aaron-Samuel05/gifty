/* Gifty loader: load the original site logic, memory UI, and cloud memory bridge before firing DOMContentLoaded. */
(function () {
  function load(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  Promise.all([
    load('legacy-app.js'),
    load('memory-feature.js'),
    load('supabase-client.js')
  ])
    .then(() => load('supabase-memory.js'))
    .then(() => load('cloud-memory-bridge.js'))
    .then(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    })
    .catch(error => console.error('Gifty initialization failed:', error));
})();
