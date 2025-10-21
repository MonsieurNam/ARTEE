"use client";

import { useEffect, useState } from 'react';
// SỬA LỖI 1: Import fabric như một namespace
import * as fabric from 'fabric'; 
import { useDesignStore, UILayer } from '@/store/design-store';
import { useShallow } from 'zustand/react/shallow';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { FileText, ImageIcon, Save, Trash2, Copy } from "lucide-react";
import LayerItem from "./layer-item";
import * as projectLocal from '@/lib/services/project-local';
import { ProjectData } from '@/lib/designer-storage';
import { useToast } from "@/components/ui/use-toast";
import LogoLibrary from './logo-library';

// Props interface để nhận dữ liệu từ component cha (page.tsx)
interface LeftPanelProps {
    selectedProduct: { type: string; color: string; size: string; };
    onProductChange: (product: { type: string; color: string; size: string; }) => void;
}

export default function LeftPanel({ selectedProduct, onProductChange }: LeftPanelProps) {
  // Sử dụng useShallow để tối ưu, component chỉ re-render khi các giá trị này thực sự thay đổi
  const { canvas, layers, activeSide, selectedObject } = useDesignStore(
    useShallow((state) => ({ 
      canvas: state.canvas, 
      layers: state.layers, 
      activeSide: state.activeSide,
      selectedObject: state.selectedObject
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

  // --- HÀNH ĐỘNG VỚI CANVAS ---

  const handleAddText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Nhập chữ...', {
      left: 50,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 40,
      fill: '#333333',
      data: { id: `text-${Date.now()}`, side: activeSide }
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      // SỬA: Biến hàm onload thành async
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            // SỬA: Dùng await để đợi Promise, không dùng callback
            const img = await fabric.Image.fromURL(event.target.result as string, {
              crossOrigin: 'anonymous' // Thêm này để tránh lỗi 'tainted canvas'
            });

            // Logic cũ từ callback được đưa vào đây
            img.scaleToWidth(150);
            img.set({ data: { id: `image-${Date.now()}`, side: activeSide } });
            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
          } catch (error) {
            console.error("Lỗi khi tải ảnh:", error);
          }
        }
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Xóa file đã chọn để có thể tải lại ảnh
    }
  };

  const handleDeleteLayer = (id: string) => {
    if (!canvas) return;
    const objectsToDelete = canvas.getObjects().filter(obj => obj.data?.id === id);
    if (objectsToDelete.length > 0) {
      objectsToDelete.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  // SỬA LỖI 2: Dùng async/await cho hàm clone
  const handleDuplicateLayer = async (id: string) => {
    if (!canvas) return;
    const objectToClone = canvas.getObjects().find(obj => obj.data?.id === id);
    if (objectToClone) {
        try {
          // 'data' được truyền để đảm bảo các thuộc tính tùy chỉnh được clone
          const cloned = await objectToClone.clone(['data']); 
          
          cloned.set({
              left: (cloned.left || 0) + 10,
              top: (cloned.top || 0) + 10,
              data: { ...cloned.data, id: `${cloned.type || 'object'}-${Date.now()}` }
          });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
        } catch (error) {
           console.error("Lỗi khi nhân bản đối tượng:", error);
        }
    }
  };

  // --- HÀNH ĐỘNG VỚI DỰ ÁN ---

  const handleSaveProject = () => {
    if (!canvas || !newProjectName.trim()) {
        toast({ title: "Lỗi", description: "Vui lòng nhập tên dự án.", variant: "destructive" });
        return;
    };

    // SỬA LỖI 3: Dùng 'as any' để bỏ qua lỗi type 'toJSON'
    const json = JSON.stringify((canvas as any).toJSON(['data']));
    
    // Gợi ý cải tiến: Đảm bảo canvas.getWidth() hợp lệ
    const canvasWidth = canvas.getWidth();
    const multiplier = canvasWidth > 0 ? 100 / canvasWidth : 0.25; // 0.25 là giá trị dự phòng
    const preview = canvas.toDataURL({ format: 'png', quality: 0.8, multiplier });

    projectLocal.saveProject(newProjectName, json, preview, selectedProduct);

    setNewProjectName('');
    setIsModalOpen(false);
    refreshProjects();
    toast({ title: "Thành công!", description: `Đã lưu dự án "${newProjectName}".` });
  };

  const handleLoadProject = (project: ProjectData) => {
    if (!canvas) return;

    // 1. Báo cho component cha (page.tsx) cập nhật lại sản phẩm
    onProductChange(project.product); 
    
    // 2. Dùng setTimeout để đảm bảo state sản phẩm và ảnh nền của canvas được cập nhật trước khi load JSON
    setTimeout(() => {
        canvas.loadFromJSON(project.json, () => {
            canvas.renderAll();
            
            // 3. Đồng bộ lại toàn bộ state của Zustand
            const objects = canvas.getObjects();
            useDesignStore.getState().setLayers(objects);
            
            // 4. Kích hoạt lại logic ẩn/hiện layer theo mặt đang active
            const currentSide = useDesignStore.getState().activeSide;
            useDesignStore.getState().setActiveSide(currentSide);

            toast({
                title: "Tải thành công",
                description: `Đã tải dự án "${project.title}".`,
            });
        });
    }, 100); // 100ms là một khoảng delay an toàn
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa dự án "${title}" không? Hành động này không thể hoàn tác.`)) {
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
            <Button variant="outline" className="gap-2" onClick={handleAddText}>
              <FileText className="w-4 h-4" /> Thêm Chữ
            </Button>
            <label htmlFor="image-upload-btn" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer">
              <ImageIcon className="w-4 h-4" /> Tải Ảnh
            </label>
            <input 
              id="image-upload-btn" 
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          
          <LogoLibrary />

          <p className="text-sm font-medium text-muted-foreground">Danh sách lớp ({activeSide === 'front' ? 'Mặt trước' : 'Mặt sau'})</p>
          <div className="space-y-2 overflow-y-auto flex-1">
            {visibleLayers.length > 0 ? (
              visibleLayers.map((layer: UILayer) => (
                <LayerItem
                  key={layer.id}
                  id={layer.id}
                  type={layer.type}
                  title={layer.title}
                  isActive={layer.id === selectedObject?.data?.id}
                  onDelete={() => handleDeleteLayer(layer.id)}
                  onDuplicate={() => handleDuplicateLayer(layer.id)}
                />
              ))
            ) : (
                <div className="text-center text-xs text-muted-foreground p-4 border-dashed border-2 rounded-lg h-full flex flex-col justify-center items-center">
                    <p>Chưa có lớp nào.</p>
                    <p>Hãy thêm chi tiết để bắt đầu!</p>
                </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="flex-1 p-4 flex flex-col gap-4">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                  <Button className="gap-2 w-full" disabled={layers.length === 0}>
                      <Save className="w-4 h-4" /> Lưu dự án mới
                  </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Đặt tên cho dự án của bạn</DialogTitle>
                  </DialogHeader>
                  <Input 
                      placeholder="Ví dụ: Áo nhóm mùa hè..."
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveProject()}
                  />
                  <DialogFooter>
                      <Button onClick={handleSaveProject}>Lưu</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
          <p className="text-sm font-medium text-muted-foreground">Các dự án đã lưu</p>
          <div className="space-y-2 overflow-y-auto flex-1">
            {projects.length > 0 ? (
                projects.map(p => (
                    <div key={p.id} className="group flex items-center gap-3 p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                        <img 
                            src={p.previewImage} 
                            alt={p.title} 
                            className="w-12 h-12 flex-shrink-0 rounded-md object-cover border bg-white cursor-pointer" 
                            onClick={() => handleLoadProject(p)}
                        />
                        <div className="flex-1 min-w-0" onClick={() => handleLoadProject(p)}>
                            <p className="text-sm font-semibold truncate cursor-pointer">{p.title}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(p.updatedAt).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 flex-shrink-0" 
                            onClick={() => handleDeleteProject(p.id, p.title)}
                        >
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    </div>
                ))
            ) : (
                <div className="text-center text-xs text-muted-foreground p-4 border-dashed border-2 rounded-lg h-full flex flex-col justify-center items-center">
                    <p>Bạn chưa có dự án nào được lưu.</p>
                </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}