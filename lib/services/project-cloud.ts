// lib/services/project-cloud.ts
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  orderBy
} from "firebase/firestore";

export interface CloudProject {
  id?: string;
  uid: string; // ID người dùng sở hữu
  title: string;
  json: string; // Dữ liệu Canvas (JSON string)
  previewImage: string; // URL ảnh preview (Cloudinary hoặc Base64 nhỏ)
  product: {
    type: string;
    color: string;
    size: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION_NAME = "designs";

// 1. Lưu dự án mới
export async function saveProjectCloud(data: Omit<CloudProject, "id" | "createdAt" | "updatedAt">) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
}

// 2. Cập nhật dự án
export async function updateProjectCloud(id: string, data: Partial<CloudProject>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

// 3. Tải danh sách dự án của một User
export async function getUserProjects(uid: string) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("uid", "==", uid),
      orderBy("updatedAt", "desc") // Sắp xếp mới nhất lên đầu
    );
    
    const querySnapshot = await getDocs(q);
    const projects: CloudProject[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as CloudProject);
    });
    
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Trả về mảng rỗng nếu lỗi (hoặc chưa tạo index)
  }
}

// 4. Xóa dự án
export async function deleteProjectCloud(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}