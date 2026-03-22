'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Recipe, RECIPES } from '@/lib/recipes'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import TofudaDa from '@/components/ui/TofudaDa'

const EASE = [0.16, 1, 0.3, 1] as const

export default function RecipeDetailPage({ recipe }: { recipe: Recipe }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useTransform(scrollYProgress, [0, 1], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const related = RECIPES.filter(r => r.slug !== recipe.slug && r.category === recipe.category).slice(0, 3)
  const fallbackRelated = RECIPES.filter(r => r.slug !== recipe.slug).slice(0, 3)
  const relatedRecipes = related.length >= 2 ? related : fallbackRelated

  return (
    <main className="bg-cream min-h-screen">
      {/* Hero */}
      <div ref={heroRef} className="relative h-[55vh] md:h-[65vh] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={recipe.image}
            alt={`${recipe.title} — Hills Tofuda soy paneer recipe`}
            fill
            className="object-cover scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        </motion.div>

        <motion.div
          className="relative z-10 max-w-content mx-auto px-6 md:px-8 pb-10 md:pb-16 w-full"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="flex flex-wrap gap-2 mb-4"
          >
            <span className="bg-forest text-cream font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-pill">
              {recipe.tag}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-cream font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-pill">
              {recipe.category}
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-cream leading-display mb-2"
            style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {recipe.title}
          </motion.h1>
          <motion.p
            className="font-hindi text-cream/60 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {recipe.titleHindi}
          </motion.p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-content mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Main column */}
          <div className="lg:col-span-2 flex flex-col gap-12">

            {/* Quick meta */}
            <QuickMeta recipe={recipe} />

            {/* Description */}
            <p className="font-body text-charcoal/70 text-[17px] leading-[1.85]">
              {recipe.description}
            </p>

            {/* Ingredients */}
            <IngredientsSection recipe={recipe} />

            {/* Steps */}
            <StepsSection recipe={recipe} />

            {/* Tips */}
            <TipsSection recipe={recipe} />

            {/* CTA */}
            <OrderCTA recipe={recipe} />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <NutritionCard recipe={recipe} />
            <TofudaCTA recipe={recipe} />
          </div>
        </div>

        {/* Related recipes */}
        {relatedRecipes.length > 0 && (
          <RelatedRecipes recipes={relatedRecipes} />
        )}
      </div>
    </main>
  )
}

function QuickMeta({ recipe }: { recipe: Recipe }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { icon: '⏱', label: 'Total Time', value: recipe.time },
        { icon: '👥', label: 'Servings', value: `${recipe.servings} people` },
        { icon: '📊', label: 'Difficulty', value: recipe.difficulty },
        { icon: '💪', label: 'Protein', value: `${recipe.protein} / serving` },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-card p-4 border border-[rgba(26,77,46,0.1)] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE }}
        >
          <span className="text-2xl block mb-1">{item.icon}</span>
          <p className="font-mono text-[9px] uppercase tracking-wider text-charcoal/40 mb-0.5">{item.label}</p>
          <p className="font-body font-semibold text-[13px] text-charcoal">{item.value}</p>
        </motion.div>
      ))}
    </div>
  )
}

function IngredientsSection({ recipe }: { recipe: Recipe }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref}>
      <motion.h2
        className="font-display text-[28px] text-forest mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        Ingredients
      </motion.h2>
      <div className="bg-white rounded-card border border-[rgba(26,77,46,0.1)] overflow-hidden">
        {recipe.ingredients.map((ingredient, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-3 px-5 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-cream/50'} border-b border-[rgba(26,77,46,0.06)] last:border-0`}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.05 + i * 0.04, ease: EASE }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-leaf flex-shrink-0" />
            <span
              className={`font-body text-[14px] leading-relaxed ${
                ingredient.includes('Hills Tofuda')
                  ? 'text-forest font-semibold'
                  : 'text-charcoal/80'
              }`}
            >
              {ingredient}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StepsSection({ recipe }: { recipe: Recipe }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref}>
      <motion.h2
        className="font-display text-[28px] text-forest mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        Method
      </motion.h2>
      <div className="flex flex-col gap-5">
        {recipe.steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex gap-5 group"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08 + i * 0.1, ease: EASE }}
          >
            {/* Step number */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-forest text-cream font-mono text-[12px] font-semibold flex items-center justify-center">
                {i + 1}
              </div>
              {i < recipe.steps.length - 1 && (
                <div className="w-px flex-1 min-h-[24px] bg-[rgba(26,77,46,0.15)]" />
              )}
            </div>
            {/* Content */}
            <div className="pb-4 pt-1 flex-1">
              <h3 className="font-display text-[18px] text-forest mb-1.5">{step.title}</h3>
              <p className="font-body text-charcoal/70 text-[15px] leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function TipsSection({ recipe }: { recipe: Recipe }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className="bg-mint/40 rounded-card p-6 border border-leaf/20"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <h2 className="font-display text-[20px] text-forest mb-4 flex items-center gap-2">
        💡 Pro Tips
      </h2>
      <ul className="flex flex-col gap-3">
        {recipe.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5 font-body text-[14px] text-charcoal/75 leading-relaxed">
            <span className="text-leaf mt-0.5 flex-shrink-0">✓</span>
            {tip}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function OrderCTA({ recipe }: { recipe: Recipe }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className="bg-forest rounded-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <div className="flex-1 text-center md:text-left">
        <h3 className="font-display text-[22px] text-cream mb-2">
          Fresh {recipe.title} banao?
        </h3>
        <p className="font-body text-cream/65 text-[14px]">
          Hills Tofuda ka fresh soy paneer order karo — same day delivery.
        </p>
      </div>
      <WhatsAppButton
        text="Order Fresh Tofu"
        size="lg"
        prefillMessage={`Hi Tofuda Da! 👋 Mujhe ${recipe.title} banana hai, fresh soy paneer chahiye.`}
        className="flex-shrink-0"
      />
    </motion.div>
  )
}

function NutritionCard({ recipe }: { recipe: Recipe }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-card border border-[rgba(26,77,46,0.12)] overflow-hidden sticky top-24"
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="bg-forest px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-cream/70">Nutrition per serving</p>
      </div>
      <div className="p-5 flex flex-col gap-3">
        {[
          { label: 'Calories', value: `${recipe.calories} kcal` },
          { label: 'Protein', value: recipe.protein },
          { label: 'Prep Time', value: `${recipe.prepTime} min` },
          { label: 'Cook Time', value: `${recipe.cookTime} min` },
          { label: 'Servings', value: recipe.servings },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-[rgba(26,77,46,0.07)] last:border-0">
            <span className="font-mono text-[11px] uppercase tracking-wider text-charcoal/45">{item.label}</span>
            <span className="font-body font-semibold text-[14px] text-charcoal">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function TofudaCTA({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-cream rounded-card border border-[rgba(26,77,46,0.1)] text-center">
      <TofudaDa
        size={80}
        message={`${recipe.title} bahut tasty banta hai! 😋`}
        showBubble
        variant="solo"
      />
      <p className="font-body text-[13px] text-charcoal/55">
        Made with Hills Tofuda fresh soy paneer
      </p>
      <Link href="/order" className="font-body font-semibold text-[13px] text-forest underline-offset-2 hover:underline">
        Order karo →
      </Link>
    </div>
  )
}

function RelatedRecipes({ recipes }: { recipes: Recipe[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div ref={ref} className="mt-16 pt-12 border-t border-[rgba(26,77,46,0.1)]">
      <motion.h2
        className="font-display text-[28px] text-forest mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        Aur recipes try karo
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe, i) => (
          <motion.div
            key={recipe.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: EASE }}
          >
            <Link href={`/recipes/${recipe.slug}`} className="group block">
              <div className="bg-white rounded-card overflow-hidden border border-[rgba(26,77,46,0.1)] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={recipe.image} alt={recipe.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-[18px] text-forest leading-snug mb-1">{recipe.title}</h3>
                  <div className="flex gap-3 font-mono text-[10px] uppercase tracking-wider text-charcoal/40">
                    <span>⏱ {recipe.time}</span>
                    <span>💪 {recipe.protein}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
