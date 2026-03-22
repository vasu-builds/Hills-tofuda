'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TofudaDa from '@/components/ui/TofudaDa'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.16, 1, 0.3, 1] as const

const STEPS = [
  {
    number: '01',
    icon: '📲',
    title: 'WhatsApp pe tap karo',
    description: 'Neeche diye button pe click karo. Number automatically open ho jaata hai — koi searching nahi.',
    detail: '"Hi Tofuda Da" bol do, bas!',
    colorBg: '#C8E6C9',
  },
  {
    number: '02',
    icon: '📍',
    title: 'Address aur order bhejo',
    description: 'Pack size batao (200g / 500g / 1kg) aur ghar ka address bhejo. Hum confirm karenge.',
    detail: 'Same-day delivery for morning orders',
    colorBg: '#FAF7F0',
  },
  {
    number: '03',
    icon: '🚴',
    title: 'Fresh delivery, aapke ghar',
    description: 'Usi din fresh pack karke deliver. Nainital ki taazgi, seedha aapki rasoi mein.',
    detail: 'Morning: 8–11am • Evening: 4–7pm',
    colorBg: '#D4B896',
  },
]

export default function HowToOrder() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const step0Ref   = useRef<HTMLDivElement>(null)
  const step1Ref   = useRef<HTMLDivElement>(null)
  const step2Ref   = useRef<HTMLDivElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' })

  const stepRefs = [step0Ref, step1Ref, step2Ref]

  // ── GSAP ScrollTrigger timeline ─────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([step0Ref.current, step1Ref.current, step2Ref.current], {
        opacity: 0,
        y: 50,
        scale: 0.95,
      })
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })

      // Timeline scrubbed to scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'bottom 80%',
          scrub: 1.2,
        },
      })

      // Connecting line draws left-to-right
      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 2,
        ease: 'none',
      }, 0)

      // Steps stagger in while scrolling
      tl.to(step0Ref.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, 0.1)

      tl.to(step1Ref.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, 0.6)

      tl.to(step2Ref.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, 1.1)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-section-mobile md:py-section bg-forest overflow-hidden"
    >
      {/* Subtle diagonal texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full border border-white/5 pointer-events-none" />

      <div className="relative max-w-content mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-cream/35"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
          >
            02 / Order
          </motion.span>

          <motion.h2
            className="font-display text-h2 text-cream leading-display mt-3 mb-4"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            Teen steps, bas
          </motion.h2>

          <motion.p
            className="font-body text-cream/55 text-[16px] max-w-sm mx-auto"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
          >
            No app, no account, no waiting. Seedha WhatsApp se order karo.
          </motion.p>
        </div>

        {/* Steps + connecting line */}
        <div className="relative">
          {/* Animated connecting line — desktop only */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.67%-16px)] right-[calc(16.67%-16px)] h-px bg-white/08 z-0">
            <div
              ref={lineRef}
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(200,230,201,0.5), rgba(212,184,150,0.5))' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {STEPS.map((step, i) => (
              <div key={i}>
                {/* Step card — GSAP-controlled opacity/transform */}
                <div
                  ref={stepRefs[i]}
                  className="flex flex-col gap-5"
                >
                  <div
                    className="rounded-card p-6 md:p-8 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    {/* Big step number — watermark */}
                    <span
                      className="absolute top-2 right-3 font-display font-bold leading-none select-none pointer-events-none"
                      style={{ fontSize: '80px', color: 'rgba(255,255,255,0.04)' }}
                    >
                      {step.number}
                    </span>

                    {/* Icon circle */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5 border border-white/10 flex-shrink-0"
                      style={{ background: step.colorBg }}
                    >
                      {step.icon}
                    </div>

                    <h3 className="font-display text-[21px] text-cream leading-snug mb-3">
                      {step.title}
                    </h3>

                    <p className="font-body text-cream/90 text-[15px] leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-pill bg-white/20 text-white">
                      ✓ {step.detail}
                    </span>
                  </div>

                  {/* Mobile down arrow */}
                  {i < STEPS.length - 1 && (
                    <div className="flex justify-center md:hidden">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
                        <path d="M12 5v14M5 12l7 7 7-7"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        >
          <TofudaDa
            size={130}
            message="Main deliver karunga! 🛵"
            showBubble
            variant="solo"
            className="flex-shrink-0"
          />
          <div className="flex flex-col gap-3 items-center md:items-start">
            <p className="font-body text-cream/65 text-[15px]">
              Delivery: <strong className="text-cream">Nainital · Haldwani · Kathgodam</strong>
            </p>
            <WhatsAppButton text="Abhi Order Karo" size="lg" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
