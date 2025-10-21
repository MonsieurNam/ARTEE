"use client";

import { useDesignStore } from "@/store/design-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProductSelector from "@/components/product-selector";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import * as fabric from 'fabric';
import { useEffect, useState } from "react";
import AddToCartButton from './add-to-cart-button';
import { Button } from "../ui/button";
import { Download, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"; // Đã sửa lỗi import trùng 'DialogHeader'

interface RightPanelProps {
  selectedProduct: any;
  onProductChange: (product: any) => void;
}

// Định nghĩa kiểu cho các thuộc tính cục bộ
interface LocalAttributes {
  text: string;
  scale: number;
  angle: number;
  fill: string;
}

export default function RightPanel({ selectedProduct, onProductChange }: RightPanelProps) {
  const { canvas, selectedObject } = useDesignStore();
  
  // State cục bộ để quản lý thuộc tính trên UI, tránh re-render không cần thiết
  const [attributes, setAttributes] = useState<LocalAttributes>({
    text: '',
    scale: 1,
    angle: 0,
    fill: '#000000',
  });

  // Chỉ cập nhật state cục bộ từ store KHI đối tượng được chọn thay đổi
  useEffect(() => {
    if (selectedObject) {
      setAttributes({
        text: (selectedObject as fabric.IText).text || '',
        scale: selectedObject.scaleX || 1,
        angle: selectedObject.angle || 0,
        fill: (selectedObject as fabric.IText).fill as string || '#000000',
      });
    }
  }, [selectedObject]); // Dependency array chỉ chứa selectedObject

  // Hàm cập nhật thuộc tính trên canvas mà KHÔNG trigger re-render từ store
  const updateProperty = (prop: string, value: any) => {
    if (canvas && selectedObject) {
      selectedObject.set(prop as keyof fabric.Object, value);
      
      // Với scale, cần set cả X và Y
      if (prop === 'scale') {
          selectedObject.set('scaleX', value);
          selectedObject.set('scaleY', value);
      }
      
      canvas.renderAll();
    }
  };

  const handleDownloadDesign = async () => {
      if (!canvas) return;
      
      const activeSide = useDesignStore.getState().activeSide;
      const fileName = `ARTEE_Design_${activeSide}_${Date.now()}.png`;

      // 1. Tạo một canvas ảo để không ảnh hưởng đến canvas chính
      // SỬA LỖI 1: Thay 'null' bằng 'undefined'
      const virtualCanvas = new fabric.Canvas(undefined, {
          width: 1000, // Kích thước lớn hơn để có chất lượng cao
          height: 1250,
      });

      // 2. Lấy JSON từ canvas chính
      // SỬA LỖI 2: Dùng 'as any' để bỏ qua lỗi type 'toJSON'
      const json = (canvas as any).toJSON(['data']);

      try {
        // 3. Tải JSON vào canvas ảo (Sử dụng async/await)
        await virtualCanvas.loadFromJSON(json);

        const bgImage = virtualCanvas.backgroundImage as fabric.Image;
        if (bgImage && bgImage.width && bgImage.height) {
            // Đảm bảo ảnh nền vừa với canvas ảo
            const scaleFactor = Math.min(
                virtualCanvas.width / bgImage.width,
                virtualCanvas.height / bgImage.height
            ) * 0.9;
            bgImage.scale(scaleFactor);
            virtualCanvas.centerObject(bgImage);
        }
        
        // Ẩn các layer không thuộc mặt đang active
        virtualCanvas.getObjects().forEach(obj => {
            obj.set('visible', obj.data?.side === activeSide);
        });

        virtualCanvas.renderAll();

        // 4. Tạo link tải xuống từ canvas ảo
        const link = document.createElement("a");
        
        // SỬA LỖI 3: Thêm 'multiplier: 1'
        link.href = virtualCanvas.toDataURL({ 
          format: 'png', 
          quality: 1.0, 
          multiplier: 1 
        });
        
        link.download = fileName;
        link.click();

      } catch (error) {
        console.error("Lỗi khi load JSON vào canvas ảo:", error);
      } finally {
        // 5. Hủy canvas ảo
        virtualCanvas.dispose();
      }
  };

  // Hàm xử lý khi người dùng tương tác với UI
  const handleAttributeChange = (prop: keyof LocalAttributes, value: any) => {
    // 1. Cập nhật state cục bộ để UI mượt mà
    setAttributes(prev => ({ ...prev, [prop]: value }));
    // 2. Cập nhật trực tiếp lên canvas
    updateProperty(prop, value);
  };
  
  // Hàm này sẽ được gọi khi người dùng ngưng tương tác (ví dụ: thả chuột khỏi slider)
  // để đồng bộ lại state của Zustand nếu cần.
  const commitChanges = () => {
    if (canvas && selectedObject) {
      canvas.fire('object:modified', { target: selectedObject as fabric.Object });
    }
  };

  return (
    <><Card className="h-full shadow-md">
      <Tabs defaultValue="product" key={selectedObject ? 'object' : 'product'}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="product">Sản phẩm</TabsTrigger>
          <TabsTrigger value="object" disabled={!selectedObject}>Đối tượng</TabsTrigger>
        </TabsList>

        <TabsContent value="product" className="flex-1 p-0 mt-0">
          <ProductSelector
            selectedProduct={selectedProduct}
            onProductChange={onProductChange} />
        </TabsContent>

        <TabsContent value="object" className="flex-1 p-4 mt-0">
          {selectedObject ? (
            <div className="space-y-8"> {/* Tăng khoảng cách để giao diện thoáng hơn */}

              {selectedObject.type === 'i-text' && (
                <div>
                  <Label>Nội dung</Label>
                  <Input
                    value={attributes.text}
                    onChange={(e) => handleAttributeChange('text', e.target.value)} />
                </div>
              )}

              <div>
                <Label>Kích thước (Scale)</Label>
                <Slider
                  value={[attributes.scale]}
                  max={5}
                  min={0.1}
                  step={0.05}
                  onValueChange={([val]) => handleAttributeChange('scale', val)}
                  onValueCommit={commitChanges} // Gọi khi người dùng ngưng kéo
                />
              </div>

              <div>
                <Label>Xoay (Angle)</Label>
                <Slider
                  value={[attributes.angle]}
                  max={360}
                  step={1}
                  onValueChange={([val]) => handleAttributeChange('angle', val)}
                  onValueCommit={commitChanges} />
              </div>

              {selectedObject.type === 'i-text' && (
                <div>
                  <Label>Màu sắc</Label>
                  <Input
                    type="color"
                    value={attributes.fill}
                    onChange={(e) => handleAttributeChange('fill', e.target.value)}
                    className="p-1 h-10 w-full" />
                </div>
              )}
            </div>
          ) : null}
        </TabsContent>
        <AddToCartButton selectedProduct={selectedProduct} />
      </Tabs>
    </Card><div className='space-y-2'>
        <Button className="w-full gap-2" onClick={handleDownloadDesign}>
          <Download className="w-4 h-4" /> Tải thiết kế (mặt {useDesignStore.getState().activeSide === 'front' ? 'trước' : 'sau'})
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Phone className="w-4 h-4" /> Liên hệ tư vấn
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Liên hệ ARTEE</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <p>Cảm ơn bạn đã quan tâm đến sản phẩm!</p>
              <p>Để được tư vấn và đặt hàng, vui lòng liên hệ chúng tôi qua:</p>
              <ul>
                <li><strong>Hotline:</strong> 0123.456.789</li>
                <li><strong>Email:</strong> contact@artee.vn</li>
                <li><strong>Fanpage:</strong> fb.com/artee.fashion</li>
              </ul>
              <p>Chúng tôi sẽ sớm phản hồi bạn!</p>
            </div>
          </DialogContent>
        </Dialog>
      </div></>
  );
}