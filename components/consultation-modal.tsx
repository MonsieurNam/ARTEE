"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle, // <--- 1. THÊM IMPORT NÀY
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, MessageCircle } from "lucide-react"
import { SHOP_CONTACT } from "@/lib/constants"

export default function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 1. Kiểm tra xem khách đã từng đóng popup này chưa
    const hasSeenPopup = sessionStorage.getItem("has_seen_consultation_popup")
    
    if (!hasSeenPopup) {
      // 2. Hiện popup sau 15 giây
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 15000) 

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("has_seen_consultation_popup", "true")
  }

  const handleContact = () => {
    window.open(SHOP_CONTACT.zalo, '_blank')
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl bg-white" 
        showCloseButton={false} 
      >
        <div className="flex flex-col md:flex-row">
            {/* Cột trái */}
            <div className="md:w-2/5 bg-gradient-to-br from-blue-700 to-blue-900 p-6 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                
                <div className="relative z-10 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20">
                    <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="relative z-10 font-bold text-lg leading-tight">ARTEE Support</h3>
                <p className="relative z-10 text-xs text-blue-200 mt-2">Hỗ trợ trực tiếp 1:1</p>
            </div>

            {/* Cột phải */}
            <div className="md:w-3/5 p-6 relative">
                <button 
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors z-20"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="mt-1">
                    {/* --- 2. SỬA TẠI ĐÂY: Dùng DialogTitle thay cho h2 --- */}
                    <DialogTitle className="text-lg font-bold text-gray-900 leading-snug">
                        Bạn muốn xem ảnh thực tế chất vải?
                    </DialogTitle>
                    
                    <div className="mt-4 space-y-3">
                        <p className="text-sm text-gray-600">
                            Chat ngay với nhân viên ARTEE để:
                        </p>
                        <ul className="text-xs text-gray-700 space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Xem video/ảnh thật cận cảnh chất vải.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Tư vấn size chuẩn theo chiều cao/cân nặng.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Hướng dẫn quy trình <b>cọc 50k</b> an toàn.
                            </li>
                        </ul>

                        <div className="pt-3">
                            <Button 
                                onClick={handleContact}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 shadow-lg shadow-blue-200 text-sm transition-transform active:scale-95"
                            >
                                Chat Zalo Xem Ảnh Thật
                            </Button>
                            <p className="text-[10px] text-center text-gray-400 mt-2">
                                *Không mua không sao, chúng tôi sẵn sàng tư vấn.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}