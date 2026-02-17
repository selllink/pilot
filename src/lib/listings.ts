import { supabase } from './supabase'
import type { CreateListingPayload, Listing } from './types'

const BUCKET = 'product-images'

export async function uploadImageFiles(files: File[]): Promise<string[]> {
  const paths: string[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    })
    if (error) throw new Error(error.message)
    paths.push(path)
  }
  return paths
}

export async function deleteListingImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return
  const { error } = await supabase.storage.from(BUCKET).remove(paths)
  if (error) throw new Error(error.message)
}

export function getListingImageUrls(listing: { image_paths: string[] | null }): string[] {
  if (!listing.image_paths?.length) return []
  return listing.image_paths.map((path) => {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  })
}

export async function createListing(
  payload: CreateListingPayload,
  imageFiles: File[]
): Promise<Listing | null> {
  const imagePaths = imageFiles.length > 0 ? await uploadImageFiles(imageFiles) : []
  const { data, error } = await supabase
    .from('listings')
    .insert({
      title: payload.title,
      price: payload.price,
      currency_code: payload.currency_code,
      description: payload.description || null,
      whatsapp_number: payload.whatsapp_number,
      creator_email: payload.creator_email,
      creator_name: payload.creator_name ?? null,
      creator_avatar_url: payload.creator_avatar_url ?? null,
      creator_verified_google: payload.creator_verified_google ?? false,
      image_paths: imagePaths.length ? imagePaths : null,
    } as Record<string, unknown>)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as Listing
}

export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data as Listing | null
}

export async function getListingBySlug(shortSlug: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('short_slug', shortSlug)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data as Listing | null
}

export async function recordListingEvent(
  listingId: string,
  eventType: 'view' | 'whatsapp_click'
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('record_listing_event', {
    p_listing_id: listingId,
    p_event_type: eventType,
  })
}

export async function getMyListings(userEmail: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('creator_email', userEmail)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Listing[]
}

export async function getListingEventCounts(
  listingIds: string[]
): Promise<Record<string, { views: number; whatsapp_clicks: number }>> {
  if (listingIds.length === 0) return {}
  const { data, error } = await supabase
    .from('listing_events')
    .select('listing_id, event_type')
    .in('listing_id', listingIds)
  if (error) return {}
  const result: Record<string, { views: number; whatsapp_clicks: number }> = {}
  for (const id of listingIds) {
    result[id] = { views: 0, whatsapp_clicks: 0 }
  }
  const rows = (data ?? []) as { listing_id: string; event_type: string }[]
  for (const row of rows) {
    const id = row.listing_id
    if (!result[id]) result[id] = { views: 0, whatsapp_clicks: 0 }
    if (row.event_type === 'view') result[id].views += 1
    if (row.event_type === 'whatsapp_click') result[id].whatsapp_clicks += 1
  }
  return result
}

export type UpdateListingPayload = Partial<
  Omit<CreateListingPayload, 'image_paths'> & { image_paths?: string[] | null }
>

export async function updateListing(
  id: string,
  updates: UpdateListingPayload
): Promise<Listing> {
  const { data, error } = await supabase
    .from('listings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as Listing
}

export async function deleteListing(id: string): Promise<void> {
  const { error } = await supabase.from('listings').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function duplicateListing(listing: Listing): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .insert({
      title: listing.title,
      price: listing.price,
      currency_code: listing.currency_code,
      description: listing.description,
      whatsapp_number: listing.whatsapp_number,
      creator_email: listing.creator_email,
      creator_name: listing.creator_name,
      creator_avatar_url: listing.creator_avatar_url,
      creator_verified_google: listing.creator_verified_google,
      image_paths: listing.image_paths,
    } as Record<string, unknown>)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as Listing
}
