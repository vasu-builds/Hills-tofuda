'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

export interface StockStatus {
  available: boolean
  count: number
  loading: boolean
}

const FALLBACK: StockStatus = { available: true, count: 5, loading: false }

export function useStock(productId = 'soy-paneer'): StockStatus {
  const [status, setStatus] = useState<StockStatus>({ available: true, count: 0, loading: true })

  useEffect(() => {
    const client = getSupabaseClient()

    // No Supabase configured — show fallback (fresh available)
    if (!client) {
      setStatus(FALLBACK)
      return
    }

    // Initial fetch
    const fetchStock = async () => {
      try {
        const { data, error } = await client
          .from('inventory')
          .select('stock_available, stock_count')
          .eq('product_id', productId)
          .single()

        if (error || !data) {
          setStatus(FALLBACK)
          return
        }

        setStatus({
          available: data.stock_available,
          count: data.stock_count,
          loading: false,
        })
      } catch {
        setStatus(FALLBACK)
      }
    }

    fetchStock()

    // Real-time subscription
    const channel = client
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'inventory',
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          const newRecord = payload.new as { stock_available: boolean; stock_count: number }
          setStatus({
            available: newRecord.stock_available,
            count: newRecord.stock_count,
            loading: false,
          })
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [productId])

  return status
}

