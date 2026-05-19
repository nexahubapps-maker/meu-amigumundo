"use client";

interface CheckoutModalProps {
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const CheckoutModal = ({ total, onClose, onConfirm }: CheckoutModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center w-full" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Quase lá! 🎉
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl absolute top-4 right-4">
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">WhatsApp</label>
              <input
                type="text"
                placeholder="55 (00) 00000-0000"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Resumo do Pedido
            </h3>
            <p className="text-gray-500 text-sm mb-2">Suas receitas serão enviadas pelo WhatsApp.</p>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-lg" style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}>
                Total: R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <button
              onClick={onConfirm}
              className="w-full py-3 rounded-xl font-bold text-white text-lg transition-transform active:scale-[0.98]"
              style={{ backgroundColor: "#FF6B35", fontFamily: "'Fredoka One', cursive" }}
            >
              💳 Pagar via Pix
            </button>
            <button              className="w-full py-3 rounded-xl font-bold text-white text-base transition-transform active:scale-[0.98]"
              style={{ backgroundColor: "#4A90D9", fontFamily: "'Fredoka One', cursive" }}
            >
              💳 Pagar com Cartão
            </button>
          </div>

          <div className="bg-[#FFF8F2] rounded-xl p-3 mb-4 text-center">
            <p className="text-sm font-bold" style={{ color: "#FF6B35" }}>
              ⚡ Entrega em 5 segundos após pagamento
            </p>
          </div>

          <div className="text-center text-sm text-gray-400 pb-2">
            📱 Suas receitas chegam no seu WhatsApp em segundos após o pagamento
          </div>
        </div>
      </div>
    </div>
  );
};