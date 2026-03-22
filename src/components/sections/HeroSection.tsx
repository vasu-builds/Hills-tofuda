'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

// Adjust TOTAL_FRAMES to the exact number of frames in your ezgif folder
const TOTAL_FRAMES = 240 
// Adjust this function if your files are named differently (e.g. frame_00.jpg instead of frame_000.jpg)
const currentFrame = (index: number) => `/ezgif-2de718434e2446ac-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sub-sections refs for animations
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)
  const section5Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      render() // Re-render current frame on resize
    }
    
    // Create an array of preloaded images
    const images: HTMLImageElement[] = []
    const loadingState = { frame: 0 }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image()
      img.src = currentFrame(i)
      images.push(img)
    }

    const render = () => {
      const img = images[loadingState.frame]
      if (img && img.complete) {
        // Calculate object-fit cover
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
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, startX, startY, drawWidth, drawHeight)
      }
    }

    // Render first frame as soon as it loads
    images[0].onload = render

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, 
        pin: '.sticky-container',
      }
    })

    // 1. Scrub image sequence across the ENTIRE duration of the scroll
    tl.to(loadingState, {
      frame: TOTAL_FRAMES - 1,
      snap: 'frame',
      ease: 'none',
      duration: 1, // Fix: Make it span the whole timeline from 0 to 1
      onUpdate: () => render()
    }, 0)

    // DOM UI Overlay Sequences
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
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#FAF7F0]">
      <div className="sticky-container sticky top-0 left-0 w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#FAF7F0_0%,_#F0EAD6_100%)] opacity-60 mix-blend-multiply" />
        
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
                 "Pahaad ka mazaa hai isme!"
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
                 "Main guarantee deta hoon!"
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
