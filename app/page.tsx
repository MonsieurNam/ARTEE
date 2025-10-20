// app/page.tsx
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import BrandStorySection from "@/components/brand-story-section"
import CollectionSection from "@/components/collection-section"
import HowItWorksSection from "@/components/how-it-works-section"
import FinalCtaSection from "@/components/final-cta-section"
import Link from "next/link"

export default function Home() {
  return (
    <main className="w-full overflow-hidden">
      <Header />
      <HeroSection />
      <BrandStorySection />
      <CollectionSection />
      <HowItWorksSection />
      <FinalCtaSection />

      {/* Floating CTA Button */}
      <Link
        href="/customizer"
        className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold z-40"
      >
        Thiết kế riêng
      </Link>
    </main>
  )
}
