import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { AIVoiceDemo } from '@/components/sections/AIVoiceDemo'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { ReviewsSection } from '@/components/sections/ReviewsSection'
import { AuditFormSection } from '@/components/sections/AuditFormSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <AIVoiceDemo />
      <PortfolioSection />
      <ReviewsSection />
      <AuditFormSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
