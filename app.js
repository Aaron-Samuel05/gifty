/* Gifty loader: load original logic, memory UI, shared Supabase memory support, and memory manager before firing DOMContentLoaded. */
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
    .then(() => Promise.all([load('supabase-memory.js'), load('cloud-memory-render.js')]))
    .then(() => Promise.all([load('cloud-memory-bridge.js'), load('memory-manager.js')]))
    .then(() => document.dispatchEvent(new Event('DOMContentLoaded')))
    .catch(error => console.error('Gifty initialization failed:', error));
})();
