/* Gifty loader: preserves the original site and adds the memory creator. */
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
  load('legacy-app.js').then(() => load('memory-feature.js')).catch(console.error);
})();
