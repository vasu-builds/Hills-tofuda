import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import StoryPage from '@/components/sections/StoryPage'

export const metadata = {
  title: 'Our Story — Hills Tofuda',
  description: "How Nainital's love for honest food became Hills Tofuda. The story of Tofuda Da and fresh soy paneer.",
}

export default function Story() {
  return (
    <>
      <Navbar />
      <StoryPage />
      <Footer />
    </>
  )
}
