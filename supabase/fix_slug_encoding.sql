-- Ejecutar en Supabase Dashboard → SQL Editor
-- Corrige el error: unrecognized encoding "base64url"
-- (PostgreSQL solo soporta 'base64', 'hex', 'escape')

create or replace function public.set_listing_slug_and_expiry()
returns trigger as $$
declare
  new_slug text;
  slug_exists boolean;
begin
  if new.short_slug is null or new.short_slug = '' then
    loop
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
