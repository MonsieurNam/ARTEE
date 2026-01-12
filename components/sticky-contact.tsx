"use client"

import { Phone, MessageCircle } from "lucide-react" // Đảm bảo import icon cần thiết
import { SHOP_CONTACT } from "@/lib/constants"
import { useState, useEffect } from "react"
import Link from "next/link" // <--- 1. NHỚ IMPORT LINK

export default function StickyContact() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-3"
      style={{
        animation: isVisible ? 'slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
      }}
    >
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.95);
            opacity: 1;
          }
        }
      `}</style>

      {/* --- NÚT ZALO (ƯU TIÊN SỐ 1) --- */}
      <a
        href={SHOP_CONTACT.zalo}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 hover:scale-110"
        style={{
          animation: 'float 3s ease-in-out infinite',
          background: 'linear-gradient(135deg, #0068FF 0%, #0084FF 100%)',
          boxShadow: '0 8px 32px rgba(0, 104, 255, 0.4), 0 0 0 0 rgba(0, 104, 255, 0.4)',
        }}
      >
        {/* Outer glow ring */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #0068FF, #0084FF)',
            filter: 'blur(8px)',
            opacity: 0.6,
            animation: 'pulse-ring 2s ease-in-out infinite'
          }}
        />
        
        {/* Animated ping effect */}
        <span 
          className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
          style={{
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
        
        {/* Shimmer effect on hover */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            backgroundSize: '200% 100%',
            animation: isHovering ? 'shimmer 1.5s linear infinite' : 'none'
          }}
        />

        {/* Tooltip with enhanced design */}
        <span className="absolute left-full ml-5 px-4 py-2.5 bg-gradient-to-r from-white to-gray-50 text-blue-600 text-sm font-bold rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-blue-100/50 backdrop-blur-sm group-hover:translate-x-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Chat Zalo (Online)
          </div>
          <span 
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0"
            style={{
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '8px solid rgba(255, 255, 255, 0.95)',
              filter: 'drop-shadow(-1px 0 1px rgba(0,0,0,0.05))'
            }}
          />
        </span>

        {/* Icon Zalo */}
        <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
            alt="Zalo" 
            className="w-7 h-7 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Chấm xanh báo Online với hiệu ứng nâng cao */}
        <span className="absolute top-0.5 right-0.5 z-20 flex items-center justify-center">
          <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow-lg"></span>
        </span>

        {/* Border gradient effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />
      </a>

      {/* --- NÚT GỌI ĐIỆN (ƯU TIÊN SỐ 2) --- */}
      <Link href="/contact">
        <div className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white shadow-lg shadow-green-600/30 hover:-translate-y-1 transition-all duration-300 hover:bg-green-700 cursor-pointer">
            
            {/* Tooltip */}
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-white text-green-900 text-xs font-bold rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-green-100">
                Gửi Tin Nhắn / Email
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white transform rotate-45 border-l border-b border-green-100"></span>
            </span>
            
            <Phone className="w-5 h-5 fill-current" />
        </div>
      </Link>
    </div>
  )
}