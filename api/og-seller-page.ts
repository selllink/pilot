import { createClient } from '@supabase/supabase-js'

const BUCKET = 'product-images'

function getFirstImageUrl(supabaseUrl: string, imagePaths: string[] | null): string | null {
  if (!imagePaths?.length) return null
  const path = imagePaths[0]
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const creatorSlug = url.searchParams.get('creatorSlug')
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY

  if (!creatorSlug || !supabaseUrl || !supabaseAnonKey) {
    return new Response('Missing creatorSlug or Supabase config', { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data: creator, error: creatorError } = await supabase
    .from('creator_slugs')
    .select('creator_email')
    .eq('slug', creatorSlug)
    .maybeSingle()

  if (creatorError || !creator) {
    const fallback = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>LinkVenta Express</title></head><body>Link no encontrado</body></html>`
    return new Response(fallback, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const { data: firstListing } = await supabase
    .from('listings')
    .select('creator_name, creator_avatar_url, image_paths')
    .eq('creator_email', creator.creator_email)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const creatorName =
    (firstListing as { creator_name?: string | null } | null)?.creator_name ?? 'Vendedor'
  const title = `Publicaciones de ${creatorName}`
  const description = 'Ver todas las publicaciones'
  const imageUrl = firstListing?.image_paths?.length
    ? getFirstImageUrl(supabaseUrl, firstListing.image_paths as string[])
    : null
  const canonicalUrl = url.origin + '/u/' + creatorSlug

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
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
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
