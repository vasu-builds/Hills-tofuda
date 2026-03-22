'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false)
  const pathname = usePathname()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Use springs for that buttery smooth "Awwwards" follow effect
  const springX = useSpring(cursorX, { stiffness: 400, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 400, damping: 28 })

  useEffect(() => {
    // Hide native cursor, only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    document.body.style.cursor = 'none'

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if hovering over a clickable element
      const isClickable = target.closest('a') !== null || target.closest('button') !== null || target.closest('[role="button"]') !== null || window.getComputedStyle(target).cursor === 'pointer'
      setHovered(isClickable)
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', checkHover)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', checkHover)
      document.body.style.cursor = 'auto'
    }
  }, [cursorX, cursorY])

  // Reset hover state on route change
  useEffect(() => setHovered(false), [pathname])

  // Prevent hydration mismatch by rendering null on server
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <div className="custom-cursor-container relative">
      {/* Outer circle — follows with spring smoothing */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-forest/30 pointer-events-none z-[100100] mix-blend-multiply origin-center"
        style={{
          x: springX,
          y: springY,
          marginLeft: '-16px',
          marginTop: '-16px',
        }}
        animate={{
          scale: hovered ? 1.5 : 1,
          borderColor: hovered ? 'rgba(255, 107, 53, 0.4)' : 'rgba(26, 77, 46, 0.3)',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      {/* Inner dot — constant follow */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[100101] mix-blend-multiply origin-center"
        style={{
          x: cursorX,
          y: cursorY,
          marginLeft: '-5px',
          marginTop: '-5px',
        }}
        animate={{
          scale: hovered ? 2.2 : 1,
          backgroundColor: hovered ? '#FF6B35' : '#1A4D2E',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
      <style jsx global>{`
        * { cursor: none !important; }
        a, button, [role="button"] { cursor: none !important; }
        @media (pointer: coarse) {
          * { cursor: auto !important; }
          .custom-cursor-container { display: none !important; }
        }
      `}</style>
    </div>
  )
}
