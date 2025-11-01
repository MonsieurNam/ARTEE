// components/designer/HistoryControls.tsx
"use client";

import { useDesignStore } from "@/store/design-store";
import { Button } from "@/components/ui/button";
import { Undo, Redo } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

export default function HistoryControls() {
  const { history, historyIndex, undo, redo } = useDesignStore(
    useShallow((state) => ({
      history: state.history,
      historyIndex: state.historyIndex,
      undo: state.undo,
      redo: state.redo,
    }))
  );

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="absolute top-4 left-4 flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 bg-white shadow-sm"
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 bg-white shadow-sm"
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
}