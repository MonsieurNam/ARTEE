import imageCompression from 'browser-image-compression';

/**
 * Nén file ảnh sử dụng browser-image-compression
 * Giới hạn 1MB, chiều rộng tối đa 1500px
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // Giới hạn 1MB
    maxWidthOrHeight: 1500, // Resize nếu quá lớn
    useWebWorker: true, // Dùng luồng phụ để không đơ UI
    fileType: "image/png" // Cố định định dạng nếu cần
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Đã nén: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error("Lỗi nén ảnh:", error);
    return file; // Nếu lỗi thì trả về file gốc
  }
}

/**
 * Chuyển Base64 DataURL thành File object (để upload)
 */
export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Upload File lên API /api/upload của chính server mình
 * Trả về URL ảnh trên Cloudinary
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Upload failed');
  }

  return data.url;
}