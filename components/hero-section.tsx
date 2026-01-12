"use client"
import { HERO_CONTENT } from "@/lib/content"
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

const backgroundVideos = [
  "/brand_vid.mp4",
  "/cfsua.mp4",
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
    }, 500)
  }

  // Hàm xử lý cuộn xuống Tech Showcase
  const scrollToTechShowcase = () => {
    // Tìm phần tử có id là "tech-showcase"
    const section = document.getElementById("tech-showcase")
    
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    } else {
      // Fallback: Nếu chưa đặt ID, thử tìm section thứ 3 (Hero -> AR -> Tech)
      // Bạn nên thêm id="tech-showcase" vào file components/tech-showcase-section.tsx
      const sections = document.querySelectorAll("section")
      if (sections[1]) {
        sections[1].scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Sophisticated gradient overlay with shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-neutral-900/30 to-black/70 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-[1]" />
      
      {/* Premium grain texture */}
      <div className="absolute inset-0 z-[2] opacity-[0.04] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] animate-grain" />
      </div>

      {/* Video Background with luxury transition */}
      <div className={`absolute inset-0 z-0 transition-all duration-700 ease-out ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
        <video
          key={currentVideoIndex}
          src={backgroundVideos[currentVideoIndex]}
          onEnded={handleVideoEnd}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.65) contrast(1.15) saturate(0.95)' }}
        />
      </div>

      {/* Elegant vignette with subtle glow */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/80 z-[3]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_70%)] z-[3]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        
        {/* Premium badges with glass morphism */}
        <div
          className={`mb-8 flex justify-center gap-4 transition-all duration-1200 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
        >
          <div className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/15 bg-gradient-to-br from-white/8 to-white/5 backdrop-blur-xl shadow-2xl hover:border-white/25 hover:shadow-amber-500/20 transition-all duration-500">
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.15em] text-white/95 uppercase">AR Technology</span>
          </div>
          <div className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-blue-400/20 bg-gradient-to-br from-blue-500/15 to-blue-600/10 backdrop-blur-xl shadow-2xl hover:border-blue-400/30 hover:shadow-blue-500/20 transition-all duration-500">
            <ShieldCheck className="w-4 h-4 text-blue-300 group-hover:animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.15em] text-blue-50 uppercase">Cọc 50k - Bảo hành in ấn</span>
          </div>
        </div>

        {/* Luxury logo with sophisticated animation */}
        <div
          className={`mb-10 flex justify-center transition-all duration-1200 delay-150 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl group-hover:via-white/20 transition-all duration-700" />
            <div className="relative text-6xl md:text-8xl font-bold tracking-[0.25em] text-white" style={{ 
              textShadow: '0 0 40px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.9)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.3em'
            }}>
              ARTEE
            </div>
            <div className="absolute -bottom-3 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
            <div className="absolute -bottom-4 left-[30%] right-[30%] h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
          </div>
        </div>

        {/* Elegant headline with refined typography */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-[1.1] tracking-tight transition-all duration-1200 delay-300 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ 
            textShadow: '0 4px 60px rgba(0,0,0,0.9), 0 2px 20px rgba(0,0,0,0.8)',
            fontFamily: 'Georgia, serif'
          }}
        >
          {HERO_CONTENT.slogan}
        </h1>

        {/* Refined subtitle */}
        <p
          className={`text-lg md:text-2xl text-neutral-100/80 mb-14 max-w-3xl mx-auto font-light leading-relaxed tracking-wide transition-all duration-1200 delay-500 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          {HERO_CONTENT.subtitle}
        </p>

        {/* Premium CTA buttons */}
        <div
          className={`transition-all duration-1200 delay-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            
            {/* Nút 1: Liên hệ với chúng tôi (Dẫn xuống Contact) */}
            <button 
              onClick={() => {
                const contactSection = document.getElementById("contact")
                contactSection?.scrollIntoView({ behavior: "smooth" })
              }}
              className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black text-base font-semibold tracking-[0.1em] rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:bg-neutral-50"
              style={{ boxShadow: '0 10px 40px rgba(255,255,255,0.2)' }}
            >
              <span className="relative flex items-center justify-center gap-2.5 z-10">
                LIÊN HỆ VỚI CHÚNG TÔI
                <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </button>

            {/* Nút 2: Xem công nghệ in ấn (Dẫn xuống Tech Showcase) */}
            <button
              onClick={scrollToTechShowcase}
              className="group w-full sm:w-auto px-10 py-5 text-base font-medium tracking-[0.08em] rounded-full border border-white/20 text-white backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              <span className="flex items-center justify-center gap-2.5">
                <ShieldCheck className="w-5 h-5 group-hover:text-blue-300 transition-colors duration-300" /> 
                Xem công nghệ in ấn
              </span>
            </button>
          </div>
          
          <p className="mt-6 text-sm text-white/40 italic font-light tracking-wide" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            *Cam kết hoàn tiền cọc nếu không hài lòng với bản in thử.
          </p>
        </div>

        {/* Elegant video indicators */}
        <div
          className={`mt-20 flex justify-center gap-3 transition-all duration-1200 delay-900 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          {backgroundVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentVideoIndex(index)
                  setIsTransitioning(false)
                }, 500)
              }}
              className={`h-0.5 rounded-full transition-all duration-700 ease-out ${
                index === currentVideoIndex 
                  ? 'w-16 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]' 
                  : 'w-10 bg-white/25 hover:bg-white/50 hover:w-12'
              }`}
              aria-label={`View video ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Refined scroll indicator */}
      <div 
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-1200 delay-1000 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[11px] font-light tracking-[0.25em] text-neutral-300/60 uppercase">Scroll to Discover</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 via-white/15 to-transparent relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-scroll-down shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
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
          animation: grain 10s steps(10) infinite;
        }

        @keyframes scroll-down {
          0% { transform: translate(-50%, 0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(-50%, 40px); opacity: 0; }
        }

        .animate-scroll-down {
          animation: scroll-down 2.5s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  )
}