// components/order-summary.tsx
"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SHOP_CONTACT, PRODUCT_NAMES } from "@/lib/constants"
import { MessageCircle, Phone, Copy, Check, Loader2, LogIn } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { createOrder } from "@/lib/services/order-service"
import { clearCart } from "@/lib/cart"

// Hàm format giá tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

export default function OrderSummary() {
  const { cart, getTotalPrice } = useCart() // Cần thêm hàm clearCart vào hook useCart sau
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  
  const [isCopied, setIsCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Nếu giỏ hàng trống, không hiển thị gì cả
  if (!cart || cart.length === 0) {
    return null;
  }

  // Hàm tạo nội dung tin nhắn đơn hàng
  const generateOrderMessage = (orderId?: string) => {
    let message = `👋 Chào ${SHOP_CONTACT.shopName}, mình muốn đặt đơn hàng${orderId ? ` #${orderId.slice(0,6).toUpperCase()}` : ''}:\n\n`;
    
    cart.forEach((item, index) => {
      let name = "Sản phẩm";
      let details = "";

      if (item.type === 'custom') {
        const typeName = item.product.type ? PRODUCT_NAMES[item.product.type] : 'Áo';
        name = `${typeName} Tự thiết kế`;
        details = `(Size: ${item.product.size} - Màu: ${item.product.color})`;
      } else {
        name = item.product.productName || "Sản phẩm BST";
        details = `(Size: ${item.product.size} - Vải: ${item.product.fabric})`;
      }
        
      message += `${index + 1}. ${name}\n   ${details}\n   SL: ${item.quantity} x ${formatPrice(item.price)}\n\n`;
    });

    message += `💰 Tổng tạm tính: ${formatPrice(getTotalPrice())}`;
    message += `\n\nShop kiểm tra và báo giá phí vận chuyển giúp mình nhé!`;
    
    return message;
  };

  // Hàm xử lý chính: Lưu đơn -> Copy -> Mở Zalo
  const handleCheckout = async () => {
    // 1. Kiểm tra đăng nhập
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để chúng tôi lưu đơn hàng của bạn.",
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
      const totalAmount = getTotalPrice();
      // Gọi service tạo đơn hàng
      const orderId = await createOrder(user.uid, cart, totalAmount);

      // 3. Tạo nội dung tin nhắn (kèm mã đơn hàng vừa tạo)
      const message = generateOrderMessage(orderId);
      
      // Copy vào clipboard
      await navigator.clipboard.writeText(message);
      
      toast({
        title: "Đơn hàng đã được lưu! ✅",
        description: "Nội dung đã được sao chép. Đang mở Zalo để gửi cho Shop...",
      });

      // 4. Mở Zalo và Chuyển hướng
      setTimeout(() => {
        // Mở Zalo trong tab mới
        window.open(SHOP_CONTACT.zalo, '_blank');
        
        clearCart();
        router.push("/orders"); 
      }, 1500);

    } catch (error) {
      console.error(error);
      toast({ 
        title: "Lỗi hệ thống", 
        description: "Không thể tạo đơn hàng. Vui lòng thử lại.", 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Hàm phụ: Chỉ copy (dành cho người không dùng Zalo)
  const handleCopyOnly = () => {
    const message = generateOrderMessage();
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    toast({ title: "Đã sao chép", description: "Bạn có thể gửi qua Messenger hoặc Email." });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="lg:col-span-1">
      <Card className="p-6 sticky top-24 border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 shadow-xl">
        <div className="mb-6 pb-4 border-b border-border/50">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Tổng đơn hàng dự kiến</h2>
        </div>

        <div className="flex justify-between items-baseline mb-2">
          <span className="text-muted-foreground font-medium">Tạm tính:</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-6 italic">
          *Chưa bao gồm phí vận chuyển.
        </p>

        <div className="space-y-3">
          {/* Nút chính: Checkout */}
          <Button 
            onClick={handleCheckout} 
            disabled={isProcessing}
            className="w-full py-6 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-600/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lý...
              </>
            ) : user ? (
              <>
                <MessageCircle className="w-5 h-5 mr-2" /> Gửi đơn qua Zalo
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" /> Đăng nhập để gửi đơn
              </>
            )}
          </Button>

          {/* Nút phụ: Copy */}
          <Button 
            onClick={handleCopyOnly} 
            variant="outline" 
            className="w-full border-dashed border-2"
          >
            {isCopied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
            {isCopied ? "Đã sao chép" : "Sao chép nội dung"}
          </Button>
          
          <div className="pt-4 mt-4 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-2">Cần hỗ trợ gấp?</p>
            <Button asChild variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                <a href={`tel:${SHOP_CONTACT.phone}`} className="flex items-center gap-2 font-semibold text-lg">
                  <Phone className="w-5 h-5" />
                  {SHOP_CONTACT.phone}
                </a>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}