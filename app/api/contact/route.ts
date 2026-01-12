import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate dữ liệu
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin.' },
        { status: 400 }
      );
    }

    // ============================================================
    // 1. GỬI EMAIL (Logic cũ - Giữ nguyên để bạn nhận thông báo ngay)
    // ============================================================
    try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `ARTEE Contact Form <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_RECEIVER, 
          replyTo: email,
          subject: `[ARTEE] Tin nhắn mới từ: ${name}`,
          text: `Tên: ${name}\nEmail: ${email}\nNội dung: ${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h2 style="color: #0044cc;">📩 Tin nhắn liên hệ mới</h2>
              <p>Khách hàng gửi từ trang Contact website ARTEE.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              
              <p><strong>👤 Họ tên:</strong> ${name}</p>
              <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
              
              <p><strong>📝 Nội dung:</strong></p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; color: #333;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
    } catch (emailError) {
        console.error("Lỗi gửi Email:", emailError);
        // Nếu lỗi gửi mail thì vẫn tiếp tục để thử lưu vào Sheet, không return lỗi ngay
    }

    // ============================================================
    // 2. LƯU VÀO GOOGLE SHEET (Logic Mới - Để tổng hợp dữ liệu)
    // ============================================================
    try {
        // Kiểm tra biến môi trường
        if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
            
            const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '');
            const serviceAccountAuth = new JWT({
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: privateKey,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
            await doc.loadInfo();

            // Cấu hình Sheet
            const SHEET_TITLE = 'LienHe';
            const HEADERS = ['Thời gian', 'Họ tên', 'Email', 'Nội dung tin nhắn'];
            
            // Tìm Sheet, nếu chưa có thì tạo mới
            let sheet = doc.sheetsByTitle[SHEET_TITLE];
            if (!sheet) {
                sheet = await doc.addSheet({ title: SHEET_TITLE, headerValues: HEADERS });
            } else {
                // Đảm bảo Header luôn tồn tại
                try {
                    await sheet.loadHeaderRow();
                } catch (e) {
                    await sheet.setHeaderRow(HEADERS);
                }
                if (!sheet.headerValues || sheet.headerValues.length === 0) {
                    await sheet.setHeaderRow(HEADERS);
                }
            }

            // Ghi dữ liệu
            await sheet.addRow({
                'Thời gian': new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
                'Họ tên': name,
                'Email': email,
                'Nội dung tin nhắn': message
            });
        }
    } catch (sheetError) {
        console.error("Lỗi ghi Google Sheet (Contact):", sheetError);
        // Không throw error để người dùng vẫn thấy thông báo thành công (vì Email quan trọng hơn)
    }

    // Trả về thành công
    return NextResponse.json(
      { success: true, message: 'Tin nhắn đã được gửi thành công!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[Contact API Critical Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Hệ thống đang bận, vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}