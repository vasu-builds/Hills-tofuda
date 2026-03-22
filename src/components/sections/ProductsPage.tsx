'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

const EASE = [0.16, 1, 0.3, 1] as const

const PRODUCTS = [
  {
    name: 'Soy Paneer',
    weight: '200g',
    price: 49,
    priceLabel: '₹49',
    tag: 'Try karo',
    tagColor: '#C8E6C9',
    description: 'Perfect for a single meal. Try karein — fresh taste guarantee.',
    image: '/images/product-plain.png',
    nutrition: { protein: '36g', calcium: '22%', calories: '144 kcal', fat: '8g', carbs: '2.4g' },
    servings: '2–3 servings',
    highlight: false,
  },
  {
    name: 'Soy Paneer',
    weight: '500g',
    price: 110,
    priceLabel: '₹110',
    tag: 'Most Popular',
    tagColor: '#1A4D2E',
    tagTextColor: '#FAF7F0',
    description: 'Family ka favourite. Week bhar ke liye enough — fresh taste guaranteed.',
    image: '/images/product-board.png',
    nutrition: { protein: '90g', calcium: '55%', calories: '360 kcal', fat: '20g', carbs: '6g' },
    servings: '5–6 servings',
    highlight: true,
  },
  {
    name: 'Soy Paneer',
    weight: '1kg',
    price: 199,
    priceLabel: '₹199',
    tag: 'Best Value',
    tagColor: '#FF6B35',
    tagTextColor: '#fff',
    description: 'Bulk order for gym-goers, large families, or weekly meal prep.',
    image: '/images/product-white.png',
    nutrition: { protein: '180g', calcium: '110%', calories: '720 kcal', fat: '40g', carbs: '12g' },
    servings: '10–12 servings',
    highlight: false,
  },
]

export default function ProductsPage() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="min-h-screen pt-28 pb-section-mobile md:pb-section bg-cream">
      <div className="max-w-content mx-auto px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="badge border-forest text-forest">🏔️ Made in Nainital · Fresh Daily</span>
          </motion.div>
          <motion.h1
            className="font-display text-h1 text-forest leading-display mt-4 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            Hamare Products
          </motion.h1>
          <motion.p
            className="font-body text-charcoal/60 text-[17px] max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            Ek hi product — soy paneer. Teen sizes. Har subah fresh batch. Koi preservative nahi.
          </motion.p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={i}
              className={`
                relative rounded-card overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                ${product.highlight
                  ? 'border-forest shadow-lg ring-2 ring-forest/20'
                  : 'border-[rgba(26,77,46,0.15)] bg-white shadow-sm'
                }
              `}
              style={{ background: product.highlight ? 'linear-gradient(160deg, #EBF5EB 0%, #FFFFFF 100%)' : 'white' }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: EASE }}
            >
              {/* Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: product.tagColor,
                    color: (product as any).tagTextColor || '#1A4D2E',
                  }}
                >
                  {product.tag}
                </span>
              </div>

              {/* Image */}
              <div className="relative h-52 bg-cream-dark overflow-hidden">
                <Image
                  src={product.image}
                  alt={`Hills Tofuda ${product.weight} Soy Paneer`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-[22px] text-forest leading-snug">{product.name}</h3>
                    <span className="font-mono text-[13px] text-charcoal/50 uppercase tracking-wider">{product.weight}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-[32px] text-forest leading-none">{product.priceLabel}</div>
                    <span className="font-mono text-[10px] text-charcoal/40 uppercase tracking-wider">{product.servings}</span>
                  </div>
                </div>

                <p className="font-body text-charcoal/60 text-[14px] leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Nutrition mini grid */}
                <div className="grid grid-cols-3 gap-2 mb-5 p-3 bg-cream rounded-lg">
                  {[
                    { label: 'Protein', value: product.nutrition.protein },
                    { label: 'Calcium', value: product.nutrition.calcium },
                    { label: 'Calories', value: product.nutrition.calories },
                  ].map((n, j) => (
                    <div key={j} className="text-center">
                      <div className="font-body font-semibold text-forest text-[14px]">{n.value}</div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-charcoal/40">{n.label}</div>
                    </div>
                  ))}
                </div>

                <WhatsAppButton
                  text={`Order ${product.weight}`}
                  size="md"
                  className="w-full justify-center"
                  prefillMessage={`Hi Tofuda Da! 👋 Mujhe order karna hai. ${product.weight} Soy Paneer — ${product.priceLabel}.`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Freshness promise */}
        <motion.div
          className="mt-16 p-8 bg-forest rounded-card text-center text-cream"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
        >
          <h3 className="font-display text-[28px] mb-2">Freshness Guarantee</h3>
          <p className="font-body text-cream/70 text-[16px] max-w-lg mx-auto">
            Har batch usi din fresh banta hai. Agar satisfy nahi hue — full refund, koi sawaal nahi.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
