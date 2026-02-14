-- Listings table: sale cards with short_slug and expiration
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  short_slug text unique,
  title text not null,
  price numeric not null check (price >= 0),
  currency_code text not null default 'USD',
  description text,
  whatsapp_number text not null,
  creator_email text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  image_paths text[] default '{}'
);

-- Trigger: generate short_slug and set expires_at on insert
create or replace function public.set_listing_slug_and_expiry()
returns trigger as $$
declare
  new_slug text;
  slug_exists boolean;
begin
  if new.short_slug is null or new.short_slug = '' then
    loop
      -- base64url no existe en PostgreSQL; usamos hex (8 caracteres, URL-safe)
      new_slug := encode(gen_random_bytes(4), 'hex');
      select exists(select 1 from public.listings where short_slug = new_slug) into slug_exists;
      exit when not slug_exists;
    end loop;
    new.short_slug := new_slug;
  end if;
  if new.expires_at is null then
    new.expires_at := now() + interval '30 days';
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql security definer;

create trigger listings_set_slug_expiry
  before insert on public.listings
  for each row execute function public.set_listing_slug_and_expiry();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

comment on table public.listings is 'Sale cards (fichas de venta) with public URL and expiration';
