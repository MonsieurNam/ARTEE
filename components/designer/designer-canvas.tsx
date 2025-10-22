// FILE: components/designer/designer-canvas.tsx
"use client";

import { useCanvas } from '@/hooks/use-canvas';
import { Card } from "@/components/ui/card";
import { useDesignStore } from '@/store/design-store';
import { useEffect, useRef } from 'react'; // Thêm useRef
import { SHIRT_ASSETS } from '@/lib/content';
import { Image as FabricImage, filters } from 'fabric';
import { useToast } from "@/components/ui/use-toast";

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
  
  // Sử dụng ref để tránh useEffect chạy lại khi các hàm từ store thay đổi
  const storeActions = useRef({ finishLoadingProject, setLayers, toast });

  const productType = selectedProduct.type || 'tee';
  const backgroundImageSrc = SHIRT_ASSETS[productType]?.[activeSide] || SHIRT_ASSETS['tee'].front;

  // useEffect 1: CHỈ VẼ NỀN VÀ CÁC ĐỐI TƯỢNG HIỆN CÓ
  useEffect(() => {
    if (!canvas || isLoadingProject) {
        // Nếu đang trong quá trình tải dự án, KHÔNG làm gì cả
        // để tránh ghi đè lên kết quả của useEffect 2
        return;
    };

    console.log(`%c[Render] Vẽ nền và đối tượng cho mặt: ${activeSide}`, "color: blue");

    FabricImage.fromURL(backgroundImageSrc, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!canvas || !img.width || !img.height) return;

        const colorFilter = new filters.BlendColor({ color: selectedProduct.color, mode: 'tint', alpha: 0.9 });
        img.filters = [colorFilter];
        img.applyFilters();
        
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        const scaleFactor = (canvasAspect > imgAspect) ? (canvas.height / img.height) : (canvas.width / img.width);
        const finalScale = scaleFactor * 0.9;
        img.set({
          originX: 'center', originY: 'center', left: canvas.width / 2, top: canvas.height / 2,
          scaleX: finalScale, scaleY: finalScale, selectable: false, evented: false,
        });
        
        canvas.backgroundImage = img;

        canvas.getObjects().forEach(obj => {
          obj.set('visible', obj.data?.side === activeSide);
        });
        canvas.renderAll();
      }).catch((err) => { 
          console.error('Lỗi tải ảnh nền:', err); 
      });

  }, [canvas, activeSide, backgroundImageSrc, selectedProduct.color, isLoadingProject]);


  // useEffect 2: CHỈ TẢI DỰ ÁN TỪ JSON
  useEffect(() => {
    if (isLoadingProject && projectToLoad && canvas) {
        console.log("%c[Loader] Tải dự án từ JSON...", "color: green; font-weight: bold;");

        // Không cần clear(), loadFromJSON sẽ tự làm
        canvas.loadFromJSON(projectToLoad, () => {
            const currentSide = useDesignStore.getState().activeSide;
            const objects = canvas.getObjects();
            
            objects.forEach(obj => {
                obj.set('visible', obj.data?.side === currentSide);
            });
            
            // Trigger việc render lại của useEffect 1 với nền áo ĐÚNG
            // bằng cách gọi finishLoadingProject, sẽ thay đổi isLoadingProject
            storeActions.current.finishLoadingProject();
            
            // Cập nhật các state khác
            storeActions.current.setLayers(objects);
            storeActions.current.toast({ title: "Tải thành công", description: `Đã tải lại thiết kế.` });
        });
    }
  }, [isLoadingProject, projectToLoad, canvas]);

  return (
    <div>
      <Card className="shadow-lg overflow-hidden p-0 border-none bg-transparent">
        <canvas ref={canvasRef} />
      </Card>
    </div>
  );
}