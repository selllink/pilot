import type { ListingRow, ListingEventRow } from './database.types'

export type Listing = ListingRow
export type ListingEvent = ListingEventRow

export interface ListingWithStats extends Listing {
  view_count?: number
  whatsapp_click_count?: number
}

export interface CreateListingPayload {
  title: string
  price: number
  currency_code: string
  description: string
  whatsapp_number: string
  creator_email: string
  image_paths?: string[]
  /** Set when creator is signed in with Google */
  creator_name?: string | null
  creator_avatar_url?: string | null
  creator_verified_google?: boolean
}
