// FILE: components/designer/left-panel.tsx
"use client";

import { useEffect, useState } from 'react';
import * as fabric from 'fabric'; 
import { useDesignStore, UILayer } from '@/store/design-store';
import { useShallow } from 'zustand/react/shallow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { FileText, ImageIcon, Save, Trash2, Copy, FilePlus } from "lucide-react"; // Thêm icon FilePlus
import LayerItem from "./layer-item";
import * as projectLocal from '@/lib/services/project-local';
import { ProjectData } from '@/lib/designer-storage';
import { useToast } from "@/components/ui/use-toast";
import LogoLibrary from './logo-library';

interface LeftPanelProps {
    selectedProduct: { type: string; color: string; size: string; };
    onProductChange: (product: { type: string; color: string; size: string; }) => void;
}

export default function LeftPanel({ selectedProduct, onProductChange }: LeftPanelProps) {
  const { canvas, layers, activeSide, selectedObject, setActiveSide } = useDesignStore(
    useShallow((state) => ({ 
      canvas: state.canvas, 
      layers: state.layers, 
      activeSide: state.activeSide,
      selectedObject: state.selectedObject,
      setActiveSide: state.setActiveSide // Lấy action setActiveSide
    }))
  );
  
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    refreshProjects();
  }, []);

  const refreshProjects = () => setProjects(projectLocal.loadProjects());

  // SỬA LỖI #1: Thêm hàm để tạo dự án mới
  const handleNewProject = () => {
    if (canvas) {
      if (!confirm("Bạn có chắc muốn tạo một thiết kế mới? Mọi thay đổi chưa lưu sẽ bị mất.")) {
        return;
      }
      canvas.clear(); // Xóa tất cả đối tượng trên canvas
      // Reset về mặt trước để có trải nghiệm nhất quán
      setActiveSide('front'); 
      toast({ title: "Bắt đầu thiết kế mới!", description: "Canvas đã được dọn dẹp." });
    }
  };

  const handleAddText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Nhập chữ...', {
      left: 50, top: 100, fontFamily: 'Arial', fontSize: 40, fill: '#333333',
      data: { id: `text-${Date.now()}`, side: activeSide }
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            const img = await fabric.Image.fromURL(event.target.result as string, { crossOrigin: 'anonymous' });
            img.scaleToWidth(150);
            img.set({ data: { id: `image-${Date.now()}`, side: activeSide } });
            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
          } catch (error) { console.error("Lỗi tải ảnh:", error); }
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleDeleteLayer = (id: string) => {
    if (!canvas) return;
    const objectsToDelete = canvas.getObjects().filter(obj => obj.data?.id === id);
    objectsToDelete.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const handleDuplicateLayer = async (id: string) => {
    if (!canvas) return;
    const objectToClone = canvas.getObjects().find(obj => obj.data?.id === id);
    if (objectToClone) {
      try {
        const cloned = await objectToClone.clone(['data']);
        cloned.set({
          left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20,
          data: { ...cloned.data, id: `${cloned.type || 'object'}-${Date.now()}` }
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
      } catch (error) { console.error("Lỗi nhân bản:", error); }
    }
  };

  const handleSaveProject = () => {
    if (!canvas || !newProjectName.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tên dự án.", variant: "destructive" });
      return;
    }
    const json = JSON.stringify((canvas as any).toJSON(['data']));
    const preview = canvas.toDataURL({ format: 'png', quality: 0.5, multiplier: 0.2 });
    projectLocal.saveProject(newProjectName, json, preview, selectedProduct);
    setNewProjectName('');
    setIsModalOpen(false);
    refreshProjects();
    toast({ title: "Thành công!", description: `Đã lưu dự án "${newProjectName}".` });
  };
  
  // SỬA LỖI #1 (tiếp): Cải thiện hàm tải dự án
  const handleLoadProject = (project: ProjectData) => {
    if (!canvas) return;

    // 1. Cập nhật state sản phẩm (áo, màu, size)
    onProductChange(project.product); 
    
    // 2. Dùng setTimeout để đảm bảo UI (đặc biệt là ảnh nền canvas) có thời gian cập nhật
    setTimeout(() => {
        // 3. Xóa sạch canvas cũ trước khi tải dữ liệu mới
        canvas.clear();
        
        // 4. Tải dữ liệu JSON vào canvas
        canvas.loadFromJSON(project.json, () => {
            canvas.renderAll();
            
            // 5. Đồng bộ lại state Zustand và kích hoạt lại logic hiển thị layer
            const objects = canvas.getObjects();
            useDesignStore.getState().setLayers(objects);
            const currentSide = useDesignStore.getState().activeSide;
            useDesignStore.getState().setActiveSide(currentSide);

            toast({ title: "Tải thành công", description: `Đã tải dự án "${project.title}".` });
        });
    }, 100); 
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa dự án "${title}" không?`)) {
        projectLocal.deleteProject(id);
        refreshProjects();
        toast({ title: "Đã xóa", description: `Dự án "${title}" đã được xóa.` });
    }
  };

  const visibleLayers = layers.filter(layer => layer.side === activeSide);

  return (
    <Card className="h-full shadow-md">
      <Tabs defaultValue="layers" className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="layers">Lớp ({visibleLayers.length})</TabsTrigger>
          <TabsTrigger value="projects">Dự án</TabsTrigger>
        </TabsList>
        <TabsContent value="layers" className="flex-1 p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="gap-2" onClick={handleAddText}><FileText className="w-4 h-4" /> Thêm Chữ</Button>
            <label htmlFor="image-upload-btn" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer"><ImageIcon className="w-4 h-4" /> Tải Ảnh</label>
            <input id="image-upload-btn" type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
          </div>
          <LogoLibrary />
          <p className="text-sm font-medium text-muted-foreground">Danh sách lớp ({activeSide === 'front' ? 'Mặt trước' : 'Mặt sau'})</p>
          <div className="space-y-2 overflow-y-auto flex-1">
            {visibleLayers.length > 0 ? (
              visibleLayers.map((layer: UILayer) => (
                <LayerItem key={layer.id} id={layer.id} type={layer.type} title={layer.title} isActive={layer.id === selectedObject?.data?.id} onDelete={() => handleDeleteLayer(layer.id)} onDuplicate={() => handleDuplicateLayer(layer.id)}/>
              ))
            ) : (<div className="text-center text-xs text-muted-foreground p-4 border-dashed border-2 rounded-lg h-full flex flex-col justify-center items-center"><p>Chưa có lớp nào.</p><p>Hãy thêm chi tiết để bắt đầu!</p></div>)}
          </div>
        </TabsContent>
        <TabsContent value="projects" className="flex-1 p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Button className="gap-2" onClick={handleNewProject} variant="outline"><FilePlus className="w-4 h-4" /> Thiết kế mới</Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild><Button className="gap-2 w-full" disabled={layers.length === 0}><Save className="w-4 h-4" /> Lưu dự án</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Đặt tên cho dự án của bạn</DialogTitle></DialogHeader>
                <Input placeholder="Ví dụ: Áo nhóm mùa hè..." value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveProject()}/>
                <DialogFooter><Button onClick={handleSaveProject}>Lưu</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Các dự án đã lưu</p>
          <div className="space-y-2 overflow-y-auto flex-1">
            {projects.length > 0 ? (
                projects.map(p => (
                    <div key={p.id} className="group flex items-center gap-3 p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                        <img src={p.previewImage} alt={p.title} className="w-12 h-12 flex-shrink-0 rounded-md object-cover border bg-white cursor-pointer" onClick={() => handleLoadProject(p)}/>
                        <div className="flex-1 min-w-0" onClick={() => handleLoadProject(p)}>
                            <p className="text-sm font-semibold truncate cursor-pointer">{p.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(p.updatedAt).toLocaleString('vi-VN')}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 flex-shrink-0" onClick={() => handleDeleteProject(p.id, p.title)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                ))
            ) : (<div className="text-center text-xs text-muted-foreground p-4 border-dashed border-2 rounded-lg h-full flex flex-col justify-center items-center"><p>Bạn chưa có dự án nào được lưu.</p></div>)}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}