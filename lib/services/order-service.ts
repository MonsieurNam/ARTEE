// lib/services/order-service.ts
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp,
  type Timestamp
} from "firebase/firestore";
import type { CartItem } from "@/lib/cart";

// Định nghĩa cấu trúc dữ liệu đơn hàng sẽ lưu trên Firestore
export interface FirestoreOrder {
  id?: string;
  uid: string;          // ID người dùng (từ Firebase Auth)
  items: CartItem[];    // Danh sách sản phẩm
  totalAmount: number;  // Tổng tiền
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerInfo?: {      // Thông tin thêm (nếu cần mở rộng sau này)
    name?: string;
    phone?: string;
    note?: string;
  };
  createdAt: Timestamp | any; 
}

const COLLECTION_NAME = "orders";

/**
 * Tạo một đơn hàng mới
 */
export async function createOrder(
  uid: string, 
  items: CartItem[], 
  totalAmount: number,
  customerInfo?: { name?: string, phone?: string, note?: string }
) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      uid,
      items,
      totalAmount,
      status: 'pending', // Trạng thái mặc định
      customerInfo: customerInfo || {},
      createdAt: serverTimestamp(), // Sử dụng thời gian server để chính xác
    });
    
    console.log("Đơn hàng đã được tạo với ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng trên Firestore:", error);
    throw error;
  }
}

/**
 * Lấy danh sách đơn hàng của một người dùng cụ thể
 */
export async function getUserOrders(uid: string) {
  try {
    // Tạo truy vấn: Lấy đơn hàng của user này, sắp xếp mới nhất lên đầu
    const q = query(
      collection(db, COLLECTION_NAME),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders: FirestoreOrder[] = [];

    querySnapshot.forEach((doc) => {
      // Ép kiểu dữ liệu trả về
      orders.push({ 
        id: doc.id, 
        ...doc.data() 
      } as FirestoreOrder);
    });

    return orders;
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
    
    // Lưu ý quan trọng về Indexing của Firestore:
    // Nếu bạn thấy lỗi "The query requires an index...", hãy mở console trình duyệt
    // và click vào đường link do Firebase cung cấp để tạo Index tự động.
    return [];
  }
}