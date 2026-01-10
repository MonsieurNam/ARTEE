// store/design-store.ts
import { create } from 'zustand';
import * as fabric from 'fabric';

// 1. Cập nhật Interface UILayer
export interface UILayer {
  id: string;
  type: string;
  title: string;
  side: 'front' | 'back';
  visible: boolean; // <-- THÊM DÒNG NÀY
  locked: boolean;  // <-- THÊM DÒNG NÀY (để dùng cho chức năng khóa lớp)
}

interface DesignState {
  canvas: fabric.Canvas | null;
  activeSide: 'front' | 'back';
  layers: UILayer[];
  selectedObject: fabric.Object | null;
  history: string[];
  historyIndex: number;
  zoomLevel: number;
  
  // Project Loading State
  isLoadingProject: boolean;
  projectToLoad: string | null;
  activeProjectId: string | null;

  // Actions
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setActiveSide: (side: 'front' | 'back') => void;
  setLayers: (objects: fabric.Object[]) => void;
  setSelectedObject: (object: fabric.Object | null) => void;
  setZoomLevel: (level: number) => void;
  
  startLoadingProject: (json: string) => void;
  finishLoadingProject: () => void;
  setActiveProjectId: (id: string | null) => void;

  // History Actions
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  canvas: null,
  activeSide: 'front',
  layers: [],
  selectedObject: null,
  history: [],
  historyIndex: -1,
  zoomLevel: 1,
  
  isLoadingProject: false,
  projectToLoad: null,
  activeProjectId: null,

  setCanvas: (canvas) => set({ canvas }),
  
  setActiveSide: (side) => {
    const { canvas } = get();
    if (canvas) {
      canvas.discardActiveObject();
      // Ẩn/Hiện các object dựa trên mặt
      canvas.getObjects().forEach((obj) => {
        const objSide = (obj as any).data?.side || 'front';
        obj.set('visible', objSide === side);
      });
      canvas.renderAll();
      
      // Cập nhật lại danh sách layer hiển thị trên UI
      get().setLayers(canvas.getObjects());
    }
    set({ activeSide: side });
  },

  // 2. Cập nhật hàm setLayers để lấy giá trị visible từ Fabric Object
  setLayers: (objects) => {
    const layers = objects.map((obj) => {
      const data = (obj as any).data || {};
      
      // Xác định tiêu đề cho layer
      let title = "Layer";
      if (obj.type === 'i-text') {
        title = (obj as any).text ? `Text: "${(obj as any).text.substring(0, 10)}..."` : "Văn bản";
      } else if (obj.type === 'image') {
        title = "Hình ảnh";
      }

      return {
        id: data.id || `unknown-${Date.now()}`,
        type: obj.type || 'object',
        title: title,
        side: data.side || 'front',
        visible: obj.visible !== false, // Mặc định là true nếu undefined
        locked: !obj.selectable, // Nếu không selectable nghĩa là đang khóa
      };
    });
    
    // Đảo ngược để layer mới nhất lên đầu danh sách (giống Photoshop)
    set({ layers: layers.reverse() });
  },

  setSelectedObject: (object) => set({ selectedObject: object }),
  setZoomLevel: (level) => set({ zoomLevel: level }),

  startLoadingProject: (json) => set({ isLoadingProject: true, projectToLoad: json }),
  finishLoadingProject: () => set({ isLoadingProject: false, projectToLoad: null }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),

  // History logic (giữ nguyên hoặc tối giản cho MVP)
  saveHistory: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas) return;

    // Giới hạn lịch sử 10 bước để tránh tràn bộ nhớ
    const newHistory = history.slice(0, historyIndex + 1);
    const json = JSON.stringify(canvas.toJSON());
    newHistory.push(json);
    
    if (newHistory.length > 10) newHistory.shift();

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const prevIndex = historyIndex - 1;
    const prevState = history[prevIndex];

    // Tạm thời tắt saveHistory để tránh loop
    canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
        get().setLayers(canvas.getObjects()); // Cập nhật lại UI
        set({ historyIndex: prevIndex });
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const nextIndex = historyIndex + 1;
    const nextState = history[nextIndex];

    canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        get().setLayers(canvas.getObjects()); // Cập nhật lại UI
        set({ historyIndex: nextIndex });
    });
  }
}));