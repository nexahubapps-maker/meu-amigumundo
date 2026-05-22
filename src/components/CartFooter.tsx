"use client";

import { ShoppingBag } from "lucide-react";

interface CartFooterProps {
  count: number;
  total: number;
  onCheckout: () => void;
}

export const CartFooter = ({ count, total, onCheckout }: CartFooterProps) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-[40px] left-0 right-0 z-[9999] bg-white border-t border-gray-100 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] px-4 py-2 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={20} className="text-[#171717]" />
            <span className="absolute -top-1.5 -right-1.5 bg-[#44FF00] text-[#171717] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {count}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">Total</span>
            <span className="text-base font-black text-[#171717]">R$ {total.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          onClick={onCheckout}
          className="bg-[#44FF00] text-[#171717] px-5 py-2 rounded-full font-black text-[0.7rem] uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
};