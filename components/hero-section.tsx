// components/hero-section.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react" // <-- Import thêm useState
import { HERO_CONTENT } from "@/lib/content"
import Link from "next/link"

// Danh sách các video sẽ được phát trong nền
const backgroundVideos = [
  "/brand_vid.mp4",
  "/customn_vid.mp4",
  "/hoodie_vid.mp4",
]

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  // State để theo dõi video hiện tại đang phát
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Hàm này sẽ được gọi khi một video kết thúc
  const handleVideoEnd = () => {
    // Chuyển sang video tiếp theo trong danh sách, quay lại video đầu tiên nếu đã hết
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % backgroundVideos.length)
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* --- BẮT ĐẦU THAY ĐỔI LỚN --- */}
      {/* Background Video Player */}
      <div className="absolute inset-0 z-0">
        <video
          // Key rất quan trọng: Khi key thay đổi, React sẽ render lại component
          // Điều này buộc video phải tải lại nguồn mới và phát từ đầu.
          key={currentVideoIndex}
          src={backgroundVideos[currentVideoIndex]}
          onEnded={handleVideoEnd} // Gọi hàm khi video kết thúc
          autoPlay // Tự động phát
          muted // Bắt buộc phải tắt tiếng để autoPlay hoạt động trên hầu hết các trình duyệt
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay để làm tối video, giúp chữ dễ đọc hơn */}
      <div className="absolute inset-0 bg-black/50 z-1" />
      {/* --- KẾT THÚC THAY ĐỔI LỚN --- */}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Logo với fade-in animation */}
        <div
          className={`mb-8 flex justify-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Sửa lại màu chữ để nổi bật trên nền tối */}
          <div className="text-4xl font-bold tracking-tight text-white">ARTEE</div>
        </div>

        {/* Slogan với staggered animation */}
        <h1
          className={`text-6xl md:text-7xl font-serif font-light text-white mb-6 text-balance transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {HERO_CONTENT.slogan}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg md:text-xl text-neutral-200 mb-12 text-balance transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {HERO_CONTENT.subtitle}
        </p>

        {/* CTA Button với enhanced hover effect */}
        <div
          className={`transition-all duration-1000 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* <Link href="/customizer">
              <Button
                size="lg"
                className="bg-white hover:bg-neutral-200 text-black px-8 py-6 text-lg rounded-full inline-flex items-center gap-2 transition-all hover:gap-3 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
              >
                Tự tay thiết kế
                <ArrowRight className="w-5 h-5" />  
              </Button>
            </Link> */}
            <button
              onClick={() => {
                const collectionSection = document.getElementById("collection-section")
                collectionSection?.scrollIntoView({ behavior: "smooth" })
              }}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg rounded-full inline-flex items-center gap-2 transition-all hover:gap-3 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              Khám phá bộ sưu tập
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Chỉnh lại màu cho phù hợp nền tối */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <span className="text-sm text-neutral-300">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-neutral-400 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}