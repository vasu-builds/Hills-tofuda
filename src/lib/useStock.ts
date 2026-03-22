'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────
export interface StockStatus {
  available: boolean
  count: number
  loading: boolean
}

const FALLBACK: StockStatus = { available: true, count: 5, loading: false }
const LS_KEY = 'ht_stock'

function loadLocalStock(): StockStatus {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return { ...JSON.parse(raw), loading: false }
  } catch {}
  return FALLBACK
}

function saveLocalStock(s: Omit<StockStatus, 'loading'>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)) } catch {}
}

// ── Hook ──────────────────────────────────────────────────────────────
export function useStock(productId = 'soy-paneer') {
  const [status, setStatus] = useState<StockStatus>({ available: true, count: 0, loading: true })

  useEffect(() => {
    const client = getSupabaseClient()

    if (!client) {
      setStatus(loadLocalStock())
      return
    }

    const fetchStock = async () => {
      try {
        const { data, error } = await client
          .from('inventory')
          .select('stock_available, stock_count')
          .eq('product_id', productId)
          .single()

        if (error || !data) {
          setStatus(loadLocalStock())
          return
        }

        const s = { available: data.stock_available, count: data.stock_count, loading: false }
        setStatus(s)
        saveLocalStock(s)
      } catch {
        setStatus(loadLocalStock())
      }
    }

    fetchStock()

    // Real-time subscription
    const channel = client
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'inventory', filter: `product_id=eq.${productId}` },
        (payload) => {
          const d = payload.new as { stock_available: boolean; stock_count: number }
          const s = { available: d.stock_available, count: d.stock_count, loading: false }
          setStatus(s)
          saveLocalStock(s)
        }
      )
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [productId])

  // Admin write function — updates Supabase or localStorage
  const setStock = useCallback(async (count: number) => {
    const available = count > 0
    const s = { available, count, loading: false }
    setStatus(s)
    saveLocalStock(s)

    const client = getSupabaseClient()
    if (!client) return { success: true, source: 'local' }

    const { error } = await client
      .from('inventory')
      .update({ stock_available: available, stock_count: count, updated_at: new Date().toISOString() })
      .eq('product_id', productId)

    return { success: !error, source: 'supabase', error }
  }, [productId])

  return { ...status, setStock }
}
