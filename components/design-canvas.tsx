// components/design-canvas.tsx
"use client"

import React from "react"
import { useEffect, useState, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Type, Trash2, ImageIcon, Copy } from "lucide-react"
import type { DesignElement } from "@/lib/cart"

// Props interface không thay đổi
interface DesignCanvasProps {
  productColor: string
  productType: string
  designElements: DesignElement[]
  onDesignChange: (elements: DesignElement[]) => void
}

const LOGO_LIBRARY = [
  { id: "logo1", name: "Star", emoji: "⭐" },
  { id: "logo2", name: "Heart", emoji: "❤️" },
  { id: "logo3", name: "Lightning", emoji: "⚡" },
  { id: "logo4", name: "Rocket", emoji: "🚀" },
  { id: "logo5", name: "Crown", emoji: "👑" },
  { id: "logo6", name: "Skull", emoji: "💀" },
  { id: "logo7", name: "Fire", emoji: "🔥" },
  { id: "logo8", name: "Diamond", emoji: "💎" },
]

const DesignCanvas = forwardRef<HTMLCanvasElement, DesignCanvasProps>(
  ({ productColor, productType, designElements, onDesignChange }, ref) => {
    // Không cần useRef nội bộ cho canvas nữa, vì chúng ta dùng ref từ cha
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [selectedElement, setSelectedElement] = useState<string | null>(null)
    const [textInput, setTextInput] = useState("")
    const [draggedElement, setDraggedElement] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    useEffect(() => {
      // TypeScript cần biết ref có thể là một hàm hoặc một đối tượng
      const canvas = (ref && 'current' in ref) ? ref.current : null;
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = productColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw border
      ctx.strokeStyle = "#ddd"
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, canvas.width, canvas.height)

      // Draw design elements
      designElements.forEach((element) => {
        ctx.save()

        const centerX = element.x + element.width! / 2
        const centerY = element.y + element.height! / 2
        
        ctx.translate(centerX, centerY)
        ctx.rotate((element.rotation * Math.PI) / 180)
        ctx.translate(-centerX, -centerY)

        if (element.type === "text") {
          ctx.font = `bold ${element.size}px Arial`
          ctx.fillStyle = element.color || "#000000"
          ctx.textAlign = "left"
          ctx.textBaseline = "top"
          ctx.fillText(element.content, element.x, element.y)
          
          // Cập nhật width/height cho text để xử lý click
          const metrics = ctx.measureText(element.content)
          element.width = metrics.width
          element.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        } else if (element.type === "image" && element.content) {
          // Xử lý emoji như text để dễ dàng scale
          ctx.font = `${element.size}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(element.content, element.x + element.size / 2, element.y + element.size / 2);

          element.width = element.size
          element.height = element.size
        }
        
        ctx.restore()

        // Draw selection box if selected
        if (selectedElement === element.id) {
          ctx.strokeStyle = "#0074D9"
          ctx.lineWidth = 2
          ctx.strokeRect(element.x - 2, element.y - 2, element.width! + 4, element.height! + 4)
        }
      })
    }, [designElements, selectedElement, productColor, ref])

    const addTextElement = () => {
      if (!textInput.trim()) return

      const newElement: DesignElement = {
        id: Date.now().toString(),
        type: "text",
        content: textInput,
        x: 50,
        y: 150,
        size: 32,
        color: "#000000",
        rotation: 0,
        width: 0, // Sẽ được tính trong useEffect
        height: 0, // Sẽ được tính trong useEffect
      }

      onDesignChange([...designElements, newElement])
      setTextInput("")
    }

    const addLogoElement = (emoji: string) => {
      const newElement: DesignElement = {
        id: `logo-${Date.now()}`,
        type: "image",
        content: emoji,
        x: 100,
        y: 100,
        size: 48,
        rotation: 0,
        width: 48,
        height: 48,
      }

      onDesignChange([...designElements, newElement])
    }

    const updateElement = (id: string, updates: Partial<DesignElement>) => {
      onDesignChange(designElements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
    }

    const deleteElement = (id: string) => {
      onDesignChange(designElements.filter((el) => el.id !== id))
      setSelectedElement(null)
    }

    const duplicateElement = (id: string) => {
      const element = designElements.find((el) => el.id === id)
      if (!element) return

      const newElement = {
        ...element,
        id: `${element.type}-copy-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
      }

      onDesignChange([...designElements, newElement])
    }

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = (ref && 'current' in ref) ? ref.current : null;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect()

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Tìm phần tử được click theo thứ tự ngược lại (từ trên xuống dưới)
      const clickedElement = [...designElements].reverse().find(element => 
        x >= element.x && x <= element.x + element.width! &&
        y >= element.y && y <= element.y + element.height!
      );

      if (clickedElement) {
        setSelectedElement(clickedElement.id)
        setDraggedElement(clickedElement.id)
        setDragOffset({ x: x - clickedElement.x, y: y - clickedElement.y })
      } else {
        setSelectedElement(null)
      }
    }

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!draggedElement) return
      
      const canvas = (ref && 'current' in ref) ? ref.current : null;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect()
      
      const element = designElements.find(el => el.id === draggedElement);
      if (!element) return;

      const x = e.clientX - rect.left - dragOffset.x
      const y = e.clientY - rect.top - dragOffset.y

      // Giới hạn di chuyển trong canvas
      const boundedX = Math.max(0, Math.min(x, canvas.width - element.width!))
      const boundedY = Math.max(0, Math.min(y, canvas.height - element.height!))

      updateElement(draggedElement, { x: boundedX, y: boundedY })
    }

    const handleCanvasMouseUp = () => {
      setDraggedElement(null)
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-center bg-gray-50 rounded-lg p-2 md:p-4 border border-border overflow-x-auto">
          <canvas
            ref={ref} // Gán thẳng ref từ cha vào đây
            width={400}
            height={500}
            className="border-2 border-border rounded cursor-move shadow-lg min-w-fit"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm md:text-base">Thêm phần tử</h3>
            <div className="space-y-3">
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Nhập văn bản..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                  onKeyPress={(e) => e.key === "Enter" && addTextElement()}
                />
                <Button size="sm" onClick={addTextElement} className="gap-2 whitespace-nowrap">
                  <Type className="w-4 h-4" />
                  Thêm
                </Button>
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-2"
                  disabled // Tạm thời vô hiệu hóa cho MVP để tập trung vào text và logo
                >
                  <ImageIcon className="w-4 h-4" />
                  Tải hình ảnh (sắp có)
                </Button>
              </div>
            </div>
          </Card>
          {/* <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm md:text-base">Thư viện logo</h3>
            <div className="grid grid-cols-4 gap-2">
              {LOGO_LIBRARY.map((logo) => (
                <button
                  key={logo.id}
                  onClick={() => addLogoElement(logo.emoji)}
                  className="aspect-square flex items-center justify-center text-xl md:text-2xl bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-border"
                  title={logo.name}
                >
                  {logo.emoji}
                </button>
              ))}
            </div>
          </Card> */}
        </div>

        {designElements.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm md:text-base">
              Các phần tử ({designElements.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {designElements.map((element) => (
                <div
                  key={element.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors text-sm ${
                    selectedElement === element.id
                      ? "bg-primary/10 border-primary"
                      : "bg-gray-50 border-border hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {element.type === "text" ? `Text: "${element.content}"` : `Logo: ${element.content}`}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); duplicateElement(element.id) }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); deleteElement(element.id) }}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {selectedElement && designElements.find(el => el.id === selectedElement) && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-foreground mb-3 text-sm md:text-base">Chỉnh sửa phần tử đã chọn</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground block mb-2">
                  Kích thước: {designElements.find((el) => el.id === selectedElement)?.size}px
                </label>
                <input
                  type="range"
                  min={designElements.find((el) => el.id === selectedElement)?.type === 'text' ? "12" : "20"}
                  max={designElements.find((el) => el.id === selectedElement)?.type === 'text' ? "72" : "150"}
                  value={designElements.find((el) => el.id === selectedElement)?.size || 32}
                  onChange={(e) => updateElement(selectedElement, { size: Number.parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {designElements.find((el) => el.id === selectedElement)?.type === "text" && (
                <div>
                  <label className="text-xs md:text-sm font-medium text-foreground block mb-2">Màu sắc</label>
                  <input
                    type="color"
                    value={designElements.find((el) => el.id === selectedElement)?.color || "#000000"}
                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer border border-border"
                  />
                </div>
              )}

              <div>
                <label className="text-xs md:text-sm font-medium text-foreground block mb-2">
                  Xoay: {designElements.find((el) => el.id === selectedElement)?.rotation}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={designElements.find((el) => el.id === selectedElement)?.rotation || 0}
                  onChange={(e) => updateElement(selectedElement, { rotation: Number.parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    )
  }
)

DesignCanvas.displayName = 'DesignCanvas';

export default DesignCanvas