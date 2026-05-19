"use client";

interface CartProps {
  count: number;
  total: number;
  onCheckout: () => void;
}

export const Cart = ({ count, total, onCheckout }: CartProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a1a] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 text-white">
          <span className="text-xl sm:text-2xl">🛍️</span>
          <div>
            <span className="font-bold text-sm sm:text-lg">{count} {count === 1 ? "item" : "itens"}</span>
            <span className="text-white/40 mx-1 sm:mx-2">•</span>
            <span className="font-bold text-sm sm:text-lg text-[#7BC843]">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={count === 0}
          className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-white text-xs sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 bg-[#7BC843]"
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
};