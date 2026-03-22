'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import TofudaDa from '@/components/ui/TofudaDa'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

const EASE = [0.16, 1, 0.3, 1] as const

const COMPARISON = [
  { label: 'Protein (per 100g)', soy: '18g', dairy: '11g', soyWins: true },
  { label: 'Cholesterol', soy: '0mg ✅', dairy: '34mg', soyWins: true },
  { label: 'Saturated Fat', soy: '0.5g', dairy: '5.9g', soyWins: true },
  { label: 'Calcium', soy: '22%', dairy: '20%', soyWins: true },
  { label: 'Calories', soy: '144 kcal', dairy: '321 kcal', soyWins: true },
  { label: 'Lactose-free', soy: '✅ Yes', dairy: '❌ No', soyWins: true },
  { label: 'Water used (per kg)', soy: '300L', dairy: '1000L', soyWins: true },
  { label: 'CO₂ emissions', soy: 'Low', dairy: 'High', soyWins: true },
]

const BENEFITS = [
  {
    icon: '💪',
    title: 'Zyada Protein',
    stat: '18g',
    statLabel: 'per 100g',
    desc: 'Regular paneer se 64% zyada protein. Gym goers aur active lifestyle ke liye perfect.',
    message: 'Protein ke liye best choice! 💪',
  },
  {
    icon: '❤️',
    title: 'Dil ka dost',
    stat: '0mg',
    statLabel: 'cholesterol',
    desc: 'Zero cholesterol. Heart health ke liye dairy paneer se kaafi behtar — cardiologists recommend karte hain plant-based protein.',
    message: 'Dil ko healthy rakho! ❤️',
  },
  {
    icon: '🌍',
    title: 'Environment ke liye',
    stat: '70%',
    statLabel: 'less water',
    desc: 'Soy paneer banane mein dairy paneer ke comparison mein 70% kam paani lagta hai. Nainital ka paani — sooch ke use karo.',
    message: 'Nature ka khayal rakho 🌿',
  },
  {
    icon: '🥛',
    title: 'Lactose-free',
    stat: '100%',
    statLabel: 'dairy-free',
    desc: 'Lactose intolerant log bhi freely kha sakte hain. Same taste, same texture — bina discomfort ke.',
    message: 'Sab kha sakte hain! 😊',
  },
]

function AnimatedStat({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className="font-display text-[48px] text-forest leading-none"
    >
      {value}
    </motion.div>
  )
}

export default function WhyPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const tableInView = useInView(tableRef, { once: true, margin: '-80px' })

  return (
    <main className="bg-cream pt-24">
      <div className="max-w-content mx-auto px-6 md:px-8">

        {/* Header */}
        <div ref={heroRef} className="text-center py-16 md:py-24">
          <motion.span
            className="badge border-forest text-forest"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            🔬 Science-backed
          </motion.span>
          <motion.h1
            className="font-display text-h1 text-forest leading-display mt-4 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            Soy Paneer kyun?
          </motion.h1>
          <motion.p
            className="font-body text-charcoal/60 text-[17px] max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            Dairy paneer se better nutrition, zero cholesterol, aur environment ke liye bhi achha. Yeh sirf hum nahi keh rahe — numbers bolta hai.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          >
            <TofudaDa size={100} message="Main samjhata hoon! 📊" showBubble variant="solo" />
          </motion.div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {BENEFITS.map((b, i) => (
            <BenefitCard key={i} benefit={b} delay={0.1 + i * 0.1} />
          ))}
        </div>

        {/* Comparison table */}
        <div ref={tableRef} className="mb-20">
          <motion.h2
            className="font-display text-h2 text-forest leading-display mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Soy Paneer <em>vs</em> Dairy Paneer
          </motion.h2>

          <motion.div
            className="rounded-card overflow-hidden border border-[rgba(26,77,46,0.15)] shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {/* Table header */}
            <div className="grid grid-cols-3 bg-forest text-cream">
              <div className="p-4 font-mono text-[11px] uppercase tracking-widest text-cream/50">Nutrient</div>
              <div className="p-4 font-mono text-[11px] uppercase tracking-widest text-leaf text-center">🌱 Soy Paneer</div>
              <div className="p-4 font-mono text-[11px] uppercase tracking-widest text-cream/50 text-center">🥛 Dairy Paneer</div>
            </div>

            {COMPARISON.map((row, i) => (
              <motion.div
                key={i}
                className={`grid grid-cols-3 border-b border-[rgba(26,77,46,0.08)] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-cream'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={tableInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
              >
                <div className="p-4 font-body text-[14px] text-charcoal/70 font-medium">{row.label}</div>
                <div className="p-4 font-body text-[14px] font-semibold text-forest text-center bg-mint/20">{row.soy}</div>
                <div className="p-4 font-body text-[14px] text-charcoal/50 text-center">{row.dairy}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Environment section */}
        <EnvironmentSection />

        {/* Final CTA */}
        <div className="py-16 md:py-24 text-center">
          <TofudaDa size={120} message="Ab convinced ho gaye? 😄" showBubble variant="with-bowl" className="mb-6 mx-auto" />
          <h2 className="font-display text-h2 text-forest leading-display mb-4">
            Try karo, fark mehsoos karo
          </h2>
          <p className="font-body text-charcoal/60 text-[16px] mb-8 max-w-md mx-auto">
            200g se shuru karo — ₹49 mein Nainital ki taazgi aapke ghar.
          </p>
          <WhatsAppButton text="200g Pack — ₹49 se shuru" size="lg" prefillMessage="Hi Tofuda Da! 👋 Mujhe 200g soy paneer try karna hai." />
        </div>
      </div>
    </main>
  )
}

function BenefitCard({ benefit, delay }: { benefit: typeof BENEFITS[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className="p-6 bg-white rounded-card border border-[rgba(26,77,46,0.1)] hover:border-forest/25 hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      <span className="text-3xl block mb-4">{benefit.icon}</span>
      <AnimatedStat value={benefit.stat} delay={delay + 0.1} />
      <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal/40 block mb-3">
        {benefit.statLabel}
      </span>
      <h3 className="font-display text-[18px] text-forest mb-2">{benefit.title}</h3>
      <p className="font-body text-charcoal/60 text-[13px] leading-relaxed">{benefit.desc}</p>
    </motion.div>
  )
}

function EnvironmentSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="py-16 md:py-20 rounded-card bg-forest p-8 md:p-12 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div>
          <motion.h2
            className="font-display text-[32px] md:text-[40px] text-cream leading-display mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            Nainital ke liye bhi achha
          </motion.h2>
          <motion.p
            className="font-body text-cream/70 text-[16px] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            Soy farming uses significantly less water and land than dairy. When you choose Hills Tofuda, you're also choosing Nainital's future.
          </motion.p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { stat: '70%', label: 'Less water used', icon: '💧' },
            { stat: '50%', label: 'Less land needed', icon: '🌾' },
            { stat: '3×', label: 'More protein per acre', icon: '📈' },
            { stat: '0', label: 'Artificial additives', icon: '✨' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/10 rounded-card p-4 text-center border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
            >
              <span className="text-2xl block mb-1">{item.icon}</span>
              <div className="font-display text-[28px] text-cream leading-none">{item.stat}</div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-cream/50 mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
