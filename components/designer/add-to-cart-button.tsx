// components/designer/add-to-cart-button.tsx
"use client";

import { useDesignStore } from "@/store/design-store";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CUSTOM_PRODUCT_PRICE } from "@/lib/constants";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  selectedProduct: {
    type: string;
    color: string;
    size: string;
  };
}

export default function AddToCartButton({ selectedProduct }: AddToCartButtonProps) {
  const { canvas, layers } = useDesignStore();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!canvas || layers.length === 0) {
      toast({
        title: "Thiết kế trống",
        description: "Vui lòng thêm ít nhất một chi tiết vào thiết kế của bạn.",
        variant: "destructive",
      });
      return;
    }

    // 1. Lấy dữ liệu thiết kế từ canvas
    const designJSON = JSON.stringify(canvas.toJSON());
    const previewImage = canvas.toDataURL({
        format: 'png', quality: 0.8,
        multiplier: 0
    });

    // 2. Gọi hàm addToCart từ hook với cấu trúc mới
    addToCart({
      type: "custom",
      product: selectedProduct, // type, color, size
      designJSON,
      previewImage,
      quantity: 1, // Mặc định mỗi lần thêm là 1 sản phẩm
      price: CUSTOM_PRODUCT_PRICE,
    });

    // 3. Thông báo cho người dùng
    toast({
      title: "Thành công!",
      description: "Sản phẩm đã được thêm vào giỏ hàng của bạn.",
    });
  };

  return (
    <Button 
      className="w-full gap-2 py-6 text-base"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="w-5 h-5" />
      Thêm vào giỏ hàng
    </Button>
  );
}