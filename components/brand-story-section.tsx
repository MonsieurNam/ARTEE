// components/brand-story-section.tsx
"use client"

import { useEffect, useState } from "react"
import { BRAND_STORY } from "@/lib/content"

export default function BrandStorySection() {
  const [visiblePillars, setVisiblePillars] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisiblePillars((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-index]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="w-full py-24 md:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-5xl md:text-6xl font-serif font-light text-neutral-900 mb-6 text-balance">
            {BRAND_STORY.title}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto text-balance">
            {BRAND_STORY.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {BRAND_STORY.pillars.map((pillar, index) => (
            <div
              key={index}
              data-index={index}
              className={`flex flex-col items-center text-center p-8 rounded-xl transition-all duration-700 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                visiblePillars.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              } hover:bg-gradient-to-br hover:from-neutral-50 hover:to-neutral-100`}
            >
              {/* <div className="text-5xl mb-6 transition-transform duration-300 hover:scale-110">
                {index === 0 ? "✨" : index === 1 ? "🌱" : "🔮"}
              </div> */}
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">{pillar.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}