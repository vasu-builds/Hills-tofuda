# 🏔️ Hills Tofuda — Complete Setup & Deploy Guide

---

## Pehle yeh karo (5 minute setup)

### Step 1 — Unzip & Install

```bash
unzip hills-tofuda.zip
cd hills-tofuda
npm install
```

### Step 2 — Environment Variables

```bash
cp .env.local.example .env.local
```

`.env.local` mein yeh values bharo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_WA_NUMBER=919876543210
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 3 — WhatsApp Number Replace

Teen files mein `91XXXXXXXXXX` replace karo apne actual number se:
- `src/components/ui/WhatsAppButton.tsx` — `const WA_NUMBER`
- `src/components/ui/Navbar.tsx` — dono WhatsApp links
- `src/components/ui/Footer.tsx` — WhatsApp link

### Step 4 — Local test

```bash
npm run dev
# Open: http://localhost:3000
```

---

## Supabase Setup

1. supabase.com → New project → URL + anon key copy karo → `.env.local`
2. SQL Editor mein run karo:

```sql
create table inventory (
  id uuid primary key default gen_random_uuid(),
  product_id text not null unique,
  stock_available boolean default true,
  stock_count int default 10,
  updated_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  address text not null,
  product_id text not null,
  weight text not null,
  quantity int default 1,
  total_price numeric not null,
  status text default 'pending'
    check (status in ('pending','confirmed','out_for_delivery','delivered')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique not null,
  address text,
  order_count int default 0,
  created_at timestamptz default now()
);

create table delivery_zones (
  id uuid primary key default gen_random_uuid(),
  area_name text not null,
  is_active boolean default true,
  delivery_slots text[] default array['Morning 8-11am']
);

insert into inventory (product_id, stock_available, stock_count)
values ('soy-paneer', true, 10);

insert into delivery_zones (area_name, is_active, delivery_slots) values
  ('Nainital',  true,  array['Morning 8-11am', 'Evening 4-7pm']),
  ('Haldwani',  true,  array['Morning 9-12pm']),
  ('Kathgodam', true,  array['Morning 9-12pm']),
  ('Bhimtal',   false, array[]::text[]);
```

3. Table Editor → inventory → Enable Realtime ✅

---

## Vercel Deploy

```bash
npm i -g vercel
vercel
# Add env vars when prompted
```

Or GitHub se: repo push karo → vercel.com → Import → env vars → Deploy.

**Custom domain:** Vercel → Project → Settings → Domains → Add domain.

---

## Admin Panel

- URL: `/admin`
- Demo password: `tofuda2025`
- **Production mein password change karo** — `AdminDashboard.tsx` → `AuthGate`

Features: Orders table, stock update (real-time website badge update), WhatsApp broadcast, zone toggle.

---

## Google Analytics 4

1. analytics.google.com → New Property → Measurement ID (G-XXXXXXXXXX)
2. `.env.local` mein `NEXT_PUBLIC_GA_ID` set karo
3. Auto-tracked: `whatsapp_click`, `page_view`, `view_recipe`, scroll depth

---

## SEO Already Done

- `/sitemap.xml` — auto, all pages + all 6 recipes included
- `/robots.txt` — admin blocked, rest open
- Recipe JSON-LD schema — Google Rich Results (star ratings in search)
- Per-page title, description, keywords, og:image

Submit sitemap: Google Search Console → Sitemaps → `https://yourdomain.com/sitemap.xml`

---

## Complete File Map

```
src/
├── app/
│   ├── page.tsx                     Home (/)
│   ├── layout.tsx                   Root — fonts, Lenis, GA, page transitions
│   ├── globals.css                  Design tokens, 3D cube, animations
│   ├── sitemap.ts                   Auto sitemap
│   ├── robots.ts                    robots.txt
│   ├── products/page.tsx            /products
│   ├── story/page.tsx               /story
│   ├── why/page.tsx                 /why
│   ├── order/page.tsx               /order
│   ├── recipes/page.tsx             /recipes
│   ├── recipes/[slug]/page.tsx      /recipes/tofu-makhani etc
│   └── admin/page.tsx               /admin

├── components/sections/
│   ├── HeroSection.tsx              Word stagger, parallax, magnetic CTA
│   ├── TrustBar.tsx                 Marquee
│   ├── ProductSpotlight.tsx         Weight toggle, real-time stock badge
│   ├── HowToOrder.tsx               GSAP ScrollTrigger timeline
│   ├── RecipeTeaser.tsx             Cards fan out
│   ├── SocialProof.tsx              Reviews + counters
│   ├── RecipesListPage.tsx          Grid + category filter
│   ├── RecipeDetailPage.tsx         Full recipe, steps, nutrition
│   ├── ProductsPage.tsx             3 product cards
│   ├── StoryPage.tsx                Cinematic magazine scroll
│   ├── WhyPage.tsx                  Comparison + environment
│   ├── OrderPage.tsx                Zone selector + CTA
│   └── AdminDashboard.tsx           Full owner panel

├── components/ui/
│   ├── Navbar.tsx                   Transparent→solid, spring scroll progress
│   ├── Footer.tsx
│   ├── TofudaDa.tsx                 GSAP float yoyo, CSS wink, speech bubble
│   ├── TofuBlock3D.tsx              CSS 3D cube, mouse parallax
│   ├── HimalayanMountains.tsx       3-layer SVG parallax + pine trees
│   ├── WhatsAppButton.tsx           Pulse, magnetic, GA tracking
│   ├── FreshTodayBadge.tsx          Supabase real-time green/red badge
│   ├── SmoothScrollProvider.tsx     Lenis lerp:0.08 + GSAP ticker
│   ├── PageTransitionProvider.tsx   Cream wipe AnimatePresence
│   └── GoogleAnalytics.tsx          GA4 + event helpers

└── lib/
    ├── supabase.ts                  Client + types
    ├── useStock.ts                  Real-time stock hook
    └── recipes.ts                   6 recipes data + types
```

---

## What's Complete ✅

**Pages** — Home, Products, Story, Why, Order, Recipes (listing + 6 detail pages), Admin

**Animations**
- Lenis smooth scroll lerp:0.08 synced with GSAP ticker
- Hero: word-by-word stagger, rotateX, parallax, scroll-linked opacity
- Magnetic WhatsApp CTA (spring physics)
- Tofuda Da: GSAP float yoyo + CSS wink every 5s
- GSAP ScrollTrigger: HowToOrder connecting line draws on scroll
- Page transitions: cream wipe left-to-right
- Scroll progress bar: spring-smoothed scaleX

**Backend**
- Supabase real-time stock subscription
- FreshTodayBadge live update when admin changes stock
- Admin dashboard: orders, stock, broadcast, zones

**SEO & Analytics**
- sitemap.xml auto-generated
- robots.txt
- Recipe JSON-LD schema (Google Rich Results ready)
- GA4 with WhatsApp click conversion tracking

*Tofuda Da ready hai. Deploy karo. 🏔️*
