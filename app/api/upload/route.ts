// app/api/upload/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// 1. Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 2. Nhận dữ liệu Form từ Client
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Không tìm thấy file ảnh' },
        { status: 400 }
      );
    }

    // Kiểm tra định dạng (chỉ cho phép ảnh)
    if (!file.type.startsWith('image/')) {
        return NextResponse.json(
            { error: 'Chỉ chấp nhận định dạng ảnh' },
            { status: 400 }
        );
    }

    // 3. Chuyển đổi File sang Buffer để upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload lên Cloudinary sử dụng Promise
    // Chúng ta dùng upload_stream để upload trực tiếp từ RAM lên Cloud
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'artee-uploads', // Tên thư mục trên Cloudinary
          resource_type: 'image',
          // Tự động nén và format để tối ưu dung lượng
          transformation: [{ quality: 'auto', fetch_format: 'auto' }] 
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary Error]', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Gửi buffer vào stream
      uploadStream.end(buffer);
    });

    // 5. Trả về URL ảnh
    return NextResponse.json({ 
        success: true,
        url: result.secure_url, // URL https bảo mật
        public_id: result.public_id 
    });

  } catch (error) {
    console.error('[Upload API Error]', error);
    return NextResponse.json(
      { error: 'Lỗi khi tải ảnh lên server' },
      { status: 500 }
    );
  }
}