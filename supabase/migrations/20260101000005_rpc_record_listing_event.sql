-- RPC: record a view or whatsapp_click event (callable by anon key)
create or replace function public.record_listing_event(p_listing_id uuid, p_event_type text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event_type not in ('view', 'whatsapp_click') then
    return;
  end if;
  insert into public.listing_events (listing_id, event_type)
  select p_listing_id, p_event_type::text
  where exists (
    select 1 from public.listings l
    where l.id = p_listing_id and l.expires_at > now()
  );
end;
$$;

comment on function public.record_listing_event is 'Records view or whatsapp_click event for a non-expired listing. Callable anonymously.';
