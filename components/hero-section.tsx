// components/hero-section.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react" // Thêm icon ShieldCheck
import { useEffect, useState } from "react"
import { HERO_CONTENT } from "@/lib/content"
import Link from "next/link"

const backgroundVideos = [
  "/brand_vid.mp4",
  "/customn_vid.mp4",
  "/hoodie_vid.mp4",
  "/cfsua.mp4"
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
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 z-[1]" />
      
      {/* Grain texture */}
      <div className="absolute inset-0 z-[2] opacity-[0.03] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] animate-grain" />
      </div>

      {/* Video Background */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <video
          key={currentVideoIndex}
          src={backgroundVideos[currentVideoIndex]}
          onEnded={handleVideoEnd}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.7) contrast(1.1)' }} // Giảm độ sáng video một chút để text nổi hơn
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/70 z-[3]" />

      {/* --- CONTENT CHÍNH --- */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        
        {/* Badge: Nhấn mạnh Pre-order & Công nghệ */}
        <div
          className={`mb-6 flex justify-center gap-3 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] md:text-xs font-bold tracking-wider text-white/90 uppercase">AR Technology</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-600/20 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-[10px] md:text-xs font-bold tracking-wider text-blue-100 uppercase">Cọc 50k - Bảo hành in ấn</span>
          </div>
        </div>

        {/* Logo Text */}
        <div
          className={`mb-8 flex justify-center transition-all duration-1000 delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <div className="relative">
            <div className="text-5xl md:text-7xl font-bold tracking-[0.2em] text-white drop-shadow-2xl">
              ARTEE
            </div>
            {/* Thanh gạch chân trang trí */}
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>
        </div>

        {/* Slogan Lớn */}
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-6 text-balance leading-tight tracking-tight transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
        >
          {HERO_CONTENT.slogan}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-base md:text-xl text-neutral-200/90 mb-12 text-balance max-w-3xl mx-auto font-light leading-relaxed tracking-wide transition-all duration-1000 delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {HERO_CONTENT.subtitle}
        </p>

        {/* --- NÚT CTA (THAY ĐỔI LỚN) --- */}
        <div
          className={`transition-all duration-1000 delay-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            
           {/* Nút 1: LIÊN HỆ TƯ VẤN (Thay vì Tự thiết kế) */}
            <button 
                onClick={() => {
                    const contactSection = document.getElementById("contact"); // Đảm bảo ContactSection có id="contact"
                    contactSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black text-base font-bold tracking-wide rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
                <span className="relative flex items-center justify-center gap-2 z-10">
                    LIÊN HỆ VỚI CHÚNG TÔI
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
            </button>

            <Link href="/contact">
                <button
                  className="group w-full sm:w-auto px-8 py-4 text-base font-medium tracking-wide rounded-full border border-white/30 text-white backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/60 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 group-hover:text-blue-300 transition-colors" /> 
                    Tư vấn & Bảo hành
                  </span>
                </button>
            </Link>
          
          <p className="mt-4 text-xs text-white/50 italic">
            *Cam kết hoàn tiền cọc nếu không hài lòng với bản in thử.
          </p>
        </div>

        {/* Video Dots */}
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

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-1000 delay-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-light tracking-[0.2em] text-neutral-400 uppercase">Scroll to Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 via-white/20 to-transparent relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-scroll-down" />
          </div>
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
          0% { transform: translate(-50%, 0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(-50%, 32px); opacity: 0; }
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