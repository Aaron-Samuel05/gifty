/* Render shared Supabase memories using the existing polaroid design. */
(function () {
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  window.GiftyCloudRender = async function () {
    if (!window.GiftyCloudMemories) return;
    const grid = document.getElementById('memory-grid'); if (!grid) return;
    const old = grid.querySelectorAll('.cloud-memory-card'); old.forEach(x => x.remove());
    try {
      const memories = await window.GiftyCloudMemories.load();
      memories.forEach(m => {
        const card = document.createElement('article'); card.className = 'polaroid-card custom-memory-card cloud-memory-card';
        const image = m.images?.[0];
        card.innerHTML = `<div class="polaroid-img-wrapper">${image ? `<img src="${esc(image)}" alt="${esc(m.title)}" class="polaroid-img" loading="lazy"><span class="memory-photo-count">📷 ${m.images.length}</span>` : `<div class="memory-text-preview">💌<br><span style="font-size:.9rem">A memory without a photo</span></div>`}<span class="polaroid-badge">${esc(m.badge)}</span></div><div class="polaroid-caption">${esc(m.title)}</div><div class="polaroid-footer"><span class="polaroid-date">${esc(m.caption || 'New memory')}</span><span class="memory-uploader">💗 ${esc(m.uploader)}</span></div>`;
        card.dataset.category = m.category; card.onclick = () => {
          const imgs = m.images || []; let i = 0;
          const overlay = document.createElement('div'); overlay.className = 'memory-modal active';
          overlay.innerHTML = `<div class="memory-modal-card"><button class="memory-modal-close" type="button">&times;</button><div class="memory-modal-image-wrap">${imgs.length ? `<img class="memory-modal-image" alt="${esc(m.title)}">` : '<div class="memory-text-preview">💌<br>No photo added</div>'}<button class="memory-modal-nav memory-modal-prev" type="button">‹</button><button class="memory-modal-nav memory-modal-next" type="button">›</button></div><div class="memory-modal-text"><h3 class="memory-modal-title">${esc(m.title)}</h3><p class="memory-modal-caption">${esc(m.caption || '')}</p><div class="memory-modal-uploader">📷 Uploaded by ${esc(m.uploader)}</div><div class="memory-modal-counter"></div></div></div>`;
          document.body.appendChild(overlay); const img=overlay.querySelector('.memory-modal-image'), counter=overlay.querySelector('.memory-modal-counter'), prev=overlay.querySelector('.memory-modal-prev'), next=overlay.querySelector('.memory-modal-next');
          const show=()=>{if(!imgs.length)return;img.src=imgs[i];counter.textContent=`Photo ${i+1} of ${imgs.length}`}; show();
          prev.style.display=next.style.display=imgs.length>1?'block':'none'; prev.onclick=e=>{e.stopPropagation();i=(i-1+imgs.length)%imgs.length;show()}; next.onclick=e=>{e.stopPropagation();i=(i+1)%imgs.length;show()}; overlay.querySelector('.memory-modal-close').onclick=()=>overlay.remove(); overlay.onclick=e=>{if(e.target===overlay)overlay.remove()};
        }; grid.appendChild(card);
      });
    } catch (e) { console.error('Gifty cloud memories could not load:', e); }
  };
  const boot = () => { if (window.GiftyCloudMemories) window.GiftyCloudRender(); };
  window.addEventListener('gifty-supabase-ready', boot); window.addEventListener('gifty-cloud-ready', boot);
})();
