-- Run this AFTER supabase-schema.sql.
-- Safe to run more than once: existing policies are dropped first.
-- IMPORTANT: because the current site has no authentication yet, these policies
-- allow any visitor with the publishable frontend client to edit/delete memories.
-- Add Supabase Auth/admin RLS later if you want only Aaron to manage them.

DROP POLICY IF EXISTS "Anyone can update memories" ON public.memories;
CREATE POLICY "Anyone can update memories"
ON public.memories FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete memories" ON public.memories;
CREATE POLICY "Anyone can delete memories"
ON public.memories FOR DELETE
USING (true);

DROP POLICY IF EXISTS "Anyone can update memory photos" ON public.memory_photos;
CREATE POLICY "Anyone can update memory photos"
ON public.memory_photos FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete memory photos" ON public.memory_photos;
CREATE POLICY "Anyone can delete memory photos"
ON public.memory_photos FOR DELETE
USING (true);

DROP POLICY IF EXISTS "Anyone can delete memory photo files" ON storage.objects;
CREATE POLICY "Anyone can delete memory photo files"
ON storage.objects FOR DELETE
USING (bucket_id = 'memory-photos');
