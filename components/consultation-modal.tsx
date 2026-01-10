// components/consultation-modal.tsx
"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, MessageCircle } from "lucide-react"
import { SHOP_CONTACT } from "@/lib/constants"

export default function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 1. Kiểm tra xem khách đã từng đóng popup này chưa (để tránh làm phiền)
    const hasSeenPopup = sessionStorage.getItem("has_seen_consultation_popup")
    
    if (!hasSeenPopup) {
      // 2. Nếu chưa, hiện popup sau 15 giây
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 15000) 

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Lưu lại trạng thái đã xem vào Session (Tắt tab mở lại mới hiện lại)
    sessionStorage.setItem("has_seen_consultation_popup", "true")
  }

  const handleContact = () => {
    window.open(SHOP_CONTACT.zalo, '_blank')
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* 
         LƯU Ý QUAN TRỌNG: 
         Thêm prop showCloseButton={false} để tắt nút X mặc định bị chồng 
      */}
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl bg-white" 
        showCloseButton={false} 
      >
        <div className="flex flex-col md:flex-row">
            {/* Cột trái: Ảnh nhân viên (Hoặc ảnh branding) */}
            <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 p-6 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                
                <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="relative z-10 font-bold text-lg leading-tight">ARTEE Support</h3>
                <p className="relative z-10 text-xs text-blue-100 mt-2">Luôn sẵn sàng 24/7</p>
            </div>

            {/* Cột phải: Nội dung */}
            <div className="md:w-3/5 p-6 relative">
                {/* Nút X tự làm (Custom Close Button) */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 pr-4">
                        Bạn cần tư vấn thiết kế riêng?
                    </DialogTitle>
                </DialogHeader>
                
                <div className="mt-3 space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Đội ngũ kỹ thuật của ARTEE đang online. Chúng tôi có thể giúp bạn:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                        <li>Lên mockup 3D miễn phí.</li>
                        <li>Tư vấn chọn vải phù hợp.</li>
                        <li>Báo giá sỉ cho Team/Công ty.</li>
                    </ul>

                    <div className="pt-2">
                        <Button 
                            onClick={handleContact}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 shadow-lg shadow-blue-200"
                        >
                            Chat Zalo Ngay
                        </Button>
                        <p className="text-xs text-center text-gray-400 mt-3">
                            Phản hồi trung bình: &lt; 5 phút
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}