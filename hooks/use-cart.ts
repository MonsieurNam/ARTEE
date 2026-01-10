// hooks/use-cart.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getCart,
  addToCart as addToCartLib,
  removeFromCart as removeFromCartLib,
  updateQuantity as updateQuantityLib,
  checkoutCart as checkoutCartLib, // <-- HÀM MỚI
  type CartItem,
  type Order, // <-- KIỂU DỮ LIỆU MỚI
  clearCart as clearCartLib,
} from "@/lib/cart"

export function useCart() {
  // State vẫn là CartItem[] vì nó chỉ đại diện cho GIỎ HÀNG đang hoạt động
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load giỏ hàng đang hoạt động khi mount
  useEffect(() => {
    const loadCart = () => {
      setCart(getCart())
      setIsLoading(false)
    }
    loadCart()

    const handleStorageChange = () => {
      setCart(getCart())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const addToCart = useCallback((item: Omit<CartItem, "id" | "timestamp">) => {
    addToCartLib(item)
    setCart(getCart()) // Tải lại giỏ hàng sau khi thêm
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    removeFromCartLib(itemId)
    setCart(getCart())
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    updateQuantityLib(itemId, quantity)
    setCart(getCart())
  }, [])

  // HÀM MỚI: Checkout
  const checkout = useCallback((): Order | null => {
    const newOrder = checkoutCartLib();
    setCart(getCart()); // Giỏ hàng sẽ là mảng rỗng, cập nhật lại state
    return newOrder;
  }, []);

  const getTotalPrice = useCallback(() => {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }, [cart])

  const clearCart = useCallback(() => {
    // 1. Xóa trong localStorage (cần implement ở lib/cart.ts)
    // 2. Set state rỗng
    localStorage.removeItem("artee_user_data"); // Cách nhanh nhất: Xóa key
    // Hoặc cách chuẩn hơn là update key đó về mảng rỗng
    const userData = JSON.parse(localStorage.getItem("artee_user_data") || '{}');
    userData.activeCart = [];
    localStorage.setItem("artee_user_data", JSON.stringify(userData));
    
    setCart([]); // Cập nhật UI ngay lập tức
    window.dispatchEvent(new Event("storage")); // Báo cho các tab khác
  }, []);

  return {
    cart, // Giỏ hàng đang hoạt động
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    checkout, // <-- Export hàm checkout
    clearCart,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
  }
}