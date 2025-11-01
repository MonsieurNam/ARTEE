// components/designer/layer-item.tsx
// THAY THẾ TOÀN BỘ FILE BẰNG PHIÊN BẢN NÀY

import { Button } from "@/components/ui/button";
import { FileText, ImageIcon, Copy, Trash2, Eye, EyeOff, Lock, Unlock } from "lucide-react";

interface LayerItemProps {
  id: string;
  type: string;
  title: string;
  isActive: boolean;
  isVisible: boolean;
  isLocked: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onSelect: () => void;
}

export default function LayerItem({ 
  id, type, title, isActive, isVisible, isLocked,
  onDelete, onDuplicate, onToggleVisibility, onToggleLock, onSelect
}: LayerItemProps) {
  return (
    <div 
      className={`group flex items-center p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
        isActive ? 'bg-primary/10 border-primary' : 'bg-white hover:bg-gray-50'
      } ${!isVisible ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      <div className={`p-2 rounded-md mr-3 ${isActive ? 'bg-primary/20 text-primary' : 'bg-gray-100'}`}>
        {type === 'i-text' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
      </div>
      <p className="flex-1 min-w-0 text-sm font-medium truncate">{title}</p>
      
      <div className="flex items-center gap-0.5">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} title={isVisible ? "Ẩn lớp" : "Hiện lớp"}>
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggleLock(); }} title={isLocked ? "Mở khóa" : "Khóa lớp"}>
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Nhân bản">
          <Copy className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Xóa">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}