'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Disable Lenis on mobile — native scroll is smoother on touch
    if (window.innerWidth < 768) return

    const lenis = new Lenis({
      lerp: 0.08,           // PRD spec: lerp 0.08
      smoothWheel: true,
      syncTouch: false,     // Don't touch mobile
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ticker — critical for ScrollTrigger accuracy
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return <>{children}</>
}
