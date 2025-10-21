// components/hero-section.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { HERO_CONTENT } from "@/lib/content"
import Link from "next/link"

const backgroundVideos = [
  "/brand_vid.mp4",
  "/customn_vid.mp4",
  "/hoodie_vid.mp4",
]

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleVideoEnd = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % backgroundVideos.length)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated gradient overlay for luxury feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 z-[1]" />
      
      {/* Subtle animated grain texture */}
      <div className="absolute inset-0 z-[2] opacity-[0.03] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] animate-grain" />
      </div>

      {/* Background Video Player with smooth transitions */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <video
          key={currentVideoIndex}
          src={backgroundVideos[currentVideoIndex]}
          onEnded={handleVideoEnd}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.8) contrast(1.1)' }}
        />
      </div>

      {/* Sophisticated vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/70 z-[3]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Premium badge */}
        <div
          className={`mb-6 flex justify-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-medium tracking-[0.2em] text-white/90 uppercase">Premium Collection</span>
          </div>
        </div>

        {/* Enhanced logo with refined typography */}
        <div
          className={`mb-10 flex justify-center transition-all duration-1000 delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <div className="relative">
            <div className="text-5xl md:text-6xl font-light tracking-[0.3em] text-white drop-shadow-2xl">
              ARTEE
            </div>
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>

        {/* Elevated slogan with better spacing */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-serif font-extralight text-white mb-8 text-balance leading-tight tracking-tight transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
        >
          {HERO_CONTENT.slogan}
        </h1>

        {/* Refined subtitle */}
        <p
          className={`text-base md:text-lg lg:text-xl text-neutral-200/90 mb-14 text-balance max-w-2xl mx-auto font-light leading-relaxed tracking-wide transition-all duration-1000 delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {HERO_CONTENT.subtitle}
        </p>

        {/* Premium CTA buttons */}
        <div
          className={`transition-all duration-1000 delay-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button
              onClick={() => {
                const collectionSection = document.getElementById("collection-section")
                collectionSection?.scrollIntoView({ behavior: "smooth" })
              }}
              className="group relative px-10 py-5 text-base font-medium tracking-wide overflow-hidden rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white transition-transform duration-300 group-hover:scale-110" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              
              <span className="relative flex items-center gap-2 text-black font-semibold uppercase tracking-wider text-sm">
                Khám phá bộ sưu tập
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>

            {/* Optional secondary CTA */}
            {/* <Link href="/customizer">
              <button className="group px-10 py-5 text-base font-medium tracking-wide rounded-full border-2 border-white/30 text-white backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <span className="flex items-center gap-2 uppercase tracking-wider text-sm">
                  Tự tay thiết kế
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </Link> */}
          </div>
        </div>

        {/* Video indicator dots */}
        <div
          className={`mt-16 flex justify-center gap-2 transition-all duration-1000 delay-900 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          {backgroundVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentVideoIndex(index)
                  setIsTransitioning(false)
                }, 300)
              }}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentVideoIndex 
                  ? 'w-12 bg-white' 
                  : 'w-8 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`View video ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div 
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-1000 delay-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-light tracking-[0.2em] text-neutral-300/80 uppercase">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/40 via-white/20 to-transparent relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-scroll-down" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        
        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }

        @keyframes scroll-down {
          0% {
            transform: translate(-50%, 0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, 48px);
            opacity: 0;
          }
        }

        .animate-scroll-down {
          animation: scroll-down 2s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  )
}