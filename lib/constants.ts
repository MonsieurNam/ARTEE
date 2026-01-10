// lib/constants.ts

// Giá cho các sản phẩm người dùng tự thiết kế
export const CUSTOM_PRODUCT_PRICE = 399000 // VND

// Tên sản phẩm dùng chung
export const PRODUCT_NAMES: Record<string, string> = {
  tee: "T-Shirt",
  hoodie: "Hoodie",
  polo: "Polo",
}

// Thông tin liên hệ Shop
export const SHOP_CONTACT = {
  phone: "0985029160", // Số điện thoại
  zalo: "https://zalo.me/0325235826", // Link Zalo
  messenger: "https://www.facebook.com/profile.php?id=61586419133991", // Link Messenger
  email: "namnguyenfnw@gmail.com",
  shopName: "ARTee Store"
};

// --- THÊM MỚI TỪ ĐÂY ---

// Số tiền cọc mặc định cho đơn hàng Pre-order (50.000 VNĐ)
export const DEPOSIT_AMOUNT = 50000; 

// Thông tin tài khoản ngân hàng (Dùng để hiển thị hoặc tạo mã QR sau này)
export const BANK_INFO = {
  bankId: "BIDV", // Mã ngân hàng (MB Bank) dùng cho API VietQR
  accountNum: "7411196985",
  accountName: "NGUYEN NGO NHAT NAM",
  template: "compact" // Giao diện templat QR
};