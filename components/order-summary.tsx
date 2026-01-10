// components/order-summary.tsx
"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SHOP_CONTACT, PRODUCT_NAMES } from "@/lib/constants"
import { MessageCircle, Phone, Copy, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Hàm format giá tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

export default function OrderSummary() {
  const { cart, getTotalPrice } = useCart()
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)

  // Nếu giỏ hàng trống, không hiển thị gì cả
  if (!cart || cart.length === 0) {
    return null;
  }

  // Hàm tạo nội dung tin nhắn đơn hàng
  const generateOrderMessage = () => {
    let message = `👋 Chào ${SHOP_CONTACT.shopName}, mình muốn nhận tư vấn và đặt các sản phẩm sau:\n\n`;
    
    cart.forEach((item, index) => {
      // Xác định tên sản phẩm
      let name = "Sản phẩm";
      let details = "";

      if (item.type === 'custom') {
        // Sản phẩm tự thiết kế
        const typeName = item.product.type ? PRODUCT_NAMES[item.product.type] : 'Áo';
        name = `${typeName} Tự thiết kế`;
        details = `(Size: ${item.product.size} - Màu: ${item.product.color})`;
      } else {
        // Sản phẩm có sẵn
        name = item.product.productName || "Sản phẩm BST";
        details = `(Size: ${item.product.size} - Vải: ${item.product.fabric})`;
      }
        
      message += `${index + 1}. ${name}\n   ${details}\n   SL: ${item.quantity} x ${formatPrice(item.price)}\n\n`;
    });

    message += `💰 Tổng tạm tính: ${formatPrice(getTotalPrice())}`;
    message += `\n\nShop kiểm tra và báo giá phí vận chuyển giúp mình nhé!`;
    
    return message;
  };

  const handleZaloChat = () => {
    // Copy nội dung vào clipboard trước vì Zalo Web đôi khi không nhận text dài qua URL
    const message = generateOrderMessage();
    navigator.clipboard.writeText(message);
    
    toast({
      title: "Đã sao chép nội dung đơn hàng",
      description: "Đang mở Zalo... Bạn hãy dán (Paste) nội dung vào khung chat nhé!",
    })

    // Mở tab mới tới Zalo
    setTimeout(() => {
        window.open(SHOP_CONTACT.zalo, '_blank');
    }, 1000);
  };

  const handleCopyOrder = () => {
    const message = generateOrderMessage();
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    toast({
      title: "Thành công",
      description: "Đã sao chép thông tin đơn hàng. Bạn có thể gửi qua Messenger hoặc Email.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="lg:col-span-1">
      <Card className="p-6 sticky top-24 border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 shadow-xl">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-border/50">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Tổng đơn hàng dự kiến</h2>
        </div>

        {/* Total */}
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-muted-foreground font-medium">Tạm tính:</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-6 italic">
          *Chưa bao gồm phí vận chuyển (sẽ được thông báo khi chốt đơn).
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Nút chính: Zalo */}
          <Button 
            onClick={handleZaloChat} 
            className="w-full py-6 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-600/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Gửi đơn qua Zalo
          </Button>

          {/* Nút phụ: Copy */}
          <Button 
            onClick={handleCopyOrder} 
            variant="outline" 
            className="w-full border-dashed border-2"
          >
            {isCopied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
            {isCopied ? "Đã sao chép" : "Sao chép nội dung đơn"}
          </Button>
          
          {/* Hotline */}
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