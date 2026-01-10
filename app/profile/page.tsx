// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { getUserProjects, deleteProjectCloud, type CloudProject } from "@/lib/services/project-cloud";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trash2, Edit, Calendar, LogOut, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<CloudProject[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. Bảo vệ Route: Nếu chưa login -> Đá về trang chủ
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // 2. Load dữ liệu dự án
  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const data = await getUserProjects(user.uid);
          setProjects(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingData(false);
        }
      }
    }
    fetchData();
  }, [user]);

  // 3. Xử lý xóa dự án
  const handleDelete = async (id: string) => {
    try {
      await deleteProjectCloud(id);
      // Cập nhật giao diện ngay lập tức
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Đã xóa", description: "Thiết kế đã được xóa khỏi hồ sơ." });
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể xóa dự án.", variant: "destructive" });
    }
  };

  // 4. Xử lý sửa dự án
  const handleEdit = (project: CloudProject) => {
    // Lưu ID dự án muốn sửa vào localStorage tạm thời
    // Để khi sang trang Customizer, nó tự động load
    // (Đây là một trick đơn giản để truyền dữ liệu giữa các trang)
    if (typeof window !== "undefined" && project.id) {
        // Lưu ý: Bạn cần update LeftPanel để đọc key này nếu muốn tự động load
        // Nhưng hiện tại chỉ cần chuyển hướng, người dùng tự mở tab Project để chọn cũng được.
        router.push("/customizer");
        toast({ title: "Chuyển hướng", description: "Vào tab 'Dự án' trong trang thiết kế để tải lại." });
    }
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null; // Đã xử lý redirect ở useEffect

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-10 mt-16">
        
        {/* User Info Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={user.photoURL || ""} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {user.displayName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{user.displayName || "Người dùng ARTEE"}</h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    <Package className="w-3 h-3" /> {projects.length} Thiết kế
                </span>
            </div>
          </div>

          <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={logout}>
            <LogOut className="w-4 h-4" /> Đăng xuất
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Bộ sưu tập của bạn</h2>
                <Link href="/customizer">
                    <Button>Tạo thiết kế mới</Button>
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Edit className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Chưa có thiết kế nào</h3>
                    <p className="text-gray-500 mb-6">Hãy bắt đầu sáng tạo chiếc áo đầu tiên của bạn ngay hôm nay.</p>
                    <Link href="/customizer">
                        <Button variant="outline">Bắt đầu thiết kế</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="group overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                <img 
                                    src={project.previewImage} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => handleEdit(project)}>
                                        <Edit className="w-4 h-4 mr-1" /> Sửa
                                    </Button>
                                </div>
                            </div>
                            
                            <CardHeader className="p-4 pb-2">
                                <h3 className="font-semibold truncate" title={project.title}>{project.title}</h3>
                            </CardHeader>
                            
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {project.updatedAt?.seconds 
                                        ? new Date(project.updatedAt.seconds * 1000).toLocaleDateString("vi-VN") 
                                        : "Vừa xong"
                                    }
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 border-t bg-gray-50/50 flex justify-between items-center">
                                <span className="text-xs font-medium uppercase text-muted-foreground">
                                    {project.product?.type || "Áo"}
                                </span>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Xóa thiết kế?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Hành động này không thể hoàn tác. Thiết kế "{project.title}" sẽ bị xóa vĩnh viễn.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(project.id!)} className="bg-red-600 hover:bg-red-700">
                                                Xóa
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );
}