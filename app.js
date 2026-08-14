/* Gifty loader: load the original site logic and memory feature before firing DOMContentLoaded. */
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

  Promise.all([load('legacy-app.js'), load('memory-feature.js')])
    .then(() => {
      // Both scripts register DOMContentLoaded handlers. Because app.js itself
      // is loaded after the DOM event normally fires, trigger it once now.
      document.dispatchEvent(new Event('DOMContentLoaded'));
    })
    .catch(error => console.error('Gifty initialization failed:', error));
})();
