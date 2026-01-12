import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amount, paymentContent, bankInfo, email } = body;

    // 1. Validate dữ liệu đầu vào
    if (!orderId || !amount) {
      return NextResponse.json({ message: 'Thiếu thông tin đơn hàng' }, { status: 400 });
    }

    // 2. Auth Google Sheet
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '') || "";
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || "", serviceAccountAuth);
    await doc.loadInfo();

    // 3. Xử lý Sheet & Header (PHẦN QUAN TRỌNG NHẤT)
    const SHEET_TITLE = 'ThanhToan';
    // Định nghĩa danh sách cột chuẩn
    const HEADERS = ['Thời gian', 'Email Khách', 'Mã đơn hàng', 'Số tiền cọc', 'Nội dung CK', 'Ngân hàng đích'];

    let sheet = doc.sheetsByTitle[SHEET_TITLE];

    if (!sheet) {
        // A. Nếu chưa có Sheet -> Tạo mới vả CÀI HEADER LUÔN
        sheet = await doc.addSheet({ 
            title: SHEET_TITLE,
            headerValues: HEADERS // <-- Quan trọng: Cài header ngay lúc tạo
        });
    } else {
        // B. Nếu đã có Sheet -> Kiểm tra xem có Header chưa
        try {
            await sheet.loadHeaderRow();
        } catch (e) {
            // Nếu lỗi load header (do sheet trắng) -> Cài header
            await sheet.setHeaderRow(HEADERS);
        }
        
        // Kiểm tra lại lần nữa cho chắc
        if (!sheet.headerValues || sheet.headerValues.length === 0) {
             await sheet.setHeaderRow(HEADERS);
        }
    }

    // 4. Ghi dữ liệu (Keys phải khớp 100% với HEADERS ở trên)
    const newRowData = {
      'Thời gian': new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      'Email Khách': email || 'Không có', // <-- Đã thêm cột Email
      'Mã đơn hàng': orderId,
      'Số tiền cọc': new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount),
      'Nội dung CK': paymentContent,
      'Ngân hàng đích': `${bankInfo.bankId} - ${bankInfo.accountNum}`
    };

    await sheet.addRow(newRowData);

    return NextResponse.json({ success: true, message: "Ghi nhận thành công" });

  } catch (error: any) {
    console.error('[Google Sheet API Error]:', error);
    // Trả về lỗi chi tiết để dễ debug trong Console trình duyệt
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}