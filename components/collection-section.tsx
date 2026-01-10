// components/collection-section.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { COLLECTION } from "@/lib/content";
import Link from "next/link"; // 1. IMPORT LINK

export default function CollectionSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps"
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("init", onInit);
    onSelect();
    onInit();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("init", onInit);
    };
  }, [emblaApi]);

  return (
    <section className="w-full py-24 md:py-32 px-4 bg-black text-white overflow-hidden relative border-t border-neutral-800" id="collection-section">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-950/20 via-transparent to-transparent opacity-40"></div>

      {/* Floating Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium tracking-wide text-neutral-300">{COLLECTION.title}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-50 mb-6 tracking-tight text-balance">
            Khám Phá{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold animate-gradient">
              Phong Cách Riêng
            </span>
          </h2>
          
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed text-balance">
            {COLLECTION.description}
          </p>
        </div>

        {/* Enhanced Carousel */}
        <div className="relative px-8 lg:px-16">
          
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="absolute top-1/2 -left-4 lg:left-0 -translate-y-1/2 z-20 h-14 w-14 rounded-full border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-xl hover:bg-white/10 hover:border-white/20 hover:scale-105 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 group"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 text-white mx-auto group-hover:scale-110 transition-transform" />
          </button>

          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex -ml-6 md:-ml-8">
              {COLLECTION.products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 pl-6 md:pl-8">
                  
                  {/* 2. CHUYỂN DIV THÀNH LINK */}
                  <Link href={`/products/${product.id}`} className="block group cursor-pointer h-full">
                    
                    {/* Product Card */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-900 border border-white/10">
                      
                      {/* Glow Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-pink-600/0 group-hover:from-purple-600/30 group-hover:via-blue-600/30 group-hover:to-pink-600/30 rounded-2xl blur-xl transition-all duration-700"></div>
                      
                      {/* Image Container */}
                      <div className="relative w-full h-full overflow-hidden rounded-2xl">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* AR Badge */}
                        {product.isARReady && (
                          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-bold text-emerald-400 shadow-lg border border-emerald-500/30 flex items-center gap-1.5 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            AR Ready
                          </div>
                        )}
                        
                        {/* Hover CTA Button */}
                        {/* 3. Đổi button thành div để tránh lỗi HTML (Link chứa Button) nhưng vẫn giữ style cũ */}
                        <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <div className="bg-white/95 backdrop-blur-md text-black hover:bg-white font-bold h-12 px-8 rounded-full shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                            Xem chi tiết
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Decorative corner accents */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-br-2xl"></div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3 px-1">
                      <h3 className="text-xl md:text-2xl font-semibold text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm md:text-base text-neutral-400 leading-relaxed line-clamp-2 group-hover:text-neutral-300 transition-colors duration-300">
                        {product.description}
                      </p>
                      
                      {/* Price */}
                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
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

          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="absolute top-1/2 -right-4 lg:right-0 -translate-y-1/2 z-20 h-14 w-14 rounded-full border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-xl hover:bg-white/10 hover:border-white/20 hover:scale-105 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 group"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 text-white mx-auto group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Pagination Dots */}
        {scrollSnaps.length > 1 && (
          <div className="flex justify-center gap-2 mt-12 md:mt-16">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "w-8 bg-gradient-to-r from-blue-400 to-purple-400"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Bottom Divider */}
        <div className="mt-16 md:mt-24 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-pulse"></div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent via-blue-500/50 to-transparent"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}