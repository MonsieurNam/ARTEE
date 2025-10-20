// components/how-it-works-section.tsx
"use client"

import { useEffect, useState } from "react"
import { HOW_IT_WORKS } from "@/lib/content"

export default function HowItWorksSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-step") || "0")
            setVisibleSteps((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-step]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const icons = ["👁️", "📱", "✨"] // Keep icons since they're not in content

  return (
    <section className="w-full py-24 md:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-5xl md:text-6xl font-serif font-light text-neutral-900 mb-6 text-balance">
            {HOW_IT_WORKS.title}
          </h2>
          {/* <p className="text-lg text-neutral-600 max-w-2xl mx-auto text-balance">
            {HOW_IT_WORKS.description}
          </p> */}
        </div>

        {/* <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 z-0" />

          {HOW_IT_WORKS.steps.map((step, index) => (
            <div
              key={index}
              data-step={index}
              className={`flex flex-col items-center text-center relative z-10 transition-all duration-700 transform ${
                visibleSteps.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mb-6 shadow-md hover:shadow-lg transition-shadow">
                <span className="text-3xl font-light text-neutral-600">{String(step.number).padStart(2, '0')}</span>
              </div>

              <div className="text-5xl mb-6 transition-transform duration-300 hover:scale-110">{icons[index]}</div>

              <h3 className="text-2xl font-semibold text-neutral-900 mb-4 uppercase tracking-wide">{step.title}</h3>

              <p className="text-neutral-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div> */}

        {/* Visual representation */}
        <div className="mt-16 md:mt-24 p-8 md:p-12 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <img
            src="/ar-experience-visualization-steps.png"
            alt="How it works visualization"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}