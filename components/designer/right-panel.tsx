// FILE: components/designer/right-panel.tsx
"use client";

import { useDesignStore } from "@/store/design-store";
import { useShallow } from 'zustand/react/shallow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProductSelector from "@/components/product-selector";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import * as fabric from "fabric";
import { useState, useEffect } from "react";
import AddToCartButton from "./add-to-cart-button";
import { Button } from "../ui/button";
import { Download, Phone, Loader2, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { SHIRT_ASSETS } from "@/lib/content";
import VirtualTryOnModal from "../virtual-try-on-modal";

interface RightPanelProps {
  selectedProduct: any;
  onProductChange: (product: any) => void;
}

interface LocalAttributes {
  text: string;
  scale: number;
  angle: number;
  fill: string;
}

// --- KÍCH THƯỚC CANVAS CHÍNH (GỐC) ---
const CANVAS_BASE_WIDTH = 400;
const CANVAS_BASE_HEIGHT = 500;

export default function RightPanel({
  selectedProduct,
  onProductChange,
}: RightPanelProps) {
  const { canvas, selectedObject, layers, activeSide } = useDesignStore(
    useShallow((state) => ({
      canvas: state.canvas,
      selectedObject: state.selectedObject,
      layers: state.layers,
      activeSide: state.activeSide,
    }))
  );

  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [isVtoModalOpen, setIsVtoModalOpen] = useState(false);
  const [vtoImageUrl, setVtoImageUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  
  const [attributes, setAttributes] = useState<LocalAttributes>({
    text: "",
    scale: 1,
    angle: 0,
    fill: "#000000",
  });

  useEffect(() => {
    if (selectedObject) {
      setAttributes({
        text: (selectedObject as fabric.IText).text || "",
        scale: selectedObject.scaleX || 1,
        angle: selectedObject.angle || 0,
        fill:
          ((selectedObject as fabric.IText).fill as string) || "#000000",
      });
    }
  }, [selectedObject]);

  // ... (các hàm updateProperty, handleAttributeChange, commitChanges không đổi) ...
  const updateProperty = (prop: string, value: any) => {
    if (canvas && selectedObject) {
      selectedObject.set(prop as keyof fabric.Object, value);
      if (prop === "scale") {
        selectedObject.set("scaleX", value);
        selectedObject.set("scaleY", value);
      }
      canvas.renderAll();
    }
  };

  const handleAttributeChange = (prop: keyof LocalAttributes, value: any) => {
    setAttributes((prev) => ({ ...prev, [prop]: value }));
    updateProperty(prop, value);
  };

  const commitChanges = () => {
    if (canvas && selectedObject) {
      canvas.fire("object:modified", {
        target: selectedObject as fabric.Object,
      });
    }
  };


  // --- HÀM MỞ VTO ĐÃ ĐƯỢC CẬP NHẬT HOÀN TOÀN ---
  const handleOpenVtoModal = async () => {
    if (!canvas) {
      toast({ title: "Lỗi", description: "Canvas chưa sẵn sàng.", variant: "destructive" });
      return;
    }

    const hasLayersOnThisSide = layers.some(l => l.side === activeSide);
    if (!hasLayersOnThisSide && activeSide === 'front') { // Chỉ kiểm tra mặt trước
       toast({
         title: "Mặt trước trống",
         description: `Vui lòng thêm chi tiết vào mặt trước trước khi thử đồ.`,
         variant: "destructive"
       });
       return;
    }

    setIsGeneratingPreview(true);
    
    // --- TĂNG ĐỘ PHÂN GIẢI ---
    const PREVIEW_WIDTH = 800;  // Tăng từ 400
    const PREVIEW_HEIGHT = 1000; // Tăng từ 500

    // Tính toán tỷ lệ scale
    const scaleX = PREVIEW_WIDTH / CANVAS_BASE_WIDTH;   // = 2
    const scaleY = PREVIEW_HEIGHT / CANVAS_BASE_HEIGHT; // = 2
    // --- KẾT THÚC TĂNG ĐỘ PHÂN GIẢI ---

    // 1. Tạo canvas ảo
    const virtualCanvas = new fabric.StaticCanvas(undefined, {
      width: PREVIEW_WIDTH,
      height: PREVIEW_HEIGHT,
    });

    // 2. Lấy JSON thiết kế
    const designData = {
      objects: canvas.getObjects().map(obj => obj.toObject(['data'])),
    };

    try {
      // 3. Nạp JSON vào canvas ảo
      await virtualCanvas.loadFromJSON(designData);

      // --- THÊM BƯỚC QUAN TRỌNG: SCALE CÁC ĐỐI TƯỢNG ---
      virtualCanvas.getObjects().forEach(obj => {
        obj.set({
          left: (obj.left ?? 0) * scaleX,
          top: (obj.top ?? 0) * scaleY,
          scaleX: (obj.scaleX ?? 1) * scaleX,
          scaleY: (obj.scaleY ?? 1) * scaleY,
        });
        obj.setCoords();
      });
      // --- KẾT THÚC BƯỚC SCALE ---

      // 4. Tải ảnh nền (áo)
      const productType = selectedProduct.type || 'tee';
      const backgroundImageSrc =
        SHIRT_ASSETS[productType]?.[activeSide] || SHIRT_ASSETS['tee'].front;
      
      const img = await fabric.Image.fromURL(backgroundImageSrc, { crossOrigin: 'anonymous' });

      // 5. Áp filter màu
      const colorFilter = new fabric.filters.BlendColor({
        color: selectedProduct.color,
        mode: 'tint',
        alpha: 0.9,
      });
      img.filters?.push(colorFilter);
      img.applyFilters();

      // 6. Scale và đặt ảnh nền
      const canvasAspect = PREVIEW_WIDTH / PREVIEW_HEIGHT;
      const imgAspect = img.width! / img.height!;
      const bgScaleFactor =
        canvasAspect > imgAspect
          ? PREVIEW_HEIGHT / img.height!
          : PREVIEW_WIDTH / img.width!;
      const finalBgScale = bgScaleFactor * 0.9;

      img.set({
        scaleX: finalBgScale,
        scaleY: finalBgScale,
        originX: 'center',
        originY: 'center',
        left: PREVIEW_WIDTH / 2,
        top: PREVIEW_HEIGHT / 2,
      });
      virtualCanvas.backgroundImage = img;

      // 7. Ẩn/hiện đối tượng theo 'activeSide'
      virtualCanvas.getObjects().forEach(obj => {
        obj.set('visible', obj.data?.side === activeSide);
      });

      // 8. Chờ render
      await new Promise<void>((resolve) => {
        virtualCanvas.renderAll();
        // Dùng setTimeout nhỏ để đảm bảo render hoàn tất
        setTimeout(() => resolve(), 50); 
      });

      // 9. Xuất Data URI
      const imageDataUrl = virtualCanvas.toDataURL({
        format: 'png',
        quality: 0.9, // Giữ chất lượng tốt
        multiplier: 1,
      });

      // 10. Mở Modal
      setVtoImageUrl(imageDataUrl);
      setIsVtoModalOpen(true);

    } catch (error) {
      console.error("Lỗi khi tạo preview VTO:", error);
      toast({ title: "Lỗi", description: "Không thể tạo ảnh xem trước.", variant: "destructive"});
    } finally {
      virtualCanvas.dispose();
      setIsGeneratingPreview(false);
    }
  };
  // --- KẾT THÚC HÀM VTO MỚI ---


  // HÀM TẢI THIẾT KẾ (FABRIC V6) - (Không thay đổi)
  const handleDownloadDesign = async (side: 'front' | 'back') => {
    if (!canvas) {
      toast({ title: "Lỗi", description: "Canvas chính chưa sẵn sàng.", variant: "destructive" });
      return;
    }

    setIsDownloading(true);

    const fileName = `ARTEE_Design_${side}_${Date.now()}.png`;
    const ORIGINAL_WIDTH = CANVAS_BASE_WIDTH;
    const ORIGINAL_HEIGHT = CANVAS_BASE_HEIGHT;
    const HI_RES_WIDTH = 2000;
    const HI_RES_HEIGHT = 2500;
    const scaleX = HI_RES_WIDTH / ORIGINAL_WIDTH;
    const scaleY = HI_RES_HEIGHT / ORIGINAL_HEIGHT;
    
    const designData = {
      objects: canvas.getObjects().map(obj => obj.toObject(['data'])),
    };
    
    const virtualCanvas = new fabric.StaticCanvas(undefined, {
      width: HI_RES_WIDTH,
      height: HI_RES_HEIGHT,
    });
    try {
      console.log(`[v6] Bắt đầu quá trình tải mặt ${side}.`);
      await virtualCanvas.loadFromJSON(designData);
      
      virtualCanvas.getObjects().forEach(obj => {
        obj.set({
          left: (obj.left ?? 0) * scaleX,
          top: (obj.top ?? 0) * scaleY,
          scaleX: (obj.scaleX ?? 1) * scaleX,
          scaleY: (obj.scaleY ?? 1) * scaleY,
        });
        obj.setCoords();
      });
      
      console.log("[v6] Bắt đầu tải ảnh nền...");
      const productType = selectedProduct.type || 'tee';
      const backgroundImageSrc =
        SHIRT_ASSETS[productType]?.[side] || SHIRT_ASSETS['tee'].front;
      const img = await fabric.Image.fromURL(backgroundImageSrc, { crossOrigin: 'anonymous' });
      console.log("[v6] Tải ảnh nền thành công.");
      
      const colorFilter = new fabric.filters.BlendColor({
        color: selectedProduct.color,
        mode: 'tint',
        alpha: 0.9,
      });
      img.filters?.push(colorFilter);
      img.applyFilters();

      const canvasAspect = HI_RES_WIDTH / HI_RES_HEIGHT;
      const imgAspect = img.width! / img.height!;
      const bgScaleFactor =
        canvasAspect > imgAspect
          ? HI_RES_HEIGHT / img.height!
          : HI_RES_WIDTH / img.width!;
      const finalBgScale = bgScaleFactor * 0.9;
      
      img.scaleX = finalBgScale;
      img.scaleY = finalBgScale;
      img.originX = 'center';
      img.originY = 'center';
      img.left = HI_RES_WIDTH / 2;
      img.top = HI_RES_HEIGHT / 2;

      virtualCanvas.backgroundImage = img;
      virtualCanvas.requestRenderAll();
      console.log("[v6] Đặt ảnh nền thành công.");
      
      virtualCanvas.getObjects().forEach(obj => {
        obj.set('visible', obj.data?.side === side);
      });
      console.log("[v6] Đã ẩn/hiện đối tượng theo mặt áo.");

      await new Promise<void>((resolve) => {
        virtualCanvas.renderAll();
        requestAnimationFrame(() => {
          console.log("[v6] Canvas đã render xong (requestAnimationFrame).");
          resolve();
        });
      });
      
      const dataUrl = virtualCanvas.toDataURL({
        format: 'png',
        quality: 1.0,
        multiplier: 1,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: `Đã tải xuống mặt ${side === 'front' ? 'trước' : 'sau'}`,
        description: fileName,
      });
    } catch (error) {
      console.error(`Lỗi trong quá trình tải mặt ${side}:`, error);
      toast({ title: "Lỗi tải xuống", variant: "destructive" });
    } finally {
      virtualCanvas.dispose();
      setIsDownloading(false);
    }
  };


  // =============================
  // GIAO DIỆN (UI) - Không thay đổi
  // =============================
  return (
    <> 
      <Card className="h-full shadow-md flex flex-col">
        <Tabs
          defaultValue="product"
          key={selectedObject ? "object" : "product"}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="product">Sản phẩm</TabsTrigger>
            <TabsTrigger value="object" disabled={!selectedObject}>
              Đối tượng
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-0">
            <TabsContent value="product" className="mt-0">
              <ProductSelector
                selectedProduct={selectedProduct}
                onProductChange={onProductChange}
              />
            </TabsContent>

            <TabsContent value="object" className="p-4 mt-0">
              {selectedObject ? (
                <div className="space-y-6">
                  {selectedObject.type === "i-text" && (
                    <div>
                      <Label>Nội dung</Label>
                      <Input
                        value={attributes.text}
                        onChange={(e) =>
                          handleAttributeChange("text", e.target.value)
                        }
                      />
                    </div>
                  )}

                  <div>
                    <Label>
                      Kích thước: {Math.round(attributes.scale * 100)}%
                    </Label>
                    <Slider
                      value={[attributes.scale]}
                      max={5}
                      min={0.1}
                      step={0.05}
                      onValueChange={([val]) =>
                        handleAttributeChange("scale", val)
                      }
                      onValueCommit={commitChanges}
                    />
                  </div>

                  <div>
                    <Label>Xoay: {Math.round(attributes.angle)}°</Label>
                    <Slider
                      value={[attributes.angle]}
                      max={360}
                      step={1}
                      onValueChange={([val]) =>
                        handleAttributeChange("angle", val)
                      }
                      onValueCommit={commitChanges}
                    />
                  </div>

                  {selectedObject.type === "i-text" && (
                    <div>
                      <Label>Màu sắc</Label>
                      <Input
                        type="color"
                        value={attributes.fill}
                        onChange={(e) =>
                          handleAttributeChange("fill", e.target.value)
                        }
                        className="p-1 h-10 w-full"
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 border-t space-y-2 flex-shrink-0 bg-card">
          <AddToCartButton selectedProduct={selectedProduct} />

          <Button
            className="w-full gap-2"
            variant="secondary"
            onClick={handleOpenVtoModal}
            disabled={isGeneratingPreview || (layers.filter(l => l.side === 'front').length === 0)}
          >
            {isGeneratingPreview ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Thử đồ ảo
          </Button>

          {/* Dialog tải xuống */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full gap-2"
                variant="outline"
                disabled={layers.length === 0}
              >
                <Download className="w-4 h-4" /> Tải thiết kế xuống
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tải xuống thiết kế của bạn</DialogTitle>
                <DialogDescription>
                  Chọn mặt áo bạn muốn tải về dưới dạng ảnh PNG chất lượng cao.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button
                  onClick={() => handleDownloadDesign("front")}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Tải mặt trước"
                  )}
                </Button>
                <Button
                  onClick={() => handleDownloadDesign("back")}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Tải mặt sau"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dialog liên hệ */}
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
                <p>Để được tư vấn và đặt hàng, vui lòng liên hệ chúng tôi qua:</p>
                <ul>
                  <li>
                    <strong>Hotline:</strong> 0123.456.789
                  </li>
                  <li>
                    <strong>Email:</strong> contact@artee.vn
                  </li>
                  <li>
                    <strong>Fanpage:</strong> fb.com/artee.fashion
                  </li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <VirtualTryOnModal
        isOpen={isVtoModalOpen}
        onClose={() => setIsVtoModalOpen(false)}
        shirtImageUrl={vtoImageUrl}
        productPose={activeSide} 
      />
    </>
  );
}