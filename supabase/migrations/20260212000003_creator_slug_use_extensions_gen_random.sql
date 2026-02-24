-- Fix: gen_random_bytes lives in extensions schema on Supabase
create or replace function public.set_creator_slug()
returns trigger as $$
declare
  new_slug text;
  slug_exists boolean;
begin
  if new.slug is null or new.slug = '' then
    loop
      new_slug := encode(extensions.gen_random_bytes(4), 'hex');
      select exists(select 1 from public.creator_slugs where slug = new_slug) into slug_exists;
      exit when not slug_exists;
    end loop;
    new.slug := new_slug;
  end if;
  return new;
end;
$$ language plpgsql security definer;
