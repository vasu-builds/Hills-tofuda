'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import TofudaDa from '@/components/ui/TofudaDa'
import FreshTodayBadge from '@/components/ui/FreshTodayBadge'

const EASE = [0.16, 1, 0.3, 1] as const

const WEIGHTS = [
  {
    label: '200g',
    price: 49,
    protein: 36,
    calcium: 22,
    calories: 144,
    servings: '2–3',
    tag: 'Try karo',
    tagColor: '#C8E6C9',
    tagText: '#1A4D2E',
    perGram: '₹0.24/g protein',
    image: '/images/product-plain.png',
    ideal: 'Pehli baar try karne ke liye perfect',
  },
  {
    label: '500g',
    price: 110,
    protein: 90,
    calcium: 55,
    calories: 360,
    servings: '5–6',
    tag: 'Most Popular',
    tagColor: '#1A4D2E',
    tagText: '#FAF7F0',
    perGram: '₹0.12/g protein',
    image: '/images/product-board.png',
    ideal: 'Family ke liye, weekly staple',
  },
  {
    label: '1kg',
    price: 199,
    protein: 180,
    calcium: 110,
    calories: 720,
    servings: '10–12',
    tag: 'Best Value',
    tagColor: '#FF6B35',
    tagText: '#fff',
    perGram: '₹0.11/g protein',
    image: '/images/product-white.png',
    ideal: 'Gym goers aur large families ke liye',
  },
]

// ── Animated number ──────────────────────────────────────────────────
function AnimNum({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    const from = prev.current
    const to = value
    if (from === to) return
    const dur = 500
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const e = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * e))
      if (t < 1) requestAnimationFrame(tick)
      else prev.current = to
    }
    requestAnimationFrame(tick)
  }, [value])

  return <>{display}</>
}

// ── Nutrition bar ────────────────────────────────────────────────────
function NutritionBar({ label, value, max, unit, color, delay }: {
  label: string; value: number; max: number
  unit: string; color: string; delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const pct = Math.round(Math.min((value / max) * 100, 100))

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[11px] uppercase tracking-wider text-charcoal/50">{label}</span>
        <span className="font-body font-semibold text-[15px] text-charcoal">
          <AnimNum value={value} />{unit}
        </span>
      </div>
      <div className="h-2.5 bg-cream-dark rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full origin-left"
          style={{ backgroundColor: color }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: pct / 100 } : {}}
          transition={{ duration: 0.9, delay, ease: EASE }}
        />
      </div>
      <span className="font-mono text-[10px] text-charcoal/30 text-right">{pct}% of daily max</span>
    </div>
  )
}

// ── 3D Product card ──────────────────────────────────────────────────
function ProductCard3D({ weight, active, onClick, index }: {
  weight: typeof WEIGHTS[0]
  active: boolean; onClick: () => void; index: number
}) {
  const [flipped, setFlipped] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  // Auto-unflip when weight changes
  useEffect(() => { setFlipped(false) }, [weight])

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer select-none"
      style={{ perspective: '1000px', height: '380px' }}
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      onClick={onClick}
    >
      {/* Active ring glow */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute -inset-1 rounded-[16px]"
            style={{ background: 'linear-gradient(135deg, #1A4D2E, #4CAF50)', opacity: 0.15 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* 3D flip container */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-[14px] overflow-hidden border-2 transition-all duration-300"
          style={{
            backfaceVisibility: 'hidden',
            borderColor: active ? '#1A4D2E' : 'rgba(26,77,46,0.12)',
            background: active ? 'linear-gradient(160deg, #EBF5EB 0%, #ffffff 100%)' : 'white',
            boxShadow: active
              ? '0 20px 60px rgba(26,77,46,0.18), 0 4px 16px rgba(26,77,46,0.1)'
              : '0 4px 24px rgba(26,77,46,0.06)',
          }}
        >
          {/* Image */}
          <div className="relative h-44 overflow-hidden">
            <Image
              src={weight.image}
              alt={`Hills Tofuda Soy Paneer ${weight.label}`}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Tag */}
            <span
              className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold"
              style={{ background: weight.tagColor, color: weight.tagText }}
            >
              {weight.tag}
            </span>

            {/* Flip hint */}
            <button
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center text-[11px] hover:bg-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setFlipped(true) }}
              title="Nutrition dekho"
            >
              ℹ
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="font-display text-[22px] text-forest leading-none">Soy Paneer</p>
                <span className="font-mono text-[12px] text-charcoal/45 uppercase tracking-wider">{weight.label}</span>
              </div>
              <div className="text-right">
                <div className="font-display text-[34px] text-forest leading-none">
                  ₹<AnimNum value={weight.price} />
                </div>
                <span className="font-mono text-[9px] text-charcoal/35 uppercase tracking-wider">{weight.servings} servings</span>
              </div>
            </div>

            {/* Per gram value */}
            <div className="bg-cream rounded-lg px-3 py-2 mb-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-forest/70">
                💪 {weight.perGram} protein
              </p>
            </div>

            <p className="font-body text-[13px] text-charcoal/55 leading-relaxed">{weight.ideal}</p>
          </div>
        </div>

        {/* BACK — Nutrition details */}
        <div
          className="absolute inset-0 rounded-[14px] border-2 border-forest overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(160deg, #1A4D2E 0%, #0F2E1A 100%)',
          }}
        >
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-cream text-[18px]">Nutrition Facts</h3>
              <button
                className="text-cream/60 hover:text-cream font-mono text-[11px] uppercase tracking-wider"
                onClick={(e) => { e.stopPropagation(); setFlipped(false) }}
              >
                ← Back
              </button>
            </div>

            <div className="font-mono text-[10px] uppercase tracking-wider text-cream/40 mb-3">
              Per {weight.label} pack
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {[
                { label: 'Protein',  value: weight.protein,  max: 200, unit: 'g',    color: '#4CAF50' },
                { label: 'Calcium',  value: weight.calcium,  max: 120, unit: '%',    color: '#C8E6C9' },
                { label: 'Calories', value: weight.calories, max: 800, unit: ' kcal', color: '#D4B896' },
              ].map((n) => (
                <div key={n.label}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-cream/50">{n.label}</span>
                    <span className="font-mono text-[11px] text-cream font-semibold">{n.value}{n.unit}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((n.value / n.max) * 100, 100)}%`,
                        backgroundColor: n.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2 text-center">
                {[
                  { label: 'Cholesterol', value: '0mg' },
                  { label: 'Preservatives', value: 'None' },
                  { label: 'Plant Based', value: '100%' },
                  { label: 'Fresh Daily', value: '✓' },
                ].map((f) => (
                  <div key={f.label} className="bg-white/08 rounded-lg p-2">
                    <div className="font-body font-semibold text-cream text-[13px]">{f.value}</div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-cream/40">{f.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main section ─────────────────────────────────────────────────────
export default function ProductSpotlight() {
  const [activeIdx, setActiveIdx] = useState(1)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const active = WEIGHTS[activeIdx]

  return (
    <section
      ref={ref}
      className="relative py-section-mobile md:py-section overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FAF7F0 0%, #F0EBE0 100%)' }}
    >
      {/* Decorative bg blob */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)',
          transform: 'translate(35%, -35%)',
        }}
      />

      <div className="max-w-content mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-forest/50">01 / Product</span>
              <span className="flex-1 h-px bg-[rgba(26,77,46,0.15)] max-w-[60px]" />
            </motion.div>
            <motion.h2
              className="font-display text-h2 text-forest leading-display"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            >
              Soy Paneer, <em>ekdum fresh</em>
            </motion.h2>
          </div>

          {/* Real-time stock badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <FreshTodayBadge />
          </motion.div>
        </div>

        {/* 3 Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {WEIGHTS.map((w, i) => (
            <ProductCard3D
              key={w.label}
              weight={w}
              active={activeIdx === i}
              onClick={() => setActiveIdx(i)}
              index={i}
            />
          ))}
        </div>

        {/* Cinematic selected product detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-[20px] p-8 md:p-10 border border-[rgba(26,77,46,0.1)] shadow-lg"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Left — Image + visual */}
            <div className="relative flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Plate bg */}
                <div
                  className="absolute inset-0 rounded-full blur-2xl scale-75"
                  style={{ background: 'radial-gradient(circle, #D4B896 0%, transparent 70%)', opacity: 0.5 }}
                />
                <Image
                  src={active.image}
                  alt={`Soy Paneer ${active.label}`}
                  width={320}
                  height={320}
                  className="object-contain relative z-10 drop-shadow-2xl"
                />
              </motion.div>

              {/* Weight badge */}
              <motion.div
                className="absolute top-4 right-4 bg-forest text-cream rounded-pill px-4 py-2 text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
              >
                <div className="font-display text-[26px] leading-none">{active.label}</div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-cream/60">pack size</div>
              </motion.div>
            </div>

            {/* Right — Details */}
            <div className="flex flex-col gap-6">
              {/* Price + servings */}
              <div className="flex items-end gap-4">
                <motion.div
                  className="font-display text-forest leading-none"
                  style={{ fontSize: 'clamp(52px, 7vw, 80px)' }}
                  key={`price-${activeIdx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  ₹{active.price}
                </motion.div>
                <div className="mb-2">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-charcoal/45">{active.servings} servings</p>
                  <p className="font-mono text-[11px] text-leaf font-semibold uppercase tracking-wider">{active.perGram}</p>
                </div>
              </div>

              {/* Nutrition bars */}
              <div className="flex flex-col gap-4 p-5 bg-cream rounded-[14px]">
                <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40 mb-1">
                  Nutrition per pack
                </p>
                <NutritionBar label="Protein"  value={active.protein}  max={200} unit="g"     color="#1A4D2E" delay={0}    />
                <NutritionBar label="Calcium"  value={active.calcium}  max={120} unit="%"     color="#4CAF50" delay={0.1}  />
                <NutritionBar label="Calories" value={active.calories} max={800} unit=" kcal" color="#D4B896" delay={0.2}  />
              </div>

              {/* Ideal for */}
              <div className="flex items-center gap-3 bg-mint/30 rounded-[12px] px-4 py-3">
                <span className="text-xl">✓</span>
                <p className="font-body text-[14px] text-forest font-medium">{active.ideal}</p>
              </div>

              {/* CTA row */}
              <div className="flex items-end gap-4">
                <TofudaDa
                  size={130}
                  message={`${active.label} — ekdum sahi choice! 👍`}
                  showBubble
                  variant="solo"
                  className="flex-shrink-0"
                />
                <WhatsAppButton
                  text={`Order ${active.label} — ₹${active.price}`}
                  size="lg"
                  prefillMessage={`Hi Tofuda Da! 👋 Mujhe order karna hai. ${active.label} Soy Paneer — ₹${active.price}.`}
                  gaSource={`product_spotlight_${active.label}`}
                  className="flex-1 justify-center"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom hint */}
        <motion.p
          className="text-center font-mono text-[10px] uppercase tracking-widest text-charcoal/35 mt-6"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Card pe click karo — flip karke nutrition dekho ℹ
        </motion.p>
      </div>
    </section>
  )
}
