"use client";

import { useRef, useEffect } from "react";
import { useDesignStore } from "@/store/design-store";
import * as fabric from "fabric";

interface UseCanvasProps {
  width: number;
  height: number;
}

export const useCanvas = ({ width, height }: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, setLayers, setSelectedObject } = useDesignStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
    });
    setCanvas(canvas);

    // 👇 Dùng 'any' để tránh lỗi typing cứng của Fabric v6
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

    // Đăng ký listener
    canvas.on("object:added", updateStore);
    canvas.on("object:removed", updateStore);
    canvas.on("object:modified", updateStore);
    canvas.on("selection:created", updateStore);
    canvas.on("selection:updated", updateStore);
    canvas.on("selection:cleared", updateStore);

    // Gọi lần đầu
    updateStore({ type: "initial_load" });

    return () => {
      canvas.off("object:added", updateStore);
      canvas.off("object:removed", updateStore);
      canvas.off("object:modified", updateStore);
      canvas.off("selection:created", updateStore);
      canvas.off("selection:updated", updateStore);
      canvas.off("selection:cleared", updateStore);

      setCanvas(null);
      canvas.dispose();
    };
  }, [width, height, setCanvas, setLayers, setSelectedObject]);

  return { canvasRef };
};
