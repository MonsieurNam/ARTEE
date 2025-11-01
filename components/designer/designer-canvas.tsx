"use client";

// Helper function
function isColorLight(hexColor: string): boolean {
  try {
    let hex = hexColor.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.7; // True nếu là màu sáng
  } catch (e) {
    console.error("Invalid color format:", hexColor);
    return false;
  }
}

import { useCanvas } from '@/hooks/use-canvas';
import { Card } from "@/components/ui/card";
import { useDesignStore } from '@/store/design-store';
import { useEffect } from 'react';
import { SHIRT_ASSETS } from '@/lib/content';
import { Image as FabricImage, filters } from 'fabric';
import { useToast } from "@/components/ui/use-toast";
import * as fabric from 'fabric';

interface DesignerCanvasProps {
  selectedProduct: { type: string; color: string; };
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

export default function DesignerCanvas({ selectedProduct }: DesignerCanvasProps) {
  const { canvasRef } = useCanvas({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const { 
    canvas, activeSide, 
    isLoadingProject, projectToLoad, finishLoadingProject, setLayers 
  } = useDesignStore();
  const { toast } = useToast();
  
  const productType = selectedProduct.type || 'tee';
  const backgroundImageSrc = SHIRT_ASSETS[productType]?.[activeSide] || SHIRT_ASSETS['tee'].front;

  // useEffect 1: Vẽ lại giao diện
  useEffect(() => {
    if (!canvas || isLoadingProject) return;

    // SỬA LỖI MÀU NỀN: Tự động thay đổi nền tương phản
    const isShirtLight = isColorLight(selectedProduct.color);
    canvas.backgroundColor = isShirtLight ? '#AAAAAA' : '#FFFFFF';

    FabricImage.fromURL(backgroundImageSrc, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!canvas || !img.width || !img.height) return;
        // 1. Đặt chế độ mặc định là 'multiply' VÀ KHAI BÁO KIỂU TƯỜNG MINH
        let blendMode: 'multiply' | 'tint' = 'multiply';
        let blendColor = selectedProduct.color;
        let blendAlpha = 1;

        // 2. XỬ LÝ NGOẠI LỆ: Màu đen (#000000)
        if (selectedProduct.color === '#000000') {
          blendMode = 'tint'; // Gán 'tint' (hợp lệ vì ta đã khai báo ở trên)
          blendColor = '#0A0A0A'; 
          blendAlpha = 1; 
        }

        // 3. Áp dụng bộ lọc
        const colorFilter = new filters.BlendColor({
          color: blendColor,
          mode: blendMode, // Kiểu (type) bây giờ là 'multiply' | 'tint', hoàn toàn hợp lệ
          alpha: blendAlpha
        });
        img.filters = [colorFilter];
        img.applyFilters();
        
        // SỬA LỖI LOGIC: Bỏ comment dòng này
        const canvasAspect = canvas.width! / canvas.height!;
        const imgAspect = img.width / img.height;
        const scaleFactor = (canvasAspect > imgAspect) ? (canvas.height! / img.height) : (canvas.width! / img.width);
        const finalScale = scaleFactor * 0.9;
        
        img.set({
          originX: 'center', originY: 'center', left: canvas.width! / 2, top: canvas.height! / 2,
          scaleX: finalScale, scaleY: finalScale, selectable: false, evented: false,
        }); // <-- SỬA LỖI CÚ PHÁP: Xóa comment

        canvas.backgroundImage = img;

        canvas.getObjects().forEach(obj => {
          obj.set('visible', obj.data?.side === activeSide);
        }); // <-- SỬA LỖI CÚ PHÁP: Xóa comment
        
        canvas.renderAll();
      }).catch((err) => {
          console.error('Lỗi tải ảnh nền:', err);
          canvas.renderAll(); // Vẫn render nền canvas
      });

  }, [canvas, activeSide, backgroundImageSrc, selectedProduct.color, isLoadingProject]);

  // useEffect 2: Tải dự án
  useEffect(() => {
    if (isLoadingProject && projectToLoad && canvas) {
        canvas.loadFromJSON(projectToLoad, () => {
            const currentSide = useDesignStore.getState().activeSide;
            const objects = canvas.getObjects();
            
            objects.forEach(obj => {
                obj.set('visible', obj.data?.side === currentSide);
            });
            
            setLayers(objects);
            finishLoadingProject(); 
            toast({ title: "Tải thành công", description: `Đã tải lại thiết kế.` });
        });
    }
  }, [isLoadingProject, projectToLoad, canvas, finishLoadingProject, setLayers, toast]);
  
  // Câu lệnh 'return' này bây giờ sẽ được TypeScript "nhìn thấy"
  return (
    <div>
      <Card className="shadow-lg overflow-hidden p-0 border-none bg-transparent">
        <canvas ref={canvasRef} />
      </Card>
    </div>
  );
}