// components/designer/logo-library.tsx
"use client";

import { useDesignStore } from "@/store/design-store";
import * as fabric from 'fabric';


// Lấy từ code gốc của Artee
const LOGO_LIBRARY = [
  { id: "logo1", name: "Star", emoji: "⭐" },
  { id: "logo2", name: "Heart", emoji: "❤️" },
  { id: "logo3", name: "Lightning", emoji: "⚡" },
  { id: "logo4", name: "Rocket", emoji: "🚀" },
  { id: "logo5", name: "Crown", emoji: "👑" },
  { id: "logo6", name: "Skull", emoji: "💀" },
  { id: "logo7", name: "Fire", emoji: "🔥" },
  { id: "logo8", name: "Diamond", emoji: "💎" },
];

export default function LogoLibrary() {
  const { canvas } = useDesignStore();

  const handleAddLogo = (emoji: string) => {
    if (!canvas) return;

    // Thêm emoji dưới dạng Text object để dễ dàng đổi màu và quản lý
    const logo = new fabric.IText(emoji, {
      left: 100,
      top: 150,
      fontSize: 80, // Kích thước lớn hơn cho emoji
      data: { id: `logo-${Date.now()}` },
    });

    // Add the logo and then call canvas methods separately because canvas.add returns a number in typings
    canvas.add(logo);
    canvas.centerObject(logo);
    canvas.setActiveObject(logo);
    canvas.renderAll();
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Thư viện logo</p>
      <div className="grid grid-cols-4 gap-2">
        {LOGO_LIBRARY.map((logo) => (
          <button
            key={logo.id}
            onClick={() => handleAddLogo(logo.emoji)}
            className="aspect-square flex items-center justify-center text-2xl bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-border"
            title={logo.name}
          >
            {logo.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
