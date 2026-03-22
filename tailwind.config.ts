import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'forest': '#1A4D2E',
        'forest-dark': '#0F2E1A',
        'leaf': '#4CAF50',
        'cream': '#FAF7F0',
        'cream-dark': '#F0EBE0',
        'soy-beige': '#D4B896',
        'mint': '#C8E6C9',
        'charcoal': '#2C2C2C',
        'accent-orange': '#FF6B35',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        hindi: ['var(--font-tiro)', 'serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(48px, 8vw, 120px)',
        'h1': 'clamp(36px, 5vw, 56px)',
        'h2': 'clamp(28px, 3.5vw, 40px)',
        'h3': '28px',
      },
      lineHeight: {
        'tight-display': '1.05',
        'display': '1.1',
      },
      spacing: {
        'section': '120px',
        'section-mobile': '64px',
      },
      maxWidth: {
        'content': '1280px',
      },
      borderRadius: {
        'card': '12px',
        'pill': '24px',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulse_ring: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        bounce_scroll: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        wink: {
          '0%, 94%, 100%': { transform: 'scaleY(1)' },
          '96%, 98%': { transform: 'scaleY(0.1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pulse_ring: 'pulse_ring 2s ease-out infinite',
        bounce_scroll: 'bounce_scroll 1.5s ease-in-out infinite',
        wink: 'wink 5s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
