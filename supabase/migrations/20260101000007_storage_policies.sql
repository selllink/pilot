-- Storage policies for product-images bucket.
-- Create the bucket first (Terraform or Supabase Dashboard); id must be 'product-images'.

-- Allow anyone to read (public bucket)
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow anon and authenticated to upload (for create listing flow)
create policy "product_images_upload"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

-- Allow update/delete for edit listing (authenticated users manage their uploads)
create policy "product_images_update"
  on storage.objects for update
  using (bucket_id = 'product-images');

create policy "product_images_delete"
  on storage.objects for delete
  using (bucket_id = 'product-images');
