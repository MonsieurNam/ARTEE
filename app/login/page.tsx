// app/login/page.tsx
"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { user, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  // Nếu đã đăng nhập, tự động đá về trang chủ hoặc trang trước đó
  useEffect(() => {
    if (user) {
      router.push("/"); 
    }
  }, [user, router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
          <p className="text-gray-500">Tham gia cộng đồng ARTEE để lưu thiết kế của bạn.</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={loginWithGoogle} 
            className="w-full py-6 text-base bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 mr-3" alt="Google" />
            Tiếp tục với Google
          </Button>
          
          {/* Có thể thêm Email/Pass form ở đây nếu muốn */}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <Link href="/" className="hover:underline">Quay về trang chủ</Link>
        </div>
      </Card>
    </div>
  );
}