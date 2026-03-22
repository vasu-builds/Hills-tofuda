'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { RECIPES } from '@/lib/recipes'

const EASE = [0.16, 1, 0.3, 1] as const
const CATEGORIES = ['All', 'Curry', 'Breakfast', 'Starter', 'Quick']

export default function RecipesListPage() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true })
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? RECIPES
    : RECIPES.filter(r => r.category === activeCategory)

  return (
    <main ref={ref} className="bg-cream min-h-screen pt-24">
      <div className="max-w-content mx-auto px-6 md:px-8 pb-section-mobile md:pb-section">

        {/* Header */}
        <div className="py-12 md:py-16">
          <motion.span
            className="badge border-forest text-forest"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
          >
            🍳 Tofuda Da ki Recipes
          </motion.span>
          <motion.h1
            className="font-display text-4xl md:text-6xl text-forest leading-tight mt-4 mb-3"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            Banao, khao, repeat karo
          </motion.h1>
          <motion.p
            className="font-body text-charcoal/60 text-[17px] max-w-xl mb-8"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            Soy paneer se banaye jaane wale best Indian recipes — easy, healthy, aur absolutely delicious.
          </motion.p>

          {/* Category filter */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-pill font-mono text-[11px] uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-forest text-cream border-forest'
                    : 'border-[rgba(26,77,46,0.2)] text-charcoal hover:border-forest'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Recipe grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((recipe, i) => (
            <RecipeCard key={recipe.slug} recipe={recipe} delay={0.05 * i} />
          ))}
        </div>

        {/* SEO text */}
        <div className="mt-20 pt-12 border-t border-[rgba(26,77,46,0.1)]">
          <h2 className="font-display text-[22px] text-forest mb-3">Hills Tofuda Soy Paneer Recipes</h2>
          <p className="font-body text-charcoal/55 text-[15px] leading-relaxed max-w-2xl">
            Soy paneer (tofu) regular dairy paneer ki jagah easily use ho sakta hai. Zyada protein, zero cholesterol — aur taste bilkul wahi. Nainital ke Hills Tofuda ka fresh soy paneer use karo inhi recipes mein. WhatsApp pe order karo, same day delivery Nainital, Haldwani aur Kathgodam mein.
          </p>
        </div>
      </div>
    </main>
  )
}

function RecipeCard({ recipe, delay }: { recipe: typeof RECIPES[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      <Link href={`/recipes/${recipe.slug}`} className="group block">
        <div className="bg-white rounded-card overflow-hidden border border-[rgba(26,77,46,0.1)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={recipe.image}
              alt={`${recipe.title} recipe using Hills Tofuda soy paneer`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute top-3 left-3 bg-forest text-cream font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-pill">
              {recipe.tag}
            </span>
            <span className="absolute top-3 right-3 bg-white/90 text-forest font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-pill">
              {recipe.difficulty}
            </span>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h2 className="font-display text-[20px] text-forest leading-snug group-hover:text-forest/80 transition-colors">
                  {recipe.title}
                </h2>
                <p className="font-hindi text-[13px] text-charcoal/40">{recipe.titleHindi}</p>
              </div>
            </div>
            <p className="font-body text-charcoal/60 text-[13px] leading-relaxed mb-4 line-clamp-2">
              {recipe.description}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-wider text-charcoal/45">
              <span>⏱ {recipe.time}</span>
              <span className="w-1 h-1 rounded-full bg-charcoal/20" />
              <span>👥 {recipe.servings} servings</span>
              <span className="w-1 h-1 rounded-full bg-charcoal/20" />
              <span className="text-forest font-semibold">💪 {recipe.protein}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
