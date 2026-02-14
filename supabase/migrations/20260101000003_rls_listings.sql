-- Enable RLS on listings
alter table public.listings enable row level security;

-- Public read: only non-expired listings
create policy "listings_public_select_active"
  on public.listings for select
  using (expires_at > now());

-- Anonymous insert: anyone can create a listing
create policy "listings_anon_insert"
  on public.listings for insert
  with check (true);

-- Owner update/delete: only creator_email matches auth user
create policy "listings_owner_update"
  on public.listings for update
  using (creator_email = (auth.jwt() ->> 'email'));

create policy "listings_owner_delete"
  on public.listings for delete
  using (creator_email = (auth.jwt() ->> 'email'));

-- Authenticated users can read their own listings (including expired) for dashboard
create policy "listings_owner_select"
  on public.listings for select
  using (creator_email = (auth.jwt() ->> 'email'));
