"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SHOP_CONTACT, DEPOSIT_AMOUNT } from "@/lib/constants"
import { MessageCircle, Phone, ArrowRight, ShieldCheck, Loader2, LogIn, CreditCard } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { createOrder } from "@/lib/services/order-service"
import { clearCart } from "@/lib/cart"
import PaymentModal from "./payment-modal" // <--- Import Modal vừa tạo

// Hàm format tiền tệ
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

export default function OrderSummary() {
  const { cart, getTotalPrice } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  
  const [isProcessing, setIsProcessing] = useState(false)
  
  // State quản lý Modal thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string>("")

  // Nếu giỏ hàng trống, không hiển thị
  if (!cart || cart.length === 0) return null;

  // --- TÍNH TOÁN TIỀN ---
  const totalPrice = getTotalPrice();
  const depositRequired = totalPrice < DEPOSIT_AMOUNT ? totalPrice : DEPOSIT_AMOUNT;
  const remainingAmount = totalPrice - depositRequired;

  // --- HÀM 1: XỬ LÝ CHAT ZALO (TƯ VẤN) ---
  const handleChatZalo = () => {
      // Mở trực tiếp Zalo để chat
      window.open(SHOP_CONTACT.zalo, '_blank');
  }

  // --- HÀM 2: XỬ LÝ NÚT "CỌC NGAY" ---
  const handleDepositClick = async () => {
    // 1. Kiểm tra đăng nhập
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để tạo đơn hàng và bảo hành.",
        action: (<Button size="sm" variant="outline" onClick={() => router.push("/login")}>Đăng nhập</Button>),
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Tạo đơn hàng trước trên Firestore (Trạng thái Pending)
      const orderId = await createOrder(user.uid, cart, totalPrice);
      setCreatedOrderId(orderId);
      
      // 3. Mở Modal thanh toán QR
      setShowPaymentModal(true);

    } catch (error) {
      console.error("Create Order Error:", error);
      toast({ title: "Lỗi hệ thống", description: "Không thể tạo đơn hàng. Vui lòng thử lại.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HÀM 3: XÁC NHẬN ĐÃ THANH TOÁN (Callback từ Modal) ---
  const handlePaymentSuccess = () => {
      setShowPaymentModal(false);
      clearCart(); // Xóa giỏ hàng sau khi đã tạo đơn và thanh toán
      
      toast({ 
        title: "Đặt hàng thành công! 🎉", 
        description: "Cảm ơn bạn đã thanh toán cọc. Đơn hàng đang được xử lý.",
        duration: 5000
      });
      
      router.push("/orders"); // Chuyển hướng về trang lịch sử đơn hàng
  }

  return (
    <div className="lg:col-span-1">
      <Card className="p-6 sticky top-24 border-2 border-primary/10 bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header trang trí */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="mb-6 pb-2 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Tổng kết Báo giá
            </h2>
        </div>

        {/* --- PHẦN HIỂN THỊ TIỀN --- */}
        <div className="space-y-4 mb-8">
            {/* Tổng đơn hàng */}
            <div className="flex justify-between items-baseline text-sm text-gray-500">
                <span>Tổng giá trị đơn hàng:</span>
                <span className="font-medium text-gray-600 line-through decoration-gray-400 decoration-1">{formatPrice(totalPrice)}</span>
            </div>
            
            {/* DÒNG CỌC (Nổi bật) */}
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-100 bg-blue-50/50 p-4 shadow-sm">
                <div className="flex justify-between items-center relative z-10">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                           <ShieldCheck className="w-3 h-3" /> Cần thanh toán ngay
                        </span>
                        <span className="font-bold text-blue-900 text-sm">Tiền cọc Pre-order</span>
                    </div>
                    <span className="text-3xl font-bold text-blue-700 tracking-tight">{formatPrice(depositRequired)}</span>
                </div>
                {/* Hiệu ứng nền nhẹ */}
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl" />
            </div>

            {/* Dòng COD */}
            <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-gray-200 text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                    📦 Thanh toán khi nhận hàng (COD):
                </span>
                <span className="font-bold text-gray-900">{formatPrice(remainingAmount)}</span>
            </div>
        </div>

        {/* --- NÚT HÀNH ĐỘNG (ĐÃ TÁCH) --- */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
            
            {/* Nút 1: Cọc ngay (Primary) */}
            <Button 
                onClick={handleDepositClick}
                disabled={isProcessing}
                className="w-full py-6 text-base font-bold bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:scale-[1.02]"
            >
                {isProcessing ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang khởi tạo...</>
                ) : user ? (
                    <span className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" /> Đặt Cọc Ngay ({formatPrice(depositRequired)})
                    </span>
                ) : (
                    <span className="flex items-center">
                        <LogIn className="w-5 h-5 mr-2" /> Đăng nhập để Đặt cọc
                    </span>
                )}
            </Button>

            {/* Nút 2: Tư vấn Zalo (Secondary) */}
            <Button 
                onClick={handleChatZalo}
                variant="outline"
                className="w-full py-6 text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-semibold rounded-xl"
            >
                <MessageCircle className="w-5 h-5 mr-2" /> 
                Chưa rõ size? Chat Zalo Tư Vấn
            </Button>

            <p className="text-[11px] text-center text-gray-400 mt-2 italic">
                *Quét mã QR VietQR - Xác nhận tự động - An toàn tuyệt đối
            </p>
        </div>
        
        {/* Support Link */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Button variant="link" asChild className="text-gray-500 p-0 h-auto text-xs hover:text-blue-600">
                <a href={`tel:${SHOP_CONTACT.phone}`} className="flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3" />
                  Gặp vấn đề thanh toán? Gọi {SHOP_CONTACT.phone}
                </a>
            </Button>
        </div>
      </Card>

      {/* --- RENDER MODAL THANH TOÁN --- */}
      {showPaymentModal && (
          <PaymentModal 
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            amount={depositRequired}
            orderId={createdOrderId}
            userEmail={user?.email || "Khách vãng lai"}
            onConfirm={handlePaymentSuccess}
          />
      )}
    </div>
  )
}