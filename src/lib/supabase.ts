import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — only creates client when actually needed
// This prevents crash when env vars are not set during local dev
let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === 'your_supabase_project_url') return null

  if (!_client) {
    _client = createClient(url, key)
  }
  return _client
}

// Named export for backward compat — returns null if not configured
export const supabase = {
  from: (table: string) => {
    const client = getSupabaseClient()
    if (!client) {
      // Return a mock that resolves to null safely
      return {
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }) }),
      }
    }
    return client.from(table)
  },
  channel: (name: string) => {
    const client = getSupabaseClient()
    if (!client) {
      return {
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
        subscribe: () => ({ unsubscribe: () => {} }),
      }
    }
    return client.channel(name)
  },
  removeChannel: (channel: unknown) => {
    const client = getSupabaseClient()
    if (!client) return
    client.removeChannel(channel as Parameters<SupabaseClient['removeChannel']>[0])
  },
}

export type Database = {
  public: {
    Tables: {
      inventory: {
        Row: {
          id: string
          product_id: string
          stock_available: boolean
          stock_count: number
          updated_at: string
        }
        Insert: {
          product_id: string
          stock_available: boolean
          stock_count: number
        }
        Update: {
          stock_available?: boolean
          stock_count?: number
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          address: string
          product_id: string
          weight: string
          quantity: number
          total_price: number
          status: 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered'
          created_at: string
          updated_at: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          address: string
          created_at: string
          order_count: number
        }
      }
      delivery_zones: {
        Row: {
          id: string
          area_name: string
          is_active: boolean
          delivery_slots: string[]
        }
      }
    }
  }
}

