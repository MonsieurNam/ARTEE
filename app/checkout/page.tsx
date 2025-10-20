// app/checkout/page.tsx
"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { PRODUCT_NAMES } from "@/lib/constants"
import ComingSoonTooltip from "@/components/coming-soon-tooltip" 

export default function CheckoutPage() {
  const [step, setStep] = useState<"info" | "payment" | "success">("info")
  const { cart, checkout, getTotalPrice } = useCart()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault()
    // Đơn giản hóa việc kiểm tra form
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng điền đầy đủ tất cả các trường.",
          variant: "destructive",
        })
        return
      }
    }
    setStep("payment")
  }

  const handlePayment = () => {
    // Giả lập xử lý thanh toán...
    toast({
      title: "Thành công",
      description: "Đơn hàng của bạn đã được xác nhận.",
    })
    
    // Logic mới: Chuyển giỏ hàng thành đơn hàng trong lịch sử
    checkout();

    setStep("success")
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  if (step === "success") {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground mb-6">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
            <div className="space-y-2 mb-8 text-left bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
              <p className="text-sm">
                <span className="font-medium">Tên:</span> {formData.fullName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {formData.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Điện thoại:</span> {formData.phone}
              </p>
              <p className="text-sm">
                <span className="font-medium">Địa chỉ:</span> {`${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`}
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                    <Link href="/orders">Xem lịch sử đơn hàng</Link>
                </Button>
                <Button asChild>
                    <Link href="/">Quay về trang chủ</Link>
                </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/cart" className="flex items-center gap-1 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Quay lại giỏ hàng
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Thanh toán</h1>

        <div className="flex gap-4 mb-8">
          <div
            className={`flex-1 p-4 rounded-lg border-2 text-center font-medium transition-colors ${
              step === "info" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            1. Thông tin giao hàng
          </div>
          <div
            className={`flex-1 p-4 rounded-lg border-2 text-center font-medium transition-colors ${
              step === "payment" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            } ${step === 'info' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => step !== "info" && setStep("payment")}
          >
            2. Thanh toán
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "info" && (
              <Card className="p-6 border border-border">
                <form onSubmit={handleSubmitInfo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        placeholder="0123456789"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Tỉnh/Thành phố</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background" placeholder="Tỉnh/Thành phố" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Quận/Huyện</label>
                      <input type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background" placeholder="Quận/Huyện" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phường/Xã</label>
                      <input type="text" name="ward" value={formData.ward} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background" placeholder="Phường/Xã" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                    Tiếp tục thanh toán
                  </Button>
                </form>
              </Card>
            )}

            {step === "payment" && (
              <Card className="p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Chọn phương thức thanh toán</h2>

                <div className="space-y-3 mb-6">
                  <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-primary bg-background border-border focus:ring-primary" />
                    <span className="ml-3 font-medium text-foreground">Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input type="radio" name="payment" className="w-4 h-4 text-primary bg-background border-border focus:ring-primary" />
                    <span className="ml-3 font-medium text-foreground">Chuyển khoản ngân hàng</span>
                  </label>
                </div>
                {/* <Button onClick={handlePayment} className="w-full bg-primary hover:bg-primary/90 text-white">
                  Hoàn tất đơn hàng
                </Button> */}
                <ComingSoonTooltip featureName="Chức năng thanh toán">
                  <Button 
                    disabled // Vô hiệu hóa nút để thay đổi giao diện
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Hoàn tất đơn hàng
                  </Button>
                </ComingSoonTooltip>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Tóm tắt đơn hàng</h2>
              {cart.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground pr-2">
                          {(item.product.productName || (item.product.type && PRODUCT_NAMES[item.product.type]) || "Sản phẩm")} x {item.quantity}
                        </span>
                        <span className="font-medium text-foreground flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tổng sản phẩm:</span>
                      <span className="font-medium text-foreground">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển:</span>
                      <span className="font-medium text-foreground">Miễn phí</span>
                    </div>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="font-semibold text-foreground">Tổng cộng:</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}