-- Listing events for metrics (views, whatsapp clicks)
create table if not exists public.listing_events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  event_type text not null check (event_type in ('view', 'whatsapp_click')),
  created_at timestamptz not null default now()
);

create index if not exists idx_listing_events_listing_id on public.listing_events(listing_id);
create index if not exists idx_listing_events_created_at on public.listing_events(created_at);

comment on table public.listing_events is 'Events for listing metrics: view and whatsapp_click';
