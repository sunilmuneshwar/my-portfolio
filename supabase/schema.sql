-- Portfolio Contact Form Schema for Supabase (Project: dwxehuzgekdmkvqmmtok)
-- Run this script once in your Supabase Dashboard -> SQL Editor.

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text default '' check (phone is null or char_length(phone) <= 40),
  subject text not null check (char_length(subject) between 3 and 160),
  message text not null check (char_length(message) between 10 and 4000),
  created_at timestamptz not null default now()
);

-- Index newest submissions first for quick review in Table Editor
create index if not exists idx_contacts_created_at
  on public.contacts (created_at desc);

-- Enable Row Level Security (RLS)
alter table public.contacts enable row level security;

-- Allow INSERT-only from the publishable/anon key so visitors can submit inquiries
-- without being able to read, update, or delete anyone else's submissions.
drop policy if exists "Allow public contact form inserts" on public.contacts;
create policy "Allow public contact form inserts"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);
