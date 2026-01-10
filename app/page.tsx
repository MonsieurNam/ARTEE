// app/page.tsx
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import BrandStorySection from "@/components/brand-story-section"
import CollectionSection from "@/components/collection-section"
import HowItWorksSection from "@/components/how-it-works-section"
import FinalCtaSection from "@/components/final-cta-section"
import Link from "next/link"
import ContactSection from "@/components/ContactSection"
import TechShowcaseSection from "@/components/tech-showcase-section" // 1. IMPORT

export default function Home() {
  return (
    <main className="w-full overflow-hidden">
      <Header />
      <HeroSection />
      <TechShowcaseSection /> 
      <BrandStorySection />
      <CollectionSection />
      {/* <HowItWorksSection /> */}
      <ContactSection />
      <FinalCtaSection />
    </main>
  )
}
