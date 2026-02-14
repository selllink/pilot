-- Optional: pg_cron cleanup of expired listings (run daily)
-- Requires pg_cron extension (available on Supabase).
-- In Supabase Dashboard: Database > Extensions > enable pg_cron, then run:
--
-- select cron.schedule(
--   'cleanup-expired-listings',
--   '0 3 * * *',  -- daily at 03:00 UTC
--   $$ delete from public.listings where expires_at < now() $$
-- );
--
-- Or run manually / via migration if your Supabase plan supports it:
-- delete from public.listings where expires_at < now();

-- Grant execute to allow cron if used
-- (no-op if pg_cron not enabled)
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'cleanup-expired-listings',
      '0 3 * * *',
      'delete from public.listings where expires_at < now()'
    );
  end if;
exception
  when others then null; -- ignore if pg_cron not available
end $$;
