import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import OrderPage from '@/components/sections/OrderPage'

export const metadata = {
  title: 'Order — Hills Tofuda Soy Paneer',
  description: 'Order fresh soy paneer from Hills Tofuda via WhatsApp. Delivery in Nainital, Haldwani, Kathgodam.',
}

export default function Order() {
  return (
    <>
      <Navbar />
      <OrderPage />
      <Footer />
    </>
  )
}
