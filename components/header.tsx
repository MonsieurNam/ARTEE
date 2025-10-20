// components/header.tsx
"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { cartCount } = useCart()
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
              A
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">ARTEE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Trang chủ
            </Link>
            <Link href="/customizer" className="text-foreground hover:text-primary transition-colors font-medium">
              Thiết kế
            </Link>
            <Link href="#collection" className="text-foreground hover:text-primary transition-colors font-medium">
              Bộ sưu tập
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Liên hệ
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative gap-2 bg-transparent hover:bg-secondary">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-border pt-4">
            <Link
              href="/"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/customizer"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Thiết kế
            </Link>
            <Link
              href="#collection"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Bộ sưu tập
            </Link>
            <Link
              href="#contact"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Liên hệ
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
