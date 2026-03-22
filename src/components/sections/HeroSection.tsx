'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 120 // Half the frames for faster loading and less memory/CPU usage
const currentFrame = (index: number) =>
  `/ezgif-2de718434e2446ac-jpg/ezgif-frame-${(index * 2 + 1).toString().padStart(3, '0')}.jpg` // Skip every other frame to keep the 120 sequence

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null) // Start as null to avoid wrong default choke

  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)
  const section5Ref = useRef<HTMLDivElement>(null)

  // Detect mobile on mount
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // If mobile, we don't need heavy canvas, signal ready for LoadingScreen
      if (mobile) window.dispatchEvent(new CustomEvent('hero-ready'))
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Desktop: full canvas scroll animation ─────────────────────────
  useEffect(() => {
    if (isMobile === true || isMobile === null) return // Skip on mobile OR before detection

    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: false }) // Performance opt
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      render()
    }

    const images: HTMLImageElement[] = []
    const loadingState = { frame: 0 }

    // Optimization: Pre-load EXACTLY what we need, not extra
    const render = () => {
      const img = images[loadingState.frame]
      if (img && img.complete) {
        const canvasRatio = canvas.width / canvas.height
        const imageRatio = img.width / Math.max(img.height, 1)
        let drawWidth = canvas.width
        let drawHeight = canvas.height
        let startX = 0
        let startY = 0

        if (canvasRatio > imageRatio) {
          drawHeight = canvas.width / imageRatio
          startY = (canvas.height - drawHeight) / 2
        } else {
          drawWidth = canvas.height * imageRatio
          startX = (canvas.width - drawWidth) / 2
        }
        ctx.drawImage(img, startX, startY, drawWidth, drawHeight)
      }
    }

    // Phase 1: Load first frame immediately
    const firstImg = new window.Image()
    firstImg.src = currentFrame(0)
    images[0] = firstImg
    
    let loadedCount = 1
    const totalToWait = 35 // Wait for at least 35 frames before calling it 'ready'

    const handleImgLoad = () => {
      loadedCount++
      const progress = (loadedCount / TOTAL_FRAMES) * 100
      window.dispatchEvent(new CustomEvent('hero-progress', { detail: { progress } }))
      
      if (loadedCount >= totalToWait) {
        window.dispatchEvent(new CustomEvent('hero-ready'))
      }
    }

    firstImg.onload = () => {
      render()
      // Initial progress
      window.dispatchEvent(new CustomEvent('hero-progress', { detail: { progress: 1 } }))
      
      // Phase 2: Load the rest ONLY if on desktop
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new window.Image()
        img.src = currentFrame(i)
        img.onload = handleImgLoad
        images[i] = img
      }
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5, // Smoother scrub
        pin: '.sticky-container',
      }
    })

    tl.to(loadingState, { 
      frame: TOTAL_FRAMES - 1, 
      snap: 'frame', 
      ease: 'none', 
      duration: 1, 
      onUpdate: () => render() 
    }, 0)
    
    tl.to(section1Ref.current, { opacity: 0, y: -50, duration: 0.15 }, 0.05)
    tl.fromTo(section2Ref.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.1 }, 0.15)
    tl.to(section2Ref.current, { opacity: 0, x: -50, duration: 0.1 }, 0.3)
    tl.fromTo(section3Ref.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.1 }, 0.4)
    tl.to(section3Ref.current, { opacity: 0, x: 50, duration: 0.1 }, 0.55)
    tl.fromTo(section4Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.1 }, 0.65)
    tl.fromTo('.stat-bar-fill', { width: '0%' }, { width: '100%', duration: 0.1, stagger: 0.05 }, 0.65)
    tl.to(section4Ref.current, { opacity: 0, y: -50, duration: 0.1 }, 0.8)
    tl.fromTo(section5Ref.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.85)

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isMobile])


  // ── Mobile: simple static hero ────────────────────────────────────
  if (isMobile) {
    return (
      <div className="relative w-full min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center px-6 pt-28 pb-16 overflow-hidden">
        {/* Background tofu image, subtle */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/tofuda-da-bowl.png"
            alt="Tofuda bowl"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F0]/60 via-[#FAF7F0]/30 to-[#FAF7F0]/90" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 bg-[#C8E6C9] text-[#1A4D2E] text-[11px] font-mono uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse" />
            Nainital se fresh, roz subah
          </span>

          <h1 className="font-playfair text-[#1A4D2E] text-[40px] font-bold leading-[1.1] tracking-tight mb-4">
            Nainital ki taazgi,<br/>ab aapke ghar.
          </h1>

          <p className="font-dm-sans text-[#2C2C2C] text-[16px] leading-[1.65] max-w-xs mb-8">
            Pure soy. Mountain air. Made fresh, every morning.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              className="bg-[#4CAF50] text-white px-8 py-4 rounded-full text-[16px] font-dm-sans font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order on WhatsApp
            </a>

            <Link
              href="/story"
              className="border-2 border-[#1A4D2E] text-[#1A4D2E] px-8 py-4 rounded-full text-[16px] font-dm-sans font-bold text-center active:scale-95 transition-transform"
            >
              Hamari kahani
            </Link>
          </div>
        </div>

        {/* Product image */}
        <div className="relative z-10 w-72 h-52 mt-10">
          <Image
            src="/images/product-board.png"
            alt="Hills Tofuda Soy Paneer"
            fill
            className="object-contain"
          />
        </div>

        {/* Trust chips */}
        <div className="relative z-10 flex gap-3 flex-wrap justify-center mt-6">
          {['100% Plant-based', 'Fresh Daily', 'No Preservatives'].map(t => (
            <span key={t} className="bg-white/80 text-[#1A4D2E] text-[11px] font-mono tracking-wider px-3 py-1.5 rounded-full border border-[rgba(26,77,46,0.15)]">
              ✓ {t}
            </span>
          ))}
        </div>

        {/* Mascot */}
        <div className="absolute bottom-4 right-4 w-16 h-16 z-10 opacity-70">
          <Image src="/images/tofuda-da.png" alt="Tofuda Da" fill className="object-contain" />
        </div>
      </div>
    )
  }

  // ── Desktop full scrollytelling hero ─────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#FAF7F0]">
      <div className="sticky-container sticky top-0 left-0 w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#FAF7F0_0%,_#F0EAD6_100%)] opacity-60 mix-blend-multiply" />
        
        {/* Fallback First Frame — No more black screen */}
        <div className="absolute inset-0 z-[5] overflow-hidden">
          <img 
            src={currentFrame(0)} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

        <div className="absolute inset-0 z-20 pointer-events-none max-w-7xl mx-auto px-6 flex items-center">
          
          <div ref={section1Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 w-full">
            <h1 className="font-playfair text-[#1A4D2E] text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-4 md:mb-6 drop-shadow-sm">
              Nainital ki taazgi,<br/>ab aapke ghar.
            </h1>
            <p className="font-dm-sans text-[#2C2C2C] text-base md:text-xl leading-[1.6] max-w-md md:max-w-xl mx-auto mb-8 md:mb-10 drop-shadow-sm px-2">
              Pure soy. Mountain air. Made fresh, every morning.
            </p>
            <div className="flex items-center gap-4 pointer-events-auto">
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} className="group relative bg-[#4CAF50] text-[#FAF7F0] px-8 py-4 rounded-full text-[16px] font-dm-sans font-medium hover:bg-[#43a047] transition-all overflow-hidden flex items-center gap-2 shadow-xl">
                <span className="absolute inset-0 border-2 border-[#4CAF50] rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-40"></span>
                Order on WhatsApp
              </a>
              <Link href="/story" className="border-2 border-[#1A4D2E] text-[#1A4D2E] px-8 py-4 rounded-full text-[16px] font-dm-sans font-bold hover:bg-[#1A4D2E] hover:text-[#FAF7F0] transition-colors bg-[rgba(250,247,240,0.5)] backdrop-blur-sm">
                Hamari kahani
              </Link>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A4D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </div>
          </div>

          <div ref={section2Ref} className="absolute left-6 md:left-12 top-[60%] md:top-1/2 -translate-y-1/2 max-w-[280px] sm:max-w-lg opacity-0">
            <h2 className="font-playfair text-[#1A4D2E] text-3xl md:text-5xl font-bold leading-[1.1] mb-4 md:mb-6 drop-shadow-sm">Pahaad se aata hai<br/>yeh fark.</h2>
            <p className="font-dm-sans text-[#2C2C2C] text-base md:text-lg leading-[1.6] mb-4">
              Every block begins in the Kumaon hills — clean water, mountain-grown soy, no shortcuts.
            </p>
            <p className="font-dm-sans text-[#2C2C2C] text-lg leading-[1.75] font-semibold">
              Made in small batches. Never mass-produced. Never frozen.
            </p>
            <div className="mt-8 relative inline-block">
               <div className="bg-[#FF6B35] text-white px-5 py-3 rounded-2xl rounded-bl-none font-tiro text-xl shadow-lg">
                 &quot;Pahaad ka mazaa hai isme!&quot;
               </div>
               <div className="absolute -bottom-12 -left-4 w-16 h-16 pointer-events-none">
                 <Image src="/images/tofuda-da.png" alt="Tofuda Da" width={64} height={64} className="object-contain" />
               </div>
            </div>
          </div>

          <div ref={section3Ref} className="absolute right-6 md:right-12 top-[60%] md:top-1/2 -translate-y-1/2 max-w-[280px] sm:max-w-lg text-right opacity-0 flex flex-col items-end">
            <h2 className="font-playfair text-[#1A4D2E] text-3xl md:text-5xl font-bold leading-[1.1] mb-6 md:mb-8 drop-shadow-sm">Sirf sahi cheez.<br/>Kuch aur nahi.</h2>
            <ul className="space-y-3 md:space-y-4 text-right inline-block">
              {['100% plant-based soy protein.','Zero cholesterol. Rich in calcium.','No preservatives. No compromise.'].map((pt, i) => (
                <li key={i} className="font-dm-sans text-[#2C2C2C] text-sm sm:text-base md:text-xl font-medium flex items-center justify-end gap-2 md:gap-3 drop-shadow-sm">
                  {pt} <span className="text-[#4CAF50] flex-shrink-0">✓</span>
                </li>
              ))}
            </ul>
             <div className="mt-8 relative inline-block">
               <div className="bg-[#FF6B35] text-white px-5 py-3 rounded-2xl rounded-br-none font-tiro text-xl shadow-lg">
                 &quot;Main guarantee deta hoon!&quot;
               </div>
               <div className="absolute -bottom-12 -right-4 w-16 h-16 transform scale-x-[-1]">
                 <Image src="/images/tofuda-da.png" alt="Tofuda Da" width={64} height={64} className="object-contain" />
               </div>
            </div>
          </div>

          <div ref={section4Ref} className="absolute left-6 md:left-12 top-[60%] md:top-1/2 -translate-y-1/2 max-w-xl opacity-0 w-[calc(100%-48px)]">
            <h2 className="font-playfair text-[#1A4D2E] text-3xl md:text-5xl font-bold leading-[1.1] mb-4 md:mb-6 drop-shadow-sm">Shakti jo dikhti hai.</h2>
            <p className="font-dm-sans text-[#2C2C2C] text-base md:text-lg leading-[1.6] mb-6 md:mb-8">
              More protein than dairy paneer. More calcium. Less fat. Your body knows the difference.
            </p>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2 font-dm-mono text-sm text-[#2C2C2C] font-semibold"><span className="uppercase">Protein</span><span>18g</span></div>
                <div className="h-2 w-full bg-[#D4B896]/30 rounded-full overflow-hidden"><div className="stat-bar-fill h-full bg-[#1A4D2E] rounded-full" style={{width:'0%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-2 font-dm-mono text-sm text-[#2C2C2C] font-semibold"><span className="uppercase">Calcium</span><span>350mg</span></div>
                <div className="h-2 w-full bg-[#D4B896]/30 rounded-full overflow-hidden"><div className="stat-bar-fill h-full bg-[#1A4D2E] rounded-full" style={{width:'0%'}}></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-2 font-dm-mono text-sm text-[#2C2C2C] font-semibold"><span className="uppercase">Cholesterol</span><span className="text-[#4CAF50] px-2 py-0.5 bg-[#C8E6C9] rounded-md flex items-center gap-1">0g ✓</span></div>
                <div className="h-2 w-full bg-[#D4B896]/30 rounded-full overflow-hidden"><div className="h-full bg-[#1A4D2E] w-[5%] rounded-full opacity-30"></div></div>
              </div>
            </div>
          </div>

          <div ref={section5Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 opacity-0 w-full pointer-events-auto">
             <h2 className="font-playfair text-[#1A4D2E] text-4xl sm:text-6xl md:text-8xl font-bold leading-[1.1] mb-6 drop-shadow-sm px-2">
              Taza. Sacha. Pahaadi.
            </h2>
            <p className="font-dm-sans text-lg md:text-2xl text-[#2C2C2C] leading-[1.6] mb-8 md:mb-10 font-medium">
              Hills Tofuda. Fresh batch, every morning, Nainital.
            </p>
            <div className="flex flex-col items-center gap-6">
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi%20Tofuda%20Da!%20%F0%9F%91%8B%20Mujhe%20order%20karna%20hai.`} className="bg-[#4CAF50] text-[#FAF7F0] px-10 py-5 rounded-full text-lg font-dm-sans font-bold hover:scale-105 transition-transform flex items-center gap-3 shadow-xl">
                Order on WhatsApp
              </a>
              <Link href="/products" className="font-dm-sans text-[#1A4D2E] font-bold border-b-2 border-transparent hover:border-[#1A4D2E] transition-colors pb-1">
                Products dekho
              </Link>
            </div>
            <div className="absolute right-12 md:right-1/4 bottom-[15%] animate-bounce hidden md:block">
                 <Image src="/images/tofuda-da.png" alt="Tofuda Da winking" width={100} height={100} className="object-contain" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
