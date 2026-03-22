'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const EASE = [0.16, 1, 0.3, 1] as const

export default function LoadingScreen() {
  const [phase, setPhase]     = useState<'loading' | 'done' | 'gone'>('loading')
  const [progress, setProgress] = useState(0)
  const [shown, setShown]     = useState(false)
  const hasRun = useRef(false)

  useEffect(() => {
    const visited = sessionStorage.getItem('ht-visited')
    if (visited) { setPhase('gone'); return }
    sessionStorage.setItem('ht-visited', '1')
    setShown(true)

    // Wait for hero to signal readiness
    const handleReady = () => {
      // Small delay for smooth transition
      setTimeout(() => {
        setPhase('done')
        setTimeout(() => setPhase('gone'), 800)
      }, 500)
    }

    const handleProgress = (e: any) => {
      const p = e.detail?.progress || 0
      setProgress(Math.round(p))
    }

    window.addEventListener('hero-ready', handleReady)
    window.addEventListener('hero-progress', handleProgress)

    // Fallback: don't stay stuck forever
    const fallback = setTimeout(() => {
      handleReady()
    }, 6000)

    return () => {
      window.removeEventListener('hero-ready', handleReady)
      window.removeEventListener('hero-progress', handleProgress)
      clearTimeout(fallback)
    }
  }, [])

  if (phase === 'gone' || !shown) return null

  return (
    <AnimatePresence>
      {(phase === 'loading' || phase === 'done') && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#1A4D2E' }}
          exit={{
            clipPath: ['inset(0 0 0 0)', 'inset(0 0 100% 0)'],
            transition: { duration: 0.7, ease: EASE },
          }}
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Decorative rings */}
          {[200, 340, 480].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/8"
              style={{ width: size, height: size }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: i * 0.1, ease: EASE }}
            />
          ))}

          {/* Tofuda Da — walks in from right */}
          <motion.div
            className="relative z-10 mb-6"
            initial={{ x: 280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            {/* Glow behind mascot */}
            <div
              className="absolute inset-0 rounded-full blur-3xl scale-110"
              style={{ background: 'radial-gradient(circle, rgba(212,184,150,0.25) 0%, transparent 70%)' }}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/images/tofuda-da.png"
                alt="Tofuda Da"
                width={160}
                height={160}
                className="object-contain relative z-10"
                priority
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}
              />
            </motion.div>
          </motion.div>

          {/* Brand name */}
          <motion.div
            className="text-center z-10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          >
            <h1 className="font-display text-cream text-[32px] md:text-[40px] leading-none mb-1">
              Hills Tofuda
            </h1>
            <p className="font-hindi text-cream/50 text-[16px]">
              नैनीताल का सोय पनीर
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="z-10 w-[220px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Track */}
            <div className="h-[2px] bg-white/15 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-soy-beige rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
                Fresh ho raha hai
              </span>
              <span className="font-mono text-[11px] text-cream/60 font-medium">
                {progress}%
              </span>
            </div>
          </motion.div>

          {/* Speech bubble — appears at 85% */}
          <AnimatePresence>
            {progress >= 85 && (
              <motion.div
                className="absolute z-20"
                style={{ bottom: '28%', right: '25%' }}
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div
                  className="bg-white rounded-[14px] px-4 py-2.5 relative shadow-lg"
                  style={{ border: '2px solid #FF6B35', boxShadow: '3px 3px 0 #FF6B35' }}
                >
                  <span className="font-body font-semibold text-[13px] text-charcoal whitespace-nowrap">
                    Aa gaya! 🎉
                  </span>
                  <div
                    className="absolute -bottom-[10px] left-5 w-0 h-0"
                    style={{
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: '10px solid #FF6B35',
                    }}
                  />
                  <div
                    className="absolute -bottom-[7px] left-[21px] w-0 h-0"
                    style={{
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: '8px solid white',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tagline bottom */}
          <motion.p
            className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/25 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Nainital · Fresh Daily · Since 2024
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
