// app/cart/page.tsx
"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { PRODUCT_NAMES } from "@/lib/constants"
import OrderSummary from "@/components/order-summary" 

const PRODUCT_PRICE = 299000 // VND

export default function CartPage() {
  const { cart = [], isLoading, removeFromCart, updateQuantity, getTotalPrice } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Đang tải...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="flex items-center gap-1 text-primary hover:underline text-sm md:text-base">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
          <span className="text-muted-foreground text-sm md:text-base">/</span>
          <span className="text-foreground font-medium text-sm md:text-base">Giỏ hàng</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Giỏ hàng của bạn</h1>

        {!cart || cart.length === 0 ? (
          <Card className="p-8 md:p-12 text-center">
            <p className="text-base md:text-lg text-muted-foreground mb-4">Giỏ hàng của bạn trống</p>
            <Link href="/customizer">
              <Button className="gap-2">Bắt đầu thiết kế</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-4 md:p-6 border border-border">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Preview */}
                    <div
                      className="w-full sm:w-24 h-24 rounded-lg flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: item.product.color }}
                    >
                      {item.design && item.design.length > 0 ? item.design[0].content?.substring(0, 1) : "A"}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm md:text-base">
                        {item.product.type ? PRODUCT_NAMES[item.product.type] || item.product.type : "Unknown"}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Kích cỡ: {item.product.size} | Thiết kế: {item.design?.length || 0} phần tử
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">Giá: {formatPrice(PRODUCT_PRICE)}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive self-start md:self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
             <OrderSummary
              primaryActionText="Thanh toán"
              primaryActionHref="/checkout"
              secondaryActionText="Tiếp tục thiết kế"
              secondaryActionHref="/customizer"
            />
          </div>
        )}
      </div>
    </main>
  )
}
