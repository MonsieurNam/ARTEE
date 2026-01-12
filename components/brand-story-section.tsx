"use client";

import { useEffect, useState } from "react";
import { Sparkles, Lightbulb, Users, Target } from "lucide-react";
import { BRAND_STORY } from "@/lib/content";

export default function BrandStorySection() {
  const [visiblePillars, setVisiblePillars] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0");
            setVisiblePillars((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-24 md:py-32 px-4 bg-black text-white overflow-hidden relative border-t border-neutral-800">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-950/20 via-transparent to-transparent opacity-40"></div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium tracking-wide text-neutral-300">OUR STORY</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-50 mb-6 tracking-tight text-balance">
            Câu Chuyện{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent font-semibold animate-gradient">
              Thương Hiệu
            </span>
          </h2>
          
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed text-balance">
            {BRAND_STORY.description}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {BRAND_STORY.pillars.map((pillar, index) => {
            const iconMap: { [key: number]: React.ReactNode } = {
              0: <Sparkles className="w-10 h-10" />,
              1: <Lightbulb className="w-10 h-10" />,
              2: <Users className="w-10 h-10" />,
              3: <Target className="w-10 h-10" />
            };
            return (
              <div
                key={index}
                data-index={index}
                className="relative group cursor-pointer"
                style={{
                  opacity: visiblePillars.includes(index) ? 1 : 0,
                  transform: visiblePillars.includes(index) ? 'translateY(0)' : 'translateY(2rem)',
                  transition: `opacity 0.7s ${index * 0.2}s, transform 0.7s ${index * 0.2}s`
                }}
              >
              {/* Glow Effect on Hover */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Card Content */}
              <div className="relative flex flex-col items-center text-center p-8 md:p-10 rounded-2xl transition-all duration-500 transform group-hover:scale-[1.03] bg-gradient-to-br from-neutral-900 to-black group-hover:shadow-2xl border border-white/10 group-hover:border-purple-500/30 overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>

                {/* Floating Orb Inside Card */}
                <div className="absolute top-4 right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Icon Container */}
                <div className="relative mb-6 z-10">
                  {/* Rotating Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{animationDuration: '3s'}}></div>
                  <div className="absolute inset-2 rounded-full border-2 border-blue-500/30 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
                  
                  {/* Icon Background */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-neutral-800 to-neutral-900 group-hover:from-purple-500 group-hover:to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 transform group-hover:rotate-6">
                    <div className="text-neutral-400 group-hover:text-white transition-colors duration-500">
                      {iconMap[index]}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 relative z-10">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors duration-300 relative z-10">
                  {pillar.description}
                </p>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-24 transition-all duration-500 rounded-full shadow-lg shadow-purple-500/50"></div>
              </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Divider */}
        <div className="mt-16 md:mt-24 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <div className="w-2 h-2 bg-purple-500/50 rounded-full animate-pulse"></div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent via-purple-500/50 to-transparent"></div>
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