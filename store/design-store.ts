// store/design-store.ts
import { create } from 'zustand';
import * as fabric from 'fabric';

declare module "fabric" {
  interface FabricObject {
    data?: {
      id?: string;
      [key: string]: any;
    };
  }
}
// Định nghĩa kiểu dữ liệu cho một layer được đơn giản hóa để hiển thị trên UI
export interface UILayer {
  id: string;
  type: string;
  title: string;
  side: 'front' | 'back'; // <-- THÊM MỚI: Cho biết layer thuộc mặt nào
}

interface DesignState {
  canvas: fabric.Canvas | null;
  activeSide: 'front' | 'back'; // <-- THÊM MỚI
  layers: UILayer[];
  selectedObject: fabric.Object | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setActiveSide: (side: 'front' | 'back') => void; // <-- THÊM MỚI
  setLayers: (objects: fabric.Object[]) => void;
  setSelectedObject: (obj: fabric.Object | null) => void;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  // --- STATE ---
  canvas: null,
  activeSide: 'front', // <-- THÊM MỚI: Mặc định là mặt trước
  layers: [],
  selectedObject: null,

  // --- ACTIONS ---
  setCanvas: (canvasInstance) => set({ canvas: canvasInstance }),
  
  // <-- THÊM MỚI ACTION -->
  setActiveSide: (side) => {
    const canvas = get().canvas;
    if (!canvas) return;

    // Logic chuyển đổi hiển thị layer
    canvas.getObjects().forEach(obj => {
      // Chỉ hiển thị object nào có 'side' khớp với side mới
      obj.set('visible', obj.data?.side === side);
    });
    canvas.discardActiveObject();
    canvas.renderAll();
    
    // Cập nhật state
    set({ activeSide: side, selectedObject: null });
  },
  
  setLayers: (objects) => {
    const newLayers: UILayer[] = objects.map((obj) => {
      const id = obj.data?.id || '';
      const side = obj.data?.side || 'front'; // Lấy side từ data của object
      let title = 'Đối tượng không tên';
      if (obj.type === 'i-text') {
        title = (obj as fabric.IText).text || 'Văn bản trống';
      } else if (obj.type === 'image') {
        title = 'Hình ảnh';
      }
      return { id, type: obj.type || 'unknown', title, side };
    }).reverse();
    set({ layers: newLayers });
  },
  
  setSelectedObject: (obj) => {
    set({ selectedObject: obj });
  },
}));