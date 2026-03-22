'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import TofudaDa from '@/components/ui/TofudaDa'
import { useStock } from '@/lib/useStock'

const EASE = [0.16, 1, 0.3, 1] as const

const ZONES = [
  {
    name: 'Nainital',
    areas: ['Mallital', 'Tallital', 'Sukhatal', 'Ayarpatta', 'Sher-Ka-Danda', 'Hanumangarhi'],
    active: true,
    slots: ['Morning 8–11am', 'Evening 4–7pm'],
    emoji: '🏔️',
  },
  {
    name: 'Haldwani',
    areas: ['Transport Nagar', 'Banbhoolpura', 'Lalkuaan Road', 'Kathgodam Colony'],
    active: true,
    slots: ['Morning 9–12pm'],
    emoji: '🏙️',
  },
  {
    name: 'Kathgodam',
    areas: ['Railway Station Area', 'Bus Stand Area', 'Kaladhungi Road'],
    active: true,
    slots: ['Morning 9–12pm'],
    emoji: '🚉',
  },
  {
    name: 'Bhimtal',
    areas: ['Coming soon…'],
    active: false,
    slots: [],
    emoji: '🌊',
  },
]

const PRODUCTS_ORDER = [
  { label: 'Soy Paneer 200g', price: '₹49', msg: '200g Soy Paneer — ₹49' },
  { label: 'Soy Paneer 500g', price: '₹110', msg: '500g Soy Paneer — ₹110' },
  { label: 'Soy Paneer 1kg', price: '₹199', msg: '1kg Soy Paneer — ₹199' },
]

export default function OrderPage() {
  const { available, count, loading } = useStock()
  const [activeZone, setActiveZone] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(1)
  
  // Customer details
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [issubmitting, setIsSubmitting] = useState(false)

  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })

  const zone = ZONES[activeZone]
  const product = PRODUCTS_ORDER[selectedProduct]
  
  const handleOrder = async () => {
    if (!name || !phone || !address) {
      alert('Bhai, please saari details bhar do!')
      return
    }

    setIsSubmitting(true)
    
    // 1. Sync with Supabase (Dashboard)
    const client = (await import('@/lib/supabase')).getSupabaseClient()
    if (client) {
      await client.from('orders').insert({
        customer_name: name,
        customer_phone: phone,
        address: `${address}, ${zone.name}`,
        product_id: 'soy-paneer',
        weight: product.label.split(' ').pop(),
        quantity: 1,
        total_price: parseInt(product.price.replace('₹', '')),
        status: 'pending'
      })
    }

    // 2. Open WhatsApp
    const prefill = `Namaste Tofu Da! 🙏\n\nNaya Order:\n✅ Product: ${product.msg}\n📍 Address: ${address}, ${zone.name}\n👤 Customer: ${name}\n\nKripya confirm karein!`
    const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(prefill)}`
    window.open(waUrl, '_blank')
    
    setIsSubmitting(false)
  }

  return (
    <main ref={ref} className="bg-cream min-h-screen pt-24">
      <div className="max-w-content mx-auto px-6 md:px-8 pb-section-mobile md:pb-section">

        {/* Header */}
        <div className="text-center py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center mb-4"
          >
            <div className={`px-4 py-1.5 rounded-full inline-flex items-center gap-2 border shadow-sm ${available ? 'bg-mint text-forest border-leaf/20' : 'bg-red-50 text-red-600 border-red-100'}`}>
              <span className={`w-2 h-2 rounded-full ${available ? 'bg-leaf animate-pulse' : 'bg-red-400'}`} />
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest">
                {loading ? 'Checking Stock…' : available ? `Stock: ${count}kg Available Aaj` : 'Stock Khatam — Kal Milenge!'}
              </span>
            </div>
          </motion.div>
          <motion.h1
            className="font-display text-4xl md:text-6xl text-forest leading-tight mb-3"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Order karo
          </motion.h1>
          <motion.p
            className="font-body text-charcoal/60 text-[17px] max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            Details bhariye aur WhatsApp pe confirm kariye. Seedha sync dashboard ke saath!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT — Order form */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            {/* Step 1 — Product */}
            <div className={`bg-white rounded-card border border-[rgba(26,77,46,0.12)] p-6 transition-opacity ${!available && !loading ? 'opacity-50' : 'opacity-100'}`}>
              <h3 className="font-display text-[20px] text-forest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-forest text-cream text-[12px] font-mono flex items-center justify-center flex-shrink-0">1</span>
                Product chunein
              </h3>
              <div className="flex flex-col gap-2">
                {PRODUCTS_ORDER.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => available && setSelectedProduct(i)}
                    disabled={!available}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-200 ${
                      selectedProduct === i
                        ? 'border-forest bg-mint/30'
                        : available ? 'border-[rgba(26,77,46,0.12)] hover:border-forest/30 cursor-pointer' : 'border-[rgba(26,77,46,0.05)] cursor-not-allowed'
                    }`}
                  >
                    <span className="font-body font-medium text-[15px] text-charcoal">{p.label}</span>
                    <span className="font-display text-[20px] text-forest">{p.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Customer Details */}
            <div className={`bg-white rounded-card border border-[rgba(26,77,46,0.12)] p-6 transition-opacity ${!available && !loading ? 'opacity-50' : 'opacity-100'}`}>
              <h3 className="font-display text-[20px] text-forest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-forest text-cream text-[12px] font-mono flex items-center justify-center flex-shrink-0">2</span>
                Apni details bhariye
              </h3>
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Aapka Naam" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[rgba(26,77,46,0.15)] font-body text-[15px] focus:outline-none focus:border-forest bg-cream/20" 
                />
                <input 
                  type="tel" 
                  placeholder="WhatsApp Number" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[rgba(26,77,46,0.15)] font-body text-[15px] focus:outline-none focus:border-forest bg-cream/20" 
                />
                <textarea 
                  placeholder="Ghar ka address / Landmark" 
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[rgba(26,77,46,0.15)] font-body text-[15px] focus:outline-none focus:border-forest bg-cream/20 resize-none" 
                />
              </div>
            </div>

            {/* Step 3 — Zone */}
            <div className={`bg-white rounded-card border border-[rgba(26,77,46,0.12)] p-6 transition-opacity ${!available && !loading ? 'opacity-50' : 'opacity-100'}`}>
              <h3 className="font-display text-[20px] text-forest mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-forest text-cream text-[12px] font-mono flex items-center justify-center flex-shrink-0">3</span>
                Delivery area
              </h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {ZONES.map((z, i) => (
                  <button
                    key={i}
                    onClick={() => available && z.active && setActiveZone(i)}
                    disabled={!z.active || !available}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                      activeZone === i && z.active
                        ? 'border-forest bg-mint/30'
                        : z.active && available
                        ? 'border-[rgba(26,77,46,0.12)] hover:border-forest/30 cursor-pointer'
                        : 'border-[rgba(26,77,46,0.06)] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-xl block mb-1">{z.emoji}</span>
                    <span className="font-body font-medium text-[14px] text-charcoal">{z.name}</span>
                    {!z.active && <span className="font-mono text-[9px] text-charcoal/40 uppercase tracking-wider block">Soon</span>}
                  </button>
                ))}
              </div>

              {zone.active && (
                <div className="flex flex-wrap gap-1.5">
                  {zone.areas.map((area, i) => (
                    <span key={i} className="bg-cream font-body text-[11px] text-charcoal/60 px-2 py-0.5 rounded-full border border-[rgba(26,77,46,0.05)]">
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Big Order button */}
            <button
              onClick={handleOrder}
              disabled={!available || issubmitting}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-pill font-display text-[18px] transition-all shadow-lg ${
                !available ? 'bg-charcoal/20 cursor-not-allowed text-charcoal/40' : 'bg-[#4CAF50] text-white hover:bg-[#43a047] active:scale-[0.98]'
              }`}
            >
              {issubmitting ? (
                'Saving Order...'
              ) : (
                <>
                  <span className="text-2xl">💬</span>
                  {!available ? 'Stock Khatam' : `Order on WhatsApp — ${product.price}`}
                </>
              )}
            </button>
          </motion.div>

          {/* RIGHT — Info + Tofuda Da */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {/* Tofuda Da */}
            <div className="bg-forest rounded-card p-8 text-cream flex flex-col md:flex-row items-center gap-6">
              <TofudaDa size={100} message="Main deliver karunga! 🛵" showBubble variant="solo" className="flex-shrink-0" />
              <div>
                <h3 className="font-display text-[22px] mb-2">Seedha Tofuda Da se</h3>
                <p className="font-body text-cream/70 text-[14px] leading-relaxed">
                  WhatsApp message bhejne ke 30 minute ke andar response. Order confirm hoga, slot confirm hoga — phir fresh delivery.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-card border border-[rgba(26,77,46,0.12)] p-6">
              <h3 className="font-display text-[20px] text-forest mb-5">Common Sawaal</h3>
              <div className="flex flex-col gap-4">
                {[
                  { q: 'Minimum order kya hai?', a: '200g pack se shuru — ₹49 se order ho jaata hai.' },
                  { q: 'Delivery charge hai?', a: 'Nainital mein free delivery. Haldwani / Kathgodam ke liye ₹20.' },
                  { q: 'Payment kaise karein?', a: 'Cash on delivery, UPI (GPay/PhonePe), ya bank transfer — sab chalega.' },
                  { q: 'Agar fresh na lage?', a: 'Full refund — koi sawaal nahi. Tofuda Da ki guarantee.' },
                ].map((faq, i) => (
                  <div key={i} className="pb-4 border-b border-[rgba(26,77,46,0.08)] last:border-0 last:pb-0">
                    <p className="font-body font-semibold text-[14px] text-charcoal mb-1">Q: {faq.q}</p>
                    <p className="font-body text-[14px] text-charcoal/60">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🕗', label: 'Hours', value: '8am – 7pm daily' },
                { icon: '⚡', label: 'Response', value: 'Within 30 min' },
                { icon: '💳', label: 'Payment', value: 'Cash, UPI, Bank' },
                { icon: '♻️', label: 'Freshness', value: '100% guarantee' },
              ].map((item, i) => (
                <div key={i} className="bg-cream rounded-lg p-4 border border-[rgba(26,77,46,0.1)]">
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-charcoal/40">{item.label}</p>
                  <p className="font-body font-medium text-[13px] text-charcoal">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
