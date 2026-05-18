"use client";

interface CartProps {
  count: number;
  total: number;
  onCheckout: () => void;
}

export const Cart = ({ count, total, onCheckout }: CartProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛍️</span>
          <div>
            <span className="font-bold text-lg">{count} {count === 1 ? "item" : "itens"}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="font-bold text-lg" style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}>
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={count === 0}
          className="px-6 py-2.5 rounded-xl font-bold text-white text-base disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
          style={{ backgroundColor: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
};