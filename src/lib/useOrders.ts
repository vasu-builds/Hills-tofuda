'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

// ── Types ────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'confirmed' | 'out' | 'delivered'

export interface Order {
  id: string
  customer: string
  phone: string
  address: string
  product: string
  weight: string
  qty: number
  price: number
  status: OrderStatus
  time: string
}

// ── WhatsApp message templates ────────────────────────────────────────
export const WA_MESSAGES: Record<Exclude<OrderStatus, 'pending'>, (o: Order) => string> = {
  confirmed: (o) =>
    `Namaste ${o.customer} ji! 🙏\n\nAapka Hills Tofuda order *#${o.id}* confirm ho gaya hai!\n\n📦 ${o.weight} × ${o.qty} — ₹${o.price}\n📍 ${o.address}\n\nHum jaldi taiyar karke bhejenge. Thank you! 🌿`,
  out: (o) =>
    `${o.customer} ji, aapka Tofuda ab *raste mein hai!* 🚚\n\nOrder #${o.id} — ${o.weight} × ${o.qty}\n📍 ${o.address}\n\nThodi der mein pahunch jayega. Ghar pe rehna! 😊`,
  delivered: (o) =>
    `${o.customer} ji, aapka order *deliver ho gaya!* 🎉\n\nOrder #${o.id} — ₹${o.price}\n\nUmeed hai aapko pasand aaya. Agar koi dikkat ho to reply karein. ⭐ Review zaroor dena!\n\n— Hills Tofuda Team 🙏`,
}

// ── Seed data for localStorage fallback ─────────────────────────────
const SEED_ORDERS: Order[] = [
  { id: 'TF001', customer: 'Priya Sharma', phone: '9876543210', address: 'Mallital, near Lake View', product: 'Soy Paneer', weight: '500g', qty: 2, price: 220, status: 'pending', time: '9:15 AM' },
  { id: 'TF002', customer: 'Rohit Joshi', phone: '9812345678', address: 'Haldwani, Transport Nagar', product: 'Soy Paneer', weight: '1kg', qty: 1, price: 199, status: 'confirmed', time: '9:42 AM' },
  { id: 'TF003', customer: 'Sunita Devi', phone: '9834567890', address: 'Kathgodam, Station Road', product: 'Soy Paneer', weight: '200g', qty: 3, price: 147, status: 'out', time: '10:05 AM' },
  { id: 'TF004', customer: 'Anil Rawat', phone: '9867890123', address: 'Tallital, Bus Stand Area', product: 'Soy Paneer', weight: '500g', qty: 1, price: 110, status: 'delivered', time: '8:30 AM' },
  { id: 'TF005', customer: 'Meera Bisht', phone: '9823456789', address: 'Sukhatal Colony', product: 'Soy Paneer', weight: '1kg', qty: 2, price: 398, status: 'pending', time: '10:22 AM' },
]

const LS_KEY = 'ht_orders'

function loadLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as Order[]
  } catch {}
  return SEED_ORDERS
}

function saveLocalOrders(orders: Order[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(orders)) } catch {}
}

// Map Supabase row to our Order shape
function fromSupabase(row: Record<string, unknown>): Order {
  return {
    id: String(row.id ?? ''),
    customer: String(row.customer_name ?? ''),
    phone: String(row.customer_phone ?? ''),
    address: String(row.address ?? ''),
    product: String(row.product_id ?? 'Soy Paneer'),
    weight: String(row.weight ?? ''),
    qty: Number(row.quantity ?? 1),
    price: Number(row.total_price ?? 0),
    status: (String(row.status ?? 'pending').replace('out_for_delivery', 'out')) as OrderStatus,
    time: new Date(String(row.created_at ?? '')).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  }
}

// Map our status back to Supabase format
function toSupabaseStatus(s: OrderStatus): string {
  return s === 'out' ? 'out_for_delivery' : s
}

// ── Hook ─────────────────────────────────────────────────────────────
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loaded, setLoaded] = useState(false)

  // Initial load
  useEffect(() => {
    const client = getSupabaseClient()
    if (!client) {
      setOrders(loadLocalOrders())
      setLoaded(true)
      return
    }

    const fetchOrders = async () => {
      const { data, error } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data) {
        setOrders(loadLocalOrders())
      } else {
        const mapped = (data as Record<string, unknown>[]).map(fromSupabase)
        setOrders(mapped)
        saveLocalOrders(mapped)
      }
      setLoaded(true)
    }

    fetchOrders()

    // Real-time subscription
    const channel = client
      .channel('orders-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [])

  // Advance order status + trigger WhatsApp message
  const advanceStatus = useCallback(async (id: string): Promise<string | null> => {
    const STATUS_NEXT: Record<OrderStatus, OrderStatus | null> = {
      pending: 'confirmed',
      confirmed: 'out',
      out: 'delivered',
      delivered: null,
    }

    let whatsappUrl: string | null = null

    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id !== id) return o
        const next = STATUS_NEXT[o.status]
        if (!next) return o
        const newOrder = { ...o, status: next }
        // Generate WhatsApp URL for the new status
        const msg = WA_MESSAGES[next as keyof typeof WA_MESSAGES]
        if (msg) {
          whatsappUrl = `https://wa.me/91${o.phone}?text=${encodeURIComponent(msg(newOrder))}`
        }
        return newOrder
      })
      saveLocalOrders(updated)
      return updated
    })

    // Also update Supabase if available
    const client = getSupabaseClient()
    if (client) {
      const order = orders.find(o => o.id === id)
      if (order) {
        const STATUS_NEXT2: Record<OrderStatus, OrderStatus | null> = {
          pending: 'confirmed', confirmed: 'out', out: 'delivered', delivered: null,
        }
        const next = STATUS_NEXT2[order.status]
        if (next) {
          await client.from('orders').update({ status: toSupabaseStatus(next) }).eq('id', id)
        }
      }
    }

    return whatsappUrl
  }, [orders])

  // Add a new order (for testing / manual entry)
  const addOrder = useCallback((order: Omit<Order, 'id' | 'time'>) => {
    const newOrder: Order = {
      ...order,
      id: `TF${String(Date.now()).slice(-4)}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
    setOrders(prev => {
      const updated = [newOrder, ...prev]
      saveLocalOrders(updated)
      return updated
    })
  }, [])

  return { orders, loaded, advanceStatus, addOrder }
}
