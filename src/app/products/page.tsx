import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import ProductsPage from '@/components/sections/ProductsPage'

export const metadata = {
  title: 'Products — Hills Tofuda Soy Paneer',
  description: 'Fresh soy paneer in 200g, 500g and 1kg packs. Made daily in Nainital. Order on WhatsApp.',
}

export default function Products() {
  return (
    <>
      <Navbar />
      <main>
        <ProductsPage />
      </main>
      <Footer />
    </>
  )
}
