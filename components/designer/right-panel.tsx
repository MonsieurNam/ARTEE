// FILE: components/designer/right-panel.tsx
"use client";

import { useDesignStore } from "@/store/design-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProductSelector from "@/components/product-selector";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import * as fabric from 'fabric';
import { useState, useEffect } from "react";
import AddToCartButton from './add-to-cart-button';
import { Button } from "../ui/button";
import { Download, Phone, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { useToast } from "../ui/use-toast";

interface RightPanelProps {
  selectedProduct: any;
  onProductChange: (product: any) => void;
}

interface LocalAttributes {
  text: string; scale: number; angle: number; fill: string;
}

export default function RightPanel({ selectedProduct, onProductChange }: RightPanelProps) {
  const { canvas, selectedObject } = useDesignStore();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [attributes, setAttributes] = useState<LocalAttributes>({ text: '', scale: 1, angle: 0, fill: '#000000' });

  useEffect(() => {
    if (selectedObject) {
      setAttributes({
        text: (selectedObject as fabric.IText).text || '', scale: selectedObject.scaleX || 1,
        angle: selectedObject.angle || 0, fill: (selectedObject as fabric.IText).fill as string || '#000000',
      });
    }
  }, [selectedObject]);

  const updateProperty = (prop: string, value: any) => {
    if (canvas && selectedObject) {
      selectedObject.set(prop as keyof fabric.Object, value);
      if (prop === 'scale') { selectedObject.set('scaleX', value); selectedObject.set('scaleY', value); }
      canvas.renderAll();
    }
  };

  const handleAttributeChange = (prop: keyof LocalAttributes, value: any) => {
    setAttributes(prev => ({ ...prev, [prop]: value }));
    updateProperty(prop, value);
  };
  
  const commitChanges = () => {
    if (canvas && selectedObject) {
      canvas.fire('object:modified', { target: selectedObject as fabric.Object });
    }
  };
  
  // SỬA LỖI #2: Tái cấu trúc hoàn toàn hàm tải xuống
  const handleDownloadDesign = async (side: 'front' | 'back') => {
    if (!canvas) return;
    setIsDownloading(true);

    const fileName = `ARTEE_Design_${side}_${Date.now()}.png`;
    
    // SỬA LỖI: Lấy dữ liệu JSON từ canvas CHÍNH, bao gồm cả các layer ẩn.
    const json = (canvas as any).toJSON(['data']);
    const virtualCanvas = new fabric.StaticCanvas(undefined, { width: 2000, height: 2500 });

    try {
      await virtualCanvas.loadFromJSON(json);
      
      const bgImage = virtualCanvas.backgroundImage as fabric.Image;
      if (bgImage && bgImage.width && bgImage.height) {
        const scaleFactor = Math.min(virtualCanvas.width! / bgImage.width, virtualCanvas.height! / bgImage.height) * 0.9;
        bgImage.scale(scaleFactor);
        virtualCanvas.centerObject(bgImage);
      }
      
      // SỬA LỖI: Ẩn/hiện các layer một cách chính xác trên canvas ảo
      // Chỉ hiển thị các layer thuộc về 'side' được yêu cầu tải xuống.
      virtualCanvas.getObjects().forEach(obj => {
        obj.set('visible', obj.data?.side === side);
      });

      virtualCanvas.renderAll();

      const link = document.createElement("a");
      link.href = virtualCanvas.toDataURL({ format: 'png', quality: 1.0, multiplier: 1 });
      link.download = fileName;
      document.body.appendChild(link); // Thêm vào body để hoạt động trên Firefox
      link.click();
      document.body.removeChild(link); // Dọn dẹp
      
      toast({ title: `Đã tải xuống mặt ${side === 'front' ? 'trước' : 'sau'}`, description: fileName });
    } catch (error) {
      console.error(`Lỗi khi tải mặt ${side}:`, error);
      toast({ title: "Lỗi tải xuống", variant: "destructive" });
    } finally {
      virtualCanvas.dispose();
      setIsDownloading(false);
    }
  };

  return (
    <Card className="h-full shadow-md flex flex-col">
      <Tabs defaultValue="product" key={selectedObject ? 'object' : 'product'} className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-2 flex-shrink-0"><TabsTrigger value="product">Sản phẩm</TabsTrigger><TabsTrigger value="object" disabled={!selectedObject}>Đối tượng</TabsTrigger></TabsList>
        <div className="flex-1 overflow-y-auto p-0">
          <TabsContent value="product" className="mt-0"><ProductSelector selectedProduct={selectedProduct} onProductChange={onProductChange} /></TabsContent>
          <TabsContent value="object" className="p-4 mt-0">
            {selectedObject ? (
              <div className="space-y-6">
                {selectedObject.type === 'i-text' && (<div><Label>Nội dung</Label><Input value={attributes.text} onChange={(e) => handleAttributeChange('text', e.target.value)} /></div>)}
                <div><Label>Kích thước: {Math.round(attributes.scale * 100)}%</Label><Slider value={[attributes.scale]} max={5} min={0.1} step={0.05} onValueChange={([val]) => handleAttributeChange('scale', val)} onValueCommit={commitChanges}/></div>
                <div><Label>Xoay: {Math.round(attributes.angle)}°</Label><Slider value={[attributes.angle]} max={360} step={1} onValueChange={([val]) => handleAttributeChange('angle', val)} onValueCommit={commitChanges}/></div>
                {selectedObject.type === 'i-text' && (<div><Label>Màu sắc</Label><Input type="color" value={attributes.fill} onChange={(e) => handleAttributeChange('fill', e.target.value)} className="p-1 h-10 w-full" /></div>)}
              </div>
            ) : null}
          </TabsContent>
        </div>
      </Tabs>
      <div className="p-4 border-t space-y-2 flex-shrink-0 bg-card">
        <AddToCartButton selectedProduct={selectedProduct} />
        {/* SỬA LỖI #2 (tiếp): Thay nút bấm bằng một Dialog */}
        <Dialog>
          <DialogTrigger asChild><Button className="w-full gap-2" variant="secondary"><Download className="w-4 h-4" /> Tải thiết kế xuống</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tải xuống thiết kế của bạn</DialogTitle><DialogDescription>Chọn mặt áo bạn muốn tải về dưới dạng ảnh PNG chất lượng cao.</DialogDescription></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button onClick={() => handleDownloadDesign('front')} disabled={isDownloading}>
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tải mặt trước"}
              </Button>
              <Button onClick={() => handleDownloadDesign('back')} disabled={isDownloading}>
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tải mặt sau"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild><Button variant="outline" className="w-full gap-2"><Phone className="w-4 h-4" /> Liên hệ tư vấn</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Liên hệ ARTEE</DialogTitle></DialogHeader>
            <div className="space-y-4 text-sm">
                <p>Để được tư vấn và đặt hàng, vui lòng liên hệ chúng tôi qua:</p>
                <ul><li><strong>Hotline:</strong> 0123.456.789</li><li><strong>Email:</strong> contact@artee.vn</li><li><strong>Fanpage:</strong> fb.com/artee.fashion</li></ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}