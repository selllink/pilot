-- Creator profile for listings: name, avatar and verified-with-Google flag
alter table public.listings
  add column if not exists creator_name text,
  add column if not exists creator_avatar_url text,
  add column if not exists creator_verified_google boolean not null default false;

comment on column public.listings.creator_name is 'Display name when creator signed in with Google';
comment on column public.listings.creator_avatar_url is 'Profile picture URL when creator signed in with Google';
comment on column public.listings.creator_verified_google is 'True when listing was created by a user signed in with Google';
