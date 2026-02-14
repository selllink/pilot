-- Run this in Supabase Dashboard → SQL Editor if you get
-- "new row violates row-level security policy" when creating a listing.
-- This ensures anonymous users can INSERT into public.listings.

-- Remove existing policy if it exists (avoid duplicate)
drop policy if exists "listings_anon_insert" on public.listings;

-- Allow anyone (including anon) to insert a new listing
create policy "listings_anon_insert"
  on public.listings for insert
  to anon
  with check (true);

-- Optional: also allow authenticated users to insert (e.g. when duplicating)
drop policy if exists "listings_authenticated_insert" on public.listings;
create policy "listings_authenticated_insert"
  on public.listings for insert
  to authenticated
  with check (true);
