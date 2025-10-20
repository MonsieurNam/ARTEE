// components/collection-section.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { COLLECTION } from "@/lib/content"
import useEmblaCarousel from "embla-carousel-react" // <-- IMPORT THƯ VIỆN CAROUSEL

export default function CollectionSection() {
  // State và hook để quản lý carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  // Hàm để trượt carousel
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  // Lắng nghe sự kiện của carousel để bật/tắt nút bấm
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev())
      setNextBtnDisabled(!emblaApi.canScrollNext())
    }

    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    onSelect() // Chạy lần đầu để set trạng thái ban đầu

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <section className="w-full py-24 md:py-32 px-4 bg-gradient-to-b from-neutral-50 to-white" id="collection-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header không đổi */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-sm font-semibold text-neutral-600 uppercase tracking-widest">{COLLECTION.title}</span>
          <h2 className="text-5xl md:text-6xl font-serif font-light text-neutral-900 mt-4 mb-6 text-balance">
            {COLLECTION.subtitle}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto text-balance">{COLLECTION.description}</p>
        </div>

        {/* --- BẮT ĐẦU THAY ĐỔI LỚN: CAROUSEL WRAPPER --- */}
        <div className="relative">
          {/* Nút trượt sang trái */}
          <Button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            variant="outline"
            className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full hidden lg:flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4"> {/* Container cho các slide */}
              {COLLECTION.products.map((product) => (
                // Mỗi sản phẩm là một slide
                <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 pl-4">
                  {/* --- THAY ĐỔI LỚN 2: PRODUCT CARD TƯƠNG TÁC --- */}
                  <Link href={`/products/${product.id}`} className="block group cursor-pointer">
                    <div className="relative mb-4 overflow-hidden rounded-xl aspect-square shadow-md hover:shadow-xl transition-all">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                       {product.isARReady && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity">
                          AR Ready
                        </div>
                      )}
                      {/* Hiển thị nút "Xem chi tiết" khi hover */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Button variant="outline" className="bg-white/90 backdrop-blur-sm text-neutral-900 hover:bg-white h-11 px-6">
                            Xem chi tiết
                          </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-semibold text-neutral-900 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">{product.description}</p>
                      
                      {/* Giá tiền và các nút sẽ được ẩn đi, chỉ hiện khi hover */}
                      <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-base md:text-lg font-bold text-neutral-900">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Nút trượt sang phải */}
          <Button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            variant="outline"
            className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full hidden lg:flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        {/* --- KẾT THÚC THAY ĐỔI LỚN --- */}
      </div>
    </section>
  )
}