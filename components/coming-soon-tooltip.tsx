// components/coming-soon-tooltip.tsx
"use client"

import React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface ComingSoonTooltipProps {
  children: React.ReactNode; // Component con sẽ được bọc
  featureName?: string; // Tên tính năng (tùy chọn)
}

export default function ComingSoonTooltip({ children, featureName = "Tính năng này" }: ComingSoonTooltipProps) {
  const { toast } = useToast()

  const handleClick = (e: React.MouseEvent) => {
    // Ngăn chặn các hành vi mặc định như submit form hoặc điều hướng
    e.preventDefault();
    e.stopPropagation();

    toast({
      title: "Sắp ra mắt!",
      description: `${featureName} đang được phát triển và sẽ sớm có mặt.`,
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* 
            Bọc children trong một thẻ div để đảm bảo Tooltip luôn hoạt động,
            ngay cả khi children là một component bị vô hiệu hóa (disabled).
          */}
          <div onClick={handleClick} className="cursor-pointer">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sắp ra mắt (Coming Soon)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}