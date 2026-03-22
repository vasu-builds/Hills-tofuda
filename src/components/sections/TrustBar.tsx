'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BADGES = [
  { icon: '💪', text: 'High Protein — 18g per 100g' },
  { icon: '🦴', text: 'Rich in Calcium' },
  { icon: '🌱', text: '100% Plant Based' },
  { icon: '❌', text: 'Zero Cholesterol' },
  { icon: '🏔️', text: 'Made in Nainital' },
  { icon: '🌞', text: 'Fresh Daily Batches' },
  { icon: '✅', text: 'No Preservatives' },
  { icon: '💧', text: 'Pure Mountain Water' },
]

export default function TrustBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-12 md:py-16 overflow-hidden bg-forest">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
        backgroundSize: '12px 12px',
      }} />

      {/* Static badges fade-in on scroll — then marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Marquee track */}
        <div className="flex overflow-hidden">
          <div
            className="flex items-center gap-8 animate-marquee whitespace-nowrap"
            style={{ animationDuration: '30s' }}
          >
            {[...BADGES, ...BADGES].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 flex-shrink-0"
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-cream/90 font-medium">
                  {badge.text}
                </span>
                <span className="w-1 h-1 rounded-full bg-soy-beige/50 ml-2 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
