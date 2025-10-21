// app/cart/page.tsx
"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ArrowLeft, Shirt } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import OrderSummary from "@/components/order-summary";
import { PRODUCT_NAMES } from "@/lib/constants";

// Hàm format giá tiền
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
};

export default function CartPage() {
  const { cart, isLoading, removeFromCart, updateQuantity } = useCart();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">Đang tải giỏ hàng...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb & Title */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="flex items-center gap-1 text-primary hover:underline text-sm md:text-base">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
          <span className="text-muted-foreground text-sm md:text-base">/</span>
          <span className="text-foreground font-medium text-sm md:text-base">Giỏ hàng</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Giỏ hàng của bạn</h1>

        {!cart || cart.length === 0 ? (
          <Card className="p-8 md:p-12 text-center">
            <p className="text-base md:text-lg text-muted-foreground mb-4">Giỏ hàng của bạn đang trống</p>
            <Link href="/customizer">
              <Button className="gap-2">Bắt đầu thiết kế</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-4 md:p-6 border border-border">
                  <div className="flex flex-col sm:flex-row gap-4">
                    
                    {/* Product Preview Image */}
                    <div className="w-full sm:w-28 h-28 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 border p-1">
                      {item.type === 'custom' && item.previewImage ? (
                        <img 
                            src={item.previewImage} 
                            alt="Thiết kế tùy chỉnh" 
                            className="w-full h-full object-contain rounded-md" 
                        />
                      ) : (
                        // Placeholder cho sản phẩm có sẵn hoặc khi không có ảnh preview
                        <div 
                            className="w-full h-full rounded-md flex items-center justify-center" 
                            style={{ backgroundColor: item.product.color || '#f0f0f0' }}
                        >
                            <Shirt className="w-10 h-10 text-gray-400"/>
                        </div>
                      )}
                    </div>

                    {/* Product Details & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight">
                          {item.type === 'custom'
                            ? `Áo ${PRODUCT_NAMES[item.product.type || 'tee'] || 'tự'} thiết kế`
                            : item.product.productName || 'Sản phẩm có sẵn'}
                        </h3>

                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                          {item.type === 'custom'
                            ? `Kích cỡ: ${item.product.size}`
                            : `Vải: ${item.product.fabric} | Kích cỡ: ${item.product.size}`}
                        </p>
                        
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                          Đơn giá: {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                           <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                              aria-label="Giảm số lượng"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium text-sm" aria-live="polite">
                                {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                              aria-label="Tăng số lượng"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                        </div>

                         {/* Remove Button */}
                         <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Order Summary */}
            <OrderSummary
              primaryActionText="Tiến hành thanh toán"
              primaryActionHref="/checkout"
              secondaryActionText="Thiết kế thêm"
              secondaryActionHref="/customizer"
            />
          </div>
        )}
      </div>
    </main>
  );
}