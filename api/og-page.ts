import { createClient } from '@supabase/supabase-js'

const BUCKET = 'product-images'

function getFirstImageUrl(supabaseUrl: string, imagePaths: string[] | null): string | null {
  if (!imagePaths?.length) return null
  const path = imagePaths[0]
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY

  if (!slug || !supabaseUrl || !supabaseAnonKey) {
    return new Response('Missing slug or Supabase config', { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: listing, error } = await supabase
    .from('listings')
    .select('title, description, image_paths, price, currency_code')
    .eq('short_slug', slug)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error || !listing) {
    const fallback = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>LinkVenta Express</title></head><body>Product not found</body></html>`
    return new Response(fallback, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const title = listing.title ?? 'LinkVenta Express'
  const description =
    typeof listing.description === 'string' && listing.description
      ? listing.description.slice(0, 160)
      : `${listing.title} – ${listing.currency_code} ${listing.price}`
  const imageUrl = getFirstImageUrl(supabaseUrl, listing.image_paths)
  const canonicalUrl = url.origin + '/v/' + slug

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  ${imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  ${imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">` : ''}
  <meta http-equiv="refresh" content="0;url=${escapeHtml(canonicalUrl)}">
</head>
<body><p>Redirigiendo…</p><script>location.href="${escapeHtml(canonicalUrl)}"</script></body>
</html>`

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
