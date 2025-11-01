'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import VirtualTryOnModal from '../virtual-try-on-modal';

export default function VirtualTryOnButton({ mockupImage }: { mockupImage: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
      >
        👕 Virtual Try-On
      </Button>
      {open && (
        <VirtualTryOnModal
          mockupImage={mockupImage}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
