// components/virtual-try-on-modal.tsx
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload, Loader2, Download, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// --- BƯỚC SỬA LỖI QUAN TRỌNG NHẤT LÀ Ở ĐÂY ---
// Thay thế hoàn toàn interface cũ bằng interface này.
interface VirtualTryOnModalProps {
  isOpen: boolean
  onClose: () => void
  shirtImageUrl: string | null // <-- Prop này được yêu cầu bởi customizer/page.tsx
}
// --- KẾT THÚC BƯỚC SỬA LỖI ---


export default function VirtualTryOnModal({
  isOpen,
  onClose,
  shirtImageUrl,
}: VirtualTryOnModalProps) {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Reset state khi ảnh áo mẫu thay đổi (ví dụ: người dùng mở lại modal với thiết kế khác)
  useEffect(() => {
    if (isOpen) {
        setUserImage(null);
        setResultImage(null);
        setIsGenerating(false);
    }
  }, [isOpen, shirtImageUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Lỗi", description: "Kích thước ảnh không được vượt quá 5MB", variant: "destructive" })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setUserImage(event.target?.result as string)
      setResultImage(null) // Reset kết quả cũ khi có ảnh mới
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!userImage || !shirtImageUrl) {
      toast({ title: "Lỗi", description: "Vui lòng tải lên ảnh của bạn và đảm bảo ảnh áo đã sẵn sàng.", variant: "destructive" })
      return
    }

    setIsGenerating(true)
    setResultImage(null)

    try {
      const response = await fetch("/api/virtual-try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage,
          shirtImageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Không thể tạo hình ảnh thử đồ.")
      }

      const data = await response.json()
      setResultImage(data.imageUrl)

      toast({ title: "Thành công", description: "Hình ảnh thử đồ ảo đã được tạo." })
    } catch (error) {
      console.error("Lỗi khi tạo ảnh thử đồ ảo:", error)
      toast({ title: "Lỗi", description: error instanceof Error ? error.message : "Đã có lỗi xảy ra.", variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">Thử đồ ảo</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">1. Áo mẫu</label>
              <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
                {shirtImageUrl ? <img src={shirtImageUrl} alt="Áo mẫu" className="w-full h-full object-contain rounded-lg"/> : <p className="text-xs text-muted-foreground">Không có ảnh áo</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">2. Ảnh của bạn</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square w-full border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center justify-center"
              >
                {userImage ? (
                  <img src={userImage} alt="Ảnh người dùng" className="w-full h-full object-contain rounded-lg"/>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Tải ảnh chân dung</p>
                    <p className="text-xs text-muted-foreground">(Từ ngực trở lên)</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>
          
          <Button onClick={handleGenerate} disabled={!userImage || !shirtImageUrl || isGenerating} className="w-full py-6 text-base gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</> : "Ghép ảnh thử đồ"}
          </Button>

          {resultImage && (
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground">Kết quả</h3>
              <img src={resultImage} alt="Kết quả thử đồ" className="w-full rounded-lg border border-border"/>
              <a href={resultImage} download={`artee-try-on-${Date.now()}.png`}>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Download className="w-4 h-4" /> Tải xuống hình ảnh
                </Button>
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}