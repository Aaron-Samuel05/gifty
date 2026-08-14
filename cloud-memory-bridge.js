/* Connect Gifty's existing memory UI to shared Supabase storage. */
(function () {
  'use strict';
  let bound = false;
  const esc = v => String(v ?? '').replace(/[&<>\'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  async function loadCloud() {
    if (!window.GiftyCloudMemories) return;
    try {
      const memories = await window.GiftyCloudMemories.load();
      window.GiftyCloudRender = () => render(memories);
      render(memories);
      const note = document.querySelector('.memory-sync-note');
      if (note) note.textContent = '☁️ Shared online — everyone can see new memories.';
    } catch (err) {
      console.error('Gifty Supabase load failed:', err);
      const note = document.querySelector('.memory-sync-note');
      if (note) note.textContent = '⚠️ Supabase is connected, but run supabase-schema.sql in Supabase first.';
    }
  }

  function render(memories) {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    grid.querySelectorAll('.cloud-memory-card').forEach(e => e.remove());
    memories.slice().reverse().forEach(m => {
      const card = document.createElement('article');
      card.className = 'polaroid-card custom-memory-card cloud-memory-card';
      card.dataset.category = m.category || 'cute';
      const first = m.images?.[0];
      const photo = first
        ? `<img src="${esc(first)}" alt="${esc(m.title)}" class="polaroid-img" loading="lazy"><span class="memory-photo-count">📷 ${m.images.length}</span>`
        : `<div class="memory-text-preview">💌<br><span style="font-size:.9rem">A memory without a photo</span></div>`;
      const date = m.created_at ? new Date(m.created_at).toLocaleDateString() : 'New memory';
      card.innerHTML = `<div class="polaroid-img-wrapper">${photo}<span class="polaroid-badge">${esc(m.badge || 'New Memory 💖')}</span></div><div class="polaroid-caption">${esc(m.title)}</div><div class="polaroid-footer"><span class="polaroid-date">${esc(m.caption || date)}</span><span class="memory-uploader">💗 ${esc(m.uploader)}</span></div>`;
      card.addEventListener('click', () => openViewer(m));
      grid.appendChild(card);
    });
  }

  function openViewer(m) {
    let viewer = document.getElementById('cloud-memory-viewer');
    if (!viewer) {
      viewer = document.createElement('div');
      viewer.className = 'memory-modal';
      viewer.id = 'cloud-memory-viewer';
      viewer.innerHTML = `<div class="memory-modal-card"><button class="memory-modal-close" type="button">&times;</button><div class="memory-modal-image-wrap"><img class="memory-modal-image" id="cloud-vimg" alt="Memory photo"><button class="memory-modal-nav memory-modal-prev" type="button">‹</button><button class="memory-modal-nav memory-modal-next" type="button">›</button></div><div class="memory-modal-text"><h3 class="memory-modal-title" id="cloud-vtitle"></h3><p class="memory-modal-caption" id="cloud-vcaption"></p><div class="memory-modal-uploader" id="cloud-vuser"></div><div class="memory-modal-counter" id="cloud-vcounter"></div></div></div>`;
      document.body.appendChild(viewer);
      viewer.querySelector('.memory-modal-close').onclick = () => viewer.classList.remove('active');
      viewer.onclick = e => { if (e.target === viewer) viewer.classList.remove('active'); };
    }
    let index = 0;
    const imgs = m.images || [];
    const show = () => {
      document.getElementById('cloud-vtitle').textContent = m.title;
      document.getElementById('cloud-vcaption').textContent = m.caption || 'A little moment worth keeping forever. 💕';
      document.getElementById('cloud-vuser').textContent = '📷 Uploaded by ' + m.uploader;
      const img = document.getElementById('cloud-vimg'), prev = viewer.querySelector('.memory-modal-prev'), next = viewer.querySelector('.memory-modal-next');
      if (!imgs.length) { img.style.display='none'; prev.style.display=next.style.display='none'; document.getElementById('cloud-vcounter').textContent='Text memory • no photos added'; }
      else { img.style.display='block'; img.src=imgs[index]; prev.style.display=next.style.display=imgs.length>1?'block':'none'; document.getElementById('cloud-vcounter').textContent=`Photo ${index+1} of ${imgs.length}`; }
    };
    viewer.querySelector('.memory-modal-prev').onclick = () => { index=(index-1+imgs.length)%imgs.length; show(); };
    viewer.querySelector('.memory-modal-next').onclick = () => { index=(index+1)%imgs.length; show(); };
    viewer.classList.add('active'); show();
  }

  function bindForm() {
    if (bound || !window.GiftyCloudMemories) return;
    const form = document.getElementById('memory-form');
    if (!form) return;
    bound = true;
    form.addEventListener('submit', async e => {
      e.preventDefault(); e.stopImmediatePropagation();
      const files = [...document.getElementById('mfiles').files].slice(0, 12);
      const memory = { title:document.getElementById('mtitle').value.trim(), uploader:document.getElementById('muser').value.trim(), caption:document.getElementById('mcaption').value.trim(), category:document.getElementById('mcat').value, badge:document.getElementById('mbadge').value.trim() || 'New Memory 💖' };
      if (!memory.title || !memory.uploader) return;
      const button = form.querySelector('button[type="submit"]'); const old=button.textContent; button.disabled=true; button.textContent='Uploading… ☁️';
      try {
        await window.GiftyCloudMemories.create(memory, files);
        form.reset(); document.getElementById('mbadge').value='New Memory 💖'; document.getElementById('mpreview').innerHTML=''; document.getElementById('memory-creator').classList.remove('active');
        await loadCloud();
        if (typeof playPopSFX==='function') playPopSFX(900);
      } catch(err) { console.error(err); alert('Could not upload this memory. Run supabase-schema.sql in Supabase first, then try again.'); }
      finally { button.disabled=false; button.textContent=old; }
    }, true);
  }

  function start() { bindForm(); if (window.GiftyCloudMemories) loadCloud(); }
  window.addEventListener('gifty-cloud-ready', start);
  document.addEventListener('DOMContentLoaded', start);
  setTimeout(start, 1500);
})();
