// components/tech-showcase-section.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { MoveHorizontal, Wand2, ArrowRight, Phone, Play, Sparkles, Zap } from "lucide-react";
import Link from "next/link"; // Đảm bảo đã import Link
import VirtualTryOnModal from "./virtual-try-on-modal_mini"; // 1. Import Modal

// Dữ liệu mẫu (Giữ nguyên)
const imageBefore = "hoodie_front.png"; 
const imageAfter = "/remove_background/hoodie_front (2).png"; 

export default function TechShowcaseSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isVtoOpen, setIsVtoOpen] = useState(false);
  const [isHoveringVto, setIsHoveringVto] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Logic Slider (Giữ nguyên)
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!isResizing || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  useEffect(() => {
    const handleUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isResizing]);

  // Hàm xử lý cuộn xuống phần liên hệ
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full py-32 bg-black text-white overflow-hidden relative">
      
      {/* ... (Phần Background Effects Giữ nguyên) ... */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      <div className="absolute inset-0 bg-gradient-radial from-blue-950/20 via-transparent to-transparent opacity-40"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium tracking-wide text-neutral-300">INNOVATION MEETS ARTISTRY</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Công Nghệ{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Thực & Ảo
            </span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm chất lượng in ấn cao cấp kết hợp cùng công nghệ AI tiên tiến nhất thế giới
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          
          {/* LEFT COLUMN: Comparison Slider (Giữ nguyên) */}
          <div className="relative group">
             {/* ... (Code Slider giữ nguyên như bạn cung cấp) ... */}
             <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <div 
              ref={sliderRef}
              className="relative w-full aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 select-none cursor-ew-resize transform transition-transform duration-500 group-hover:scale-[1.02]"
              onMouseDown={() => setIsResizing(true)}
              onTouchStart={() => setIsResizing(true)}
            >
              <img src={imageAfter} alt="Sản phẩm thực tế" className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"/>
              <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">Premium Quality</span>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <img src={imageBefore} alt="Bản thiết kế" className="absolute top-0 left-0 w-full h-full object-cover max-w-none" />
                <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">Digital Design</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent cursor-ew-resize z-20" style={{ left: `${sliderPosition}%`, boxShadow: '0 0 30px rgba(255,255,255,0.6)' }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 w-14 h-14 rounded-full bg-white/20 blur-md"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-white to-neutral-200 rounded-full flex items-center justify-center shadow-xl border-2 border-white/50 transform transition-transform group-hover:scale-110">
                      <MoveHorizontal className="w-6 h-6 text-neutral-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-6 flex items-center justify-center gap-3">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-white/20"></div>
              <p className="text-sm text-neutral-500 flex items-center gap-2 font-light tracking-wide"><MoveHorizontal className="w-4 h-4 animate-pulse" /> Kéo để khám phá sự khác biệt</p>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-white/20"></div>
            </div>
          </div>

          {/* RIGHT COLUMN: VTO Card */}
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsHoveringVto(true)}
            onMouseLeave={() => setIsHoveringVto(false)}
            onClick={() => setIsVtoOpen(true)} // 2. Kích hoạt Modal khi bấm vào Card
          >
            {/* ... (Các hiệu ứng nền Card giữ nguyên) ... */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-gradient"></div>
            <div className="relative bg-gradient-to-br from-neutral-900 to-black rounded-3xl p-12 border border-white/10 flex flex-col items-center text-center min-h-[500px] justify-center overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.02]">
                {/* ... (Nội dung Card giữ nguyên) ... */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
                </div>
                <div className={`absolute top-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl transition-opacity duration-700 ${isHoveringVto ? 'opacity-40 animate-pulse' : 'opacity-20'}`}></div>
                <div className={`absolute bottom-10 left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl transition-opacity duration-700 ${isHoveringVto ? 'opacity-40 animate-pulse' : 'opacity-20'}`} style={{animationDelay: '0.5s'}}></div>

                <div className="z-10 space-y-8">
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin" style={{animationDuration: '3s'}}></div>
                        <div className="absolute inset-2 rounded-full border-2 border-blue-500/30 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/50 transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                            <Wand2 className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">Phòng Thử Đồ <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ảo AI</span></h3>
                        <p className="text-neutral-400 max-w-md mx-auto text-lg leading-relaxed font-light">Không cần đến shop. Tải ảnh của bạn lên và thử trọn bộ sưu tập ARTEE chỉ trong <span className="text-white font-semibold">1 chạm</span>.</p>
                    </div>
                    {/* Nút giả trong card - Card đã có onClick nên nút này chỉ để trang trí */}
                    <button className="relative group/btn overflow-hidden bg-white text-black font-bold px-10 py-5 rounded-full text-lg shadow-2xl transform transition-all duration-300 hover:shadow-white/30 hover:scale-105 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center gap-3 group-hover/btn:text-white transition-colors duration-300">
                            <Play className="w-5 h-5 fill-current" /> Vào thử đồ ngay <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                    </button>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                        <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs text-neutral-400">⚡ Tức thì</div>
                        <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs text-neutral-400">🎯 Chính xác</div>
                        <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs text-neutral-400">✨ Miễn phí</div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          
          <div className="pt-20 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Bạn đã có ý tưởng thiết kế riêng?</h3>
            <p className="text-neutral-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-light">Đừng để ý tưởng chỉ nằm trong đầu. Hãy hiện thực hóa nó ngay bây giờ với công cụ thiết kế của chúng tôi hoặc liên hệ để được hỗ trợ 1:1.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              
              {/* 3. TÍCH HỢP LINK CHO NÚT THIẾT KẾ */}
              <Link href="/customizer">
                <button className="group/cta bg-white text-black hover:bg-neutral-100 font-bold px-10 py-5 rounded-full min-w-[220px] shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                    Tự tay Thiết kế 
                    <ArrowRight className="w-5 h-5 transform group-hover/cta:translate-x-1 transition-transform" />
                    </span>
                </button>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
                <span className="text-neutral-500 font-medium tracking-wider text-sm">HOẶC</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-neutral-600 to-transparent"></div>
              </div>

              {/* 4. TÍCH HỢP SCROLL CHO NÚT LIÊN HỆ */}
              <button 
                onClick={scrollToContact}
                className="group/cta border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/30 font-bold px-10 py-5 rounded-full min-w-[220px] shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> 
                  Liên hệ tư vấn
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. RENDER MODAL Ở CUỐI */}
        <VirtualTryOnModal 
            isOpen={isVtoOpen} 
            onClose={() => setIsVtoOpen(false)} 
        />

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