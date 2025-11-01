// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster" // <-- 1. Import Toaster

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

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
    
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <Toaster /> {/* <-- 2. Thêm Toaster vào đây */}
      </body>
    </html>
  )
}