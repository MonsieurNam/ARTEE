// app/orders/page.tsx
"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Card } from "@/components/ui/card"
import { getUserData, type Order } from "@/lib/cart"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("vi-VN")
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setOrders(getUserData().orderHistory)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Lịch sử Đơn hàng</h1>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">Bạn chưa có đơn hàng nào.</p>
            <Link href="/"><Button>Bắt đầu mua sắm</Button></Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.orderId} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-semibold text-foreground">Đơn hàng #{order.orderId.split('-')[1]}</h2>
                    <p className="text-sm text-muted-foreground">Ngày đặt: {formatDate(order.orderDate)}</p>
                  </div>
                  <span className="text-xs font-bold uppercase bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">{order.status}</span>
                </div>
                <div className="space-y-2 border-t border-border pt-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <p className="text-muted-foreground">{(item.product.productName || item.product.type)} x {item.quantity}</p>
                      <p className="font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}