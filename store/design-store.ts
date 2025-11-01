// store/design-store.ts
// THAY THẾ TOÀN BỘ FILE BẰNG PHIÊN BẢN ĐÃ ĐƯỢC DỌN DẸP NÀY

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

export interface UILayer {
  id: string;
  type: string;
  title: string;
  side: 'front' | 'back';
}

interface DesignState {
  canvas: fabric.Canvas | null;
  activeSide: 'front' | 'back';
  layers: UILayer[];
  selectedObject: fabric.Object | null;
  isLoadingProject: boolean;
  projectToLoad: string | null;
  activeProjectId: string | null;
  zoomLevel: number;

  setCanvas: (canvas: fabric.Canvas | null) => void;
  setActiveSide: (side: 'front' | 'back') => void;
  setLayers: (objects: fabric.Object[]) => void;
  setSelectedObject: (obj: fabric.Object | null) => void;
  startLoadingProject: (projectJSON: string) => void;
  finishLoadingProject: () => void;
  setActiveProjectId: (id: string | null) => void;
  setZoomLevel: (level: number) => void;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  // --- STATE ---
  canvas: null,
  activeSide: 'front',
  layers: [],
  selectedObject: null,
  isLoadingProject: false,
  projectToLoad: null,
  activeProjectId: null,
  zoomLevel: 1,

  // --- ACTIONS ---
  setCanvas: (canvasInstance) => set({ canvas: canvasInstance }),
  
  setActiveSide: (side) => {
    // Khi đổi mặt áo, bỏ chọn đối tượng để tránh lỗi
    get().canvas?.discardActiveObject();
    get().canvas?.renderAll();
    set({ activeSide: side, selectedObject: null });
  },
  
  setLayers: (objects) => {
    const newLayers: UILayer[] = objects
      .filter(obj => !obj.excludeFromExport) // Lọc bỏ các đối tượng hệ thống như Safe Area
      .map((obj) => {
        const id = obj.data?.id || '';
        const side = obj.data?.side || 'front';
        let title = 'Đối tượng';
        if (obj.type === 'i-text') {
          title = (obj as fabric.IText).text || 'Văn bản';
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

  startLoadingProject: (projectJSON) => {
    set({ 
      isLoadingProject: true, 
      projectToLoad: projectJSON, 
      activeProjectId: null 
    });
  },
  
  finishLoadingProject: () => {
    set({ isLoadingProject: false, projectToLoad: null });
  },

  setActiveProjectId: (id) => set({ activeProjectId: id }),
  
  setZoomLevel: (level) => set({ zoomLevel: level }),
}));