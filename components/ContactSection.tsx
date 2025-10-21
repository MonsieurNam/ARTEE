// components/contact-section.tsx
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";

const contactDetails = [
  {
    icon: <MapPin className="w-5 h-5 text-primary" />,
    title: "Địa chỉ",
    value: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
  },
  {
    icon: <Mail className="w-5 h-5 text-primary" />,
    title: "Email",
    value: "support@artee.com",
  },
  {
    icon: <Phone className="w-5 h-5 text-primary" />,
    title: "Điện thoại",
    value: "+84 123 456 789",
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
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Giả lập việc gửi form đến API
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" }); // Reset form
    
    toast({
      title: "Gửi thành công!",
      description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.",
    });
  };

  return (
    // QUAN TRỌNG: Gán id="contact" cho section này
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
                  <Input id="name" name="name" type="text" placeholder="Tên của bạn" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input id="email" name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Lời nhắn</label>
                  <Textarea id="message" name="message" placeholder="Bạn muốn nói gì với chúng tôi?" value={formData.message} onChange={handleInputChange} rows={5} required />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : "Gửi tin nhắn"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}