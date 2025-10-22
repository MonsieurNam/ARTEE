// FILE: components/designer/designer-canvas.tsx
"use client";

import { useCanvas } from '@/hooks/use-canvas';
import { Card } from "@/components/ui/card";
import { useDesignStore } from '@/store/design-store';
import { useEffect } from 'react';
import { SHIRT_ASSETS } from '@/lib/content';
import { Image as FabricImage, filters } from 'fabric';

interface DesignerCanvasProps {
  selectedProduct: { type: string; color: string; };
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

export default function DesignerCanvas({ selectedProduct }: DesignerCanvasProps) {
  const { canvasRef } = useCanvas({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const { canvas, activeSide } = useDesignStore();
  const productType = selectedProduct.type || 'tee';
  const backgroundImageSrc = SHIRT_ASSETS[productType]?.[activeSide] || SHIRT_ASSETS['tee'].front;

  useEffect(() => {
    if (!canvas) return;
    canvas.backgroundColor = '#f0f0f0';
    canvas.backgroundImage = undefined;
    canvas.renderAll();
    FabricImage.fromURL(backgroundImageSrc, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!canvas || !img.width || !img.height) return;
        if (canvas.backgroundImage instanceof FabricImage) { canvas.backgroundImage.filters = []; }
        const colorFilter = new filters.BlendColor({ color: selectedProduct.color, mode: 'tint', alpha: 0.9 });
        img.filters.push(colorFilter);
        img.applyFilters();
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let scaleFactor = (canvasAspect > imgAspect) ? (canvas.height / img.height) : (canvas.width / img.width);
        const finalScale = scaleFactor * 0.9;
        img.set({
          originX: 'center', originY: 'center', left: canvas.width / 2, top: canvas.height / 2,
          scaleX: finalScale, scaleY: finalScale, selectable: false, evented: false,
        });
        canvas.backgroundImage = img;
        canvas.renderAll();
      }).catch((err) => { console.error('Lỗi tải ảnh nền:', err); });
  }, [backgroundImageSrc, selectedProduct.color, canvas, activeSide]);

  // SỬA LỖI #3: Xóa các class `w-full` và `flex justify-center` không cần thiết.
  // Việc căn giữa sẽ được xử lý bởi component cha (`customizer/page.tsx`).
  return (
    <div>
      <Card className="shadow-lg overflow-hidden p-0 border-none bg-transparent">
        <canvas ref={canvasRef} />
      </Card>
    </div>
  );
}