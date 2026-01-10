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
import { FileText, ImageIcon, Save, Trash2, Copy, FilePlus, Loader2, LogIn } from "lucide-react";
import LayerItem from "./layer-item";
import * as projectLocal from '@/lib/services/project-local';
import { ProjectData } from '@/lib/designer-storage';
import { useToast } from "@/components/ui/use-toast";
import LogoLibrary from './logo-library';
import { useAuth } from "@/components/providers/auth-provider"; // Hook lấy user
import { saveProjectCloud, updateProjectCloud, getUserProjects, deleteProjectCloud, type CloudProject } from "@/lib/services/project-cloud";
import Link from "next/link";
import { Separator } from '../ui/separator';
import { compressImage, dataURLtoFile, uploadToCloudinary } from '@/lib/image-helper';

interface LeftPanelProps {
    selectedProduct: { type: string; color: string; size: string; };
    onProductChange: (product: { type: string; color: string; size: string; }) => void;
}

export default function LeftPanel({ selectedProduct, onProductChange }: LeftPanelProps) {
  const { 
    canvas, layers, activeSide, selectedObject, setActiveSide, 
    activeProjectId, setActiveProjectId 
  } = useDesignStore(
    useShallow((state) => ({ 
      canvas: state.canvas, 
      layers: state.layers, 
      activeSide: state.activeSide,
      selectedObject: state.selectedObject,
      setActiveSide: state.setActiveSide,
      activeProjectId: state.activeProjectId,
      setActiveProjectId: state.setActiveProjectId
    }))
  );
  
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
  // 2. State cho Cloud Projects
  const [cloudProjects, setCloudProjects] = useState<CloudProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  // 3. Load dự án khi user thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    if (user) {
      loadCloudProjects();
    } else {
      setCloudProjects([]); // Xóa list nếu logout
    }
  }, [user]);

  const loadCloudProjects = async () => {
    if (!user) return;
    setIsLoadingProjects(true);
    try {
      const projects = await getUserProjects(user.uid);
      setCloudProjects(projects);
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể tải danh sách dự án.", variant: "destructive" });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleSaveOrUpdateProject = async () => {
    if (!canvas || !user) {
        toast({ title: "Lỗi", description: "Cần đăng nhập để lưu.", variant: "destructive" });
        return;
    }

    if (!activeProjectId && !newProjectName.trim()) {
      toast({ title: "Thiếu tên", description: "Vui lòng đặt tên.", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
        // 1. Lấy dữ liệu JSON từ Canvas
        const designData = {
            version: "6.0.0", // Hoặc fabric.version
            objects: canvas.getObjects().map(obj => obj.toObject(['data']))
        };
        const jsonString = JSON.stringify(designData);

        // 2. Tạo ảnh Preview từ Canvas (Base64)
        // Dùng multiplier nhỏ để tạo thumbnail nhẹ
        const previewBase64 = canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 0.5 });
        
        // 3. BƯỚC MỚI: Upload Preview lên Cloudinary thay vì lưu Base64 vào Firestore
        const previewFile = dataURLtoFile(previewBase64, `preview-${Date.now()}.png`);
        const previewUrl = await uploadToCloudinary(previewFile);

        // 4. Lưu vào Firestore (Lưu URL preview ngắn gọn)
        if (activeProjectId) {
            await updateProjectCloud(activeProjectId, {
                json: jsonString,
                previewImage: previewUrl, // URL Cloudinary
                product: selectedProduct
            });
            toast({ title: "Cập nhật thành công", description: "Dữ liệu đã được đồng bộ." });
        } else {
            const newProj = await saveProjectCloud({
                uid: user.uid,
                title: newProjectName,
                json: jsonString,
                previewImage: previewUrl, // URL Cloudinary
                product: selectedProduct
            });
            setActiveProjectId(newProj.id);
            setNewProjectName('');
            setIsModalOpen(false);
            toast({ title: "Lưu mới thành công", description: "Đã tạo dự án mới." });
        }
        
        loadCloudProjects();

    } catch (error) {
        console.error(error);
        toast({ title: "Lỗi lưu trữ", description: "Không thể lưu dữ liệu.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  // 5. Hàm Xóa (Cloud)
  const handleDeleteCloudProject = async (id: string) => {
      if(!confirm("Bạn chắc chắn muốn xóa?")) return;
      await deleteProjectCloud(id);
      if(activeProjectId === id) setActiveProjectId(null);
      loadCloudProjects();
      toast({ title: "Đã xóa", description: "Dự án đã bị xóa vĩnh viễn." });
  }

  // 6. Hàm Load Project vào Canvas (Cloud)
  const handleLoadCloudProject = (proj: CloudProject) => {
      if(!confirm("Tải dự án này? Thay đổi chưa lưu sẽ mất.")) return;
      
      useDesignStore.getState().startLoadingProject(proj.json);
      if (proj.id) setActiveProjectId(proj.id);
      onProductChange(proj.product); // Cập nhật màu áo/loại áo
  };
  
  useEffect(() => {
    refreshProjects();
  }, []);

  const refreshProjects = () => setProjects(projectLocal.loadProjects());

  const handleNewProject = () => {
    if (canvas) {
      if (!confirm("Bạn có chắc muốn tạo một thiết kế mới? Mọi thay đổi chưa lưu sẽ bị mất.")) {
        return;
      }
      canvas.clear();
      setActiveSide('front'); 
      setActiveProjectId(null);
      toast({ title: "Bắt đầu thiết kế mới!", description: "Canvas đã được dọn dẹp." });
    }
  };

  const handleAddText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Nhập chữ...', {
      left: 50, top: 100, fontFamily: 'Arial', fontSize: 40, fill: '#333333',
    });
    (text as any).data = { id: `text-${Date.now()}`, side: activeSide };
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // Hàm xử lý upload ảnh mới
   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate định dạng sơ bộ
    if (!file.type.startsWith('image/')) {
        toast({ title: "Lỗi định dạng", description: "Vui lòng chọn file ảnh.", variant: "destructive" });
        return;
    }

    setIsUploading(true);

    try {
      // BƯỚC MỚI: Nén ảnh trước khi upload
      const compressedFile = await compressImage(file);

      // Gọi Helper upload
      const imgUrl = await uploadToCloudinary(compressedFile);

      // Thêm vào Canvas (Giữ nguyên logic cũ)
      // Lưu ý: Fabric v6 import
      const fabric = await import("fabric"); // Dynamic import hoặc dùng * as fabric đã import ở trên
      
      fabric.Image.fromURL(imgUrl, { crossOrigin: 'anonymous' })
        .then((img) => {
            const canvasWidth = canvas.width || 400;
            const targetWidth = canvasWidth * 0.5;
            const scale = targetWidth / (img.width || 1);
            
            img.set({
                scaleX: scale,
                scaleY: scale,
                left: canvasWidth / 2,
                top: (canvas.height || 500) / 2,
                originX: 'center',
                originY: 'center'
            });

            (img as any).data = { 
                id: `image-${Date.now()}`, 
                side: activeSide,
                src: imgUrl // URL Cloudinary (Ngắn)
            };

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            
            toast({ title: "Thành công", description: "Đã thêm ảnh vào thiết kế." });
        })
        .catch(err => {
            console.error(err);
            toast({ title: "Lỗi hiển thị", description: "Không thể vẽ ảnh.", variant: "destructive" });
        });

    } catch (error) {
      console.error("Upload error:", error);
      toast({ 
        title: "Lỗi tải ảnh", 
        description: "Không thể upload ảnh lên server.", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
      e.target.value = ''; 
    }
  };

  const handleDeleteLayer = (id: string) => {
    if (!canvas) return;
    const objectsToDelete = canvas.getObjects().filter(obj => (obj as any).data?.id === id);
    objectsToDelete.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const handleDuplicateLayer = async (id: string) => {
    if (!canvas) return;
    const objectToClone = canvas.getObjects().find(obj => (obj as any).data?.id === id);
    if (objectToClone) {
      try {
        const cloned = await objectToClone.clone(['data']);
        (cloned as any).set({
          left: (cloned.left || 0) + 20, 
          top: (cloned.top || 0) + 20,
        });
        (cloned as any).data = { ...(cloned as any).data, id: `${cloned.type || 'object'}-${Date.now()}` };
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
      } catch (error) { console.error("Lỗi nhân bản:", error); }
    }
  };

  const handleSaveOrUpdateLocalProject = () => {
    if (!canvas) {
      toast({ title: "Lỗi", description: "Canvas chưa sẵn sàng.", variant: "destructive" });
      return;
    }
    if (!activeProjectId && !newProjectName.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tên cho dự án mới.", variant: "destructive" });
      return;
    }

    const originalVisibility: { obj: fabric.Object, visible: boolean }[] = [];
    canvas.getObjects().forEach(obj => {
        originalVisibility.push({ obj, visible: obj.visible || false });
        obj.set('visible', true);
    });

    const designData = {
        version: fabric.version,
        objects: canvas.getObjects().map(obj => obj.toObject(['data']))
    };
    const json = JSON.stringify(designData);

    originalVisibility.forEach(item => item.obj.set('visible', item.visible));
    canvas.renderAll();

    console.log("[Save Panel] Dữ liệu JSON cuối cùng sẽ được lưu:", json);

    const preview = canvas.toDataURL({ format: 'png', quality: 0.1, multiplier: 0.1 });

    if (activeProjectId) {
      projectLocal.updateProject(activeProjectId, json, preview, selectedProduct);
      refreshProjects();
      toast({ title: "Thành công!", description: `Đã cập nhật dự án.` });
    } else {
      const newProject = projectLocal.saveProject(newProjectName, json, preview, selectedProduct);
      setActiveProjectId(newProject.id);
      setNewProjectName('');
      setIsModalOpen(false);
      refreshProjects();
      toast({ title: "Thành công!", description: `Đã lưu dự án "${newProjectName}".` });
    }
  };
  
  const handleLoadProject = (project: ProjectData) => {
    if (!canvas) return;
    if (!confirm(`Bạn có chắc muốn tải dự án "${project.title}"? Mọi thay đổi chưa lưu sẽ bị mất.`)) return;
    
    useDesignStore.getState().startLoadingProject(project.json);
    setActiveProjectId(project.id);
    onProductChange(project.product);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa dự án "${title}" không?`)) {
        projectLocal.deleteProject(id);
        if (id === activeProjectId) setActiveProjectId(null);
        refreshProjects();
        toast({ title: "Đã xóa", description: `Dự án "${title}" đã được xóa.` });
    }
  };

  const findObjectById = (id: string) => canvas?.getObjects().find(obj => (obj as any).data?.id === id);

  const handleSelectLayer = (id: string) => {
    if (!canvas) return;
    const object = findObjectById(id);
    if (object) {
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  };

  const handleToggleVisibility = (id: string) => {
    if (!canvas) return;
    const object = findObjectById(id);
    if (object) {
      object.set('visible', !object.visible);
      canvas.renderAll();
    }
  };

  const handleToggleLock = (id: string) => {
    if (!canvas) return;
    const object = findObjectById(id);
    if (object) {
      object.set({
        selectable: !object.selectable,
        evented: !object.evented,
      });
      (object as any).data = { ...(object as any).data, isLocked: !object.selectable };
      canvas.renderAll();
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
          {/* --- NÚT UPLOAD MỚI --- */}
            <div className="relative">
                <Button 
                    variant="outline" 
                    className="w-full gap-2 relative" 
                    disabled={isUploading}
                    asChild={!isUploading} // Chỉ render asChild (label) khi không loading
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang tải...
                        </>
                    ) : (
                        <label 
                            htmlFor="image-upload-btn" 
                            className="w-full h-full flex items-center justify-center cursor-pointer"
                        >
                            <ImageIcon className="w-4 h-4 mr-2" /> 
                            Tải Ảnh
                        </label>
                    )}
                </Button>
                
                {/* Input file ẩn */}
                <input 
                    id="image-upload-btn" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={isUploading}
                />
            </div>

          <p className="text-sm font-medium text-muted-foreground">Danh sách lớp ({activeSide === 'front' ? 'Mặt trước' : 'Mặt sau'})</p>
          <div className="space-y-2 overflow-y-auto flex-1">
            {visibleLayers.length > 0 ? (
              visibleLayers.map((layer: UILayer) => (
                <LayerItem
                  key={layer.id}
                  id={layer.id}
                  type={layer.type}
                  title={layer.title}
                  isActive={layer.id === (selectedObject && (selectedObject as any).data?.id)}
                  isVisible={layer.visible}
                  isLocked={(layer as any).data?.isLocked || false}
                  onSelect={() => handleSelectLayer(layer.id)}
                  onToggleVisibility={() => handleToggleVisibility(layer.id)}
                  onToggleLock={() => handleToggleLock(layer.id)}
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
          {/* Nút Tạo mới luôn hiện */}
          <Button className="gap-2 w-full" onClick={handleNewProject} variant="outline">
              <FilePlus className="w-4 h-4" /> Thiết kế mới (Reset)
          </Button>

          {/* Phần trạng thái Đăng nhập */}
          {!user ? (
            <div className="flex flex-col items-center justify-center flex-1 space-y-4 p-6 border-2 border-dashed rounded-xl bg-gray-50">
                <p className="text-center text-muted-foreground text-sm">Đăng nhập để lưu và quản lý các thiết kế của bạn trên mọi thiết bị.</p>
                <Link href="/login">
                    <Button className="gap-2">
                        <LogIn className="w-4 h-4" /> Đăng nhập ngay
                    </Button>
                </Link>
            </div>
          ) : (
            <>
                {/* Nút Lưu/Cập nhật */}
                {activeProjectId ? (
                  <Button className="gap-2 w-full" onClick={handleSaveOrUpdateProject} disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4" />} 
                    Cập nhật dự án đang sửa
                  </Button>
                ) : (
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 w-full" disabled={layers.length === 0}>
                        <Save className="w-4 h-4" /> Lưu dự án mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Đặt tên cho thiết kế</DialogTitle></DialogHeader>
                      <Input 
                        placeholder="Ví dụ: Áo lớp A1..." 
                        value={newProjectName} 
                        onChange={(e) => setNewProjectName(e.target.value)} 
                        disabled={isSaving}
                      />
                      <DialogFooter>
                        <Button onClick={handleSaveOrUpdateProject} disabled={isSaving}>
                            {isSaving && <Loader2 className="animate-spin w-4 h-4 mr-2"/>} Lưu lại
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Separator className="my-2" />

                {/* Danh sách dự án */}
                <p className="text-sm font-medium text-muted-foreground">Thiết kế của bạn ({cloudProjects.length})</p>
                
                {isLoadingProjects ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin"/></div>
                ) : (
                    <div className="space-y-2 overflow-y-auto flex-1 max-h-[300px]">
                        {cloudProjects.length > 0 ? (
                        cloudProjects.map(p => (
                            <div
                            key={p.id}
                            className={`group flex items-center gap-3 p-2 rounded-lg border hover:bg-gray-50 transition-colors ${
                                p.id === activeProjectId ? 'bg-primary/10 border-primary' : ''
                            }`}
                            >
                            <img
                                src={p.previewImage}
                                alt={p.title}
                                className="w-12 h-12 flex-shrink-0 rounded-md object-cover border bg-white cursor-pointer"
                                onClick={() => handleLoadCloudProject(p)}
                            />
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleLoadCloudProject(p)}>
                                <p className="text-sm font-semibold truncate">{p.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {p.updatedAt?.seconds ? new Date(p.updatedAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Vừa xong'}
                                </p>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 flex-shrink-0 text-destructive hover:text-red-700"
                                onClick={() => handleDeleteCloudProject(p.id!)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            </div>
                        ))
                        ) : (
                        <div className="text-center text-xs text-muted-foreground py-8">
                            Chưa có thiết kế nào.
                        </div>
                        )}
                    </div>
                )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
