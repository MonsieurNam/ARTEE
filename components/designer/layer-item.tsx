// components/designer/layer-item.tsx
import { useDesignStore } from "@/store/design-store";
import { Button } from "@/components/ui/button";
import { FileText, ImageIcon, Copy, Trash2 } from "lucide-react";

interface LayerItemProps {
  id: string;
  type: string;
  title: string;
  isActive?: boolean;
  onDelete: () => void;      // <-- Callback mới
  onDuplicate: () => void;  // <-- Callback mới
}

export default function LayerItem({ id, type, title, isActive = false, onDelete, onDuplicate }: LayerItemProps) {
  const { canvas } = useDesignStore();

  const handleSelectLayer = () => {
    if (!canvas) return;
    const objectToSelect = canvas.getObjects().find(obj => obj.data?.id === id);
    if (objectToSelect) {
      canvas.setActiveObject(objectToSelect);
      canvas.renderAll();
    }
  };

  return (
    <div 
      className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
        isActive 
          ? 'bg-primary/10 border-primary' 
          : 'bg-gray-50 hover:bg-gray-100'
      }`}
      onClick={handleSelectLayer}
    >
      {type === 'i-text' 
        ? <FileText className="w-5 h-5 mr-3 text-muted-foreground" /> 
        : <ImageIcon className="w-5 h-5 mr-3 text-muted-foreground" />
      }
      <p className="flex-1 text-sm font-medium truncate">{title}</p>
      <div className="flex items-center">
        <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 hover:text-destructive" 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}