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
    }
    Functions: {
      record_listing_event: {
        Args: { p_listing_id: string; p_event_type: string }
        Returns: void
      }
    }
  }
}

export type ListingRow = Database['public']['Tables']['listings']['Row']
export type ListingInsert = Database['public']['Tables']['listings']['Insert']
export type ListingEventRow = Database['public']['Tables']['listing_events']['Row']
