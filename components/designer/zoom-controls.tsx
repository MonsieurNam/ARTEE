"use client";
import { useDesignStore } from "@/store/design-store";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react"; // Icon để reset

export function ZoomControls() {
  // Lấy trạng thái từ store
  const { canvas, zoomLevel, setZoomLevel } = useDesignStore();

  /**
   * Hàm này sẽ reset cả Zoom và Pan (vị trí kéo)
   */
  const resetView = () => {
    if (canvas) {
      // 1. Reset zoom về 100%
      canvas.setZoom(1);
      
      // 2. Reset pan (vị trí kéo) về trung tâm (0, 0)
      // Cấu trúc: [scaleX, skewY, skewX, scaleY, panX, panY]
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      
      // 3. Cập nhật state trong store để UI đồng bộ
      setZoomLevel(1);
    }
  };
  
  return (
    <div className="flex items-center justify-center gap-2 bg-gray-100 p-1 rounded-lg border">
      
      {/* Nút Reset (Quay về trung tâm) */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={resetView} 
        title="Quay về trung tâm (100%)"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>

      {/* Hiển thị % zoom (lấy từ store) */}
      <span className="text-sm font-medium w-12 text-center tabular-nums">
        {Math.round(zoomLevel * 100)}%
      </span>
    </div>
  );
}