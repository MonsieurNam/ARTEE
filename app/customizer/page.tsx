// app/customizer/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Link from "next/link";
import { ArrowLeft, Loader2, LogIn } from "lucide-react"; // Import thêm icon
import LeftPanel from "@/components/designer/left-panel";
import RightPanel from "@/components/designer/right-panel";
import DesignerCanvas from "@/components/designer/designer-canvas";
import SideSelector from "@/components/designer/side-selector";
import { ZoomControls } from "@/components/designer/zoom-controls";
import { useAuth } from "@/components/providers/auth-provider"; // 1. Import Auth
import { Button } from "@/components/ui/button"; // Import Button
import { useRouter } from "next/navigation";

interface SelectedProduct {
  type: string;
  color: string;
  size: string;
}
export default function CustomizerPage() {
  const { user, loading } = useAuth(); // 2. Lấy trạng thái đăng nhập
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct>({
    type: "tee",
    color: "#ffffff",
    size: "M",
  });

  const handleProductChangeFromProject = (product: SelectedProduct) => {
    setSelectedProduct(product);
  };

  // 3. Xử lý Loading (Tránh màn hình chớp nháy)
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 4. Chặn truy cập nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Yêu cầu đăng nhập</h1>
            <p className="text-gray-500 mb-8">
              Để bảo vệ thiết kế của bạn và sử dụng các tính năng nâng cao, vui lòng đăng nhập trước khi bắt đầu sáng tạo.
            </p>
            <div className="space-y-3">
              <Link href="/login" className="w-full block">
                <Button className="w-full py-6 text-base">Đăng nhập ngay</Button>
              </Link>
              <Link href="/" className="w-full block">
                <Button variant="ghost" className="w-full">Quay về trang chủ</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Nếu đã đăng nhập, hiển thị giao diện thiết kế bình thường
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black flex flex-col overflow-hidden">
      <Header />
      {/* ... (Phần code giao diện thiết kế giữ nguyên như cũ) ... */}
       <div className="flex-1 flex flex-col w-full max-w-screen-2xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <div className="flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
                <Link href="/" className="flex items-center gap-1 text-primary hover:underline text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Trang chủ
                </Link>
                <span className="text-muted-foreground text-sm">/</span>
                <span className="text-foreground font-medium text-sm">Công cụ thiết kế</span>
            </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
         {/* Cột trái */}
          <div className="lg:col-span-3 h-full min-h-[500px] lg:min-h-0">
            <LeftPanel 
              selectedProduct={selectedProduct}
              onProductChange={handleProductChangeFromProject} 
            />
          </div>

          {/* Cột giữa */}
          <div className="lg:col-span-6 flex flex-col items-center justify-start gap-4 h-full">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <SideSelector />
              <ZoomControls />
            </div>
            <DesignerCanvas selectedProduct={selectedProduct} />
            <p className="text-xs text-muted-foreground mt-2">
              *Cuộn chuột để Zoom. Giữ phím <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md">Alt</kbd> để kéo thả canvas.
            </p>
          </div>

          {/* Cột phải */}
          <div className="lg:col-span-3 h-full min-h-[500px] lg:min-h-0">
            <RightPanel 
              selectedProduct={selectedProduct}
              onProductChange={handleProductChangeFromProject} 
            />
          </div>

        </div>
      </div>
    </main>
  );
}