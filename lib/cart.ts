// lib/cart.ts
export interface DesignElement {
  id: string
  type: "text" | "image"
  content: string
  x: number
  y: number
  size: number
  width?: number
  height?: number
  color?: string
  rotation: number
}

export interface CartItem {
  id: string;
  type: "custom" | "predesigned";
  product: {
    // Thuộc tính cho sản phẩm custom
    type?: string;
    color?: string;
    size?: string;
    
    // Thuộc tính cho sản phẩm có sẵn
    fabric?: string;
    productId?: number;
    productName?: string;
  };

  // --- THÊM MỚI CÁC TRƯỜNG NÀY ---
  designJSON?: string;      // Chuỗi JSON từ Fabric.js
  previewImage?: string;    // Ảnh preview dạng Base64 (data URL)
  // ---------------------------------

  timestamp: number;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  status: 'processing' | 'shipped' | 'delivered';
  orderDate: number; // timestamp
  // Thêm các thông tin khác nếu cần: total, shippingAddress...
}

// Cấu trúc dữ liệu chính sẽ được lưu trong localStorage
export interface UserData {
  activeCart: CartItem[];
  orderHistory: Order[];
}

const STORAGE_KEY = "artee_user_data";

const getDefaultData = (): UserData => ({
  activeCart: [],
  orderHistory: [],
});

const CART_KEY = "artee_cart"

export function getUserData(): UserData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultData();
  } catch {
    return getDefaultData();
  }
}

// Lưu toàn bộ dữ liệu người dùng
function saveUserData(data: UserData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Bắn sự kiện storage để các tab khác đồng bộ
  window.dispatchEvent(new Event("storage"));
}

export function getCart(): CartItem[] {
  return getUserData().activeCart;
}

export function addToCart(item: Omit<CartItem, "id" | "timestamp">): string {
  const data = getUserData();
  const itemId = `item-${Date.now()}`;

  const newCartItem: CartItem = {
    ...item,
    id: itemId,
    timestamp: Date.now(),
  };

  // Logic kiểm tra sản phẩm trùng lặp cần được điều chỉnh
  // Sản phẩm tự thiết kế được coi là duy nhất mỗi lần thêm vào giỏ
  if (newCartItem.type === 'predesigned') {
    const existingItemIndex = data.activeCart.findIndex(
      (cartItem) =>
        cartItem.type === 'predesigned' &&
        JSON.stringify(cartItem.product) === JSON.stringify(newCartItem.product)
    );
  
    if (existingItemIndex > -1) {
      data.activeCart[existingItemIndex].quantity += newCartItem.quantity;
      saveUserData(data);
      return data.activeCart[existingItemIndex].id;
    }
  }

  // Nếu là sản phẩm 'custom' hoặc sản phẩm 'predesigned' chưa có, thêm mới
  data.activeCart.push(newCartItem);
  saveUserData(data);
  return itemId;
}

export function removeFromCart(itemId: string): void {
  const data = getUserData();
  data.activeCart = data.activeCart.filter((item) => item.id !== itemId);
  saveUserData(data);
}

export function updateQuantity(itemId: string, quantity: number): void {
  const data = getUserData();
  const item = data.activeCart.find((item) => item.id === itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveUserData(data);
  }
}

// --- HÀM MỚI QUAN TRỌNG: CHUYỂN GIỎ HÀNG THÀNH ĐƠN HÀNG ---
export function checkoutCart(): Order | null {
  const data = getUserData();
  
  if (data.activeCart.length === 0) {
    return null; // Không có gì để thanh toán
  }

  // Tạo một đơn hàng mới từ giỏ hàng hiện tại
  const newOrder: Order = {
    orderId: `order-${Date.now()}`,
    items: data.activeCart, // Di chuyển toàn bộ giỏ hàng vào đơn hàng
    status: 'processing', // Trạng thái ban đầu
    orderDate: Date.now(),
  };

  // Thêm đơn hàng mới vào lịch sử
  data.orderHistory.unshift(newOrder); // unshift để đơn hàng mới nhất lên đầu
  
  // Dọn sạch giỏ hàng
  data.activeCart = [];
  
  // Lưu lại cấu trúc dữ liệu mới
  saveUserData(data);

  return newOrder;
}

export function clearCart(): void {
  const data = getUserData();
  data.activeCart = [];
  saveUserData(data);
  window.dispatchEvent(new Event("storage"));
}

export function getCartCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0)
}

export function getCartTotal(): number {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0)
}
