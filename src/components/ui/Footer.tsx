import Link from 'next/link'
import Image from 'next/image'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-cream">
      {/* Top CTA strip */}
      <div
        className="border-b border-white/10 py-12 md:py-16"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <div className="max-w-content mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-[28px] md:text-[36px] text-cream leading-display mb-1">
              Ready to order?
            </h3>
            <p className="font-body text-cream/50 text-[15px]">
              Fresh batch kal subah bhi milega. Abhi WhatsApp karo.
            </p>
          </div>
          <WhatsAppButton
            text="Order Now — WhatsApp"
            size="lg"
            className="flex-shrink-0"
          />
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-content mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <Image src="/images/logo-hills-tofuda.jpg" alt="Hills Tofuda Logo" width={32} height={32} className="object-cover mix-blend-multiply" />
              </div>
              <span className="font-display font-semibold text-cream text-lg">Hills Tofuda</span>
            </div>
            <p className="font-body text-cream/50 text-[14px] leading-relaxed mb-4">
              Nainital ki taazgi, ab aapke ghar. Fresh soy paneer, made with love in the hills.
            </p>
            <p className="font-hindi text-cream/40 text-[15px]">
              पहाड़ों का स्वाद, सेहत का साथ
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-cream/30 mb-4">Pages</h4>
            <ul className="flex flex-col gap-2.5">
              {['Products', 'Our Story', 'Recipes', 'Why Soy Paneer', 'Order'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="font-body text-[14px] text-cream/60 hover:text-cream transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-cream/30 mb-4">Products</h4>
            <ul className="flex flex-col gap-2.5">
              {['Soy Paneer 200g — ₹49', 'Soy Paneer 500g — ₹110', 'Soy Paneer 1kg — ₹199'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="font-body text-[14px] text-cream/60 hover:text-cream transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-cream/30 mb-4">Contact</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://wa.me/91XXXXXXXXXX"
                  className="flex items-center gap-2 font-body text-[14px] text-cream/60 hover:text-cream transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <span className="font-body text-[14px] text-cream/60">📍 Nainital, Uttarakhand</span>
              </li>
              <li>
                <span className="font-body text-[14px] text-cream/60">🕗 Daily 8am – 7pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-cream/25">
            © 2025 Hills Tofuda · Nainital, Uttarakhand
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-cream/25">
            Made with ❤️ in the hills
          </p>
        </div>
      </div>
    </footer>
  )
}
