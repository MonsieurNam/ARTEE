"use client";

import { useRef, useEffect } from "react";
import { useDesignStore } from "@/store/design-store";
import * as fabric from "fabric";

// Hằng số cho Giai đoạn 1
const MIN_ZOOM = 0.5; // Zoom ra tối thiểu 50%
const MAX_ZOOM = 3;   // Zoom vào tối đa 300%

interface UseCanvasProps {
  width: number;
  height: number;
}

export const useCanvas = ({ width, height }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { setCanvas, setLayers, setSelectedObject, setZoomLevel } = useDesignStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
    });
    setCanvas(canvas);

    // ===================================================
    // BIẾN CỤC BỘ CHO GIAI ĐOẠN 2 (PANNING)
    // ===================================================
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;
    // ===================================================


    // ===================================
    // LOGIC GIAI ĐOẠN 1 (ZOOM) - (Đã chạy đúng)
    // ===================================
    const handleMouseWheel = (opt: fabric.TPointerEventInfo<WheelEvent>) => {
      opt.e.preventDefault();
      opt.e.stopPropagation();

      const currentCanvas = useDesignStore.getState().canvas;
      if (!currentCanvas) return;

      const delta = opt.e.deltaY;
      let zoom = currentCanvas.getZoom();
      
      zoom *= 0.999 ** delta;
      if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
      if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;

      currentCanvas.zoomToPoint(
        new fabric.Point(opt.e.offsetX, opt.e.offsetY),
        zoom
      );

      setZoomLevel(zoom);
    };

    // ===================================
    // BẮT ĐẦU LOGIC GIAI ĐOẠN 2 (PAN - ĐÃ SỬA LỖI)
    // ===================================
    
    // 1. Lắng nghe phím Alt
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentCanvas = useDesignStore.getState().canvas;
      if (e.key === 'Alt' && currentCanvas && !isPanning) {
        currentCanvas.selection = false;
        currentCanvas.defaultCursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const currentCanvas = useDesignStore.getState().canvas;
      if (e.key === 'Alt' && currentCanvas && !isPanning) {
        currentCanvas.selection = true;
        currentCanvas.defaultCursor = 'default';
      }
    };

    // 2. Lắng nghe sự kiện chuột/chạm TRÊN CANVAS
    // Sửa kiểu (type) của 'opt' thành TPointerEventInfo<PointerEvent>
    const handleMouseDown = (opt: fabric.TPointerEventInfo<PointerEvent>) => {
      const currentCanvas = useDesignStore.getState().canvas;
      const e = opt.e; // e bây giờ là 'PointerEvent'

      // Bắt đầu pan NẾU giữ phím Alt
      if (e.altKey && currentCanvas) {
        isPanning = true;
        currentCanvas.selection = false;
        currentCanvas.defaultCursor = 'grabbing';
        
        // 'PointerEvent' đã bao gồm clientX/Y
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    };

    const handleMouseMove = (opt: fabric.TPointerEventInfo<PointerEvent>) => {
      const currentCanvas = useDesignStore.getState().canvas;
      if (isPanning && currentCanvas && currentCanvas.viewportTransform) {
        const e = opt.e; // e bây giờ là 'PointerEvent'
        const vpt = currentCanvas.viewportTransform;
        
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        currentCanvas.requestRenderAll();
        
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    };

    const handleMouseUp = (opt: fabric.TPointerEventInfo<PointerEvent>) => {
      const currentCanvas = useDesignStore.getState().canvas;
      if (isPanning && currentCanvas) {
        isPanning = false;
        currentCanvas.defaultCursor = opt.e.altKey ? 'grab' : 'default';
        if (!opt.e.altKey) {
            currentCanvas.selection = true;
        }
      }
    };
    // ===================================
    // KẾT THÚC LOGIC GIAI ĐOẠN 2 (PAN - ĐÃ SỬA LỖI)
    // ===================================

    // Dùng 'any' để tránh lỗi typing cứng của Fabric v6
    const updateStore = (e: any) => {
      const objects = canvas.getObjects();
      console.log(
        `%c[use-canvas] Event: ${e?.type || "unknown"}. Canvas hiện có ${objects.length} đối tượng.`,
        "color: green"
      );

      setLayers(objects);

      const activeObject = canvas.getActiveObject();
      setSelectedObject(activeObject || null);
    };

    // === Đăng ký listener ===
    // Sửa 'IEvent' thành 'TEvent'
    canvas.on("mouse:wheel", handleMouseWheel);
    canvas.on('mouse:down', handleMouseDown as (e: fabric.TEvent) => void);
    canvas.on('mouse:move', handleMouseMove as (e: fabric.TEvent) => void);
    canvas.on('mouse:up', handleMouseUp as (e: fabric.TEvent) => void);

    canvas.on("object:added", updateStore);
    canvas.on("object:removed", updateStore);
    canvas.on("object:modified", updateStore);
    canvas.on("selection:created", updateStore);
    canvas.on("selection:updated", updateStore);
    canvas.on("selection:cleared", updateStore);

    // Đăng ký listener Giai đoạn 2 vào window
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Gọi lần đầu
    updateStore({ type: "initial_load" });

    // === Dọn dẹp listener ===
    // Sửa 'IEvent' thành 'TEvent'
    return () => {
      canvas.off("mouse:wheel", handleMouseWheel);
      canvas.off('mouse:down', handleMouseDown as (e: fabric.TEvent) => void);
      canvas.off('mouse:move', handleMouseMove as (e: fabric.TEvent) => void);
      canvas.off('mouse:up', handleMouseUp as (e: fabric.TEvent) => void);

      canvas.off("object:added", updateStore);
      canvas.off("object:removed", updateStore);
      canvas.off("object:modified", updateStore);
      canvas.off("selection:created", updateStore);
      canvas.off("selection:updated", updateStore);
      canvas.off("selection:cleared", updateStore);

      // Dọn dẹp listener Giai đoạn 2
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      setCanvas(null);
      canvas.dispose();
    };
  }, [width, height, setCanvas, setLayers, setSelectedObject, setZoomLevel]);

  return { canvasRef };
};