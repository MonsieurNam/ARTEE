// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    // 1. Nhận dữ liệu từ Client gửi lên
    const body = await req.json();
    const { name, email, message } = body;

    // Validate cơ bản (tránh trường hợp gửi rỗng)
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin.' },
        { status: 400 }
      );
    }

    // 2. Cấu hình Transporter (Người vận chuyển thư)
    // Ở đây dùng Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Email của shop dùng để gửi
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    // 3. Cấu hình nội dung Email
    const mailOptions = {
      from: `ARTEE Contact Form <${process.env.EMAIL_USER}>`, // Gmail thường ép 'from' phải là user auth
      to: process.env.EMAIL_RECEIVER, // Gửi đến hòm thư của bạn
      replyTo: email, // Khi bạn bấm Reply, nó sẽ gửi lại cho khách hàng
      subject: `[ARTEE] Tin nhắn mới từ khách hàng: ${name}`,
      text: `
        Tên khách hàng: ${name}
        Email: ${email}
        
        Nội dung tin nhắn:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">📩 Tin nhắn liên hệ mới</h2>
          <p>Bạn nhận được một tin nhắn mới từ website ARTEE.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p><strong>👤 Họ tên:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
          
          <p><strong>📝 Nội dung:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; color: #555;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Email này được gửi tự động từ hệ thống.</p>
        </div>
      `,
    };

    // 4. Thực hiện gửi mail
    await transporter.sendMail(mailOptions);

    // 5. Trả về kết quả thành công
    return NextResponse.json(
      { success: true, message: 'Email đã được gửi thành công!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Gửi mail thất bại. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}