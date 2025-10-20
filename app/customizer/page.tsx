// app/customizer/page.tsx
"use client"

import { useState, useRef } from "react"
import Header from "@/components/header"
import DesignCanvas from "@/components/design-canvas"
import ProductSelector from "@/components/product-selector"
import VirtualTryOnModal from "@/components/virtual-try-on-modal"
import { Button } from "@/components/ui/button"
// Đảm bảo tất cả các icon được sử dụng đều được import
import { ShoppingCart, Download, ArrowLeft, Menu, X, Camera } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { DesignElement } from "@/lib/cart"
import { useIsMobile } from "@/hooks/use-mobile"
import { CUSTOM_PRODUCT_PRICE } from "@/lib/constants"

export default function CustomizerPage() {
  const [selectedProduct, setSelectedProduct] = useState({
    type: "tee",
    color: "#000000",
    size: "M",
  })
  const [designElements, setDesignElements] = useState<DesignElement[]>([])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false)
  const [canvasImageUrl, setCanvasImageUrl] = useState<string | null>(null)
  
  const { addToCart } = useCart()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const designCanvasRef = useRef<HTMLCanvasElement>(null)

  const handleAddToCart = () => {
    if (designElements.length === 0) {
      toast({
        title: "Thiết kế trống",
        description: "Vui lòng thêm ít nhất một phần tử vào thiết kế",
        variant: "destructive",
      })
      return
    }

    addToCart({
      type: "custom",
      product: selectedProduct,
      design: designElements,
      quantity: 1,
      price: CUSTOM_PRODUCT_PRICE,
    })
    
    toast({
      title: "Thành công",
      description: "Sản phẩm đã được thêm vào giỏ hàng",
    })
  }

  const handleDownloadDesign = () => {
    const canvas = designCanvasRef.current
    if (canvas) {
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `design-${Date.now()}.png`
      link.click()
      toast({
        title: "Tải xuống thành công",
        description: "Thiết kế đã được tải xuống",
      })
    }
  }

  const handleOpenVirtualTryOn = () => {
    if (designCanvasRef.current) {
      const imageUrl = designCanvasRef.current.toDataURL("image/png")
      setCanvasImageUrl(imageUrl)
      setIsTryOnModalOpen(true)
    } else {
      toast({ title: "Lỗi", description: "Không thể lấy ảnh thiết kế.", variant: "destructive"})
    }
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
          <span className="text-foreground font-medium text-sm md:text-base">Thiết kế áo</span>
        </div>

        {/* Title */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Thiết kế áo của bạn</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Tạo thiết kế độc đáo với công cụ thiết kế trực tuyến của ARTEE
          </p>
        </div>

        {/* Main Content - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Sidebar - Product & Design Controls */}
          <div className="lg:col-span-1">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden mb-4">
              <Button variant="outline" onClick={() => setShowMobileMenu(!showMobileMenu)} className="w-full gap-2">
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                {showMobileMenu ? "Ẩn" : "Hiện"} Tùy chọn
              </Button>
            </div>

            {/* Product Selector - Show/Hide on Mobile */}
            {(showMobileMenu || !isMobile) && (
              <div className="space-y-6">
                <ProductSelector selectedProduct={selectedProduct} onProductChange={setSelectedProduct} />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-white text-sm md:text-base"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    onClick={handleDownloadDesign}
                    variant="outline"
                    className="w-full gap-2 bg-transparent text-sm md:text-base"
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống thiết kế
                  </Button>
                  <Button
                    onClick={handleOpenVirtualTryOn}
                    variant="outline"
                    className="w-full gap-2 bg-transparent text-sm md:text-base"
                  >
                    <Camera className="w-4 h-4" />
                    Thử đồ ảo
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Center - Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-border shadow-sm p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Thiết kế của bạn</h2>
              <div className="overflow-x-auto">
                <DesignCanvas
                  ref={designCanvasRef}
                  productColor={selectedProduct.color}
                  productType={selectedProduct.type}
                  designElements={designElements}
                  onDesignChange={setDesignElements}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <VirtualTryOnModal
        isOpen={isTryOnModalOpen}
        onClose={() => setIsTryOnModalOpen(false)}
        shirtImageUrl={canvasImageUrl}
      />
    </main>
  )
}