/* Shared memory API for Gifty. Requires supabase-schema.sql to be run once. */
(function () {
  'use strict';
  const ready = fn => window.giftySupabase ? fn() : window.addEventListener('gifty-supabase-ready', fn, { once: true });
  const storage = () => window.giftySupabase.storage.from('memory-photos');
  const api = {
    async load() {
      const { data, error } = await window.giftySupabase.from('memories').select('id,title,uploader,caption,category,badge,created_at,memory_photos(id,storage_path,sort_order)').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(m => ({ ...m, images: (m.memory_photos || []).sort((a,b) => a.sort_order-b.sort_order).map(p => storage().getPublicUrl(p.storage_path).data.publicUrl), photoRows: (m.memory_photos || []).sort((a,b) => a.sort_order-b.sort_order) }));
    },
    async create(memory, files) {
      const { data: row, error: rowError } = await window.giftySupabase.from('memories').insert({ title: memory.title, uploader: memory.uploader, caption: memory.caption, category: memory.category, badge: memory.badge }).select().single();
      if (rowError) throw rowError;
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
          const path = `${row.id}/${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await storage().upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type || 'image/jpeg' });
          if (uploadError) throw uploadError;
          const { error: photoError } = await window.giftySupabase.from('memory_photos').insert({ memory_id: row.id, storage_path: path, sort_order: i });
          if (photoError) throw photoError;
        }
        return row;
      } catch (error) { throw error; }
    },
    async update(id, memory, files, replacePhotos) {
      const { error } = await window.giftySupabase.from('memories').update({ title: memory.title, uploader: memory.uploader, caption: memory.caption, category: memory.category, badge: memory.badge }).eq('id', id);
      if (error) throw error;
      if (!replacePhotos || !files.length) return;
      const { data: oldRows, error: oldError } = await window.giftySupabase.from('memory_photos').select('storage_path').eq('memory_id', id);
      if (oldError) throw oldError;
      const oldPaths = (oldRows || []).map(r => r.storage_path);
      if (oldPaths.length) { const { error: removeError } = await storage().remove(oldPaths); if (removeError) throw removeError; }
      const { error: deleteRowsError } = await window.giftySupabase.from('memory_photos').delete().eq('memory_id', id);
      if (deleteRowsError) throw deleteRowsError;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const path = `${id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await storage().upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type || 'image/jpeg' });
        if (uploadError) throw uploadError;
        const { error: photoError } = await window.giftySupabase.from('memory_photos').insert({ memory_id: id, storage_path: path, sort_order: i });
        if (photoError) throw photoError;
      }
    },
    async remove(id) {
      const { data: rows, error: photoError } = await window.giftySupabase.from('memory_photos').select('storage_path').eq('memory_id', id);
      if (photoError) throw photoError;
      const paths = (rows || []).map(r => r.storage_path);
      if (paths.length) { const { error } = await storage().remove(paths); if (error) throw error; }
      const { error } = await window.giftySupabase.from('memories').delete().eq('id', id);
      if (error) throw error;
    }
  };
  window.GiftyCloudMemories = api;
  ready(() => window.dispatchEvent(new Event('gifty-cloud-ready')));
})();
