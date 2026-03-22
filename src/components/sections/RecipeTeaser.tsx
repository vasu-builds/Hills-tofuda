'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const EASE = [0.16, 1, 0.3, 1] as const

const RECIPES = [
  {
    title: 'Tofu Makhani',
    hindi: 'टोफू मखनी',
    time: '30 min',
    difficulty: 'Easy',
    tag: 'Restaurant Style',
    image: '/images/recipe-makhani.png',   // ← rich tomato curry
    description: 'Rich, creamy tomato-butter gravy. Paneer ki jagah tofu — aur bhi healthy.',
    rotate: -4,
  },
  {
    title: 'Tofu Bhurji',
    hindi: 'टोफू भुर्जी',
    time: '15 min',
    difficulty: 'Very Easy',
    tag: 'Breakfast Favourite',
    image: '/images/recipe-stirfry.png',   // ← stir fry / bhurji style
    description: 'Spiced scrambled tofu with onions, tomatoes, and Kumaoni masala.',
    rotate: 0,
  },
  {
    title: 'Soy Paneer Tikka',
    hindi: 'सोय पनीर टिक्का',
    time: '25 min',
    difficulty: 'Medium',
    tag: 'Party Starter',
    image: '/images/recipe-tikka.png',     // ← tikka / grilled
    description: 'Marinated in smoky spices, grilled to perfection. Party ka star dish.',
    rotate: 4,
  },
  {
    title: 'Palak Tofu',
    hindi: 'पालक टोफू',
    time: '20 min',
    difficulty: 'Easy',
    tag: 'Health Special',
    image: '/images/recipe-palak.png',     // ← green spinach dish
    description: 'Vibrant spinach gravy with golden tofu. Healthy aur tasty.',
    rotate: -3,
  },
]

export default function RecipeTeaser() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className="relative py-section-mobile md:py-section overflow-hidden bg-cream">

      <div className="max-w-content mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:gap-16 md:items-start">

          {/* ── LEFT: Fixed text column ── */}
          <div className="md:w-[300px] md:flex-shrink-0 mb-8 md:mb-0 md:sticky md:top-28">
            <motion.div
              initial={{ opacity:0, y:16 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.5, ease:EASE }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-forest/50">03 / Recipes</span>
              <span className="flex-1 h-px bg-[rgba(26,77,46,0.15)] max-w-[50px]"/>
            </motion.div>

            <motion.h2
              className="font-display text-h2 text-forest leading-display mb-4"
              initial={{ opacity:0, y:24 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, delay:0.08, ease:EASE }}
            >
              Tofu se banao,{' '}
              <em className="text-accent-orange">dil jeet lo</em>
            </motion.h2>

            <motion.p
              className="font-body text-charcoal/60 text-[15px] leading-relaxed mb-6"
              initial={{ opacity:0, y:16 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.6, delay:0.15, ease:EASE }}
            >
              Fresh Hills Tofuda soy paneer se banao ye recipes — healthy, tasty, aur ekdum ghar jaisi.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.55, delay:0.22, ease:EASE }}
            >
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 font-body font-semibold text-[14px] text-forest border-b-2 border-forest pb-0.5 hover:opacity-70 transition-opacity"
              >
                Aur recipes dekho
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={{ opacity:0 }}
              animate={inView ? { opacity:1 } : {}}
              transition={{ duration:0.6, delay:0.3, ease:EASE }}
            >
              {[
                { icon:'🍳', label:'6+ Recipes', sub:'Aur badhte ja rahe hain' },
                { icon:'⏱', label:'15–35 min', sub:'Easy weeknight cooking' },
                { icon:'💪', label:'High Protein', sub:'18g per 100g tofu' },
              ].map((s,i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[rgba(26,77,46,0.1)]">
                  <span className="text-xl w-8 flex-shrink-0">{s.icon}</span>
                  <div>
                    <p className="font-body font-semibold text-[13px] text-charcoal">{s.label}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-charcoal/40">{s.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Horizontal scroll cards ── */}
          <div className="flex-1 min-w-0">
            {/* Scroll hint on mobile */}
            <motion.p
              className="md:hidden font-mono text-[10px] uppercase tracking-widest text-charcoal/35 mb-3"
              initial={{ opacity:0 }}
              animate={inView ? { opacity:1 } : {}}
              transition={{ delay:0.4 }}
            >
              ← Swipe to see more
            </motion.p>

            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {RECIPES.map((recipe, i) => (
                <motion.div
                  key={recipe.title}
                  className="flex-shrink-0 w-[280px] md:w-[300px] snap-start"
                  initial={{ opacity:0, x:40 }}
                  animate={inView ? { opacity:1, x:0 } : {}}
                  transition={{ duration:0.65, delay:0.2 + i*0.1, ease:EASE }}
                  style={{ rotate: recipe.rotate }}
                  whileHover={{ rotate: 0, scale: 1.02, transition:{ duration:0.3 } }}
                >
                  <Link href={`/recipes`} className="group block">
                    <div className="bg-white rounded-[18px] overflow-hidden border border-[rgba(26,77,46,0.1)] shadow-sm hover:shadow-xl transition-shadow duration-300">
                      {/* Image */}
                      <div className="relative h-[200px] overflow-hidden">
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"/>
                        <span className="absolute top-3 left-3 bg-forest text-cream font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {recipe.tag}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-display text-[20px] text-forest leading-snug">{recipe.title}</h3>
                            <p className="font-hindi text-[12px] text-charcoal/40">{recipe.hindi}</p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 flex-shrink-0 mt-0.5">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal/45">⏱ {recipe.time}</span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-leaf font-semibold">{recipe.difficulty}</span>
                          </div>
                        </div>
                        <p className="font-body text-charcoal/58 text-[13px] leading-relaxed">
                          {recipe.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* See all card */}
              <motion.div
                className="flex-shrink-0 w-[200px] snap-start"
                initial={{ opacity:0 }}
                animate={inView ? { opacity:1 } : {}}
                transition={{ duration:0.6, delay:0.55 }}
              >
                <Link href="/recipes"
                  className="h-full min-h-[300px] flex flex-col items-center justify-center gap-4 bg-forest rounded-[18px] border border-[rgba(26,77,46,0.3)] hover:bg-forest-dark transition-colors duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <div className="text-center px-4">
                    <p className="font-display text-cream text-[18px] leading-snug">Sab recipes dekho</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-cream/50 mt-1">6+ recipes</p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
