'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import TofudaDa from '@/components/ui/TofudaDa'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

const EASE = [0.16, 1, 0.3, 1] as const

export default function StoryPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <main className="bg-cream overflow-x-hidden">
      {/* Hero — full screen parallax */}
      <div ref={heroRef} className="relative h-[60vh] md:h-[90vh] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src="/images/product-board.png"
            alt="Nainital hills — Hills Tofuda origin"
            fill
            className="object-cover scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/40 to-transparent" />
        </motion.div>

        <motion.div
          className="relative z-10 max-w-content mx-auto px-6 md:px-8 pb-16 md:pb-24 w-full"
          style={{ opacity: heroOpacity }}
        >
          <motion.span
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/50 block mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            Our Story
          </motion.span>
          <motion.h1
            className="font-display text-cream leading-tight mb-6"
            style={{ fontSize: 'clamp(32px, 8vw, 96px)' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          >
            Nainital ne<br />
            <em className="text-soy-beige">sikhaya</em> banana
          </motion.h1>
          <motion.p
            className="font-body text-cream/70 text-[17px] max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          >
            How a hill town's love for honest food became Hills Tofuda.
          </motion.p>
        </motion.div>
      </div>

      {/* Story sections */}
      <div className="max-w-content mx-auto px-6 md:px-8">

        {/* Chapter 1 */}
        <StoryChapter
          number="01"
          title="Pehad ki baat"
          body="Nainital mein fresh food ki ek alag pehchaan hai. Yahan ke logon ko pata hai ki quality ka matlab kya hota hai — clean air, clean water, aur saaf ingredients. Hum usi philosophy ke saath soy paneer banate hain."
          imageRight="/images/product-plain.png"
          delay={0}
        />

        {/* Chapter 2 */}
        <StoryChapter
          number="02"
          title="Tofuda Da ka janam"
          body="Jab hum brand banana shuru kar rahe the, hame ek chehra chahiye tha — jo Nainital ki mitti se juda ho, jo thoda playful ho, thoda wise bhi. Tofuda Da usi soch ka result hai. Woh sirf mascot nahi — woh brand ki awaaz hai."
          imageLeft="/images/tofuda-da-bowl.png"
          delay={0.1}
          tofudaDa
        />

        {/* Chapter 3 */}
        <StoryChapter
          number="03"
          title="Har subah, fresh batch"
          body="No shortcuts. Har din subah 5 baje process shuru hoti hai. Premium soy beans, Nainital ka paani, aur decades purani technique. Result — ek tofu jo paneer jaisa firm hai, bilkul fresh, aur bilkul honest."
          imageRight="/images/recipe-sesame.png"
          delay={0.1}
        />

        {/* Values */}
        <ValuesSection />

        {/* Tofuda Da origin */}
        <TofudaOriginSection />
      </div>
    </main>
  )
}

function StoryChapter({
  number, title, body, imageRight, imageLeft, delay = 0, tofudaDa
}: {
  number: string
  title: string
  body: string
  imageRight?: string
  imageLeft?: string
  delay?: number
  tofudaDa?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 md:py-24 border-b border-[rgba(26,77,46,0.1)]"
    >
      {imageLeft && (
        <motion.div
          className="relative aspect-square rounded-card overflow-hidden order-1 md:order-1"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay, ease: EASE }}
        >
          <Image src={imageLeft} alt={title} fill className="object-cover" />
        </motion.div>
      )}

      <motion.div
        className={`flex flex-col gap-5 ${imageLeft ? 'order-2 md:order-2' : 'order-2 md:order-1'}`}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: delay + 0.15, ease: EASE }}
      >
        <span className="font-display text-[60px] md:text-[80px] text-forest/5 leading-none select-none -mb-2 md:-mb-4">{number}</span>
        <h2 className="font-display text-3xl md:text-5xl text-forest leading-tight">{title}</h2>
        <p className="font-body text-charcoal/70 text-[17px] leading-[1.8]">{body}</p>
        {tofudaDa && (
          <div className="mt-2">
            <TofudaDa size={100} message="Namaste! Main hoon Tofuda Da 🙏" showBubble variant="solo" />
          </div>
        )}
      </motion.div>

      {imageRight && (
        <motion.div
          className="relative aspect-square rounded-card overflow-hidden order-1 md:order-2"
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay, ease: EASE }}
        >
          <Image src={imageRight} alt={title} fill className="object-cover" />
        </motion.div>
      )}
    </div>
  )
}

function ValuesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const values = [
    { icon: '🏔️', title: 'Place-first', body: 'Nainital sirf location nahi — yeh brand ka DNA hai.' },
    { icon: '🌱', title: 'Zero compromise', body: 'No preservatives. No shortcuts. Agar fresh nahi, toh deliver nahi.' },
    { icon: '💚', title: 'Community', body: 'Local families se shuru. Unka trust hi hamare liye sabse bada award hai.' },
    { icon: '🧑‍🍳', title: 'Honest food', body: 'Jo dikhta hai, wahi hai. No gimmicks, no marketing fluff.' },
  ]

  return (
    <div ref={ref} className="py-16 md:py-24">
      <motion.h2
        className="font-display text-3xl md:text-5xl text-forest leading-tight mb-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Jo hum believe karte hain
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white rounded-card border border-[rgba(26,77,46,0.1)] hover:border-forest/30 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE }}
          >
            <span className="text-3xl block mb-4">{v.icon}</span>
            <h3 className="font-display text-[20px] text-forest mb-2">{v.title}</h3>
            <p className="font-body text-charcoal/60 text-[14px] leading-relaxed">{v.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TofudaOriginSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className="py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 text-center md:text-left"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <TofudaDa size={160} message="Chalo order karte hain! 🛒" showBubble variant="solo" className="flex-shrink-0" />
      <div>
        <h2 className="font-display text-h2 text-forest leading-display mb-4">
          Tofuda Da kehta hai —
        </h2>
        <p className="font-body text-charcoal/70 text-[17px] leading-[1.8] mb-6 max-w-lg">
          "Main sirf ek mascot nahi hoon. Main us har ghar ki kahani hoon jahan Hills Tofuda pahuncha hai. Aap bhi is family ka hissa ban sakte ho — ek WhatsApp message se."
        </p>
        <WhatsAppButton text="Family mein aao — Order karo" size="lg" />
      </div>
    </motion.div>
  )
}
