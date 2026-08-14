/* Shared memory API for Gifty. Requires supabase-schema.sql to be run once. */
(function () {
  'use strict';
  const ready = fn => window.giftySupabase ? fn() : window.addEventListener('gifty-supabase-ready', fn, { once: true });
  const api = {
    async load() {
      const { data, error } = await window.giftySupabase.from('memories').select('id,title,uploader,caption,category,badge,created_at,memory_photos(id,storage_path,sort_order)').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(m => ({ ...m, images: (m.memory_photos || []).sort((a,b) => a.sort_order-b.sort_order).map(p => window.giftySupabase.storage.from('memory-photos').getPublicUrl(p.storage_path).data.publicUrl) }));
    },
    async create(memory, files) {
      const { data: row, error: rowError } = await window.giftySupabase.from('memories').insert({ title: memory.title, uploader: memory.uploader, caption: memory.caption, category: memory.category, badge: memory.badge }).select().single();
      if (rowError) throw rowError;
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
          const path = `${row.id}/${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await window.giftySupabase.storage.from('memory-photos').upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type || 'image/jpeg' });
          if (uploadError) throw uploadError;
          const { error: photoError } = await window.giftySupabase.from('memory_photos').insert({ memory_id: row.id, storage_path: path, sort_order: i });
          if (photoError) throw photoError;
        }
        return row;
      } catch (error) {
        // The public policy intentionally does not allow deletion, so an incomplete upload is left for the owner to clean up.
        throw error;
      }
    }
  };
  window.GiftyCloudMemories = api;
  ready(() => window.dispatchEvent(new Event('gifty-cloud-ready')));
})();
