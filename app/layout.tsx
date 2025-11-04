// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
// THAY ĐỔI: Import Inter và Roboto_Mono thay vì Geist
import { Inter, Roboto_Mono } from "next/font/google" 
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

// THAY ĐỔI: Khởi tạo Inter với subset 'vietnamese' và gán biến CSS
const inter = Inter({ 
  subsets: ["latin", "vietnamese"], 
  variable: "--font-sans" 
})

// THAY ĐỔI: Khởi tạo Roboto_Mono
const roboto_mono = Roboto_Mono({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ARTEE - Thiết kế áo in theo yêu cầu",
  description: "Tạo thiết kế áo in theo yêu cầu của bạn với công nghệ AR",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en">
      {/* THAY ĐỔI: Áp dụng các biến font vào thẻ body */}
      <body className={`${inter.variable} ${roboto_mono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}