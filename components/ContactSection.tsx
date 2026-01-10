// components/ContactSection.tsx
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2, Send } from "lucide-react";

// Dữ liệu tĩnh hiển thị bên trái (không đổi)
const contactDetails = [
  {
    icon: <MapPin className="w-5 h-5 text-primary" />,
    title: "Địa chỉ",
    value: "Ninh Kiều, Cần Thơ, Việt Nam",
  },
  {
    icon: <Mail className="w-5 h-5 text-primary" />,
    title: "Email",
    value: "namnguyenfnw@gmail.com",
  },
  {
    icon: <Phone className="w-5 h-5 text-primary" />,
    title: "Điện thoại",
    value: "+84 985 029 160",
  },
];

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate phía Client
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ Họ tên, Email và Lời nhắn.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Gọi API Route vừa tạo ở Bước 1
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi gửi tin nhắn.");
      }

      // 3. Xử lý khi thành công
      toast({
        title: "Gửi thành công! 🎉",
        description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm qua Email.",
        variant: "default", // Hoặc dùng class text-green-600 nếu custom
      });

      // Reset form
      setFormData({ name: "", email: "", message: "" });

    } catch (error) {
      // 4. Xử lý khi thất bại
      console.error("Contact Form Error:", error);
      toast({
        title: "Gửi thất bại",
        description: error instanceof Error ? error.message : "Vui lòng thử lại sau hoặc liên hệ qua Zalo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-24 md:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-5xl md:text-6xl font-serif font-light text-neutral-900 mb-6 text-balance">
            Liên hệ với ARTEE
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto text-balance">
            Chúng tôi luôn sẵn sàng lắng nghe! Gửi cho chúng tôi một tin nhắn hoặc liên hệ qua thông tin bên dưới.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Cột thông tin liên hệ */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-neutral-900">Thông tin liên hệ</h3>
            {contactDetails.map((detail) => (
              <div key={detail.title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  {detail.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800">{detail.title}</h4>
                  <p className="text-neutral-600">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Cột Form liên hệ */}
          <div>
            <Card className="p-8 border-border shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Họ và tên</label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Tên của bạn" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="email@example.com" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Lời nhắn</label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Bạn muốn nói gì với chúng tôi?" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    rows={5} 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full gap-2 text-base py-6 font-medium transition-all" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang gửi tin nhắn...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Gửi tin nhắn
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}