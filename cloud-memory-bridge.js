/* Connect the existing Create Memory UI to shared Supabase storage. */
(function () {
  'use strict';
  const run = () => {
    if (!window.GiftyCloudMemories) return;
    const form = document.getElementById('memory-form');
    if (!form || form.dataset.cloudBound) return;
    form.dataset.cloudBound = 'true';
    form.addEventListener('submit', async e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const files = [...document.getElementById('mfiles').files].slice(0, 12);
      const memory = {
        title: document.getElementById('mtitle').value.trim(),
        uploader: document.getElementById('muser').value.trim(),
        caption: document.getElementById('mcaption').value.trim(),
        category: document.getElementById('mcat').value,
        badge: document.getElementById('mbadge').value.trim() || 'New Memory 💖'
      };
      if (!memory.title || !memory.uploader) return;
      const button = form.querySelector('button[type="submit"]');
      const old = button.textContent; button.disabled = true; button.textContent = 'Uploading… ☁️';
      try {
        await window.GiftyCloudMemories.create(memory, files);
        form.reset(); document.getElementById('mbadge').value = 'New Memory 💖'; document.getElementById('mpreview').innerHTML = '';
        document.getElementById('memory-creator').classList.remove('active');
        await window.GiftyCloudRender();
        if (typeof playPopSFX === 'function') playPopSFX(900);
      } catch (err) {
        console.error(err);
        alert('Could not upload this memory. Make sure the Supabase SQL setup has been run.');
      } finally { button.disabled = false; button.textContent = old; }
    }, true);
  };
  window.addEventListener('gifty-cloud-ready', run);
  if (window.GiftyCloudMemories) run();
})();
