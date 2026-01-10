// components/virtual-try-on-modal.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Upload, Loader2, Download, RotateCcw, Shirt, Sparkles, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { compressImage } from "@/lib/image-helper"
import { COLLECTION } from "@/lib/content"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- Helper Functions ---
async function resizeImage(dataUri: string, targetSize: number = 1024): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetSize, targetSize);
      const scale = Math.min(targetSize / img.width, targetSize / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (targetSize - w) / 2, (targetSize - h) / 2, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = dataUri;
  });
}

// --- Component Chính ---
interface VirtualTryOnModalProps {
  isOpen: boolean
  onClose: () => void
  shirtImageUrl?: string | null
  productPose?: 'front' | 'back'
}

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  shirtImageUrl: initialShirtUrl,
  productPose: initialPose = 'front',
}: VirtualTryOnModalProps) {
  
  const [userImage, setUserImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeProductId, setActiveProductId] = useState<number>(COLLECTION.products[0].id)
  const [currentPose, setCurrentPose] = useState<'front' | 'back'>(initialPose)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  let currentShirtUrl = initialShirtUrl;

  if (!initialShirtUrl) {
    const activeProduct = COLLECTION.products.find(p => p.id === activeProductId) || COLLECTION.products[0];
    const imageObj = activeProduct.galleryImages.find(img => img.pose === currentPose);
    currentShirtUrl = imageObj ? imageObj.url : activeProduct.galleryImages[0].url;
  }

  useEffect(() => {
    if (isOpen) {
      setResultImage(null)
    }
  }, [isOpen])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
        toast({ title: "Lỗi", description: "Vui lòng chọn file ảnh", variant: "destructive" });
        return;
    }
    setIsProcessing(true);
    try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader()
        reader.onload = (event: ProgressEvent<FileReader>) => {
            setUserImage(event.target?.result as string)
            setResultImage(null)
            setIsProcessing(false);
        }
        reader.readAsDataURL(compressedFile)
    } catch (error) {
        setIsProcessing(false);
    }
  }

  const handleGenerate = async () => {
    if (!userImage || !currentShirtUrl) return
    setIsGenerating(true)
    setResultImage(null)

    try {
      const resizedUser = await resizeImage(userImage, 1024);
      const shirtRes = await fetch(currentShirtUrl);
      const shirtBlob = await shirtRes.blob();
      const shirtBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(shirtBlob);
      });
      const resizedShirt = await resizeImage(shirtBase64, 1024);

      const response = await fetch("/api/virtual-try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: resizedUser,
          mockupImage: resizedShirt,
          productPose: currentPose,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      setResultImage(data.imageUrl);

    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể tạo ảnh. Thử lại sau nhé.", variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-neutral-950 to-black z-[60] flex items-center justify-center p-2 md:p-4 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="relative w-full max-w-7xl h-[92vh] md:h-[88vh] flex flex-col bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-neutral-800/50 shadow-2xl overflow-hidden text-white backdrop-blur-xl">
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 pointer-events-none"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-5 md:p-6 border-b border-neutral-800/50 bg-gradient-to-r from-neutral-900/80 via-neutral-900/50 to-neutral-900/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-purple-600/20">
                <Shirt className="w-5 h-5 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
            </div>
            <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">Phòng Thử Đồ AI</h2>
                <p className="text-xs text-neutral-400 hidden md:block flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Trải nghiệm thời trang với công nghệ AI tiên tiến
                </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="hover:bg-white/10 text-neutral-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="relative flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* DANH SÁCH SẢN PHẨM */}
            {!initialShirtUrl && (
                <div className="lg:col-span-3 bg-gradient-to-b from-black via-neutral-950 to-black border-r border-neutral-800/30 overflow-y-auto p-5 custom-scrollbar">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-600/50 to-transparent"></div>
                      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Bộ Sưu Tập</h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-600/50 to-transparent"></div>
                    </div>
                    <div className="space-y-3">
                        {COLLECTION.products.map(product => (
                            <div 
                                key={product.id}
                                onClick={() => setActiveProductId(product.id)}
                                className={`group relative p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-3 overflow-hidden ${
                                    activeProductId === product.id 
                                    ? 'border-purple-600 bg-gradient-to-br from-purple-600/20 via-purple-600/10 to-transparent shadow-lg shadow-purple-600/20 scale-105' 
                                    : 'border-neutral-800/50 hover:border-purple-600/50 bg-neutral-900/50 hover:bg-neutral-900/80 hover:scale-102'
                                }`}
                            >
                                {activeProductId === product.id && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse"></div>
                                )}
                                <div className="relative">
                                  <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="w-14 h-14 object-cover rounded-xl bg-white shadow-md transition-transform duration-300 group-hover:scale-110"
                                  />
                                  {activeProductId === product.id && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full border-2 border-neutral-950 animate-pulse"></div>
                                  )}
                                </div>
                                <div className="relative flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate transition-colors duration-300 ${activeProductId === product.id ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-purple-400 font-medium truncate">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* KHU VỰC CHÍNH */}
            <div className={`${initialShirtUrl ? 'lg:col-span-12' : 'lg:col-span-9'} flex flex-col h-full bg-gradient-to-b from-neutral-900/50 to-black/50 overflow-y-auto`}>
                
                {/* Pose Selector */}
                <div className="relative p-5 border-b border-neutral-800/30 flex justify-center sticky top-0 bg-neutral-900/80 backdrop-blur-xl z-10">
                    <Tabs value={currentPose} onValueChange={(v: string) => setCurrentPose(v as 'front' | 'back')}>
                        <TabsList className="bg-neutral-800/50 text-neutral-400 border border-neutral-700/50 backdrop-blur-xl p-1 rounded-2xl shadow-lg">
                            <TabsTrigger 
                              value="front" 
                              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-600/30 rounded-xl transition-all duration-300 px-6"
                            >
                              Mặt Trước
                            </TabsTrigger>
                            <TabsTrigger 
                              value="back" 
                              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-600/30 rounded-xl transition-all duration-300 px-6"
                            >
                              Mặt Sau
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex-1 p-4 md:p-10 flex flex-col md:flex-row gap-10 items-start justify-center">
                    
                    {/* Ảnh Áo Đang Chọn */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-600/50"></div>
                          <p className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Sản phẩm</p>
                          <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-600/50"></div>
                        </div>
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-purple-600/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative aspect-[3/4] bg-gradient-to-br from-white via-neutral-50 to-white rounded-2xl p-6 flex items-center justify-center shadow-2xl border border-neutral-200/50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5"></div>
                            <img src={currentShirtUrl || ''} className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" alt="Shirt" />
                            <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 shadow-lg">
                                {currentPose === 'front' ? 'Front' : 'Back'}
                            </div>
                          </div>
                        </div>
                    </div>

                    {/* Ảnh Người Dùng & Kết Quả */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-600/50"></div>
                          <p className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            {resultImage ? 'Kết quả' : 'Ảnh của bạn'}
                          </p>
                          <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-600/50"></div>
                        </div>
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-br from-purple-600/40 via-blue-600/40 to-purple-600/40 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                          <div className="relative aspect-[3/4] bg-gradient-to-br from-neutral-900 via-neutral-950 to-black rounded-2xl border-2 border-dashed border-neutral-700/50 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                            
                            {resultImage ? (
                                <div className="relative w-full h-full">
                                  <img src={resultImage} className="w-full h-full object-contain" alt="Result" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                                </div>
                            ) : userImage ? (
                                <div className="relative w-full h-full">
                                  <img src={userImage} className="w-full h-full object-cover" alt="User" />
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="relative w-20 h-20 mx-auto mb-5">
                                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                      <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center border border-purple-600/30 backdrop-blur-xl">
                                        <Camera className="w-10 h-10 text-purple-400" />
                                      </div>
                                    </div>
                                    <p className="text-base font-semibold text-white mb-2">Tải ảnh toàn thân</p>
                                    <p className="text-xs text-neutral-500 leading-relaxed max-w-[200px] mx-auto">
                                      Nên mặc áo gọn gàng để AI xử lý tốt nhất
                                    </p>
                                </div>
                            )}

                            {/* Loading */}
                            {(isProcessing || isGenerating) && (
                                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-950/90 to-black/95 z-20 flex flex-col items-center justify-center backdrop-blur-xl">
                                    <div className="relative">
                                      <div className="absolute inset-0 bg-purple-600/50 rounded-full blur-2xl animate-pulse"></div>
                                      <Loader2 className="relative w-16 h-16 text-purple-400 animate-spin" />
                                    </div>
                                    <p className="text-purple-300 font-semibold mt-6 animate-pulse text-lg tracking-wide">
                                        {isProcessing ? "Đang xử lý ảnh..." : "AI đang may đồ..."}
                                    </p>
                                    <div className="flex gap-1 mt-3">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}

                            {/* Input File */}
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                onChange={handleImageUpload}
                                disabled={isProcessing || isGenerating}
                            />

                            {/* Reset Button */}
                            {resultImage && (
                                <Button 
                                    size="icon" 
                                    variant="secondary" 
                                    className="absolute top-3 right-3 z-30 bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl border border-white/30 shadow-xl hover:scale-110 transition-all duration-300 rounded-xl"
                                    onClick={(e: { stopPropagation: () => void }) => { e.stopPropagation(); setResultImage(null); }}
                                    title="Thử lại"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                                onClick={handleGenerate} 
                                disabled={!userImage || isGenerating || isProcessing}
                                className="relative w-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:from-purple-700 hover:via-purple-600 hover:to-blue-700 text-white font-bold h-14 rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <Sparkles className="mr-2 w-5 h-5" />
                                {isGenerating ? "Đang chạy..." : "Mặc thử ngay"}
                            </Button>
                            {resultImage ? (
                                <a href={resultImage} download={`artee-tryon-${Date.now()}.jpg`} className="w-full">
                                    <Button 
                                      variant="outline" 
                                      className="w-full h-14 border-2 border-purple-600/50 hover:border-purple-600 hover:bg-purple-600/10 text-white bg-transparent rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 shadow-lg"
                                    >
                                        <Download className="mr-2 w-5 h-5" /> Tải về
                                    </Button>
                                </a>
                            ) : (
                                <Button 
                                  variant="outline" 
                                  className="w-full h-14 border-2 border-neutral-800 bg-neutral-900/50 text-neutral-600 cursor-not-allowed rounded-xl" 
                                  disabled
                                >
                                    <Download className="mr-2 w-5 h-5" /> Tải về
                                </Button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </Card>
    </div>
  )
}