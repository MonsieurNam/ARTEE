// FILE: components/designer/designer-canvas.tsx (Final Clean Version)
"use client";

import { useCanvas } from '@/hooks/use-canvas';
import { Card } from "@/components/ui/card";
import { useDesignStore } from '@/store/design-store';
import { useEffect } from 'react';
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
  
  const productType = selectedProduct.type || 'tee';
  const backgroundImageSrc = SHIRT_ASSETS[productType]?.[activeSide] || SHIRT_ASSETS['tee'].front;

  // useEffect 1: Vẽ lại giao diện
  useEffect(() => {
    if (!canvas || isLoadingProject) return;

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
      }).catch((err) => console.error('Lỗi tải ảnh nền:', err));

  }, [canvas, activeSide, backgroundImageSrc, selectedProduct.color, isLoadingProject]);


  // useEffect 2: Tải dự án
  useEffect(() => {
    if (isLoadingProject && projectToLoad && canvas) {
        // loadFromJSON sẽ xóa canvas, bao gồm cả backgroundImage.
        // Điều đó không sao, vì useEffect 1 sẽ vẽ lại nó sau khi tải xong.
        canvas.loadFromJSON(projectToLoad, () => {
            const currentSide = useDesignStore.getState().activeSide;
            const objects = canvas.getObjects();
            
            objects.forEach(obj => {
                obj.set('visible', obj.data?.side === currentSide);
            });
            
            setLayers(objects);
            finishLoadingProject(); // <-- Tín hiệu này sẽ kích hoạt lại useEffect 1
            toast({ title: "Tải thành công", description: `Đã tải lại thiết kế.` });

            // Không cần gọi renderAll() ở đây nữa, vì useEffect 1 sẽ làm điều đó.
        });
    }
  }, [isLoadingProject, projectToLoad, canvas, finishLoadingProject, setLayers, toast]);

  return (
    <div>
      <Card className="shadow-lg overflow-hidden p-0 border-none bg-transparent">
        <canvas ref={canvasRef} />
      </Card>
    </div>
  );
}