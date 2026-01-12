// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { BANK_INFO } from "./constants" // <--- Nhớ import BANK_INFO

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateVietQR(amount: number, orderId: string) {
  const content = `ARTEE ${orderId ? orderId.slice(-6).toUpperCase() : 'COC'}`;
  const url = `https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNum}-${BANK_INFO.template}.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;
  return {
    qrUrl: url,
    content: content
  };
}