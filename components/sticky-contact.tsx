// components/sticky-contact.tsx
"use client"

import { MessageCircle, Phone } from "lucide-react"
import { SHOP_CONTACT } from "@/lib/constants"
import { useState, useEffect } from "react"

export default function StickyContact() {
  // Chỉ hiện nút sau khi user cuộn xuống 1 chút để tránh che nội dung ban đầu
  const [isVisible, setIsVisible] = useState(false)

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
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3 animate-in slide-in-from-bottom-10 fade-in duration-500">
      
      {/* Nút Zalo */}
      <a
        href={SHOP_CONTACT.zalo}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:scale-110 transition-all duration-300 hover:bg-blue-700"
      >
        <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat Zalo
        </span>
        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-20"></div>
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
            alt="Zalo" 
            className="w-7 h-7 object-contain"
        />
      </a>

      {/* Nút Phone */}
      <a
        href={`tel:${SHOP_CONTACT.phone}`}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white shadow-lg shadow-green-600/30 hover:scale-110 transition-all duration-300 hover:bg-green-700"
      >
        <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Gọi Hotline
        </span>
        <Phone className="w-5 h-5 fill-current" />
      </a>

    </div>
  )
}