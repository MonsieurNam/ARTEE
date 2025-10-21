// lib/designer-storage.ts

/**
 * Định nghĩa cấu trúc cho một dự án thiết kế được lưu trữ cục bộ.
 */
// lib/designer-storage.ts
export interface ProjectData {
  id: string;
  title: string;
  json: string; // Dữ liệu canvas
  product: {     // <-- THÊM MỚI
    type: string;
    color: string;
    size: string;
  };
  previewImage: string;
  updatedAt: number;
}

/**
 * Định nghĩa cấu trúc cho một ảnh người dùng đã tải lên.
 */
export interface UploadedImageData {
  id: string;
  dataUrl: string; // Dữ liệu ảnh dạng Base64 (data URL)
}

/**
 * Định nghĩa cấu trúc dữ liệu tổng thể sẽ được lưu vào localStorage.
 */
export interface DesignerStorageData {
  projects: ProjectData[];
  uploadedImages: UploadedImageData[];
}

// Khóa (key) để lưu trữ dữ liệu trong localStorage.
const STORAGE_KEY = "artee_designer_data";

/**
 * Lấy dữ liệu thiết kế từ localStorage.
 * Trả về một đối tượng mặc định nếu không có dữ liệu hoặc có lỗi xảy ra.
 * @returns {DesignerStorageData} Dữ liệu thiết kế.
 */
export function getDesignerStorage(): DesignerStorageData {
  // Tránh lỗi khi chạy trên server (Next.js SSR)
  if (typeof window === "undefined") {
    return { projects: [], uploadedImages: [] };
  }

  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      // Parse dữ liệu đã lưu
      return JSON.parse(rawData) as DesignerStorageData;
    }
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu designer từ localStorage:", error);
    // Nếu có lỗi, trả về giá trị mặc định để tránh crash ứng dụng
    return { projects: [], uploadedImages: [] };
  }

  // Trả về giá trị mặc định nếu không có gì trong localStorage
  return { projects: [], uploadedImages: [] };
}

/**
 * Lưu dữ liệu thiết kế vào localStorage.
 * @param {DesignerStorageData} data Dữ liệu cần lưu.
 */
export function saveDesignerStorage(data: DesignerStorageData): void {
  // Tránh lỗi khi chạy trên server
  if (typeof window === "undefined") {
    return;
  }

  try {
    const rawData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, rawData);
    // Gửi một sự kiện 'storage' để các tab khác (nếu có) có thể đồng bộ state
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu designer vào localStorage:", error);
  }
}