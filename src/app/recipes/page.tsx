import { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import RecipesListPage from '@/components/sections/RecipesListPage'

export const metadata: Metadata = {
  title: 'Soy Paneer Recipes — Hills Tofuda Nainital',
  description: 'Best Indian soy paneer recipes — Tofu Makhani, Bhurji, Tikka, Palak Tofu and more. Easy, high protein, made with Hills Tofuda fresh soy paneer from Nainital.',
  keywords: ['soy paneer recipes', 'tofu recipes Indian', 'tofu makhani', 'palak tofu', 'tofu bhurji', 'Hills Tofuda recipes'],
  openGraph: {
    title: 'Soy Paneer Recipes — Hills Tofuda',
    description: 'High protein Indian recipes with fresh soy paneer from Nainital.',
    type: 'website',
  },
}

export default function RecipesPage() {
  return (
    <>
      <Navbar />
      <RecipesListPage />
      <Footer />
    </>
  )
}
