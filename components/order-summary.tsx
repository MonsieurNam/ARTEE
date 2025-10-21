// components/order-summary.tsx
"use client"

import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PRODUCT_NAMES } from "@/lib/constants"

// Định nghĩa props cho component, cho phép truyền các nút bấm tùy chỉnh
interface OrderSummaryProps {
  primaryActionText: string;
  primaryActionHref: string;
  secondaryActionText: string;
  secondaryActionHref: string;
}

// Hàm format giá tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

export default function OrderSummary({ primaryActionText, primaryActionHref, secondaryActionText, secondaryActionHref }: OrderSummaryProps) {
  const { cart, getTotalPrice } = useCart()

  // Nếu giỏ hàng trống, không hiển thị gì cả
  if (!cart || cart.length === 0) {
    return null;
  }
  
  return (
    <div className="lg:col-span-1">
      <Card className="p-8 sticky top-24 border-2 border-border/50 shadow-xl bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-border">
        {/* Header with elegant styling */}
        <div className="mb-6 pb-4 border-b-2 border-border/30">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Tóm tắt đơn hàng</h2>
          <div className="h-0.5 w-16 bg-primary mt-2 rounded-full"></div>
        </div>

        {/* Cart items with smooth scroll and hover effects */}
        <div className="space-y-4 mb-8 pb-6 border-b border-border/50 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {cart.map((item, index) => (
            <div 
              key={item.id} 
              className="flex justify-between items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-muted/30 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed flex-1">
                {/* Sử dụng productName cho sản phẩm pre-designed, và type cho sản phẩm custom */}
                <span className="font-medium text-foreground">{item.quantity}</span> × {(item.product.productName || (item.product.type ? PRODUCT_NAMES[item.product.type] : "Sản phẩm"))}
              </span>
              <span className="font-semibold text-foreground flex-shrink-0 tabular-nums">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary details with refined spacing */}
        <div className="space-y-4 mb-8 pb-6 border-b border-border/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Tổng sản phẩm</span>
            <span className="font-semibold text-foreground tabular-nums">
              {cart.reduce((total, item) => total + item.quantity, 0)} món
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Phí vận chuyển</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Miễn phí</span>
          </div>
        </div>

        {/* Total with prominent styling */}
        <div className="flex justify-between items-baseline mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <span className="font-bold text-foreground text-base tracking-wide">Tổng cộng</span>
          <span className="text-2xl md:text-3xl font-bold text-primary tabular-nums">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        {/* Action buttons with premium styling */}
        <div className="space-y-3">
          <Link href={primaryActionHref} className="block group">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white text-base font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <span className="group-hover:tracking-wide transition-all duration-300">{primaryActionText}</span>
            </Button>
          </Link>
          <Link href={secondaryActionHref} className="block group">
            <Button variant="outline" className="w-full bg-transparent border-2 text-base font-medium py-6 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]">
              {secondaryActionText}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}