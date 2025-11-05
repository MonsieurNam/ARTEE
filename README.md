# ARTEE - Print-on-Demand T-Shirt Customization Platform

Một nền tảng web hiện đại cho phép người dùng thiết kế và mua áo in theo yêu cầu (Print-on-Demand) với công nghệ AR và virtual try-on.

## Project Demonstration Video

<div align="center">
    <a href="https://youtu.be/J4xfar31A_s">
    </a>
</div>

[![Watch the video](/public/main_web.png)](https://www.youtube.com/watch?v=J4xfar31A_s)


**Click on the image above to watch the project demonstration video on YouTube**

## 🎨 Tính Năng Chính

### Landing Page
- Hero section ấn tượng với CTA rõ ràng
- Brand story giới thiệu 3 trụ cột: Personalized Art, AR Technology, Sustainable Fashion
- Showcase bộ sưu tập với hình ảnh 3D
- Hướng dẫn "How It Works" với 3 bước đơn giản
- Newsletter signup và social media links

### Design Customizer
- **Chọn Sản Phẩm**: 4 loại áo (Tee, Hoodie, Polo), 8 màu sắc, 6 size
- **Canvas Editor**: 
  - Thêm và chỉnh sửa text với kiểm soát kích thước và màu sắc
  - Thư viện logo emoji (8 thiết kế sẵn)
  - Upload hình ảnh tùy chỉnh
  - Kéo thả để sắp xếp vị trí
  - Xoay 360 độ
  - Nhân đôi phần tử
- **Virtual Try-On**: 
  - Xem trước thiết kế trên áo 3D
  - Xoay tương tác 360 độ
  - Zoom từ 50% đến 200%
  - Rendering thực tế với bóng và độ sâu

### Shopping Cart & Checkout
- Giỏ hàng với quản lý số lượng
- Tính toán giá tổng cộng
- Quy trình checkout 3 bước (Thông tin → Thanh toán → Xác nhận)
- Lưu trữ dữ liệu với localStorage

## 🚀 Cài Đặt & Chạy Dự Án

### Yêu Cầu
- Node.js 18+ 
- npm hoặc yarn

### Bước 1: Tải Code
```bash
git clone <repository-url>
cd artee-landing
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Chạy Development Server
```bash
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem ứng dụng.

### Bước 4: Build cho Production
```bash
npm run build
npm start
# hoặc
yarn build
yarn start
```

## 📁 Cấu Trúc Dự Án

```
artee-landing/
├── app/
│   ├── page.tsx                 # Landing page chính
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── customizer/
│   │   └── page.tsx             # Trang design customizer
│   ├── cart/
│   │   └── page.tsx             # Trang giỏ hàng
│   └── checkout/
│       └── page.tsx             # Trang thanh toán
├── components/
│   ├── header.tsx               # Navigation header
│   ├── hero-section.tsx         # Hero section
│   ├── brand-story-section.tsx  # Brand story
│   ├── collection-section.tsx   # Product collection
│   ├── how-it-works-section.tsx # How it works
│   ├── final-cta-section.tsx    # Final CTA
│   ├── product-selector.tsx     # Product selector
│   ├── design-canvas.tsx        # Canvas editor
│   └── virtual-try-on.tsx       # Virtual try-on
├── public/
│   └── images/                  # Hình ảnh sản phẩm
└── package.json
```

## 🎯 Hướng Dẫn Sử Dụng

### Cho Người Dùng Cuối

#### 1. Khám Phá Landing Page
- Xem các thiết kế sẵn có trong phần "Collection"
- Đọc về brand story và công nghệ AR
- Đăng ký newsletter để nhận cập nhật

#### 2. Thiết Kế Áo Tùy Chỉnh
- Nhấp vào nút "Design Now" hoặc "Khám Phá Bộ Sưu Tập"
- Chọn loại áo, màu sắc và size
- Sử dụng canvas editor để:
  - Thêm text: Nhập nội dung, chọn kích thước và màu
  - Thêm logo: Chọn từ thư viện emoji
  - Upload hình ảnh: Tải lên file hình ảnh của bạn
  - Sắp xếp: Kéo thả các phần tử
  - Xoay: Điều chỉnh góc xoay

#### 3. Xem Trước Virtual Try-On
- Xem thiết kế trên áo 3D
- Xoay áo để xem từ mọi góc độ
- Zoom vào để kiểm tra chi tiết

#### 4. Mua Hàng
- Nhấp "Add to Cart"
- Xem giỏ hàng
- Tiến hành thanh toán
- Nhập thông tin giao hàng
- Chọn phương thức thanh toán
- Xác nhận đơn hàng

### Cho Nhà Phát Triển

#### Tùy Chỉnh Màu Sắc
Chỉnh sửa `app/globals.css`:
```css
@theme inline {
  --primary: #your-color;
  --secondary: #your-color;
  --accent: #your-color;
  /* ... */
}
```

#### Thêm Loại Áo Mới
Chỉnh sửa `components/product-selector.tsx`:
```tsx
const SHIRT_TYPES = [
  { id: 'tee', name: 'T-Shirt', price: 15 },
  { id: 'hoodie', name: 'Hoodie', price: 35 },
  // Thêm loại áo mới ở đây
];
```

## 🛠️ Công Nghệ Sử Dụng

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Hooks**: State management
- **Canvas API**: Design editor
- **localStorage**: Data persistence

## 📱 Responsive Design

Ứng dụng hoàn toàn responsive và hoạt động tốt trên:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 📝 Lưu Ý Quan Trọng

- Dữ liệu giỏ hàng được lưu trong localStorage (chỉ trên thiết bị hiện tại)
- Checkout hiện tại là demo - cần tích hợp payment gateway thực
- Hình ảnh sản phẩm có thể được thay thế bằng hình ảnh thực tế
- Để sử dụng AR thực, cần tích hợp thư viện AR như Artivive

## 📄 License

MIT License

---

**Chúc bạn thành công với ARTEE! 🎉**