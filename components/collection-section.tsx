// components/collection-section.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { COLLECTION } from "@/lib/content"
import useEmblaCarousel from "embla-carousel-react"

export default function CollectionSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps"
  })
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev())
      setNextBtnDisabled(!emblaApi.canScrollNext())
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
    }

    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("init", onInit)
    onSelect()
    onInit()

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("init", onInit)
    }
  }, [emblaApi])

  return (
    <section className="w-full py-32 md:py-40 px-4 bg-gradient-to-b from-neutral-50 via-white to-neutral-50/30 relative overflow-hidden" id="collection-section">
      {/* Subtle luxury background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20 md:mb-28">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              {COLLECTION.title}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-300" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-serif font-light text-neutral-900 mt-6 mb-8 text-balance leading-tight tracking-tight">
            {COLLECTION.subtitle}
          </h2>
          
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto text-balance leading-relaxed">
            {COLLECTION.description}
          </p>
        </div>

        {/* Enhanced Carousel */}
        <div className="relative px-8 lg:px-16">
          {/* Navigation Buttons - Premium Style */}
          <Button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            variant="outline"
            className="absolute top-1/2 -left-4 lg:left-0 -translate-y-1/2 z-20 h-14 w-14 rounded-full border-2 border-neutral-200 bg-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 group"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-neutral-700 group-hover:text-neutral-900 transition-colors" />
          </Button>

          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex -ml-6 md:-ml-8">
              {COLLECTION.products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 pl-6 md:pl-8">
                  <Link href={`/products/${product.id}`} className="block group cursor-pointer">
                    {/* Enhanced Product Card */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500 bg-neutral-100">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* AR Badge */}
                      {product.isARReady && (
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-neutral-900 shadow-lg border border-neutral-200/50 flex items-center gap-1.5 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                          <Sparkles className="w-3 h-3" />
                          AR Ready
                        </div>
                      )}
                      
                      {/* Hover CTA Button */}
                      <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <Button 
                          variant="outline" 
                          className="bg-white/95 backdrop-blur-md text-neutral-900 hover:bg-white border-2 border-white/50 h-12 px-8 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                          Xem chi tiết
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      {/* Decorative corner accent */}
                      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Enhanced Product Info */}
                    <div className="space-y-3 px-1">
                      <h3 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 line-clamp-2 group-hover:text-neutral-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm md:text-base text-neutral-500 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Price with subtle reveal */}
                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </span>
                        <span className="text-sm text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          VND
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            variant="outline"
            className="absolute top-1/2 -right-4 lg:right-0 -translate-y-1/2 z-20 h-14 w-14 rounded-full border-2 border-neutral-200 bg-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 group"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-neutral-700 group-hover:text-neutral-900 transition-colors" />
          </Button>
        </div>

        {/* Enhanced Pagination Dots */}
        {scrollSnaps.length > 1 && (
          <div className="flex justify-center gap-2 mt-12 md:mt-16">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "w-8 bg-neutral-900"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Optional: View All CTA */}
        {/* <div className="text-center mt-16 md:mt-20">
          <Link href="/collection">
            <Button 
              variant="outline" 
              className="h-14 px-10 rounded-full text-base font-semibold border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 group"
            >
              Khám phá toàn bộ bộ sưu tập
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div> */}
      </div>
    </section>
  )
}