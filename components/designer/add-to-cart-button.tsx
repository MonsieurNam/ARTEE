// components/designer/add-to-cart-button.tsx
"use client";

import { useDesignStore } from "@/store/design-store";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Lưu ý đường dẫn import đúng
import { CUSTOM_PRODUCT_PRICE } from "@/lib/constants";
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Import Router để chuyển trang
import { useState } from "react";
import { dataURLtoFile, uploadToCloudinary } from "@/lib/image-helper";

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
  const router = useRouter(); // Khởi tạo router
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = async () => {
    if (!canvas || layers.length === 0) {
      toast({
        title: "Thiết kế trống",
        description: "Vui lòng thêm chi tiết vào áo.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Đợi render UI
      await new Promise(resolve => setTimeout(resolve, 100));

      const designJSON = JSON.stringify(canvas.toJSON()); // Lưu metadata

      // 1. Xuất ảnh preview từ Canvas (Base64 chất lượng cao)
      const previewBase64 = canvas.toDataURL({
          format: 'png', 
          quality: 0.9,
          multiplier: 1.5 // Giữ mức vừa phải, đừng quá cao
      });

      // 2. BƯỚC MỚI: Upload Preview lên Cloudinary
      // Chuyển Base64 -> File -> Upload -> Lấy URL
      const previewFile = dataURLtoFile(previewBase64, `cart-preview-${Date.now()}.png`);
      const previewUrl = await uploadToCloudinary(previewFile);

      // 3. Lưu vào Cart (Lưu URL thay vì Base64)
      addToCart({
        type: "custom",
        product: selectedProduct,
        designJSON,
        previewImage: previewUrl, // URL Cloudinary (Siêu nhẹ khi lưu text)
        quantity: 1,
        price: CUSTOM_PRODUCT_PRICE,
      });

      toast({
        title: "Đã lưu thiết kế!",
        description: "Đang chuyển đến báo giá...",
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/cart");
      }, 1000);

    } catch (error) {
      console.error("Lỗi khi lưu thiết kế:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể upload ảnh xem trước. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      className="w-full gap-2 py-6 text-base font-bold bg-primary hover:bg-primary/90 shadow-md transition-all hover:scale-[1.01]"
      onClick={handleAddToCart}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Hoàn tất & Xem báo giá
          <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
        </>
      )}
    </Button>
  );
}