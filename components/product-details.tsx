// components/product-details.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, Zap, Camera, Ruler } from "lucide-react"
import type { Product } from "@/lib/content"
import { addToCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import ARModal from "@/components/ar-modal"
import { useCart } from "@/hooks/use-cart"
import SizeChartModal from "./size-chart-modal"
import VirtualTryOnModal from "./virtual-try-on-modal"

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedFabric, setSelectedFabric] = useState(product.fabrics[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [isARModalOpen, setIsARModalOpen] = useState(false)
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const [mainImage, setMainImage] = useState(product.galleryImages[0]?.url || product.image)
  const { toast } = useToast()
  const router = useRouter()

  const { addToCart } = useCart()
  const fabricPrice = selectedFabric?.price || 0
  const sizePrice = selectedSize?.price || 0
  const unitPrice = product.price + fabricPrice + sizePrice

  const handleAddToCart = () => {
    try {
      // Tạo đối tượng CartItem hoàn chỉnh
      const itemToAdd = {
        id: "", // Sẽ được tạo trong lib
        timestamp: 0, // Sẽ được tạo trong lib
        type: "predesigned" as const,
        product: {
          productId: product.id,
          productName: product.name,
          fabric: selectedFabric.name,
          size: selectedSize.name,
        },
        quantity: quantity,
        price: unitPrice, // Truyền giá của 1 sản phẩm vào đây
      }

      addToCart({
        type: "predesigned" as const,
        product: {
          productId: product.id,
          productName: product.name,
          fabric: selectedFabric.name,
          size: selectedSize.name,
        },
        design: [], // Sản phẩm có sẵn không có thiết kế tùy chỉnh
        quantity: quantity,
        price: unitPrice,
      })

      toast({
        title: "Thành công",
        description: `${product.name} đã được thêm vào giỏ hàng`,
      })

      // Không cần setTimeout, có thể điều hướng ngay
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
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* --- BẮT ĐẦU NÂNG CẤP IMAGE GALLERY --- */}
        <div className="space-y-4">
          {/* Ảnh chính */}
          <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-square shadow-lg">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
            {product.isARReady && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-neutral-900">
                AR Ready ✨
              </div>
            )}
          </div>
          {/* Danh sách ảnh thumbnail */}
          <div className="grid grid-cols-4 gap-2">
            {product.galleryImages.map((img) => (
              <button
                key={img.id}
                onClick={() => setMainImage(img.url)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  mainImage === img.url ? 'border-primary' : 'border-transparent hover:border-primary/50'
                }`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>
        {/* --- KẾT THÚC NÂNG CẤP IMAGE GALLERY --- */}

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>
          </div>

          <Card className="p-4 bg-secondary/50 border-border">
            <h3 className="font-semibold text-foreground mb-2">Câu chuyện thiết kế</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.story}</p>
        </Card>

        {/* Fabric Selection */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Chọn loại vải</label>
          <div className="grid grid-cols-1 gap-2">
            {product.fabrics.map((fabric) => (
              <button
                key={fabric.id}
                onClick={() => setSelectedFabric(fabric)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedFabric.id === fabric.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{fabric.name}</span>
                  {fabric.price > 0 && (
                    <span className="text-sm text-muted-foreground">
                      +{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(fabric.price)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-foreground">Chọn kích cỡ</label>
              <Button
                variant="link"
                className="text-primary p-0 h-auto gap-1"
                onClick={() => setIsSizeChartOpen(true)}
              >
                <Ruler className="w-4 h-4" />
                Bảng kích cỡ
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-lg border-2 transition-all font-medium ${
                    selectedSize.id === size.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Số lượng</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              -
            </button>
            <span className="w-12 text-center font-semibold text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <Card className="p-4 bg-secondary/50 border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Giá cơ bản</span>
            <span className="text-foreground">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
            </span>
          </div>
          {fabricPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vải nâng cấp</span>
              <span className="text-foreground">
                +{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(fabricPrice)}
              </span>
            </div>
          )}
          {sizePrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Kích cỡ lớn</span>
              <span className="text-foreground">
                +{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(sizePrice)}
              </span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-semibold text-foreground">Tổng cộng</span>
            <span className="text-xl font-bold text-primary">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                unitPrice * quantity // <-- Tính tổng giá dựa trên giá đơn vị và số lượng
              )}
          </span>
          </div>
        </Card>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-white py-6 text-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          Thêm vào giỏ hàng
        </Button>

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t border-border">
          <p>✓ Giao hàng miễn phí cho đơn hàng trên 500.000 VND</p>
          <p>✓ Đảm bảo chất lượng 100%</p>
          <p>✓ Hỗ trợ khách hàng 24/7</p>
        </div>
      </div>

      <VirtualTryOnModal isOpen={isARModalOpen} onClose={() => setIsARModalOpen(false)} shirtImageUrl={mainImage} />
      <ARModal isOpen={isARModalOpen} onClose={() => setIsARModalOpen(false)} productName={product.name} />
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </div>
   </>
  )
}
