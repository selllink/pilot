-- Table: creator_slugs — one public slug per creator_email for "share all my listings" link
create table if not exists public.creator_slugs (
  creator_email text primary key,
  slug text unique not null
);

-- Trigger: generate slug on insert (8-char hex, same pattern as listings short_slug)
create or replace function public.set_creator_slug()
returns trigger as $$
declare
  new_slug text;
  slug_exists boolean;
begin
  if new.slug is null or new.slug = '' then
    loop
      new_slug := encode(gen_random_bytes(4), 'hex');
      select exists(select 1 from public.creator_slugs where slug = new_slug) into slug_exists;
      exit when not slug_exists;
    end loop;
    new.slug := new_slug;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger creator_slugs_set_slug
  before insert on public.creator_slugs
  for each row execute function public.set_creator_slug();

-- RPC: get or create slug for a creator email, return the slug (RLS applies: invoker must match creator_email)
create or replace function public.get_or_create_creator_slug(p_creator_email text)
returns text
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.creator_slugs (creator_email)
  values (p_creator_email)
  on conflict (creator_email) do nothing;
  return (select slug from public.creator_slugs where creator_email = p_creator_email);
end;
$$;

-- RLS
alter table public.creator_slugs enable row level security;

-- Public read: anyone can resolve slug -> email (for public seller page)
create policy "creator_slugs_public_select"
  on public.creator_slugs for select
  using (true);

-- Insert only for own email (authenticated user creating their slug)
create policy "creator_slugs_owner_insert"
  on public.creator_slugs for insert
  with check (creator_email = (auth.jwt() ->> 'email'));

comment on table public.creator_slugs is 'Public slug per creator for "share all my listings" URL';
