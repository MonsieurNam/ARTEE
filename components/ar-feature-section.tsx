// components/ar-feature-section.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Scan, Smartphone, Zap } from "lucide-react";
import Link from "next/link";

export default function ArFeatureSection() {
  return (
    <section className="w-full py-24 bg-neutral-950 text-white overflow-hidden relative">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* CỘT TRÁI: Nội dung Text */}
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <Scan className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-200 tracking-wide">AR EXPERIENCE</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Áo Thun Không Chỉ <br />
              Để Mặc, Mà Để <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Trải Nghiệm
              </span>
            </h2>

            <p className="text-lg text-neutral-400 max-w-lg leading-relaxed">
              Sử dụng ứng dụng Artivive để quét hình in trên áo. 
              Bạn sẽ thấy các tác phẩm nghệ thuật chuyển động, âm thanh sống động 
              và câu chuyện ẩn giấu bên trong.
            </p>

            {/* Các bước hướng dẫn nhanh */}
            <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Bước 1</h4>
                        <p className="text-sm text-neutral-400">Mở App </p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Bước 2</h4>
                        <p className="text-sm text-neutral-400">Quét & Xem Magic</p>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Link href="/#collection-section">
                    <Button className="h-14 px-8 rounded-full bg-white text-black font-bold text-base hover:bg-neutral-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Khám phá BST AR <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </Link>
            </div>
          </div>

          {/* CỘT PHẢI: Video Showcase */}
          {/* CỘT PHẢI: Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end animate-in slide-in-from-right-8 duration-700 delay-200">
            
            {/* 
               LƯU Ý CHỈNH SỬA:
               - aspect-[9/18]: Tỷ lệ khung hình điện thoại (Dáng dài).
               - Nếu muốn ngắn hơn, đổi thành aspect-[9/16] hoặc aspect-[3/5].
            */}
            <div className="relative w-[300px] md:w-[320px] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden ring-1 ring-white/20 z-20 aspect-[9/18]">
                
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 pointer-events-none"></div>

                {/* VIDEO PLAYER */}
                <video 
                    /* 
                       object-cover: Lấp đầy khung (quan trọng)
                       object-center: Căn giữa video
                    */
                    className="w-full h-full object-cover object-center"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    poster="/cafe_sau.png" 
                >
                    <source src="/ar_video/cafe.mp4" type="video/mp4" />
                </video>

                {/* Hiệu ứng quét (Scan line) */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    <div className="w-full h-0.5 bg-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,1)] absolute top-0 animate-scan"></div>
                </div>
            </div>

            {/* Bóng trang trí phía sau */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[600px] bg-gradient-to-br from-purple-600/40 to-blue-600/40 rounded-[3rem] blur-2xl -rotate-6"></div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
            animation: scan 3s linear infinite;
        }
      `}</style>
    </section>
  );
}