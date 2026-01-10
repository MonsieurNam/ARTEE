// app/cart/page.tsx
"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ArrowLeft, Shirt, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import OrderSummary from "@/components/order-summary";
import { PRODUCT_NAMES } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        <div className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Đang tải danh sách...</p>
            </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb & Title */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="flex items-center gap-1 text-primary hover:underline text-sm md:text-base">
            <ArrowLeft className="w-4 h-4" />
            Tiếp tục xem mẫu
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Danh sách Yêu cầu & Báo giá</h1>
                <p className="text-muted-foreground mt-1">Kiểm tra lại các mẫu bạn muốn ARTEE thực hiện.</p>
            </div>
        </div>

        {/* --- PHẦN MỚI: THÔNG BÁO QUY TRÌNH (ALERT) --- */}
        {cart && cart.length > 0 && (
            <Alert className="mb-8 bg-blue-50 border-blue-200 text-blue-900">
                <ShieldCheck className="h-5 w-5 stroke-blue-600" />
                <AlertTitle className="font-bold text-blue-800 ml-2">Quy trình Pre-order Đảm bảo</AlertTitle>
                <AlertDescription className="ml-2 mt-1 text-blue-700 text-sm leading-relaxed">
                    Sản phẩm tại ARTEE được may đo và tích hợp công nghệ AR riêng biệt. 
                    Bạn chỉ cần <strong>đặt cọc 50.000đ</strong> để xác nhận đơn hàng. 
                    Phần còn lại sẽ thanh toán khi nhận hàng (COD).
                </AlertDescription>
            </Alert>
        )}

        {!cart || cart.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-white/50">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Danh sách trống</h3>
            <p className="text-muted-foreground mb-6">Bạn chưa chọn mẫu nào để báo giá.</p>
            <Link href="/customizer">
              <Button size="lg" className="shadow-lg shadow-primary/20">Bắt đầu thiết kế ngay</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow border-gray-100">
                  <div className="flex gap-4">
                    {/* Ảnh sản phẩm */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-50 border flex-shrink-0 overflow-hidden relative group">
                      {item.type === 'custom' && item.previewImage ? (
                        <img 
                            src={item.previewImage} 
                            alt="Custom Design" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <div 
                            className="w-full h-full flex items-center justify-center transition-colors" 
                            style={{ backgroundColor: item.product.color || '#f0f0f0' }}
                        >
                            <Shirt className="w-10 h-10 text-gray-300"/>
                        </div>
                      )}
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-gray-900 text-base md:text-lg line-clamp-2">
                            {item.type === 'custom'
                                ? `Thiết kế: Áo ${PRODUCT_NAMES[item.product.type || 'tee'] || 'T-shirt'}`
                                : item.product.productName}
                            </h3>
                            <Button 
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id)} 
                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                            <p>Phân loại: <span className="font-medium text-gray-700">{item.type === 'custom' ? 'Tự thiết kế (Custom)' : 'Mẫu có sẵn'}</span></p>
                            <p>
                                Size: <span className="font-medium text-gray-700">{item.product.size}</span> 
                                <span className="mx-2 text-gray-300">|</span> 
                                {item.type === 'custom' ? `Màu: ${item.product.color}` : `Vải: ${item.product.fabric}`}
                            </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Control */}
                        <div className="flex items-center border border-gray-200 rounded-md bg-white shadow-sm">
                           <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-md transition-colors text-gray-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-10 text-center font-semibold text-sm text-gray-900">
                                {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-md transition-colors text-gray-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium">Đơn giá: {formatPrice(item.price)}</p>
                            <p className="font-bold text-primary text-lg">
                                {formatPrice(item.price * item.quantity)}
                            </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Order Summary Component */}
            <OrderSummary />
          </div>
        )}
      </div>
    </main>
  );
}