'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// ── Type-safe GA4 event helper ───────────────────────────────────────
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

// Specific events for Hills Tofuda
export const GA = {
  // WhatsApp click — most important conversion
  whatsappClick: (source: string, product?: string) => {
    trackEvent('whatsapp_click', 'conversion', source)
    if (product) trackEvent('add_to_cart', 'ecommerce', product)
  },

  // Product views
  productView: (product: string, weight: string) => {
    trackEvent('view_item', 'product', `${product}_${weight}`)
  },

  // Recipe views
  recipeView: (recipeName: string) => {
    trackEvent('view_recipe', 'content', recipeName)
  },

  // Page scroll depth
  scrollDepth: (depth: number) => {
    trackEvent('scroll', 'engagement', `${depth}%`, depth)
  },
}

// ── Route change tracker ─────────────────────────────────────────────
function RouteChangeTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
    window.gtag('config', GA_ID, {
      page_path: pathname + searchParams.toString(),
    })
  }, [pathname, searchParams])

  return null
}

// ── GA4 Script Component ─────────────────────────────────────────────
export default function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  )
}
