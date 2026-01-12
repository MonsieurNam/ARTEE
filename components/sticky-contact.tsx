"use client"

import { SHOP_CONTACT } from "@/lib/constants"
import { Phone, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"

export default function StickyContact() {
  const [isVisible, setIsVisible] = useState(true) // Always visible for demo
  const [isHoveringZalo, setIsHoveringZalo] = useState(false)
  const [isHoveringPhone, setIsHoveringPhone] = useState(false)

  return (
    <div 
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-4"
      style={{
        animation: 'slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-120px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
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
            transform: scale(0.9);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.8;
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 104, 255, 0.4), 0 0 40px rgba(0, 104, 255, 0.2), 0 8px 32px rgba(0, 104, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(0, 104, 255, 0.6), 0 0 60px rgba(0, 104, 255, 0.3), 0 12px 48px rgba(0, 104, 255, 0.4);
          }
        }

        @keyframes phone-pulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(22, 163, 74, 0.3), 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 6px 30px rgba(22, 163, 74, 0.5), 0 0 0 8px rgba(34, 197, 94, 0);
          }
        }
      `}</style>

      {/* --- ZALO BUTTON --- */}
      <a
        href={SHOP_CONTACT.zalo}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHoveringZalo(true)}
        onMouseLeave={() => setIsHoveringZalo(false)}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 hover:scale-115 active:scale-95"
        style={{
          animation: 'float 3.5s ease-in-out infinite, glow-pulse 2.5s ease-in-out infinite',
          background: 'linear-gradient(135deg, #0068FF 0%, #0084FF 50%, #00A0FF 100%)',
          transform: isHoveringZalo ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
        }}
      >
        {/* Outer glow ring */}
        <div 
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, #0068FF, #0084FF)',
            filter: 'blur(12px)',
            opacity: isHoveringZalo ? 0.9 : 0.6,
            animation: 'pulse-ring 2.5s ease-in-out infinite',
            transform: isHoveringZalo ? 'scale(1.2)' : 'scale(1)'
          }}
        />
        
        {/* Animated ping effect */}
        <span 
          className="absolute inline-flex h-full w-full rounded-full bg-blue-400"
          style={{
            animation: 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.6
          }}
        />
        
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 rounded-full transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            backgroundSize: '200% 100%',
            animation: isHoveringZalo ? 'shimmer 1.2s linear infinite' : 'none',
            opacity: isHoveringZalo ? 1 : 0
          }}
        />

        {/* Enhanced Tooltip */}
        <span 
          className="absolute left-full ml-6 px-5 py-3 bg-white text-blue-600 text-sm font-bold rounded-2xl shadow-2xl transition-all duration-500 whitespace-nowrap pointer-events-none border border-blue-200/60 backdrop-blur-md"
          style={{
            opacity: isHoveringZalo ? 1 : 0,
            transform: isHoveringZalo ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.95)',
            boxShadow: '0 20px 60px rgba(0, 104, 255, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-br from-green-400 to-green-600 shadow-lg"></span>
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Chat Zalo (Online)
            </span>
          </div>
          <span 
            className="absolute top-1/2 -left-2.5 -translate-y-1/2"
            style={{
              width: 0,
              height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderRight: '10px solid white',
              filter: 'drop-shadow(-2px 0 2px rgba(0,0,0,0.08))'
            }}
          />
        </span>

        {/* Icon Container */}
        <div 
          className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md transition-all duration-500"
          style={{
            background: isHoveringZalo ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.25)',
            transform: isHoveringZalo ? 'rotate(360deg) scale(1.05)' : 'rotate(0deg) scale(1)'
          }}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
            alt="Zalo" 
            className="w-7 h-7 object-contain relative z-10 transition-transform duration-500"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              transform: isHoveringZalo ? 'scale(1.15)' : 'scale(1)'
            }}
          />
        </div>

        {/* Enhanced Online Badge */}
        <span className="absolute top-0 right-0 z-20 flex items-center justify-center">
          <span className="absolute inline-flex h-5 w-5 rounded-full bg-green-400 opacity-75 animate-ping"></span>
          <span 
            className="relative inline-flex rounded-full h-5 w-5 border-[3px] border-white shadow-xl transition-transform duration-300"
            style={{
              background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
              transform: isHoveringZalo ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        </span>

        {/* Rotating border gradient */}
        <div 
          className="absolute inset-0 rounded-full transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            opacity: isHoveringZalo ? 1 : 0,
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />
      </a>

      {/* --- PHONE BUTTON --- */}
      <a href="/contact">
        <div 
          className="group relative flex items-center justify-center w-14 h-14 rounded-full text-white transition-all duration-500 hover:scale-110 active:scale-95 cursor-pointer"
          onMouseEnter={() => setIsHoveringPhone(true)}
          onMouseLeave={() => setIsHoveringPhone(false)}
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            animation: 'phone-pulse 2.5s ease-in-out infinite',
            transform: isHoveringPhone ? 'translateY(-4px) rotate(-5deg)' : 'translateY(0) rotate(0)',
            boxShadow: isHoveringPhone 
              ? '0 8px 35px rgba(22, 163, 74, 0.6), 0 0 0 0 rgba(34, 197, 94, 0)'
              : '0 4px 20px rgba(22, 163, 74, 0.3)'
          }}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              filter: 'blur(10px)',
              opacity: isHoveringPhone ? 0.8 : 0.5,
              transform: isHoveringPhone ? 'scale(1.15)' : 'scale(1)'
            }}
          />

          {/* Enhanced Tooltip */}
          <span 
            className="absolute left-full ml-5 px-4 py-2.5 bg-white text-green-900 text-xs font-bold rounded-xl shadow-2xl transition-all duration-500 whitespace-nowrap pointer-events-none border border-green-200/60 backdrop-blur-md"
            style={{
              opacity: isHoveringPhone ? 1 : 0,
              transform: isHoveringPhone ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.95)',
              boxShadow: '0 15px 50px rgba(22, 163, 74, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
            }}
          >
            <span className="bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              Gửi Tin Nhắn / Email
            </span>
            <span 
              className="absolute top-1/2 -left-2 -translate-y-1/2"
              style={{
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderRight: '8px solid white',
                filter: 'drop-shadow(-1px 0 2px rgba(0,0,0,0.08))'
              }}
            />
          </span>
          
          <div 
            className="relative z-10 transition-transform duration-500"
            style={{
              transform: isHoveringPhone ? 'scale(1.15) rotate(20deg)' : 'scale(1) rotate(0)'
            }}
          >
            <Phone 
              className="w-6 h-6 fill-current" 
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
              }}
            />
          </div>

          {/* Shine effect on hover */}
          <div 
            className="absolute inset-0 rounded-full transition-opacity duration-500"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: isHoveringPhone ? 'shimmer 1.5s linear infinite' : 'none',
              opacity: isHoveringPhone ? 1 : 0
            }}
          />
        </div>
      </a>
    </div>
  )
}