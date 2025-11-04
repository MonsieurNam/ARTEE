// components/product-details.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ShoppingCart,
  Zap,
  Camera,
  Ruler,
  Star,
  Shield,
  Truck,
  HeadphonesIcon,
  X,
  Sparkles,
  RefreshCw
} from "lucide-react"
import type { Product } from "@/lib/content"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import ARModal from "@/components/ar-modal"
import { useCart } from "@/hooks/use-cart"
import SizeChartModal from "./size-chart-modal"
import VirtualTryOnModal from "./virtual-try-on-modal"

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedFabric, setSelectedFabric] = useState(product.fabrics[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isARModalOpen, setIsARModalOpen] = useState(false)
  const [isVtoModalOpen, setIsVtoModalOpen] = useState(false)
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const [mainImage, setMainImage] = useState(
    product.galleryImages[0]?.url || product.image,
  )
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [currentPose, setCurrentPose] = useState(
    product.galleryImages[0]?.pose || "front",
  )

  const { addToCart } = useCart()
  const fabricPrice = selectedFabric?.price || 0
  const sizePrice = selectedSize?.price || 0
  const unitPrice = product.price + fabricPrice + sizePrice

  const handleAddToCart = () => {
    try {
      addToCart({
        type: "predesigned" as const,
        product: {
          productId: product.id,
          productName: product.name,
          fabric: selectedFabric.name,
          size: selectedSize.name,
        },
        quantity: quantity,
        price: unitPrice,
      })
      toast({
        title: "Thành công",
        description: `${product.name} đã được thêm vào giỏ hàng`,
      })
      router.push("/cart")
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm vào giỏ hàng",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* --- CẤU TRÚC GRID CHÍNH (VẪN 2 CỘT) --- */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* === CỘT 1: HÌNH ẢNH VÀ NỘI DUNG (SCROLLABLE) === */}
        <div className="space-y-8">
          {/* --- Image Gallery Section --- */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />
              <div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 aspect-square shadow-2xl border border-neutral-200/50 cursor-zoom-in transition-transform duration-500 hover:scale-[1.02]"
                onClick={() => setIsImageZoomed(true)}
              >
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* AR Ready Badge */}
                {product.isARReady && (
                  <div
                    className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border-primary/20 cursor-pointer"
                    onClick={(e) => {e.stopPropagation(); setIsARModalOpen(true)}}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                        Hướng dẫn xem AR
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.galleryImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    setMainImage(img.url)
                    setCurrentPose(img.pose)
                  }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
                    mainImage === img.url
                      ? "border-primary shadow-lg shadow-primary/20 scale-105"
                      : "border-neutral-200 hover:border-primary/50 hover:scale-105"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* --- Header & Description --- */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    (4.9/5 từ 127 đánh giá)
                  </span>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* --- Design Story Card --- */}
          <Card className="p-6 bg-gradient-to-br from-secondary/30 to-secondary/10 border-primary/10 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-1 h-12 bg-gradient-to-b from-primary to-primary/30 rounded-full" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-lg">Câu chuyện thiết kế</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.story}
                </p>
              </div>
            </div>
          </Card>

          {/* --- Luxury Features --- */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-neutral-200">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-green-50 to-transparent">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Miễn phí vận chuyển
                </p>
                <p className="text-xs text-muted-foreground">
                  Đơn hàng trên 500K
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-transparent">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Đảm bảo chất lượng
                </p>
                <p className="text-xs text-muted-foreground">100% chính hãng</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-transparent">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <HeadphonesIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Hỗ trợ 24/7
                </p>
                <p className="text-xs text-muted-foreground">Luôn sẵn sàng</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-transparent">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Đánh giá cao
                </p>
                <p className="text-xs text-muted-foreground">4.9/5 sao</p>
              </div>
            </div>
          </div>
        </div>
        {/* === KẾT THÚC CỘT 1 === */}


        {/* === CỘT 2: BẢNG ĐIỀU KHIỂN (STICKY) === */}
        {/* Thêm 'lg:sticky top-24' (24 là 6rem, cho khoảng cách với header) */}
        <div className="space-y-8 lg:sticky top-24 h-fit">
          
          {/* --- Fabric Selection --- */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-foreground uppercase tracking-wide">
              Chọn loại vải
            </label>
            <div className="grid grid-cols-1 gap-3">
              {product.fabrics.map((fabric) => (
                <button
                  key={fabric.id}
                  onClick={() => setSelectedFabric(fabric)}
                  className={`group p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                    selectedFabric.id === fabric.id
                      ? "border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg shadow-primary/10"
                      : "border-neutral-200 hover:border-primary/50 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full transition-all ${
                          selectedFabric.id === fabric.id
                            ? "bg-primary scale-110"
                            : "bg-neutral-300 group-hover:bg-primary/50"
                        }`}
                      />
                      <span className="font-semibold text-foreground">
                        {fabric.name}
                      </span>
                    </div>
                    {fabric.price > 0 && (
                      <span className="text-sm font-medium text-primary">
                        +
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(fabric.price)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* --- Size Selection --- */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-foreground uppercase tracking-wide">
                Chọn kích cỡ
              </label>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 h-auto gap-2 font-medium"
                onClick={() => setIsSizeChartOpen(true)}
              >
                <Ruler className="w-4 h-4" />
                Bảng kích cỡ
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 font-bold text-lg hover:shadow-lg ${
                    selectedSize.id === size.id
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                      : "border-neutral-200 hover:border-primary/50 text-foreground bg-white"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* --- Quantity Selector --- */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-foreground uppercase tracking-wide">
              Số lượng
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 border-2 border-neutral-200 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-bold text-lg"
              >
                −
              </button>
              <span className="w-16 text-center font-bold text-2xl text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 border-2 border-neutral-200 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* --- Price Summary --- */}
          <Card className="p-6 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200 shadow-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                Giá cơ bản
              </span>
              <span className="text-foreground font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </span>
            </div>
            {fabricPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Vải nâng cấp
                </span>
                <span className="text-primary font-semibold">
                  +
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(fabricPrice)}
                </span>
              </div>
            )}
            {sizePrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Kích cỡ lớn
                </span>
                <span className="text-primary font-semibold">
                  +
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(sizePrice)}
                </span>
              </div>
            )}
            <div className="border-t-2 border-neutral-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-foreground text-lg">
                Tổng cộng
              </span>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(unitPrice * quantity)}
              </span>
            </div>
          </Card>

          {/* --- Add to Cart Button --- */}
          <Button
            onClick={handleAddToCart}
            className="w-full gap-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white py-7 text-lg font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] rounded-xl"
          >
            <ShoppingCart className="w-6 h-6" />
            Thêm vào giỏ hàng
          </Button>

          {/* --- VTO Button --- */}
          <Button
            onClick={() => setIsVtoModalOpen(true)}
            variant="secondary"
            className="w-full gap-3 py-7 text-lg font-bold transition-all duration-300 hover:scale-[1.02] rounded-xl"
          >
            <Zap className="w-6 h-6 text-primary" />
            Thử đồ ảo (VTO)
          </Button>

        </div>
        {/* === KẾT THÚC CỘT 2 === */}

      </div>

      {/* --- CÁC MODAL (KHÔNG THAY ĐỔI) --- */}
      <ImageZoomModal
        isOpen={isImageZoomed}
        onClose={() => setIsImageZoomed(false)}
        imageUrl={mainImage}
        productId={product.id}
      />

      <VirtualTryOnModal
        isOpen={isVtoModalOpen}
        onClose={() => setIsVtoModalOpen(false)}
        shirtImageUrl={mainImage}
        productPose={currentPose}
      />

      <ARModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        productName={product.name}
      />

      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
      />
    </>
  )
}

/// Component ImageZoomModal (Đã cập nhật theo yêu cầu nền)
interface ImageZoomModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  productId: number; // <-- Đã thêm
}

function ImageZoomModal({ isOpen, onClose, imageUrl, productId }: ImageZoomModalProps) {

  // --- LOGIC MỚI ---
  // ID 2 = Nạp Cảm Hứng , ID 4 = Hồi ức đáng nhớ 
  const isLightBg = (productId === 2 || productId === 4);
  
  const overlayClass = isLightBg 
    ? "bg-white" // Nền trắng
    : "bg-black/80 backdrop-blur-sm"; // Nền đen (mặc định)
    
  // Đổi màu chữ của nút control (Zoom +/-)
  const controlButtonClass = isLightBg
    ? "text-black hover:bg-black/20" // Chữ đen
    : "text-white hover:bg-white/20"; // Chữ trắng (mặc định)
    
  // Đổi màu nút Đóng (X)
  const closeButtonClass = isLightBg
    ? "bg-black/30 text-white/80" // Nền đen, Chữ X trắng
    : "bg-white/30 text-white/80"; // Nền trắng, Chữ X trắng (mặc định)
  // --- KẾT THÚC LOGIC MỚI ---

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* SỬ DỤNG CLASS MỚI 1 */}
      <DialogOverlay className={overlayClass} />
      
      <DialogContent className="fixed inset-0 w-full h-full max-w-none p-0 bg-transparent border-0 shadow-none left-0 top-0 translate-x-0 translate-y-0">
        <DialogTitle className="sr-only">Phóng to ảnh sản phẩm</DialogTitle>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          wheel={{ step: 0.2 }}
          pinch={{ disabled: false }}
          panning={{ disabled: false }}
          limitToBounds={true}
          doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              {/* Thanh control (Nền của thanh này vẫn là đen/mờ) */}
              <div className="absolute top-4 left-177 z-10 flex gap-2 p-2 rounded-full bg-black/50 backdrop-blur-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => zoomIn()}
                  // SỬ DỤNG CLASS MỚI 2
                  className={controlButtonClass}
                >
                  <span className="sr-only">Zoom In</span>+
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => zoomOut()}
                  // SỬ DỤNG CLASS MỚI 2
                  className={controlButtonClass}
                >
                  <span className="sr-only">Zoom Out</span>-
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => resetTransform()}
                  // SỬ DỤNG CLASS MỚI 2
                  className={controlButtonClass}
                >
                  <span className="sr-only">Reset Zoom</span>
                  <RefreshCw className="rotate-0" />
                </Button>
              </div>

              {/* "Canvas" (TransformComponent) */}
              <TransformComponent
                 wrapperStyle={{
                  width: "100vw",
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                contentStyle={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Ảnh */}
                <img
                  src={imageUrl}
                  alt="Product Zoom"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg cursor-grab"
                  style={{ userSelect: "none" }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {/* Nút đóng */}
        {/* SỬ DỤNG CLASS MỚI 3 */}
        <DialogClose className={`absolute top-4 right-4 rounded-full p-2 opacity-80 hover:opacity-100 transition-all backdrop-blur-md z-20 ${closeButtonClass}`}>
          <X className="w-5 h-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}