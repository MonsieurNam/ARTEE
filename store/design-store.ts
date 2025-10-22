// FILE: store/design-store.ts
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
  activeProjectId: string | null; // ID của dự án đang được chỉnh sửa

  setCanvas: (canvas: fabric.Canvas | null) => void;
  setActiveSide: (side: 'front' | 'back') => void;
  setLayers: (objects: fabric.Object[]) => void;
  setSelectedObject: (obj: fabric.Object | null) => void;
  
  startLoadingProject: (projectJSON: string) => void;
  finishLoadingProject: () => void;
  setActiveProjectId: (id: string | null) => void;
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

  // --- ACTIONS ---
  setCanvas: (canvasInstance) => set({ canvas: canvasInstance }),
  
  setActiveSide: (side) => {
    set({ activeSide: side, selectedObject: null });
  },
  
  setLayers: (objects) => {
    const newLayers: UILayer[] = objects.map((obj) => {
      const id = obj.data?.id || '';
      const side = obj.data?.side || 'front';
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

  // ===== PHIÊN BẢN ĐÃ HỢP NHẤT =====
  // Khi bắt đầu tải một dự án mới, chúng ta vừa bật cờ loading,
  // vừa lưu JSON, và quan trọng là RESET lại ID của dự án đang active.
  startLoadingProject: (projectJSON) => {
    set({ 
      isLoadingProject: true, 
      projectToLoad: projectJSON, 
      activeProjectId: null // Reset ID để chuẩn bị cho dự án mới được tải
    });
  },
  // ===================================
  
  finishLoadingProject: () => {
    set({ isLoadingProject: false, projectToLoad: null });
  },

  // Action này sẽ được gọi SAU KHI dự án đã tải xong,
  // để set ID của dự án vừa được tải là active.
  setActiveProjectId: (id) => set({ activeProjectId: id }),
}));