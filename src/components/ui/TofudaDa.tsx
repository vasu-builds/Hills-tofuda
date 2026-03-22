'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

interface TofudaDaProps {
  size?: number
  message?: string
  showBubble?: boolean
  className?: string
  variant?: 'with-bowl' | 'solo'
}

export default function TofudaDa({
  size = 160,
  message = 'Aaj fresh batch ready hai! 🎉',
  showBubble = true,
  className = '',
  variant = 'solo',
}: TofudaDaProps) {
  const gsapRef  = useRef<HTMLDivElement>(null)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  // GSAP float — yoyo, power1.inOut as per PRD
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile || !gsapRef.current) return
    const tl = gsap.to(gsapRef.current, {
      y: -10,
      duration: 2.2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })
    return () => { tl.kill() }
  }, [])

  // Delay bubble so it feels natural
  useEffect(() => {
    if (!showBubble) return
    const t = setTimeout(() => setBubbleVisible(true), 1600)
    return () => clearTimeout(t)
  }, [showBubble])

  return (
    <div className={`inline-flex flex-col items-center gap-0 ${className}`}>
      {/* Speech bubble — sits directly above mascot, connected */}
      <AnimatePresence>
        {(bubbleVisible || hovered) && (
          <motion.div
            className="relative mb-1 z-10 max-w-[200px]"
            initial={{ opacity:0, scale:0.75, y:8 }}
            animate={{ opacity:1, scale:1,   y:0 }}
            exit={{   opacity:0, scale:0.75, y:8 }}
            transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
          >
            {/* Bubble body */}
            <div
              className="bg-white px-4 py-2.5 rounded-[14px] relative shadow-sm"
              style={{ border:'2px solid #FF6B35', boxShadow:'2px 2px 0 #FF6B35' }}
            >
              <span className="text-[13px] font-body font-semibold text-charcoal leading-snug whitespace-nowrap">
                {message}
              </span>
            </div>
            {/* Tail — pointing down to mascot */}
            <div className="absolute -bottom-[9px] left-6">
              <div className="w-0 h-0"
                style={{ borderLeft:'8px solid transparent', borderRight:'8px solid transparent', borderTop:'10px solid #FF6B35' }}/>
            </div>
            <div className="absolute -bottom-[6px] left-[7px]">
              <div className="w-0 h-0"
                style={{ borderLeft:'7px solid transparent', borderRight:'7px solid transparent', borderTop:'8px solid white' }}/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot image — GSAP floats this div */}
      <div ref={gsapRef}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale:1.06 }}
          whileTap={{ scale:0.95 }}
          transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}
          className="cursor-pointer select-none"
        >
          <Image
            src={variant === 'with-bowl' ? '/images/tofuda-da-bowl.png' : '/images/tofuda-da.png'}
            alt="Tofuda Da — Hills Tofuda mascot"
            width={size}
            height={size}
            className="object-contain"
            priority={size >= 120}
            style={{
              background: 'transparent',
              filter: hovered
                ? 'drop-shadow(0 12px 30px rgba(26,77,46,0.35))'
                : 'drop-shadow(0 6px 16px rgba(26,77,46,0.22))',
              transition: 'filter 0.3s ease',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
