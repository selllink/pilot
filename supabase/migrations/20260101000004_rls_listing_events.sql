-- Enable RLS on listing_events
alter table public.listing_events enable row level security;

-- Users can only read events for their own listings
create policy "listing_events_owner_select"
  on public.listing_events for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_events.listing_id
        and l.creator_email = (auth.jwt() ->> 'email')
    )
  );

-- No direct insert from client; use RPC record_listing_event instead
