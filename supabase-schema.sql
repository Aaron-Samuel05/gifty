-- GIFTY / ANISHKA'S SPACE
-- Run this once in Supabase SQL Editor.
-- Public visitors can read and create memories.
-- Deletion is intentionally NOT public.

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 70),
  uploader text not null check (char_length(uploader) between 1 and 40),
  caption text default '' check (char_length(caption) <= 220),
  category text not null default 'cute' check (category in ('cute','fun','special')),
  badge text not null default 'New Memory 💖' check (char_length(badge) between 1 and 24),
  created_at timestamptz not null default now()
);

create table if not exists public.memory_photos (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.memories enable row level security;
alter table public.memory_photos enable row level security;

-- Everyone can see memories/photos.
drop policy if exists "Anyone can read memories" on public.memories;
create policy "Anyone can read memories" on public.memories for select using (true);

drop policy if exists "Anyone can create memories" on public.memories;
create policy "Anyone can create memories" on public.memories for insert with check (true);

drop policy if exists "Anyone can read memory photos" on public.memory_photos;
create policy "Anyone can read memory photos" on public.memory_photos for select using (true);

drop policy if exists "Anyone can create memory photos" on public.memory_photos;
create policy "Anyone can create memory photos" on public.memory_photos for insert with check (true);

-- Storage bucket for memory images.
insert into storage.buckets (id, name, public)
values ('memory-photos', 'memory-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view memory photos" on storage.objects;
create policy "Anyone can view memory photos"
on storage.objects for select
using (bucket_id = 'memory-photos');

drop policy if exists "Anyone can upload memory photos" on storage.objects;
create policy "Anyone can upload memory photos"
on storage.objects for insert
with check (bucket_id = 'memory-photos');

-- No public update/delete policies: visitors cannot modify/remove other people's memories.
