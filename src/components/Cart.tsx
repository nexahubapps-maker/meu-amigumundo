"use client";

interface CartProps {
  count: number;
  total: number;
  onCheckout: () => void;
}

export const Cart = ({ count, total, onCheckout }: CartProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center">
      <div className="bg-gradient-to-r from-[#2d2d2d] to-[#1a1a1a] rounded-2xl p-4 shadow-2xl w-full max-w-2xl text-center animate-pulse-green">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛍️</span>
          <div>
            <span className="font-bold text-lg">🛍️ {count} {count === 1 ? "item" : "itens"}</span>
            <span className="font-bold text-lg" style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}>
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={count === 0}
          className="mt-3 w-full bg-gradient-to-r from-[#7BC843] to-[#5fa832] rounded-50px py-2.5 text-lg font-bold text-white transition-all duration-200 hover:scale-105"
          style={{ boxShadow: "0 4px 20px rgba(123,200,67,0.5)" }}
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
};