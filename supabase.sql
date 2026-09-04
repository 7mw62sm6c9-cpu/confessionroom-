-- Run this in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.confessions (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(message) between 1 and 500),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.confessions enable row level security;

-- Anyone can submit a confession.
create policy "Anyone can submit confessions"
on public.confessions
for insert
to anon
with check (true);

-- Only authenticated organizers can read, update or delete.
create policy "Authenticated organizers can read"
on public.confessions
for select
to authenticated
using (true);

create policy "Authenticated organizers can update"
on public.confessions
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated organizers can delete"
on public.confessions
for delete
to authenticated
using (true);

-- Optional: prevent extremely large payloads beyond the DB constraint.
-- Do NOT expose the service_role key in browser code.
