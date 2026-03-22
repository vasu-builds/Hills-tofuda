'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import TofudaDa from '@/components/ui/TofudaDa'

const EASE = [0.16, 1, 0.3, 1] as const

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mallital, Nainital',
    message: 'Aaj fresh batch mila! 🎉 Tofu bahut fresh tha, aur delivery bhi time pe. Tofuda Da best hai! Will order again.',
    time: 'Today, 9:32 AM',
    rating: 5,
    emoji: '👩',
  },
  {
    name: 'Rohit Joshi',
    location: 'Haldwani',
    message: 'Yaar 500g pack ka tofu 3 din tak fresh raha. Protein content bhi check kiya — 18g bilkul sahi hai. Gym diet ke liye perfect.',
    time: 'Yesterday, 6:15 PM',
    rating: 5,
    emoji: '💪',
  },
  {
    name: 'Sunita Devi',
    location: 'Kathgodam',
    message: 'Pehli baar tofu try kiya Hills Tofuda ka. Sach mein paneer jaisa taste hai! Bacche bhi kha rahe hain bina bole. Thank you Tofuda Da 🙏',
    time: '2 days ago',
    rating: 5,
    emoji: '🧕',
  },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative py-section-mobile md:py-section overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #F0EBE0 0%, #FAF7F0 100%)' }}
    >
      <div className="max-w-content mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-forest/50">04 / Reviews</span>
          </motion.div>
          <motion.h2
            className="font-display text-3xl md:text-5xl text-forest leading-tight mb-3"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            Nainital bolta hai
          </motion.h2>
        </div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          {[
            { label: 'Families served', value: 500, suffix: '+' },
            { label: 'Orders delivered', value: 2400, suffix: '+' },
            { label: 'Google rating', value: 4.9, suffix: '★' },
            { label: 'Repeat customers', value: 87, suffix: '%' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-card p-5 text-center border border-[rgba(26,77,46,0.1)]"
            >
              <div className="font-display text-[36px] text-forest leading-none mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-charcoal/50">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* WhatsApp chat screenshots / testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-card p-5 border border-[rgba(26,77,46,0.1)] shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 + i * 0.12, ease: EASE }}
            >
              {/* WhatsApp header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(26,77,46,0.08)]">
                <div className="w-9 h-9 rounded-full bg-mint flex items-center justify-center text-lg">
                  {t.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-[13px] text-charcoal truncate">{t.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-charcoal/40 truncate">
                    📍 {t.location}
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" className="flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>

              {/* Message bubble */}
              <div
                className="rounded-[16px_16px_16px_4px] p-3.5 mb-3"
                style={{ background: '#DCF8C6' }}
              >
                <p className="font-body text-[14px] text-charcoal/90 leading-relaxed">{t.message}</p>
              </div>

              {/* Stars + time */}
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-amber-400 text-[14px]">★</span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-charcoal/40">{t.time}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tofuda Da closing */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
        >
          <TofudaDa
            size={130}
            message="Inke ghar bhi pahuncha! 🏠"
            showBubble={true}
            variant="solo"
          />
          <div>
            <p className="font-display text-[22px] text-forest mb-1">
              Aap bhi try karo
            </p>
            <p className="font-body text-charcoal/60 text-[15px]">
              Pehla order — fresh ya paisa wapas. Koi sawaal nahi.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
