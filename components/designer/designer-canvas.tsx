"use client";

import { useCanvas } from '@/hooks/use-canvas';
import { Card } from "@/components/ui/card";
import { useDesignStore } from '@/store/design-store';
import { useEffect } from 'react';
import { SHIRT_ASSETS } from '@/lib/content';
// SỬA 1: Import thêm 'filters'
import { Image as FabricImage, filters } from 'fabric';

interface DesignerCanvasProps {
  selectedProduct: {
    type: string;
    color: string;
  };
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

export default function DesignerCanvas({ selectedProduct }: DesignerCanvasProps) {
  const { canvasRef } = useCanvas({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });

  const { canvas, activeSide } = useDesignStore();
  const productType = selectedProduct.type || 'tee';
  const backgroundImageSrc = SHIRT_ASSETS[productType]?.[activeSide] || SHIRT_ASSETS['tee'].front;

  useEffect(() => {
    if (!canvas) return;

    // 1️⃣ Đặt màu nền
    // Ghi chú: Dòng này có thể không cần thiết nếu ảnh nền che phủ toàn bộ
    // canvas.backgroundColor = selectedProduct.color; 
    canvas.backgroundColor = 'white'; // Đặt màu nền trung tính
    canvas.backgroundImage = undefined;
    canvas.renderAll();

    // 2️⃣ Tải ảnh nền mới (Fabric v6: Promise-based)
    FabricImage.fromURL(backgroundImageSrc, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!canvas || !img.width || !img.height) return;
        if (canvas.backgroundImage instanceof FabricImage) {
            canvas.backgroundImage.filters = [];
        }

        // SỬA 2: Sử dụng 'filters' đã import
        const colorFilter = new filters.BlendColor({
            color: selectedProduct.color,
            mode: 'tint', // Chế độ 'tint' hoạt động tốt để tô màu cho ảnh trắng
            alpha: 0.8 // Giảm alpha một chút để giữ lại chi tiết của áo
        });
        img.filters.push(colorFilter);
        img.applyFilters();
        
        // Tính toán tỉ lệ scale
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let scaleFactor ;
        if (canvasAspect > imgAspect) {
          // Canvas rộng hơn ảnh -> scale theo chiều cao
          scaleFactor = (canvas.height / img.height);
        } else {
          // Canvas cao hơn hoặc bằng ảnh -> scale theo chiều rộng
          scaleFactor = (canvas.width / img.width);
        }
        
        // Áp dụng scale factor và một chút padding (0.9)
        const finalScale = scaleFactor * 0.9;

        // Căn giữa ảnh
        img.set({
          originX: 'center',
          originY: 'center',
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          // GỢI Ý: Bạn đã tính 'finalScale' nhưng lại dùng 'scaleFactor'
          // Có thể bạn muốn dùng 'finalScale' ở đây?
          scaleX: finalScale, 
          scaleY: finalScale,
        });

        // 3️⃣ Gán vào background
        canvas.backgroundImage = img;
        canvas.renderAll();
      })
      .catch((err) => {
        console.error('Error loading background image:', err);
      });
  }, [backgroundImageSrc, selectedProduct.color, canvas, activeSide]);

  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-lg shadow-lg overflow-hidden p-0 border-none bg-transparent">
        <canvas ref={canvasRef} />
      </Card>
    </div>
  );
}