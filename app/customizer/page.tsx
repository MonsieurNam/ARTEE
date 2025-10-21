// app/customizer/page.tsx
"use client";

import { useState } from "react";
import Header from "@/components/header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LeftPanel from "@/components/designer/left-panel";
import RightPanel from "@/components/designer/right-panel";
import DesignerCanvas from "@/components/designer/designer-canvas";
import SideSelector from "@/components/designer/side-selector";

interface SelectedProduct {
  type: string;
  color: string;
  size: string;
}

export default function CustomizerPage() {
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct>({
    type: "tee",
    color: "#ffffff", // Bắt đầu với áo màu trắng để thấy rõ
    size: "M",
  });
  const handleProductChangeFromProject = (product: SelectedProduct) => {
    setSelectedProduct(product);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
      <Header />
      
      {/* 
        Sử dụng w-full để container chiếm toàn bộ chiều rộng, 
        và max-w-screen-2xl để giới hạn chiều rộng tối đa.
        flex-1 và flex-col để container này lấp đầy không gian còn lại.
      */}
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

        {/* 
          Grid layout chiếm toàn bộ không gian còn lại.
          min-h-0 là một trick quan trọng để grid không bị tràn ra ngoài màn hình.
        */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          
          {/* Cột trái: Bảng điều khiển */}
        <div className="lg:col-span-3 h-full min-h-[500px] lg:min-h-0">
          <LeftPanel 
            selectedProduct={selectedProduct}
            onProductChange={handleProductChangeFromProject} 
          />
        </div>

          {/* Cột giữa: Canvas và Side Selector */}
          <div className="lg:col-span-6 flex flex-col items-center justify-start gap-4 h-full">
            <SideSelector />
            <DesignerCanvas selectedProduct={selectedProduct} />
          </div>

          {/* Cột phải: Bảng thuộc tính */}
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