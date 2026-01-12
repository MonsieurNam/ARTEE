import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Thiếu email' }, { status: 400 });
    }

    // 1. Kiểm tra biến môi trường
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      return NextResponse.json({ message: 'Lỗi cấu hình Server' }, { status: 500 });
    }

    // 2. Xử lý Private Key
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      .replace(/\\n/g, '\n')
      .replace(/"/g, '');

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

    // 3. Kết nối & Load thông tin file
    await doc.loadInfo();

    // 4. Lấy Sheet đầu tiên
    const sheet = doc.sheetsByIndex[0];

    // --- SỬA LỖI TẠI ĐÂY ---
    // Phải thử load header trước. Nếu sheet trắng trơn, hàm này có thể gây lỗi hoặc trả về rỗng.
    try {
        await sheet.loadHeaderRow(); 
    } catch (e) {
        // Nếu lỗi (do sheet chưa có dữ liệu), ta bỏ qua để xuống dưới tạo header mới
    }

    // Kiểm tra lại sau khi load: Nếu không có header thì tạo mới
    if (!sheet.headerValues || sheet.headerValues.length === 0) {
        await sheet.setHeaderRow(['Email', 'Ngày đăng ký', 'Nguồn']);
    }

    // 5. Thêm dữ liệu
    await sheet.addRow({
      'Email': email,
      'Ngày đăng ký': new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      'Nguồn': 'Website Footer'
    });

    return NextResponse.json({ success: true, message: 'Đăng ký thành công!' });

  } catch (error: any) {
    console.error('---------- LỖI GOOGLE SHEET API ----------');
    console.error('Message:', error.message);
    if (error.response) {
        console.error('Google Error Data:', error.response.data);
    }
    console.error('------------------------------------------');

    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống, vui lòng thử lại sau.' }, 
      { status: 500 }
    );
  }
}