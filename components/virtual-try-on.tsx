// components/virtual-try-on.tsx
"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCw, Zap } from "lucide-react"
import ARModal from "./ar-modal"
import type { DesignElement } from "@/lib/cart"

interface VirtualTryOnProps {
  productType: string
  productColor: string
  designElements: DesignElement[]
}

export default function VirtualTryOn({ productType, productColor, designElements }: VirtualTryOnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [showARModal, setShowARModal] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear background
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, width, height)

    // Save context for transformations
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.scale(scale, scale)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-width / 2, -height / 2)

    // Draw shirt body with gradient
    const shirtX = width / 2 - 80
    const shirtY = 40
    const shirtWidth = 160
    const shirtHeight = 280

    // Shirt gradient
    const gradient = ctx.createLinearGradient(shirtX, shirtY, shirtX + shirtWidth, shirtY + shirtHeight)
    gradient.addColorStop(0, productColor)
    gradient.addColorStop(0.5, adjustBrightness(productColor, 10))
    gradient.addColorStop(1, adjustBrightness(productColor, -10))

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(shirtX, shirtY + 30)
    ctx.quadraticCurveTo(shirtX + shirtWidth / 2, shirtY, shirtX + shirtWidth, shirtY + 30)
    ctx.lineTo(shirtX + shirtWidth, shirtY + shirtHeight)
    ctx.lineTo(shirtX, shirtY + shirtHeight)
    ctx.closePath()
    ctx.fill()

    // Neckline
    ctx.fillStyle = adjustBrightness(productColor, -20)
    ctx.beginPath()
    ctx.ellipse(width / 2, shirtY + 25, 25, 15, 0, 0, Math.PI * 2)
    ctx.fill()

    // Left sleeve
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(shirtX, shirtY + 40)
    ctx.quadraticCurveTo(shirtX - 40, shirtY + 60, shirtX - 50, shirtY + 120)
    ctx.lineTo(shirtX - 30, shirtY + 120)
    ctx.quadraticCurveTo(shirtX - 20, shirtY + 60, shirtX, shirtY + 50)
    ctx.closePath()
    ctx.fill()

    // Right sleeve
    ctx.beginPath()
    ctx.moveTo(shirtX + shirtWidth, shirtY + 40)
    ctx.quadraticCurveTo(shirtX + shirtWidth + 40, shirtY + 60, shirtX + shirtWidth + 50, shirtY + 120)
    ctx.lineTo(shirtX + shirtWidth + 30, shirtY + 120)
    ctx.quadraticCurveTo(shirtX + shirtWidth + 20, shirtY + 60, shirtX + shirtWidth, shirtY + 50)
    ctx.closePath()
    ctx.fill()

    // Draw design elements on shirt
    const designAreaX = shirtX + 20
    const designAreaY = shirtY + 80
    const designAreaWidth = shirtWidth - 40
    const designAreaHeight = 120

    // Design area background (subtle)
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)"
    ctx.fillRect(designAreaX, designAreaY, designAreaWidth, designAreaHeight)

    // Draw design elements
    designElements.forEach((element) => {
      ctx.save()
      const elementX = designAreaX + (element.x / 400) * designAreaWidth
      const elementY = designAreaY + (element.y / 500) * designAreaHeight

      ctx.translate(elementX, elementY)
      ctx.rotate((element.rotation * Math.PI) / 180)

      if (element.type === "text") {
        const fontSize = Math.max(8, (element.size / 32) * 16)
        ctx.font = `bold ${fontSize}px Arial`
        ctx.fillStyle = element.color || "#000000"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.fillText(element.content, 0, 0)
      } else if (element.type === "image") {
        ctx.font = `${Math.max(12, (element.size / 48) * 24)}px Arial`
        ctx.fillStyle = "#000000"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(element.content, 0, 0)
      }

      ctx.restore()
    })

    // Add shadow/depth
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.beginPath()
    ctx.ellipse(width / 2, shirtY + shirtHeight + 20, 100, 15, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }, [productColor, designElements, rotation, scale, productType])

  const adjustBrightness = (color: string, percent: number): string => {
    const num = Number.parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min(255, (num >> 16) + amt)
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt)
    const B = Math.min(255, (num & 0x0000ff) + amt)
    return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`
  }

  return (
    <>
      <div className="space-y-4">
        {/* Canvas */}
        <div className="flex justify-center bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg p-8 border border-border">
          <canvas ref={canvasRef} width={500} height={600} className="rounded-lg shadow-2xl border-2 border-white" />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Xoay: {rotation}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number.parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Phóng to: {(scale * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setRotation(0)
              setScale(1)
            }}
            className="gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Đặt lại
          </Button>
          <Button onClick={() => setShowARModal(true)} className="gap-2 bg-primary hover:bg-primary/90 text-white">
            <Zap className="w-4 h-4" />
            Trải nghiệm AR
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            Đây là bản xem trước 3D của thiết kế của bạn. Nhấn "Trải nghiệm AR" để xem hình ảnh marker và mã QR.
          </p>
        </div>
      </div>

      {/* AR Modal */}
      <ARModal
        isOpen={showARModal}
        onClose={() => setShowARModal(false)}
        productColor={productColor}
        productType={productType}
        designElements={designElements}
      />
    </>
  )
}
