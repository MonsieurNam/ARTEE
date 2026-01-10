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
    // 1. Validate: Kiểm tra xem có thiết kế chưa
    if (!canvas || layers.length === 0) {
      toast({
        title: "Thiết kế trống",
        description: "Vui lòng thêm ít nhất một chi tiết (Chữ hoặc Ảnh) vào áo.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Lấy dữ liệu thiết kế từ canvas
      // Đợi một chút để đảm bảo UI không bị giật
      await new Promise(resolve => setTimeout(resolve, 100));

      const designJSON = JSON.stringify(canvas.toJSON()); // Lưu thêm thuộc tính 'data' (id, side...)
      
      // Xuất ảnh preview chất lượng tốt hơn một chút để gửi shop xem rõ
      const previewImage = canvas.toDataURL({
          format: 'png', 
          quality: 1,
          multiplier: 2 // Tăng độ phân giải ảnh preview lên gấp đôi
      });

      // 3. Gọi hàm addToCart
      addToCart({
        type: "custom",
        product: selectedProduct, // type, color, size
        designJSON,
        previewImage,
        quantity: 1,
        price: CUSTOM_PRODUCT_PRICE,
      });

      // 4. Thông báo và Chuyển hướng
      toast({
        title: "Đã lưu thiết kế!",
        description: "Đang chuyển bạn đến trang gửi yêu cầu...",
        duration: 2000,
      });

      // Chuyển hướng sang trang Cart sau 1s để user kịp đọc thông báo
      setTimeout(() => {
        router.push("/cart");
      }, 1000);

    } catch (error) {
      console.error("Lỗi khi lưu thiết kế:", error);
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể lưu thiết kế. Vui lòng thử lại.",
        variant: "destructive",
      });
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