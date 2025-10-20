// components/final-cta-section.tsx
"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Mail, Instagram, Facebook, MessageCircle, Twitter } from "lucide-react"
import { useState } from "react"

export default function FinalCtaSection() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "#" },
    { name: "Facebook", icon: Facebook, url: "#" },
    { name: "TikTok", icon: MessageCircle, url: "#" },
    { name: "Twitter", icon: Twitter, url: "#" },
  ]

  return (
    <section className="w-full py-24 md:py-32 px-4 bg-gradient-to-b from-neutral-900 to-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <h2 className="text-5xl md:text-6xl font-serif font-light mb-6 text-balance">Theo dõi hành trình của ARTEE</h2>

        <p className="text-lg text-neutral-300 mb-12 max-w-2xl mx-auto text-balance">
          Hãy tham gia cộng đồng của chúng tôi và cập nhật những thiết kế mới nhất, sự kiện độc quyền và trải nghiệm AR
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {socialLinks.map((link) => {
            const Icon = link.icon
            return (
              <Button
                key={link.name}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-neutral-900 rounded-full px-6 bg-transparent transition-all hover:scale-110 flex items-center gap-2"
                asChild
              >
                <a href={link.url}>
                  <Icon className="w-4 h-4" />
                  {link.name}
                </a>
              </Button>
            )
          })}
        </div>

        <div className="mt-16 p-8 md:p-12 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl shadow-xl border border-neutral-700">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-5 h-5" />
            <h3 className="text-2xl font-semibold">Đăng ký nhận tin tức</h3>
          </div>
          <p className="text-neutral-300 mb-6">
            Nhận thông báo về các bộ sưu tập mới, sự kiện độc quyền và cơ hội hợp tác
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-full bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            />
            <Button
              type="submit"
              className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-8 transition-all hover:scale-105 font-semibold"
            >
              {subscribed ? "✓ Đã đăng ký" : "Đăng ký"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-neutral-700 text-sm text-neutral-400">
          <p>© 2025 ARTEE. All rights reserved. | Personalized Art × AR Technology × Sustainable Fashion</p>
        </div>
      </div>
    </section>
  )
}
