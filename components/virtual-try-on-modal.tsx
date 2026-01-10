// components/virtual-try-on-modal.tsx
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload, Loader2, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


async function resizeImage(dataUri: string, targetSize: number = 1024, quality: number = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 1. Tạo Canvas hình vuông cố định (ví dụ 1024x1024)
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Không thể tạo context canvas'));
      }

      // 2. Tô toàn bộ nền màu trắng (hoặc màu xám nhạt #F5F5F5 nếu muốn)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetSize, targetSize);

      // 3. Tính toán tỷ lệ để ảnh nằm trọn trong khung vuông (Object Contain)
      const scale = Math.min(targetSize / img.width, targetSize / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      
      // 4. Tính tọa độ để căn giữa ảnh
      const x = (targetSize - w) / 2;
      const y = (targetSize - h) / 2;

      // 5. Vẽ ảnh vào giữa
      ctx.drawImage(img, x, y, w, h);

      // 6. Xuất ra ảnh JPEG vuông
      const resizedDataUri = canvas.toDataURL('image/jpeg', quality);
      resolve(resizedDataUri); 
    };
    img.onerror = (err) => reject(err);
    img.src = dataUri;
  });
}

/**
 * Helper: Đảm bảo input là Data URI (chuyển đổi nếu là URL thường)
 */
async function ensureDataUri(imageSrc: string): Promise<string> {
  if (imageSrc.startsWith('data:image')) return imageSrc;

  try {
    const response = await fetch(imageSrc);
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Lỗi tải ảnh áo:", error);
    throw new Error("Không thể tải ảnh mẫu áo.");
  }
}

interface VirtualTryOnModalProps {
  isOpen: boolean
  onClose: () => void
  shirtImageUrl: string | null 
  productPose: 'front' | 'back'
}

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  shirtImageUrl,
  productPose,
}: VirtualTryOnModalProps) {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
        setUserImage(null);
        setResultImage(null);
        setIsGenerating(false);
    }
  }, [isOpen]); // Bỏ shirtImageUrl khỏi deps để tránh reset không mong muốn

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Giới hạn file input đầu vào 5MB
    if (file.size > 5 * 1024 * 1024) { 
      toast({ title: "Lỗi", description: "Ảnh quá lớn (Max 5MB)", variant: "destructive" })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setUserImage(event.target?.result as string)
      setResultImage(null)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!userImage || !shirtImageUrl) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng tải ảnh của bạn.", variant: "destructive" })
      return
    }

    setIsGenerating(true)
    setResultImage(null)

    try {
      // 1. Chuẩn hóa dữ liệu ảnh
      const userImageDataUri = userImage;
      const shirtImageDataUri = await ensureDataUri(shirtImageUrl);

      // 2. Resize ảnh về kích thước an toàn cho AI (Max 1024px)
      // Kích thước này đủ nét nhưng không quá lớn khiến AI bị lỗi hoặc crop
      const resizedUserImage = await resizeImage(userImageDataUri, 1024);
      const resizedMockupImage = await resizeImage(shirtImageDataUri, 1024);

      // 3. Gửi API
      const response = await fetch("/api/virtual-try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: resizedUserImage,
          mockupImage: resizedMockupImage,
          productPose: productPose,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Quá trình tạo ảnh thất bại");
      }

      setResultImage(data.imageUrl);
      toast({ title: "Thành công", description: "Đã tạo ảnh thử đồ!" })

    } catch (error) {
      console.error("VTO Error:", error);
      toast({ 
        title: "Lỗi", 
        description: error instanceof Error ? error.message : "Đã có lỗi xảy ra.", 
        variant: "destructive" 
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border-none shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white dark:bg-neutral-900 z-10">
          <div>
            <h2 className="text-2xl font-bold">Phòng Thử Đồ Ảo (AI)</h2>
            <p className="text-sm text-muted-foreground">Mặc thử sản phẩm lên ảnh của bạn</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-neutral-100">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CỘT TRÁI: Input */}
            <div className="space-y-6">
                {/* 1. Áo mẫu */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">1. Sản phẩm đang chọn</label>
                    <div className="aspect-[3/4] w-full bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200 flex items-center justify-center relative">
                        {shirtImageUrl ? (
                            <img src={shirtImageUrl} alt="Áo mẫu" className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-muted-foreground">Đang tải ảnh áo...</span>
                        )}
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {productPose === 'front' ? 'Mặt trước' : 'Mặt sau'}
                        </div>
                    </div>
                </div>

                {/* 2. Ảnh người dùng */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">2. Ảnh của bạn</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative aspect-[3/4] w-full bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden"
                    >
                        {userImage ? (
                            <>
                                <img src={userImage} alt="User" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4"/> Đổi ảnh khác</span>
                                </div>
                            </>
                        ) : (
                            <div className="p-6">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-primary">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="font-medium text-foreground">Tải ảnh lên</p>
                                <p className="text-xs text-muted-foreground mt-1">Nên dùng ảnh toàn thân hoặc bán thân rõ nét</p>
                            </div>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                <Button 
                    onClick={handleGenerate} 
                    disabled={!userImage || !shirtImageUrl || isGenerating} 
                    className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20"
                >
                    {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang xử lý...</> : "✨ Mặc thử ngay"}
                </Button>
            </div>

            {/* CỘT PHẢI: Kết quả */}
            <div className="space-y-2 lg:border-l lg:pl-8 border-neutral-200">
                <label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Kết quả AI</label>
                <div className="aspect-[3/4] w-full bg-neutral-900 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
                    {isGenerating ? (
                        <div className="text-center text-white/80">
                            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                            <p>AI đang may đo cho bạn...</p>
                            <p className="text-xs text-white/50 mt-2">(Mất khoảng 10-15 giây)</p>
                        </div>
                    ) : resultImage ? (
                        <img src={resultImage} alt="Kết quả" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-center text-white/30 p-8">
                            <p>Kết quả sẽ hiện ở đây</p>
                        </div>
                    )}
                </div>

                {resultImage && (
                    <a href={resultImage} download={`artee-tryon-${Date.now()}.jpg`} className="block mt-4">
                        <Button variant="outline" className="w-full gap-2">
                            <Download className="w-4 h-4" /> Tải ảnh về máy
                        </Button>
                    </a>
                )}
            </div>

          </div>
        </div>
      </Card>
    </div>
  )
}