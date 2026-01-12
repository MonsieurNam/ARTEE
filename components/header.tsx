// components/header.tsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, FileText, Package, ShieldCheck } from "lucide-react"
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
  const [hideAnnouncement, setHideAnnouncement] = useState(false)
  const { cartCount } = useCart()
  const { user, logout } = useAuth();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Ẩn announcement khi scroll xuống > 50px
      if (currentScrollY > 50) {
        setHideAnnouncement(true);
        setScrolled(true);
      } else {
        setHideAnnouncement(false);
        setScrolled(currentScrollY > 20);
      }
      
      lastScrollY = currentScrollY;
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/customizer", label: "Tự Thiết kế" },
    { href: "/#collection-section", label: "Sản phẩm Pre-order" },
    { href: "/contact", label: "Liên hệ với chúng tôi" }
  ]

  return (
    <>
      {/* Announcement Bar - Slide up when scrolling */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-blue-900 via-primary to-blue-900 text-white overflow-hidden transition-all duration-500 ease-in-out ${
          hideAnnouncement ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex items-center justify-center gap-2 px-4 py-2.5">
          <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 animate-pulse" />
          <span className="font-semibold text-[11px] md:text-xs tracking-wide text-center">
            CHƯƠNG TRÌNH PRE-ORDER: CỌC TRƯỚC CHỈ 50K - HOÀN TIỀN NẾU LỖI
          </span>
        </div>
      </div>

      {/* Header - Smooth transition to top */}
      <header 
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          hideAnnouncement 
            ? "top-0 bg-white/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-b border-gray-200/60" 
            : scrolled
            ? "top-[36px] md:top-[34px] bg-white/95 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-b border-gray-200/50"
            : "top-[36px] md:top-[34px] bg-white/90 backdrop-blur-lg border-b border-gray-100/50"
        }`}
      >
        {/* Ambient top glow */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent transition-opacity duration-700 ${
          scrolled ? "opacity-100" : "opacity-60"
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo Section */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group relative z-10 -ml-1" 
              onClick={() => setIsOpen(false)}
            >
              <div className="relative w-14 h-14 lg:w-16 lg:h-16">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/30 via-orange-500/30 to-amber-600/30 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:scale-105 ring-1 ring-gray-200/60 group-hover:ring-amber-400/40">
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
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 lg:px-5 py-2.5 text-[14px] lg:text-[15px] font-medium text-gray-700 hover:text-gray-900 transition-all duration-500 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
                  <span className="relative z-10 tracking-wide group-hover:tracking-wider transition-all duration-300">
                    {item.label}
                  </span>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 group-hover:w-3/4 transition-all duration-500 rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Actions Section */}
            <div className="flex items-center gap-2.5 lg:gap-3">
              {/* User Section */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative group">
                      <Avatar className="h-9 w-9 lg:h-10 lg:w-10 border-2 border-gray-200 group-hover:border-amber-400 transition-all duration-300 cursor-pointer ring-2 ring-transparent group-hover:ring-amber-400/20 ring-offset-1">
                        <AvatarImage src={user.photoURL || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-semibold text-sm">
                          {user.displayName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-amber-400/20 scale-0 group-hover:scale-110 transition-transform duration-300 -z-10" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 shadow-xl border-gray-200/80">
                    <Link href="/profile">
                      <DropdownMenuItem className="gap-2.5 cursor-pointer py-2.5 focus:bg-amber-50 transition-colors">
                        <UserIcon className="w-4 h-4 text-gray-600" /> 
                        <span className="font-medium">Hồ sơ thiết kế</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/orders">
                      <DropdownMenuItem className="gap-2.5 cursor-pointer py-2.5 focus:bg-amber-50 transition-colors">
                        <Package className="w-4 h-4 text-gray-600" /> 
                        <span className="font-medium">Lịch sử đơn hàng</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="gap-2.5 text-red-600 cursor-pointer py-2.5 focus:bg-red-50 focus:text-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> 
                      <span className="font-medium">Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="font-medium text-[14px] lg:text-[15px] h-9 lg:h-10 px-4 hover:bg-gray-100 transition-all duration-300"
                  >
                    Đăng nhập
                  </Button>
                </Link>
              )}

              {/* Cart/Quote Button */}
              <Link href="/cart" className="group">
                <Button 
                  variant="outline" 
                  className="relative gap-2 h-9 lg:h-10 px-3.5 lg:px-4 bg-white/70 hover:bg-white border border-gray-200 hover:border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-xl backdrop-blur-sm"
                >
                  <ShoppingCart className="w-[17px] h-[17px] lg:w-[18px] lg:h-[18px] text-gray-600 group-hover:text-gray-900 transition-colors duration-300" />
                  <span className="hidden sm:inline text-[14px] lg:text-[15px] text-gray-700 group-hover:text-gray-900 font-medium tracking-wide">
                    Báo giá
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1.5 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white text-[11px] rounded-full flex items-center justify-center font-bold shadow-[0_3px_10px_rgba(239,68,68,0.4)] ring-2 ring-white animate-in zoom-in duration-300">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            
              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden h-9 w-9 lg:h-10 lg:w-10 p-0 hover:bg-gray-100 active:bg-gray-200/70 transition-all duration-300 rounded-xl" 
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="relative w-5 h-5">
                  <X 
                    className={`absolute inset-0 w-5 h-5 text-gray-700 transition-all duration-300 ${
                      isOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
                    }`}
                  />
                  <Menu 
                    className={`absolute inset-0 w-5 h-5 text-gray-700 transition-all duration-300 ${
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
              isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="pb-5 space-y-0.5 border-t border-gray-200/60 pt-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-[15px] text-gray-700 hover:text-gray-900 bg-transparent hover:bg-gradient-to-r hover:from-gray-50 hover:via-gray-50/50 hover:to-transparent rounded-xl transition-all duration-300 font-medium group relative overflow-hidden"
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: isOpen ? 'slideInLeft 0.4s ease-out forwards' : 'none'
                  }}
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-7 bg-gradient-to-r from-amber-500 to-orange-500 rounded-r-full group-hover:w-1 transition-all duration-300" />
                  <span className="flex items-center gap-3 pl-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-amber-500 group-hover:scale-150 transition-all duration-300" />
                    <span className="tracking-wide">{item.label}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom border gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-700 ${
          scrolled ? "opacity-100" : "opacity-50"
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

      {/* Spacer - Dynamic height based on announcement visibility */}
      <div className={`transition-all duration-500 ${
        hideAnnouncement 
          ? 'h-16 lg:h-[72px]' 
          : 'h-[100px] lg:h-[106px]'
      }`} />
    </>
  )
}