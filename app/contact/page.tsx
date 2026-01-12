"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2, Send, ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import Link from "next/link";

// Thông tin liên hệ (Có thể tách ra constants nếu muốn dùng chung)
const contactDetails = [
  {
    icon: <MapPin className="w-5 h-5 text-primary" />,
    title: "Địa chỉ Shop",
    value: "Ninh Kiều, Cần Thơ, Việt Nam",
  },
  {
    icon: <Mail className="w-5 h-5 text-primary" />,
    title: "Email Hỗ trợ",
    value: "namnguyenfnw@gmail.com",
  },
  {
    icon: <Phone className="w-5 h-5 text-primary" />,
    title: "Hotline / Zalo",
    value: "0985 029 160",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ 
        title: "Thiếu thông tin", 
        description: "Vui lòng điền đầy đủ Họ tên, Email và Lời nhắn.", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra.");
      }

      toast({ 
        title: "Gửi thành công! 🎉", 
        description: "ARTEE đã nhận được tin nhắn và sẽ phản hồi sớm." 
      });
      
      // Reset form
      setFormData({ name: "", email: "", message: "" });

    } catch (error) {
      console.error("Contact Error:", error);
      toast({ 
        title: "Gửi thất bại", 
        description: "Hệ thống đang bận, vui lòng thử liên hệ qua Zalo/Hotline.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-10 pt-28">
        
        {/* Nút quay lại */}
        <div className="mb-6">
            <Link href="/">
                <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay lại Trang chủ
                </Button>
            </Link>
        </div>

        {/* Tiêu đề trang */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Liên hệ với ARTEE</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe! Gửi tin nhắn trực tuyến hoặc ghé thăm chúng tôi qua thông tin bên dưới.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN & BẢN ĐỒ */}
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-700 delay-150">
            {/* Thẻ thông tin */}
            <Card className="p-6 border border-gray-100 shadow-lg bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin kết nối</h3>
                <div className="space-y-6">
                    {contactDetails.map((detail) => (
                    <div key={detail.title} className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            {detail.icon}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 text-base">{detail.title}</h4>
                            <p className="text-gray-600 mt-1 select-all">{detail.value}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </Card>
            
            {/* Bản đồ (Iframe Google Maps) */}
            <div className="w-full h-72 bg-gray-200 rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.841518442039!2d105.76804037489524!3d10.029933690077033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zTmluaCBKiRrhu4F1LCBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="ARTEE Location"
                ></iframe>
            </div>
          </div>

          {/* CỘT PHẢI: FORM LIÊN HỆ */}
          <div className="animate-in slide-in-from-right-8 duration-700 delay-150">
            <Card className="p-8 shadow-xl border-t-4 border-t-primary bg-white">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Gửi tin nhắn</h3>
              <p className="text-gray-500 mb-8 text-sm">Điền thông tin bên dưới, chúng tôi sẽ phản hồi qua Email trong vòng 24h.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Họ và tên</label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Nhập tên của bạn" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email liên hệ</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="email@example.com" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Lời nhắn / Yêu cầu</label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Bạn cần tư vấn về sản phẩm, size hay thiết kế riêng?..." 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    rows={6} 
                    className="resize-none bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required 
                  />
                </div>

                <Button 
                    type="submit" 
                    className="w-full py-6 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]" 
                    disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2"/> Đang gửi...</>
                  ) : (
                    <><Send className="mr-2 w-5 h-5"/> Gửi tin nhắn ngay</>
                  )}
                </Button>
              </form>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}