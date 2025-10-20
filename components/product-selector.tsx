// components/product-selector.tsx
"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const PRODUCT_TYPES = [
  { id: "tee", name: "T-Shirt", icon: "👕" },
  { id: "hoodie", name: "Hoodie", icon: "🧥" },
  { id: "polo", name: "Polo", icon: "👔" },
  { id: "sweatshirt", name: "Sweatshirt", icon: "🧢" },
]

const COLORS = [
  { id: "black", name: "Đen", hex: "#000000" },
  { id: "white", name: "Trắng", hex: "#FFFFFF" },
  { id: "navy", name: "Navy", hex: "#001F3F" },
  { id: "gray", name: "Xám", hex: "#808080" },
  { id: "red", name: "Đỏ", hex: "#FF4136" },
  { id: "blue", name: "Xanh dương", hex: "#0074D9" },
  { id: "green", name: "Xanh lá", hex: "#2ECC40" },
  { id: "yellow", name: "Vàng", hex: "#FFDC00" },
]

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

interface ProductSelectorProps {
  selectedProduct: {
    type: string
    color: string
    size: string
  }
  onProductChange: (product: any) => void
}

export default function ProductSelector({ selectedProduct, onProductChange }: ProductSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Product Type */}
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Loại áo</h3>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT_TYPES.map((type) => (
            <Button
              key={type.id}
              variant={selectedProduct.type === type.id ? "default" : "outline"}
              className="justify-start gap-2"
              onClick={() => onProductChange({ ...selectedProduct, type: type.id })}
            >
              <span>{type.icon}</span>
              <span className="text-sm">{type.name}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Color Selection */}
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Màu sắc</h3>
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => onProductChange({ ...selectedProduct, color: color.hex })}
              className={`w-full aspect-square rounded-lg border-2 transition-all ${
                selectedProduct.color === color.hex
                  ? "border-primary scale-105"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </Card>

      {/* Size Selection */}
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Kích cỡ</h3>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <Button
              key={size}
              variant={selectedProduct.size === size ? "default" : "outline"}
              onClick={() => onProductChange({ ...selectedProduct, size })}
            >
              {size}
            </Button>
          ))}
        </div>
      </Card>

      {/* Product Info */}
      <Card className="p-4 bg-secondary/50">
        <h3 className="font-semibold text-foreground mb-2">Thông tin sản phẩm</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Loại: {PRODUCT_TYPES.find((t) => t.id === selectedProduct.type)?.name}</p>
          <p>Kích cỡ: {selectedProduct.size}</p>
          <p>Giá: 299.000 VND</p>
        </div>
      </Card>
    </div>
  )
}
