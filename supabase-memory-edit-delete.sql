-- Run this AFTER the original supabase-schema.sql.
-- This enables the new Edit/Delete controls for cloud memories.
-- IMPORTANT: because the current site has no authentication yet, these policies
-- allow any visitor with the publishable frontend client to edit/delete memories.
-- Add Supabase Auth/admin RLS later if you want only Aaron to manage them.

create policy "Anyone can update memories"
on public.memories for update
using (true)
with check (true);

create policy "Anyone can delete memories"
on public.memories for delete
using (true);

create policy "Anyone can update memory photos"
on public.memory_photos for update
using (true)
with check (true);

create policy "Anyone can delete memory photos"
on public.memory_photos for delete
using (true);

create policy "Anyone can delete memory photo files"
on storage.objects for delete
using (bucket_id = 'memory-photos');
