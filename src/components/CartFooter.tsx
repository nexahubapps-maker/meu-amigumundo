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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={24} className="text-[#171717]" />
            <span className="absolute -top-2 -right-2 bg-[#E8472A] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {count}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">Total</span>
            <span className="text-lg font-black text-[#171717]">R$ {total.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          onClick={onCheckout}
          className="bg-[#44FF00] text-[#171717] px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-md active:scale-95 transition-transform"
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
};