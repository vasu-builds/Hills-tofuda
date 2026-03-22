'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStock } from '@/lib/useStock'

export default function FreshTodayBadge({ className = '' }: { className?: string }) {
  const { available, count, loading } = useStock()

  if (loading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-white/60 border border-[rgba(26,77,46,0.12)] ${className}`}>
        <span className="w-2 h-2 rounded-full bg-soy-beige animate-pulse" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-charcoal/40">
          Checking stock…
        </span>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {available ? (
        <motion.div
          key="available"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-pill border ${className}`}
          style={{ background: '#C8E6C9', borderColor: 'rgba(76,175,80,0.3)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* Pulsing green dot */}
          <span className="relative flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-leaf block" />
            <span className="absolute inset-0 rounded-full bg-leaf animate-ping opacity-60" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-forest font-semibold">
            Aaj Fresh Batch Ready!
          </span>
          {count > 0 && (
            <span className="font-mono text-[10px] text-forest/60">
              ({count} kg left)
            </span>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="unavailable"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-red-50 border border-red-200 ${className}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-red-600">
            Aaj Stock Khatam
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
