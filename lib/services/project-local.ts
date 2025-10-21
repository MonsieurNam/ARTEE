// lib/services/project-local.ts
import { 
  getDesignerStorage, 
  saveDesignerStorage, 
  type ProjectData,
  type DesignerStorageData 
} from '@/lib/designer-storage';

export function saveProject(title: string, canvasJSON: string, previewImage: string, product: { type: string, color: string, size: string }): ProjectData {
  const storage: DesignerStorageData = getDesignerStorage();
  const newProject: ProjectData = {
    id: `proj-${Date.now()}`,
    title,
    json: canvasJSON,
    product, // <-- LƯU THÔNG TIN SẢN PHẨM
    previewImage,
    updatedAt: Date.now(),
  };
  storage.projects.unshift(newProject);
  saveDesignerStorage(storage);
  return newProject;
}

export function loadProjects(): ProjectData[] {
  const storage = getDesignerStorage();
  // Sắp xếp theo ngày cập nhật mới nhất
  return storage.projects.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function deleteProject(id: string): void {
  const storage = getDesignerStorage();
  storage.projects = storage.projects.filter(p => p.id !== id);
  saveDesignerStorage(storage);
}