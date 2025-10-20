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
      <Card className="p-6 sticky top-24 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tóm tắt đơn hàng</h2>

        <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-xs md:text-sm">
              <span className="text-muted-foreground truncate">
                {/* Sử dụng productName cho sản phẩm pre-designed, và type cho sản phẩm custom */}
                {(item.product.productName || (item.product.type ? PRODUCT_NAMES[item.product.type] : "Sản phẩm")) + " x " + item.quantity}
              </span>
              <span className="font-medium text-foreground flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6 pb-6 border-b border-border">
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Tổng sản phẩm:</span>
            <span className="font-medium text-foreground">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Phí vận chuyển:</span>
            <span className="font-medium text-foreground">Miễn phí</span>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <span className="font-semibold text-foreground text-sm md:text-base">Tổng cộng:</span>
          <span className="text-lg md:text-xl font-bold text-primary">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
        
        {/* Sử dụng props để tạo các nút hành động */}
        <Link href={primaryActionHref} className="block mb-2">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm md:text-base">
            {primaryActionText}
          </Button>
        </Link>
        <Link href={secondaryActionHref} className="block">
          <Button variant="outline" className="w-full bg-transparent text-sm md:text-base">
            {secondaryActionText}
          </Button>
        </Link>
      </Card>
    </div>
  )
}