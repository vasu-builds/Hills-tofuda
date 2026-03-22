'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function TofuBlock3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 })

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.body.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      setMouseX(((e.clientX - centerX) / centerX) * 15)
      setMouseY(((e.clientY - centerY) / centerY) * -10)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  return (
    <div className="flex items-center justify-center w-full h-full" ref={containerRef}>
      <motion.div
        className="tofu-scene flex items-center justify-center"
        style={{
          rotateY: isMobile ? 0 : springX,
          rotateX: isMobile ? 0 : springY,
        }}
      >
        {/* Glow behind cube */}
        <div
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: isMobile ? '160px' : '240px',
            height: isMobile ? '160px' : '240px',
            background: 'radial-gradient(circle, #D4B896 0%, transparent 70%)',
          }}
        />

        <div className="tofu-cube">
          <div className="face face-front" />
          <div className="face face-back" />
          <div className="face face-right" />
          <div className="face face-left" />
          <div className="face face-top" />
          <div className="face face-bottom" />
        </div>
      </motion.div>

      {/* Shadow underneath */}
      <div
        className="absolute rounded-full blur-xl opacity-20"
        style={{
          bottom: '10%',
          width: isMobile ? '100px' : '160px',
          height: '20px',
          background: '#1A4D2E',
        }}
      />
    </div>
  )
}
