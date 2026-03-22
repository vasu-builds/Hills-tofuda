import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhyPage from '@/components/sections/WhyPage'

export const metadata = {
  title: 'Why Soy Paneer — Hills Tofuda',
  description: 'More protein, zero cholesterol, better for the environment. Why soy paneer beats dairy paneer.',
}

export default function Why() {
  return (
    <>
      <Navbar />
      <WhyPage />
      <Footer />
    </>
  )
}
