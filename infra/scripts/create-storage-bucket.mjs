/**
 * Creates the product-images storage bucket in Supabase.
 * Run with: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node infra/scripts/create-storage-bucket.mjs
 * Or use from Terraform (null_resource local-exec).
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(url, key)

const bucketName = 'product-images'
const options = {
  public: true,
  fileSizeLimit: 5242880, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
}

const { data, error } = await supabase.storage.createBucket(bucketName, options)

if (error) {
  if (error.message?.includes('already exists') || error.message?.toLowerCase().includes('duplicate')) {
    console.log('Bucket', bucketName, 'already exists.')
    process.exit(0)
  }
  console.error('Error creating bucket:', error.message)
  process.exit(1)
}

console.log('Bucket', bucketName, 'created.', data)
process.exit(0)
