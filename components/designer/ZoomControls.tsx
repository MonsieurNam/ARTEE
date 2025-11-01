// components/designer/ZoomControls.tsx
"use client";

import { useDesignStore } from "@/store/design-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, RefreshCw } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

export default function ZoomControls() {
  const { canvas, zoomLevel, setZoomLevel } = useDesignStore(
    useShallow((state) => ({
      canvas: state.canvas,
      zoomLevel: state.zoomLevel,
      setZoomLevel: state.setZoomLevel,
    }))
  );

  const handleZoom = (factor: number) => {
    if (!canvas) return;
    const currentZoom = canvas.getZoom();
    const newZoom = currentZoom * factor;
    // Giới hạn mức zoom từ 10% đến 1000%
    const clampedZoom = Math.max(0.1, Math.min(newZoom, 10));
    canvas.setZoom(clampedZoom);
    setZoomLevel(clampedZoom);
  };
  
  const resetZoom = () => {
    if (!canvas) return;
    canvas.setZoom(1);
    setZoomLevel(1);
  }

  return (
    <Card className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => handleZoom(0.8)} // Thu nhỏ 20%
      >
        <Minus className="w-4 h-4" />
      </Button>
      <div
        className="text-sm font-medium text-center w-16 cursor-pointer"
        onClick={resetZoom}
        title="Reset Zoom"
      >
        {Math.round(zoomLevel * 100)}%
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => handleZoom(1.25)} // Phóng to 25%
      >
        <Plus className="w-4 h-4" />
      </Button>
    </Card>
  );
}