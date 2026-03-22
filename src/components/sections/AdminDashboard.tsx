'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useOrders, Order, OrderStatus, WA_MESSAGES } from '@/lib/useOrders'
import { useStock } from '@/lib/useStock'

const EASE = [0.16, 1, 0.3, 1] as const

// ── Types ────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'orders' | 'stock' | 'broadcast' | 'zones'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; next: OrderStatus | null }> = {
  pending:   { label: 'Pending',          color: '#92400e', bg: '#fef3c7', next: 'confirmed' },
  confirmed: { label: 'Confirmed',        color: '#1A4D2E', bg: '#C8E6C9', next: 'out' },
  out:       { label: 'Out for Delivery', color: '#1e40af', bg: '#dbeafe', next: 'delivered' },
  delivered: { label: 'Delivered',        color: '#065f46', bg: '#d1fae5', next: null },
}

// ── Toast ────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <motion.div
      className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-forest text-cream px-5 py-3 rounded-pill shadow-xl text-[14px] font-body z-[9999] whitespace-nowrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {msg}
    </motion.div>
  )
}

// ── Auth Gate ────────────────────────────────────────────────────────
function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (password === 'tofuda2025') {
        onAuth()
      } else {
        setError(true)
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4">
      <motion.div
        className="bg-cream rounded-card p-8 w-full max-w-sm shadow-2xl"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-12 mx-auto mb-4 relative">
            <Image src="/images/logo-hills-tofuda.jpg" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="font-display text-[26px] text-forest">Admin Panel</h1>
          <p className="font-body text-charcoal/60 text-[14px] mt-1">Hills Tofuda Dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-charcoal/50 block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              className={`w-full px-4 py-3 rounded-lg border font-body text-[15px] text-charcoal bg-white outline-none transition-all ${
                error ? 'border-red-400 ring-1 ring-red-300' : 'border-[rgba(26,77,46,0.2)] focus:border-forest focus:ring-1 focus:ring-forest/20'
              }`}
              placeholder="Enter password"
              autoFocus
            />
            {error && <p className="font-body text-[12px] text-red-500 mt-1">Wrong password. Try again.</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="bg-forest text-cream font-body font-semibold text-[14px] py-3 rounded-pill uppercase tracking-wide hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking…' : 'Enter Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

// ── Order Row ────────────────────────────────────────────────────────
function OrderRow({
  order,
  onAdvance,
  compact = false,
}: {
  order: Order
  onAdvance: (id: string) => void
  compact?: boolean
}) {
  const cfg = STATUS_CONFIG[order.status]
  const nextStatus = cfg.next
  const waMsg = nextStatus && WA_MESSAGES[nextStatus as keyof typeof WA_MESSAGES]
    ? WA_MESSAGES[nextStatus as keyof typeof WA_MESSAGES](order)
    : null
  const waUrl = waMsg ? `https://wa.me/91${order.phone}?text=${encodeURIComponent(waMsg)}` : null

  return (
    <div className={`flex flex-col md:flex-row md:items-center gap-3 p-4 hover:bg-cream/50 transition-colors`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-full bg-mint flex items-center justify-center font-mono text-[11px] text-forest font-semibold flex-shrink-0">
          {order.id.slice(-3)}
        </div>
        <div className="min-w-0">
          <p className="font-body font-semibold text-[14px] text-charcoal truncate">{order.customer}</p>
          <p className="font-body text-[12px] text-charcoal/50 truncate">{order.weight} × {order.qty} — ₹{order.price}</p>
        </div>
      </div>
      {!compact && (
        <p className="font-body text-[12px] text-charcoal/50 hidden md:block max-w-[160px] truncate">{order.address}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>

        {cfg.next && (
          <button
            onClick={() => onAdvance(order.id)}
            className="font-body text-[12px] font-medium text-forest border border-forest/30 px-2.5 py-1 rounded-pill hover:bg-forest hover:text-cream hover:border-forest transition-all cursor-pointer flex-shrink-0"
          >
            → {STATUS_CONFIG[cfg.next].label}
          </button>
        )}

        {/* WhatsApp button — shows pre-filled message for NEXT status */}
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Send WhatsApp for ${STATUS_CONFIG[cfg.next!].label}`}
            className="flex items-center gap-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white px-2.5 py-1 rounded-pill text-[11px] font-body font-medium transition-colors flex-shrink-0 cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        )}

        {/* Direct call/WA contact button */}
        <a
          href={`https://wa.me/91${order.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 bg-charcoal/5 rounded-full flex items-center justify-center hover:bg-charcoal/10 transition-colors flex-shrink-0"
          title="Open Chat"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 013.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8 8c1.39 2.49 3.51 4.61 6 6l.36-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [toast, setToast] = useState<string | null>(null)
  const [stockInput, setStockInput] = useState('')
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [zones, setZones] = useState({ nainital: true, haldwani: true, kathgodam: true, bhimtal: false })

  const { orders, loaded, advanceStatus } = useOrders()
  const { available, count, loading: stockLoading, setStock } = useStock()

  useEffect(() => {
    const isAuthed = localStorage.getItem('adminAuthed') === 'true'
    if (isAuthed) setAuthed(true)
    setAuthChecked(true)
  }, [])

  // Sync stock input with live stock count
  useEffect(() => {
    if (!stockLoading) setStockInput(String(count))
  }, [count, stockLoading])

  const showToast = (msg: string) => {
    setToast(msg)
  }

  const handleAdvanceStatus = async (id: string) => {
    const waUrl = await advanceStatus(id)
    showToast('✅ Status update ho gaya!')
    // Open WhatsApp after a brief delay so toast is visible
    if (waUrl) {
      setTimeout(() => window.open(waUrl, '_blank'), 800)
    }
  }

  const handleStockUpdate = async (n: number) => {
    setStockInput(String(n))
    const result = await setStock(n)
    if (result.success) {
      showToast(n === 0 ? '⛔ Stock khatam — website updated!' : `✅ Stock ${n}kg set — website updated!`)
    } else {
      showToast('⚠️ Update hua but Supabase sync mein issue tha.')
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  if (!authChecked) return <div className="min-h-screen bg-forest" />
  if (!authed) return <AuthGate onAuth={() => { setAuthed(true); localStorage.setItem('adminAuthed', 'true') }} />

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders',    label: 'Orders',    icon: '📦' },
    { id: 'stock',     label: 'Stock',     icon: '🧊' },
    { id: 'broadcast', label: 'Broadcast', icon: '📢' },
    { id: 'zones',     label: 'Zones',     icon: '📍' },
  ]

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-forest min-h-screen p-4 gap-1 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 mb-6 bg-white/5 rounded-xl">
          <div className="w-12 h-8 relative flex-shrink-0">
            <Image src="/images/logo-hills-tofuda.jpg" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <p className="font-body font-semibold text-cream text-[15px] leading-tight">Hills Tofuda</p>
            <p className="font-mono text-[10px] text-cream/50 uppercase tracking-widest mt-0.5">Admin</p>
          </div>
        </div>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
              activeTab === tab.id ? 'bg-white/15 text-cream font-semibold' : 'text-cream/60 hover:text-cream hover:bg-white/10'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-body text-[14px]">{tab.label}</span>
            {tab.id === 'orders' && pendingCount > 0 && (
              <span className="ml-auto bg-accent-orange text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
        <div className="mt-auto">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${available ? 'bg-leaf/20' : 'bg-red-500/20'}`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${available ? 'bg-leaf animate-pulse' : 'bg-red-400'}`} />
            <span className="font-mono text-[10px] text-cream/70 uppercase tracking-wider">
              {stockLoading ? 'Loading…' : available ? `${count}kg stock` : 'Stock khatam'}
            </span>
          </div>
          <button
            onClick={() => { setAuthed(false); localStorage.removeItem('adminAuthed') }}
            className="flex items-center gap-2 text-cream/40 hover:text-cream/70 font-body text-[13px] px-4 py-2 transition-colors cursor-pointer w-full text-left"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-forest border-t border-white/10 z-50 flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2.5 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === tab.id ? 'text-cream' : 'text-cream/40'
            }`}
          >
            <span className="text-lg mb-0.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* ── DASHBOARD ── */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="font-display text-[28px] text-forest">Aaj ka overview</h1>
                  <p className="font-body text-charcoal/50 text-[14px]">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Live Supabase status badge */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
                  <span className="font-mono text-[10px] text-charcoal/40 uppercase tracking-wider">
                    {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co')
                      ? 'Live — Supabase se connected'
                      : 'Local mode — Supabase configure karo sync ke liye'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders', value: loaded ? orders.length : '—', icon: '📦', color: '#C8E6C9' },
                    { label: 'Pending', value: loaded ? pendingCount : '—', icon: '⏳', color: '#fef3c7' },
                    { label: 'Delivered', value: loaded ? deliveredCount : '—', icon: '✅', color: '#d1fae5' },
                    { label: 'Aaj Revenue', value: loaded ? `₹${totalRevenue}` : '—', icon: '💰', color: '#dbeafe' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className="bg-white rounded-card p-5 border border-[rgba(26,77,46,0.1)] shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3" style={{ background: stat.color }}>
                        {stat.icon}
                      </div>
                      <div className="font-display text-[28px] text-forest leading-none">{stat.value}</div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-charcoal/40 mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Stock live status */}
                <div
                  className={`rounded-card p-5 border flex items-center gap-4 cursor-pointer ${
                    available ? 'bg-mint/30 border-leaf/30' : 'bg-red-50 border-red-200'
                  }`}
                  onClick={() => setActiveTab('stock')}
                >
                  <span className="text-3xl">{available ? '✅' : '⛔'}</span>
                  <div className="flex-1">
                    <p className="font-body font-semibold text-[15px] text-charcoal">
                      {stockLoading ? 'Loading stock…' : available ? `${count} kg stock available aaj` : 'Stock khatam — website updated!'}
                    </p>
                    <p className="font-body text-[13px] text-charcoal/50">
                      {available ? 'Website pe "Aaj Fresh Batch Ready" dikh raha hai' : 'Order button hide ho gaya hai'}
                    </p>
                  </div>
                  <button className="ml-auto font-body text-[13px] font-medium text-forest border border-forest px-3 py-1.5 rounded-pill hover:bg-forest hover:text-cream transition-colors cursor-pointer">
                    Update →
                  </button>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-card border border-[rgba(26,77,46,0.1)] overflow-hidden">
                  <div className="p-4 border-b border-[rgba(26,77,46,0.08)] flex items-center justify-between">
                    <h2 className="font-display text-[18px] text-forest">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="font-body text-[13px] text-forest/60 hover:text-forest cursor-pointer">
                      Sab dekho →
                    </button>
                  </div>
                  {!loaded ? (
                    <div className="p-8 text-center font-body text-charcoal/40 text-[14px]">Loading orders…</div>
                  ) : (
                    orders.slice(0, 3).map(order => (
                      <div key={order.id} className="border-b border-[rgba(26,77,46,0.06)] last:border-0">
                        <OrderRow order={order} onAdvance={handleAdvanceStatus} compact />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── ORDERS ── */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h1 className="font-display text-[28px] text-forest">All Orders</h1>
                  <span className="text-[13px] font-mono text-charcoal/40 bg-cream px-3 py-1 rounded-full border border-[rgba(26,77,46,0.12)]">
                    {orders.length} aaj
                  </span>
                </div>
                <div className="bg-white rounded-card border border-[rgba(26,77,46,0.1)] overflow-hidden">
                  {!loaded ? (
                    <div className="p-12 text-center">
                      <div className="w-8 h-8 border-2 border-forest/20 border-t-forest rounded-full animate-spin mx-auto mb-3" />
                      <p className="font-body text-charcoal/40 text-[14px]">Orders load ho rahe hain…</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-4xl mb-3">📭</p>
                      <p className="font-body text-charcoal/40 text-[14px]">Aaj koi order nahi aaya abhi tak</p>
                    </div>
                  ) : (
                    orders.map((order, i) => (
                      <div key={order.id} className={i < orders.length - 1 ? 'border-b border-[rgba(26,77,46,0.06)]' : ''}>
                        <OrderRow order={order} onAdvance={handleAdvanceStatus} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── STOCK ── */}
            {activeTab === 'stock' && (
              <div className="flex flex-col gap-6 max-w-lg">
                <h1 className="font-display text-[28px] text-forest">Stock Update</h1>
                <div className="bg-white rounded-card border border-[rgba(26,77,46,0.1)] p-6 flex flex-col gap-5">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-charcoal/50 mb-2">Live Status</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-pill font-body font-medium text-[13px] ${available ? 'bg-mint text-forest' : 'bg-red-100 text-red-700'}`}>
                      <span className={`w-2 h-2 rounded-full ${available ? 'bg-leaf animate-pulse' : 'bg-red-500'}`} />
                      {stockLoading ? 'Loading…' : available ? `${count} kg Available` : 'Stock Khatam'}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-charcoal/50 block mb-2">
                      Aaj kitna stock hai (kg)?
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={stockInput}
                        onChange={e => setStockInput(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-[rgba(26,77,46,0.2)] font-body text-[16px] text-charcoal focus:outline-none focus:border-forest"
                      />
                      <button
                        onClick={() => handleStockUpdate(parseInt(stockInput) || 0)}
                        className="bg-forest text-cream px-6 py-3 rounded-pill font-body font-semibold text-[14px] hover:bg-forest-dark transition-colors cursor-pointer"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  {/* Quick set buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {[0, 5, 10, 15, 20].map(n => (
                      <button
                        key={n}
                        onClick={() => handleStockUpdate(n)}
                        className={`px-3 py-1.5 rounded-pill font-mono text-[11px] uppercase tracking-wider border cursor-pointer transition-colors ${
                          count === n && !stockLoading
                            ? 'bg-forest text-cream border-forest'
                            : 'border-[rgba(26,77,46,0.2)] text-charcoal hover:border-forest'
                        }`}
                      >
                        {n === 0 ? 'Khatam' : `${n}kg`}
                      </button>
                    ))}
                  </div>
                  <p className="font-body text-[13px] text-charcoal/50 bg-cream rounded-lg p-3">
                    💡 Stock 0 karne pe website pe &quot;Aaj stock khatam&quot; badge lag jaata hai aur WhatsApp order button temporarily hide ho jaata hai. Ye real-time hota hai.
                  </p>
                </div>
              </div>
            )}

            {/* ── BROADCAST ── */}
            {activeTab === 'broadcast' && (
              <div className="flex flex-col gap-6 max-w-lg">
                <h1 className="font-display text-[28px] text-forest">Broadcast Message</h1>
                <div className="bg-white rounded-card border border-[rgba(26,77,46,0.1)] p-6 flex flex-col gap-5">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-charcoal/50 mb-3">Quick Templates</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: '🎉 Fresh Batch Ready', msg: '🎉 Aaj ka fresh batch ready hai! Soy paneer ekdum fresh milega. Order karo abhi — limited stock!' },
                        { label: '⛔ Stock Khatam', msg: '⛔ Aaj ke liye stock khatam ho gaya. Kal subah 8 baje se phir milega. Thank you! 🙏' },
                        { label: '🎁 Special Offer', msg: '🎁 Is hafte 1kg pack sirf ₹189 mein (was ₹199). Limited stock — aaj hi order karo!\n\nhttps://hills-tofuda.vercel.app' },
                        { label: '🌿 Sunday Special', msg: '🌿 Ravivaar special — aaj fresh batch mein sesame tofu bhi hai! WhatsApp pe order karo.' },
                      ].map((t, i) => (
                        <button
                          key={i}
                          onClick={() => setBroadcastMsg(t.msg)}
                          className="text-left px-4 py-3 rounded-lg border border-[rgba(26,77,46,0.12)] hover:border-forest/30 hover:bg-cream transition-all cursor-pointer"
                        >
                          <p className="font-body font-medium text-[13px] text-charcoal">{t.label}</p>
                          <p className="font-body text-[12px] text-charcoal/50 truncate">{t.msg.slice(0, 60)}…</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[11px] uppercase tracking-wider text-charcoal/50 block mb-2">Message</label>
                    <textarea
                      value={broadcastMsg}
                      onChange={e => setBroadcastMsg(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-[rgba(26,77,46,0.2)] font-body text-[14px] text-charcoal focus:outline-none focus:border-forest resize-none"
                      placeholder="Yahan message likhein…"
                    />
                  </div>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(broadcastMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 bg-[#25D366] text-white font-body font-semibold text-[14px] py-3.5 px-6 rounded-pill uppercase tracking-wide transition-opacity ${!broadcastMsg ? 'opacity-40 pointer-events-none' : 'hover:opacity-90'}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp pe Bhejo
                  </a>
                </div>
              </div>
            )}

            {/* ── ZONES ── */}
            {activeTab === 'zones' && (
              <div className="flex flex-col gap-6 max-w-lg">
                <h1 className="font-display text-[28px] text-forest">Delivery Zones</h1>
                <div className="bg-white rounded-card border border-[rgba(26,77,46,0.1)] overflow-hidden">
                  {Object.entries(zones).map(([key, active], i, arr) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-5 ${i < arr.length - 1 ? 'border-b border-[rgba(26,77,46,0.08)]' : ''}`}
                    >
                      <div>
                        <p className="font-body font-semibold text-[15px] text-charcoal capitalize">{key}</p>
                        <p className={`font-mono text-[10px] uppercase tracking-wider ${active ? 'text-leaf' : 'text-charcoal/30'}`}>
                          {active ? '● Active — delivery ho rahi hai' : '○ Paused — delivery band hai'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setZones(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
                          showToast(`${key} zone ${!active ? 'activate' : 'pause'} ho gaya!`)
                        }}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${active ? 'bg-leaf' : 'bg-[rgba(26,77,46,0.15)]'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="font-body text-[13px] text-charcoal/50 bg-cream rounded-lg p-3">
                  💡 Zone band karne pe uss area ke customers ko website pe &quot;Delivery available nahi&quot; dikhega.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
