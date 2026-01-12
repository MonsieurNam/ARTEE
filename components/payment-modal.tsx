"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy, Loader2, X } from "lucide-react"
import { BANK_INFO } from "@/lib/constants"
import { generateVietQR } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  userEmail: string;
  onConfirm: () => void; // Hàm chạy khi khách bấm "Tôi đã chuyển khoản"
}

export default function PaymentModal({ isOpen, onClose, amount, orderId, userEmail, onConfirm }: PaymentModalProps) {
  // 1. Tạo link QR và nội dung chuyển khoản tự động
  const { qrUrl, content } = generateVietQR(amount, orderId);
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);

  // Hàm copy nội dung vào clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ 
        title: "Đã sao chép", 
        description: text,
        duration: 2000 
    });
  }

  // Xử lý khi bấm nút "Tôi đã chuyển khoản"
  const handleConfirmPayment = async () => {
    setIsConfirming(true);
    
    try {
        // 1. Gọi API lưu vào Google Sheet
        await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderId,
                amount: amount,
                paymentContent: content,
                bankInfo: BANK_INFO,
                email: userEmail 
            })
        });

        // 2. Tạo delay giả lập thêm 1 chút để tạo cảm giác xử lý
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        // 3. Hoàn tất
        setIsConfirming(false);
        onConfirm(); // Chuyển hướng trang

    } catch (error) {
        console.error("Lỗi ghi log thanh toán:", error);
        // Dù lỗi ghi log sheet, vẫn cho khách đi tiếp để không gián đoạn trải nghiệm
        setIsConfirming(false);
        onConfirm();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-gray-100 relative">
             <DialogTitle className="text-lg font-bold text-center w-full text-gray-900">
                Thanh toán Tiền cọc
             </DialogTitle>
             {/* Nút đóng */}
             <button 
                onClick={onClose} 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
             >
                <X className="w-5 h-5 text-gray-500"/>
             </button>
        </DialogHeader>

        <div className="p-6 pt-4 flex flex-col items-center">
            
            {/* Ảnh QR Code */}
            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-5 w-full flex justify-center">
                {/* Lưu ý: Thêm timestamp để tránh cache ảnh cũ nếu mở lại */}
                <img 
                    src={qrUrl} 
                    alt="VietQR Payment" 
                    className="w-full max-w-[280px] h-auto object-contain" 
                />
            </div>

            {/* Thông tin chuyển khoản thủ công (Dự phòng) */}
            <div className="w-full space-y-3 text-sm mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between">
                    <span className="text-gray-500">Ngân hàng:</span>
                    <span className="font-semibold text-gray-900">{BANK_INFO.bankId}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-base">{BANK_INFO.accountNum}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(BANK_INFO.accountNum)}>
                            <Copy className="w-3.5 h-3.5 text-blue-600" />
                        </Button>
                    </div>
                </div>
                
                <div className="flex justify-between">
                    <span className="text-gray-500">Chủ tài khoản:</span>
                    <span className="font-semibold uppercase text-gray-900">{BANK_INFO.accountName}</span>
                </div>
                
                <div className="border-t border-dashed border-gray-300 my-2"></div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Nội dung CK:</span>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 border-dashed">
                            {content}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(content)}>
                            <Copy className="w-3.5 h-3.5 text-blue-600" />
                        </Button>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Số tiền cọc:</span>
                    <span className="font-bold text-red-600 text-lg">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)}
                    </span>
                </div>
            </div>

            {/* Nút xác nhận */}
            <Button 
                className="w-full py-6 text-base font-bold bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-200 rounded-xl transition-all active:scale-95"
                onClick={handleConfirmPayment}
                disabled={isConfirming}
            >
                {isConfirming ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Đang xác thực giao dịch...
                    </>
                ) : (
                    <>
                        <CheckCircle2 className="w-5 h-5" /> Tôi đã chuyển khoản xong
                    </>
                )}
            </Button>
            
            <p className="text-[11px] text-gray-400 mt-3 text-center max-w-xs mx-auto">
                Lưu ý: Hệ thống sẽ tự động đối soát nội dung chuyển khoản để cập nhật trạng thái đơn hàng.
            </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}