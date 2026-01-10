// components/final-cta-section.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Mail, Loader2, CheckCircle2, Send } from "lucide-react"
import { SiTiktok } from "@icons-pack/react-simple-icons" 
import { useToast } from "@/hooks/use-toast"

export default function FinalCtaSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
        toast({ title: "Lỗi", description: "Vui lòng nhập email hợp lệ.", variant: "destructive" })
        return
    }

    setIsSubmitting(true)

    try {
        const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Có lỗi xảy ra');
        }

        setSubscribed(true)
        setEmail("")
        toast({ 
            title: "Đăng ký thành công! 🎉", 
            description: "Cảm ơn bạn đã tham gia cộng đồng ARTEE.",
            className: "bg-green-600 text-white border-none"
        })
        
        setTimeout(() => setSubscribed(false), 5000)

    } catch (error) {
        console.error(error);
        toast({ 
            title: "Đăng ký thất bại", 
            description: "Hệ thống đang bận, vui lòng thử lại sau.", 
            variant: "destructive" 
        })
    } finally {
        setIsSubmitting(false)
    }
  }

  // --- CẬP NHẬT LINK SOCIAL TẠI ĐÂY ---
  const socialLinks = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      url: "https://www.facebook.com/profile.php?id=61586419133991" 
    },
    { 
      name: "TikTok", 
      icon: SiTiktok, // Dùng tạm MessageCircle vì Lucide chưa có icon TikTok
      url: "https://www.tiktok.com/@artee601?_r=1&_t=ZS-92teuzbFDZg" 
    },
  ]

  return (
    <section className="w-full py-24 md:py-32 px-4 bg-gradient-to-b from-neutral-900 to-black text-white relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-serif font-light mb-6 text-balance tracking-tight">
            Theo dõi hành trình của ARTEE
        </h2>

        <p className="text-lg text-neutral-400 mb-12 max-w-2xl mx-auto text-balance leading-relaxed">
          Tham gia cộng đồng và nhận thông báo về các bộ sưu tập AR mới nhất.
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {socialLinks.map((link) => {
            const Icon = link.icon
            return (
              <Button
                key={link.name}
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-neutral-900 rounded-full px-6 bg-white/5 backdrop-blur-sm transition-all hover:scale-105 flex items-center gap-2 h-12"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Icon className="w-4 h-4" />
                  {link.name}
                </a>
              </Button>
            )
          })}
        </div>

        {/* Newsletter Card */}
        <div className="mt-8 p-8 md:p-12 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-semibold">Đăng ký nhận tin tức</h3>
            <p className="text-neutral-400 text-sm max-w-md">
                Nhận ngay thông báo ưu đãi và sự kiện mới nhất.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
                <input
                type="email"
                placeholder="Nhập email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting || subscribed}
                className="w-full h-12 px-5 rounded-full bg-neutral-950/50 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50"
                />
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting || subscribed}
              className={`h-12 rounded-full px-8 font-semibold transition-all min-w-[140px] shadow-lg ${
                  subscribed 
                  ? "bg-green-600 hover:bg-green-700 text-white border-none" 
                  : "bg-white text-neutral-900 hover:bg-neutral-200 border-none"
              }`}
            >
              {isSubmitting ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gửi...
                </>
              ) : subscribed ? (
                <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Đã xong
                </>
              ) : (
                <>
                    Đăng ký <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-700 text-sm text-neutral-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 ARTEE. All rights reserved.</p>
          <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
              <a href="#contact" className="hover:text-white transition-colors">Liên hệ</a>
          </div>
        </div>
      </div>
    </section>
  )
}