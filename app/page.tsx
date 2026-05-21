import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { BuiltByDave } from '@/components/sections/BuiltByDave'
import { WorkWithDave } from '@/components/sections/WorkWithDave'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { ReviewsSection } from '@/components/sections/ReviewsSection'
import { FounderStory } from '@/components/sections/FounderStory'
import { PricingSection } from '@/components/sections/PricingSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ScorecardCTA } from '@/components/sections/ScorecardCTA'
import { LatestPostsSection } from '@/components/sections/LatestPostsSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <BuiltByDave />
      <WorkWithDave />
      <PortfolioSection />
      <ReviewsSection />
      <FounderStory />
      <PricingSection />
      <FAQSection />
      <ScorecardCTA />
      <LatestPostsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
