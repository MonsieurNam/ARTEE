// app/products/[id]/page.tsx
"use client"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import ProductDetails from "@/components/product-details"
import { COLLECTION } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = Number.parseInt(params.id as string)
  const product = COLLECTION.products.find((p) => p.id === productId)

  if (!product) {
    return (
      <main className="w-full min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Sản phẩm không tìm thấy</h1>
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại trang chủ
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </Link>
        <ProductDetails product={product} />
      </div>
    </main>
  )
}
