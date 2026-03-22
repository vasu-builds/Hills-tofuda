'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'

const EASE_SNAPPY = [0.16, 1, 0.3, 1] as const

// Cream wipe overlay — slides left-to-right on exit, then out on enter
function PageWipe() {
  return (
    <motion.div
      className="fixed inset-0 z-[9000] pointer-events-none"
      style={{ background: '#FAF7F0' }}
      initial={{ scaleX: 0, transformOrigin: 'left center' }}
      animate={{ scaleX: 0, transformOrigin: 'right center' }}
      exit={{ scaleX: 1, transformOrigin: 'left center' }}
      transition={{ duration: 0.45, ease: EASE_SNAPPY }}
    />
  )
}

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {children}
        <PageWipe />
      </motion.div>
    </AnimatePresence>
  )
}
