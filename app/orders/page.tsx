// app/orders/page.tsx
"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2, Package, Calendar, Clock, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider" // 1. Import Auth Hook
import { getUserOrders, type FirestoreOrder } from "@/lib/services/order-service" // 2. Import Service vừa tạo

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
}

// Hàm format ngày tháng từ Firestore Timestamp
const formatDate = (timestamp: any) => {
  if (!timestamp) return "Đang cập nhật...";
  // Nếu là Firestore Timestamp object
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString("vi-VN", {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
  // Nếu là Date object hoặc string
  return new Date(timestamp).toLocaleDateString("vi-VN");
}

// Map trạng thái sang tiếng Việt và màu sắc
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending': return { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'processing': return { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'shipped': return { label: 'Đang giao', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'delivered': return { label: 'Hoàn thành', color: 'bg-green-100 text-green-800 border-green-200' };
    case 'cancelled': return { label: 'Đã hủy', color: 'bg-red-100 text-red-800 border-red-200' };
    default: return { label: status, color: 'bg-gray-100 text-gray-800' };
  }
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth(); // Lấy user hiện tại
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Effect tải dữ liệu
  useEffect(() => {
    async function fetchOrders() {
      if (user) {
        try {
          const data = await getUserOrders(user.uid);
          setOrders(data);
        } catch (error) {
          console.error("Failed to load orders", error);
        } finally {
          setIsLoadingData(false);
        }
      } else if (!authLoading) {
        // Nếu không có user và đã load xong auth -> dừng loading data
        setIsLoadingData(false);
      }
    }

    fetchOrders();
  }, [user, authLoading]);

  // UI: Đang kiểm tra đăng nhập
  if (authLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  // UI: Chưa đăng nhập
  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Bạn chưa đăng nhập</h1>
          <p className="text-muted-foreground mb-8">Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.</p>
          <Link href="/login">
            <Button size="lg" className="px-8">Đăng nhập ngay</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 mt-4">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử Đơn hàng</h1>
        </div>

        {/* UI: Đang tải dữ liệu từ Firestore */}
        {isLoadingData ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-40 bg-white rounded-xl animate-pulse" />
             ))}
          </div>
        ) : orders.length === 0 ? (
          // UI: Không có đơn hàng nào
          <Card className="py-16 text-center bg-white border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Bạn chưa thực hiện đơn hàng nào. Hãy khám phá bộ sưu tập và tạo ra chiếc áo độc đáo cho riêng mình nhé.
            </p>
            <Link href="/">
              <Button>Bắt đầu mua sắm</Button>
            </Link>
          </Card>
        ) : (
          // UI: Danh sách đơn hàng
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              
              return (
                <Card key={order.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  {/* Header Card */}
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 font-mono">
                        <span className="text-gray-400">#</span>
                        {order.id?.slice(0, 8).toUpperCase()}
                      </div>
                    </div>
                    
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Body Card */}
                  <div className="p-4 md:p-6 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex gap-4 py-2 first:pt-0">
                        {/* Ảnh sản phẩm nhỏ */}
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 border overflow-hidden">
                           {item.type === 'custom' && item.previewImage ? (
                              <img src={item.previewImage} className="w-full h-full object-contain" alt="Custom" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                           )}
                        </div>

                        {/* Thông tin item */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {(item.product.productName || (item.type === 'custom' ? `Áo ${item.product.type} tự thiết kế` : 'Sản phẩm'))}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {item.type === 'custom' 
                              ? `Size: ${item.product.size} • Màu: ${item.product.color}`
                              : `Size: ${item.product.size} • Vải: ${item.product.fabric}`
                            }
                          </p>
                          <div className="flex justify-between items-center mt-2">
                             <span className="text-sm text-gray-500">x{item.quantity}</span>
                             <span className="text-sm font-medium">{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Card: Tổng tiền */}
                  <div className="p-4 bg-gray-50 flex justify-end items-center gap-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Thành tiền:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  )
}