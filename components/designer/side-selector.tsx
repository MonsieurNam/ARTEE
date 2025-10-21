// components/designer/side-selector.tsx
"use client";

import { useDesignStore } from "@/store/design-store";
import { Button } from "@/components/ui/button";

export default function SideSelector() {
    const { activeSide, setActiveSide } = useDesignStore();

    return (
        <div className="flex justify-center bg-gray-100 p-1 rounded-lg border">
            <Button
                variant={activeSide === 'front' ? 'default' : 'ghost'}
                className="flex-1"
                onClick={() => setActiveSide('front')}
            >
                Mặt trước
            </Button>
            <Button
                variant={activeSide === 'back' ? 'default' : 'ghost'}
                className="flex-1"
                onClick={() => setActiveSide('back')}
            >
                Mặt sau
            </Button>
        </div>
    );
}