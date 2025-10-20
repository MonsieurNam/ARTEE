// components/ar-modal.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Download, Copy, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ARModalProps {
  isOpen: boolean
  onClose: () => void
  productName?: string
}

export default function ARModal({ isOpen, onClose, productName = "ARTEE Design" }: ARModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && !qrCode) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://artivive.com/app`
      setQrCode(qrUrl)
    }
  }, [isOpen, qrCode])

  const downloadMarker = () => {
    // Create a canvas with the product image as marker
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Draw a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 800, 800)
      gradient.addColorStop(0, "#f5f5f5")
      gradient.addColorStop(1, "#e0e0e0")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 800, 800)

      // Draw border
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 4
      ctx.strokeRect(20, 20, 760, 760)

      // Draw text
      ctx.fillStyle = "#333"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("ARTEE", 400, 200)
      ctx.fillText("Marker Image", 400, 280)

      ctx.font = "24px Arial"
      ctx.fillStyle = "#666"
      ctx.fillText("Scan with Artivive App", 400, 350)
      ctx.fillText("to see the design come to life", 400, 400)

      // Add QR code instruction
      ctx.font = "20px Arial"
      ctx.fillStyle = "#999"
      ctx.fillText("Use the QR code to download Artivive", 400, 700)
    }

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `artee-marker-${productName}-${Date.now()}.png`
    link.click()

    toast({
      title: "Thành công",
      description: "Marker đã được tải xuống",
    })
  }

  const copyArtiviveLink = () => {
    navigator.clipboard.writeText("https://artivive.com/app")
    toast({
      title: "Thành công",
      description: "Link Artivive đã được sao chép",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Xem Hiệu ứng AR</h2>
            <p className="text-sm text-muted-foreground mt-1">Sử dụng Artivive để xem thiết kế sống động</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* What is AR Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Phép Màu - Công nghệ AR</h3>
            <p className="text-sm text-blue-800 mb-3">
              Công nghệ Augmented Reality (AR) của Artivive sẽ làm sống dậy thiết kế của bạn. Khi bạn soi camera vào
              hình ảnh marker, thiết kế sẽ hiện lên với hiệu ứng 3D tuyệt đẹp.
            </p>
            <p className="text-sm text-blue-800">
              Đây là cách hoàn hảo để trải nghiệm nghệ thuật và câu chuyện đằng sau mỗi thiết kế ARTEE.
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-3">Hướng dẫn từng bước:</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li className="font-medium text-foreground">
                Tải ứng dụng Artivive
                <p className="text-xs text-muted-foreground ml-6 mt-1">Có sẵn trên App Store và Google Play</p>
              </li>
              <li className="font-medium text-foreground mt-3">
                Quét mã QR bên dưới
                <p className="text-xs text-muted-foreground ml-6 mt-1">Hoặc truy cập: artivive.com/app</p>
              </li>
              <li className="font-medium text-foreground mt-3">
                Tải hình ảnh Marker
                <p className="text-xs text-muted-foreground ml-6 mt-1">Nhấn nút "Tải Marker" bên dưới</p>
              </li>
              <li className="font-medium text-foreground mt-3">
                Soi camera vào hình ảnh
                <p className="text-xs text-muted-foreground ml-6 mt-1">Xem thiết kế hiện lên với hiệu ứng 3D</p>
              </li>
            </ol>
          </div>

          {/* QR Code Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Mã QR - Tải Artivive</h3>
            </div>
            <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg border border-border">
              {qrCode && (
                <img
                  src={qrCode || "/placeholder.svg"}
                  alt="Artivive QR Code"
                  className="w-56 h-56 border-4 border-primary rounded-lg"
                />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-2">Quét mã QR để tải Artivive</p>
                <p className="text-xs text-muted-foreground">Hoặc sao chép link bên dưới</p>
              </div>
              <Button onClick={copyArtiviveLink} variant="outline" className="gap-2 bg-transparent">
                <Copy className="w-4 h-4" />
                Sao chép link: artivive.com/app
              </Button>
            </div>
          </div>

          {/* Marker Download Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Hình ảnh Marker</h3>
            <p className="text-sm text-muted-foreground">
              Tải hình ảnh marker này để sử dụng với ứng dụng Artivive. Soi camera vào hình ảnh để xem thiết kế 3D.
            </p>
            <Button onClick={downloadMarker} className="w-full gap-2 bg-primary hover:bg-primary/90 text-white py-6">
              <Download className="w-4 h-4" />
              Tải Hình ảnh Marker
            </Button>
          </div>

          {/* Product Info */}
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-2">Thông tin sản phẩm</h3>
            <p className="text-sm text-muted-foreground">{productName}</p>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-white">
            Đóng
          </Button>
        </div>
      </Card>
    </div>
  )
}
