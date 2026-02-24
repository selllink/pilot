export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string
          short_slug: string
          title: string
          price: number
          currency_code: string
          description: string | null
          whatsapp_number: string
          creator_email: string
          creator_name: string | null
          creator_avatar_url: string | null
          creator_verified_google: boolean
          expires_at: string
          created_at: string
          updated_at: string
          image_paths: string[] | null
        }
        Insert: {
          id?: string
          short_slug?: string
          title: string
          price: number
          currency_code: string
          description?: string | null
          whatsapp_number: string
          creator_email: string
          creator_name?: string | null
          creator_avatar_url?: string | null
          creator_verified_google?: boolean
          expires_at?: string
          created_at?: string
          updated_at?: string
          image_paths?: string[] | null
        }
        Update: {
          id?: string
          short_slug?: string
          title?: string
          price?: number
          currency_code?: string
          description?: string | null
          whatsapp_number?: string
          creator_email?: string
          creator_name?: string | null
          creator_avatar_url?: string | null
          creator_verified_google?: boolean
          expires_at?: string
          created_at?: string
          updated_at?: string
          image_paths?: string[] | null
        }
      }
      listing_events: {
        Row: {
          id: string
          listing_id: string
          event_type: 'view' | 'whatsapp_click'
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          event_type: 'view' | 'whatsapp_click'
          created_at?: string
        }
        Update: never
      }
      creator_slugs: {
        Row: {
          creator_email: string
          slug: string
        }
        Insert: {
          creator_email: string
          slug?: string
        }
        Update: {
          creator_email?: string
          slug?: string
        }
      }
    }
    Functions: {
      record_listing_event: {
        Args: { p_listing_id: string; p_event_type: string }
        Returns: void
      }
      get_or_create_creator_slug: {
        Args: { p_creator_email: string }
        Returns: string
      }
    }
  }
}

export type ListingRow = Database['public']['Tables']['listings']['Row']
export type ListingInsert = Database['public']['Tables']['listings']['Insert']
export type ListingEventRow = Database['public']['Tables']['listing_events']['Row']
export type CreatorSlugRow = Database['public']['Tables']['creator_slugs']['Row']
