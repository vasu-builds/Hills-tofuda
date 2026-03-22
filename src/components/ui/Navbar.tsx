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
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#1A4D2E] z-[10005] origin-left"
        style={{ scaleX }}
      />
      
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[10010] transition-all duration-500 ${
          scrolled ? 'bg-cream/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/" 
            className={`flex items-center gap-2 group relative z-[1002] transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="relative w-32 h-10 transition-transform group-hover:scale-105">
              <Image 
                src="/images/logo-hills-tofuda.jpg" 
                alt="Hills Tofuda Logo" 
                fill
                className="object-contain object-left"
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

          <div className="flex items-center gap-4">
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
              Order
            </a>

            <button 
              className="md:hidden p-2 text-forest z-[10010] relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <div className="flex flex-col gap-[5px]">
                  <span className="block w-6 h-0.5 bg-current"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#FAF7F0] z-[10005] flex flex-col pt-32 px-10 overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Logo in Menu Overlay */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <div className="relative w-32 h-10">
                <Image 
                  src="/images/logo-hills-tofuda.jpg" 
                  alt="Logo" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <nav className="flex flex-col gap-8 mt-10">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display text-4xl text-forest hover:translate-x-2 transition-transform block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto pb-12">
              <div className="h-[1px] bg-forest/10 w-full mb-8" />
              <p className="text-forest/40 uppercase tracking-widest text-[10px] font-bold mb-4">Contact us</p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                className="bg-[#4CAF50] text-white px-8 py-5 rounded-pill flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:bg-[#388E3C] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">💬</span>
                Order on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
