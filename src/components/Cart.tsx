"use client";

interface CartProps {
  count: number;
  total: number;
  onCheckout: () => void;
}

export const Cart = ({ count, total, onCheckout }: CartProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a1a] h-[56px] flex items-center px-4 border-t border-white/10 shadow-2xl">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <span className="text-lg">🛍️</span>
          <span className="font-bold text-sm">{count} itens</span>
          <span className="text-white/30">•</span>
          <span className="font-bold text-sm text-[#7BC843]">R$ {total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={count === 0}
          className="btn-premium bg-[#7BC843] text-white px-6 py-2 text-xs"
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
};