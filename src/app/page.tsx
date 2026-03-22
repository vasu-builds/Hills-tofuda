import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import HeroSection from '@/components/sections/HeroSection'
import TrustBar from '@/components/sections/TrustBar'
import ProductSpotlight from '@/components/sections/ProductSpotlight'
import HowToOrder from '@/components/sections/HowToOrder'
import RecipeTeaser from '@/components/sections/RecipeTeaser'
import SocialProof from '@/components/sections/SocialProof'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <ProductSpotlight />
        <HowToOrder />
        <RecipeTeaser />
        <SocialProof />
      </main>
      <Footer />
    </>
  )
}
