import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono, Noto_Sans_Devanagari } from 'next/font/google'
import SmoothScrollProvider from '@/components/ui/SmoothScrollProvider'
import PageTransitionProvider from '@/components/ui/PageTransitionProvider'
import GoogleAnalytics from '@/components/ui/GoogleAnalytics'
import LoadingScreen from '@/components/ui/LoadingScreen'
import CustomCursor from '@/components/ui/CustomCursor'
import GrainOverlay from '@/components/ui/GrainOverlay'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
  weight: ['400', '500'],
})

const tiro = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-tiro',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Hills Tofuda — Nainital ka Soy Paneer',
  description: 'Fresh soy paneer made in the hills of Nainital. High protein, zero cholesterol, delivered daily. Order via WhatsApp.',
  keywords: ['soy paneer', 'tofu', 'Nainital', 'Hills Tofuda', 'plant based', 'Tofuda Da'],
  openGraph: {
    title: 'Hills Tofuda — Nainital ka Soy Paneer',
    description: 'Nainital ki taazgi, ab aapke ghar.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} ${tiro.variable}`}
    >
      <body className="bg-cream text-charcoal font-body" suppressHydrationWarning>
        <LoadingScreen />
        <GoogleAnalytics />
        <GrainOverlay />
        <CustomCursor />
        <SmoothScrollProvider>
          <PageTransitionProvider>
            {children}
          </PageTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
