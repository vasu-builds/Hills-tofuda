'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Our Story',     href: '/story' },
  { label: 'Products',      href: '/products' },
  { label: 'Recipes',       href: '/recipes' },
  { label: 'Why Soy',       href: '/why' },
  { label: 'Order',         href: '/order' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [mobileMenuOpen])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#1A4D2E] z-[10000] origin-left"
        style={{ scaleX }}
      />
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-colors duration-500 ${
          scrolled
            ? 'bg-[rgba(250,247,240,0.85)] backdrop-blur-md border-b border-[rgba(26,77,46,0.08)] shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
            : 'bg-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          
          <Link href="/" className="flex-shrink-0 group flex items-center">
            <div className="relative w-[120px] h-[36px]">
              {/* Ensure logo blends well with the navbar */}
              <Image 
                src="/images/logo-hills-tofuda.jpg" 
                alt="Hills Tofuda Logo" 
                fill 
                className="object-contain mix-blend-multiply group-hover:opacity-80 transition-opacity" 
                priority 
              />
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-dm-sans text-[15px] font-medium text-[#2C2C2C] hover:text-[#1A4D2E] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi%20Tofuda%20Da!%20%F0%9F%91%8B%20Mujhe%20order%20karna%20hai.`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative hidden md:flex items-center gap-2 bg-[#4CAF50] text-[#FAF7F0] px-6 py-2.5 rounded-full text-[14px] font-dm-sans font-medium hover:bg-[#43a047] transition-all duration-300"
          >
            <span className="absolute inset-0 rounded-full border border-[#4CAF50] group-hover:animate-ping opacity-0 group-hover:opacity-60" style={{ animationDuration: '2s' }}></span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
            </svg>
            Order on WhatsApp
          </a>

          <button 
            className="md:hidden flex flex-col gap-[5px] p-2 text-[#1A4D2E] z-[1001]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             <motion.span 
               className="block w-6 h-0.5 bg-current" 
               animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
             />
             <motion.span 
               className="block w-6 h-0.5 bg-current" 
               animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
             />
             <motion.span 
               className="block w-6 h-0.5 bg-current" 
               animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
             />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-cream z-[1000] flex flex-col pt-24 px-8"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <ul className="flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.li 
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="font-display text-[32px] text-forest leading-none"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div 
                className="mt-12 pt-12 border-t border-forest/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40 mb-6 font-bold text-center">Contact</p>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  className="flex items-center justify-center gap-3 bg-[#4CAF50] text-[#FAF7F0] w-full py-5 rounded-full text-lg font-dm-sans font-bold shadow-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                  </svg>
                  Order on WhatsApp
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
