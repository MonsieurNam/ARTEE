// components/order-summary.tsx
"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SHOP_CONTACT, PRODUCT_NAMES, DEPOSIT_AMOUNT } from "@/lib/constants"
import { MessageCircle, Phone, Copy, Check, Loader2, LogIn, ArrowRight, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { createOrder } from "@/lib/services/order-service"
import { clearCart } from "@/lib/cart"

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

  // Nếu giỏ hàng trống, không hiển thị
  if (!cart || cart.length === 0) return null;

  // --- LOGIC TÍNH TOÁN CỌC ---
  const totalPrice = getTotalPrice();
  // Nếu tổng đơn < tiền cọc (hiếm), thì cọc = tổng đơn. Ngược lại cọc mặc định (50k)
  const depositRequired = totalPrice < DEPOSIT_AMOUNT ? totalPrice : DEPOSIT_AMOUNT;
  const remainingAmount = totalPrice - depositRequired;

  // --- TẠO NỘI DUNG TIN NHẮN ZALO ---
  const generateOrderMessage = (orderId?: string) => {
    let message = `🔥 *YÊU CẦU PRE-ORDER ${orderId ? `#${orderId.slice(0,6).toUpperCase()}` : ''}*\n`;
    message += `----------------\n`;
    
    cart.forEach((item, index) => {
      let name = item.product.productName || (item.type === 'custom' ? `Áo ${PRODUCT_NAMES[item.product.type || 'tee'] || 'Tee'} Custom` : "Sản phẩm");
      let specs = "";
      
      if (item.type === 'custom') {
         specs = `Size ${item.product.size} - Màu ${item.product.color}`;
      } else {
         specs = `Size ${item.product.size} - ${item.product.fabric}`;
      }
        
      message += `${index + 1}. ${name}\n   (${specs})\n   SL: ${item.quantity} x ${formatPrice(item.price)}\n\n`;
    });

    message += `----------------\n`;
    message += `💰 Tổng giá trị: ${formatPrice(totalPrice)}\n`;
    message += `💳 *CẦN CỌC NGAY: ${formatPrice(depositRequired)}*\n`;
    message += `📦 COD còn lại: ${formatPrice(remainingAmount)}\n`;
    message += `----------------\n`;
    message += `Shop gửi mình mã QR để mình chuyển khoản cọc 50k nhé! Mình muốn in sớm.`;
    
    return message;
  };

  // --- XỬ LÝ CHỐT ĐƠN ---
  const handleCheckout = async () => {
    // 1. Kiểm tra đăng nhập
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để chúng tôi liên hệ giao hàng.",
        action: (
          <Button size="sm" variant="outline" onClick={() => router.push("/login")}>
            Đăng nhập ngay
          </Button>
        ),
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Lưu đơn hàng vào Firestore
      // Lưu ý: Có thể mở rộng order-service để lưu thêm field 'depositAmount' nếu cần
      const orderId = await createOrder(user.uid, cart, totalPrice);

      // 3. Copy nội dung tin nhắn
      const message = generateOrderMessage(orderId);
      await navigator.clipboard.writeText(message);
      
      toast({
        title: "Đã tạo đơn hàng! ✅",
        description: "Nội dung đã copy. Đang mở Zalo để gửi cho Shop...",
      });

      // 4. Mở Zalo và chuyển hướng
      setTimeout(() => {
        window.open(SHOP_CONTACT.zalo, '_blank');
        
        clearCart(); // Xóa giỏ hàng sau khi gửi
        router.push("/orders"); // Chuyển sang trang lịch sử đơn
      }, 1500);

    } catch (error) {
      console.error("Checkout Error:", error);
      toast({ 
        title: "Lỗi hệ thống", 
        description: "Không thể tạo đơn hàng. Vui lòng thử lại.", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card className="p-6 sticky top-24 border-2 border-primary/10 bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header trang trí với Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="mb-6 pb-2 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Tổng kết Báo giá
            </h2>
        </div>

        {/* --- PHẦN HIỂN THỊ TIỀN --- */}
        <div className="space-y-4 mb-8">
            {/* Tổng đơn hàng (Hiển thị nhạt hơn) */}
            <div className="flex justify-between items-baseline text-sm text-gray-500">
                <span>Tổng giá trị đơn hàng:</span>
                <span className="font-semibold text-gray-700">{formatPrice(totalPrice)}</span>
            </div>
            
            {/* DÒNG CỌC (Nổi bật nhất) */}
            <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-blue-800">Cọc đảm bảo</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-700">{formatPrice(depositRequired)}</span>
                </div>
                {/* Hiệu ứng nền nhẹ */}
                <div className="absolute -right-4 -bottom-6 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl" />
            </div>

            {/* Dòng COD */}
            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-gray-200 text-sm">
                <span className="text-gray-600">Thanh toán khi nhận (COD):</span>
                <span className="font-bold text-gray-900">{formatPrice(remainingAmount)}</span>
            </div>
        </div>

        {/* --- NÚT HÀNH ĐỘNG --- */}
        <div className="space-y-4">
          <Button 
            onClick={handleCheckout} 
            disabled={isProcessing}
            className="w-full py-6 text-base font-bold bg-gradient-to-r from-primary to-blue-700 hover:from-blue-600 hover:to-primary text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 rounded-xl"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lý...
              </>
            ) : user ? (
              <span className="flex items-center">
                Gửi Zalo & Cọc ngay <ArrowRight className="w-5 h-5 ml-2" />
              </span>
            ) : (
              <span className="flex items-center">
                <LogIn className="w-5 h-5 mr-2" /> Đăng nhập để Báo giá
              </span>
            )}
          </Button>

          {/* Disclaimer */}
          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 leading-relaxed text-center border border-gray-100">
            Bằng việc tiếp tục, bạn đồng ý đặt cọc trước <strong>{formatPrice(depositRequired)}</strong> để ARTEE tiến hành sản xuất.
          </div>
        </div>
        
        {/* Support Link */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-muted-foreground mb-2">Gặp khó khăn khi thanh toán?</p>
            <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold">
                <a href={`tel:${SHOP_CONTACT.phone}`} className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Gọi Hotline: {SHOP_CONTACT.phone}
                </a>
            </Button>
        </div>
      </Card>
    </div>
  )
}