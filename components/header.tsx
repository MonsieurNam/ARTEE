// components/header.tsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, FileText } from "lucide-react" // Import thêm FileText nếu muốn đổi icon, hoặc giữ ShoppingCart
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/components/providers/auth-provider";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cartCount } = useCart()
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/customizer", label: "Thiết kế" },
    { href: "/#collection-section", label: "Bộ sưu tập" },
    { href: "/#contact", label: "Liên hệ" }
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        scrolled 
          ? "bg-white/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-gray-200/60" 
          : "bg-white/85 backdrop-blur-lg border-b border-gray-100/40"
      }`}
    >
      {/* Ambient top glow */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent transition-opacity duration-700 ${
        scrolled ? "opacity-0" : "opacity-100"
      }`} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-15 lg:h-16">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center gap-4 group relative z-10" 
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-16 h-16 lg:w-25 lg:h-15">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/40 via-orange-500/40 to-amber-600/40 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.12)] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-all duration-500 group-hover:scale-105 ring-1 ring-gray-200/50 group-hover:ring-amber-400/30">
                <Image
                  src={encodeURI("/logo chính@4x.png")}
                  alt="ARTEE Logo"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-5 lg:px-6 py-2.5 text-[15px] lg:text-base font-medium text-gray-700 hover:text-gray-900 transition-all duration-500 group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
                <span className="relative z-10 tracking-wide group-hover:tracking-wider transition-all duration-300">
                  {item.label}
                </span>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 group-hover:w-4/5 transition-all duration-500 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-3 lg:gap-4">

            {/* --- THÊM PHẦN USER Ở ĐÂY --- */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-10 w-10 border border-gray-200">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/profile">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <UserIcon className="w-4 h-4" /> Hồ sơ của tôi
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={logout} className="gap-2 text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Đăng nhập</Button>
              </Link>
            )}

            {/* THAY ĐỔI Ở ĐÂY: Nút Báo giá */}
            <Link href="/cart" className="group">
              <Button 
                variant="outline" 
                className="relative gap-2.5 h-11 px-5 bg-white/60 hover:bg-white border border-gray-200/80 hover:border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-xl backdrop-blur-sm"
              >
                {/* Giữ icon ShoppingCart hoặc đổi sang FileText nếu muốn biểu tượng giống đơn hàng hơn */}
                <ShoppingCart className="w-[18px] h-[18px] text-gray-600 group-hover:text-gray-900 transition-colors duration-300" />
                
                {/* Đổi text từ "Giỏ hàng" thành "Báo giá" */}
                <span className="hidden sm:inline text-[15px] text-gray-700 group-hover:text-gray-900 font-medium tracking-wide">
                  Báo giá
                </span>
                
                {/* Badge đếm số lượng */}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-[0_4px_12px_rgba(239,68,68,0.4)] ring-2 ring-white animate-in zoom-in duration-300">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden h-11 w-11 p-0 hover:bg-gray-100/80 active:bg-gray-200/60 transition-all duration-300 rounded-xl" 
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="relative w-6 h-6">
                <X 
                  className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ${
                    isOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                  }`}
                />
                <Menu 
                  className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ${
                    isOpen ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="pb-6 space-y-1 border-t border-gray-200/60 pt-6">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-5 py-3.5 text-base text-gray-700 hover:text-gray-900 bg-transparent hover:bg-gradient-to-r hover:from-gray-50 hover:via-gray-50/50 hover:to-transparent rounded-xl transition-all duration-300 font-medium group relative overflow-hidden"
                onClick={() => setIsOpen(false)}
                style={{ 
                  animationDelay: `${index * 60}ms`,
                  animation: isOpen ? 'slideInLeft 0.5s ease-out forwards' : 'none'
                }}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-r-full group-hover:w-1 transition-all duration-300" />
                <span className="flex items-center gap-3 pl-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-amber-500 group-hover:scale-150 transition-all duration-300" />
                  <span className="tracking-wide">{item.label}</span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-700 ${
        scrolled ? "opacity-100" : "opacity-0"
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent blur-sm" />
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </header>
  )
}