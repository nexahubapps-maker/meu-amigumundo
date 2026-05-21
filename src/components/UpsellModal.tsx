"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellModalProps {
  upsell: Upsell;
  onClose: () => void;
  onBuy: () => void;
}

export const UpsellModal = ({ upsell, onClose, onBuy }: UpsellModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content relative bg-white text-gray-900 max-w-lg rounded-[24px] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 transition-colors z-50"
        >
          ✕
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{upsell.emoji}</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">
              {upsell.nome}
            </h2>
            <p className="text-sm text-gray-500 italic font-medium">
              {upsell.descricaoLonga}
            </p>
          </div>

          {/* Body Copy */}
          <div className="space-y-3 mb-6">
            {upsell.copiaVendas.map((texto, i) => (
              <p key={i} className="text-sm text-gray-700 leading-relaxed">
                {texto}
              </p>
            ))}
          </div>

          {/* Benefits List */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
            <h4 className="font-black text-sm text-gray-900 mb-3 uppercase tracking-wider">
              O que você vai receber:
            </h4>
            <ul className="space-y-2.5">
              {upsell.beneficios.map((b, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2.5">
                  <span className="text-green-500 shrink-0">✅</span>
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scarcity Banner */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center mb-6">
            <p className="text-xs font-black text-red-600 uppercase tracking-wider">
              ⚠️ Oferta por tempo limitado
            </p>
          </div>

          {/* Price Anchoring */}
          <div className="text-center mb-6">
            <span className="text-gray-400 line-through text-sm font-bold">
              De R$ {upsell.precoOriginal.toFixed(2)}
            </span>
            <div className="text-3xl font-black text-gray-900 mt-1">
              Por apenas <span className="text-[#44FF00] bg-black px-2 py-0.5 rounded-lg">R$ {upsell.precoAtual.toFixed(2)}</span>
            </div>
          </div>

          {/* CTA Button (Fast-Pass Checkout) */}
          <button
            onClick={onBuy}
            className="w-full bg-[#44FF00] text-[#171717] py-4 rounded-2xl font-black text-base shadow-lg shadow-green-100 hover:scale-[1.02] active:scale-95 transition-transform uppercase tracking-wider"
          >
            Adicionar e Ir para o Pagamento →
          </button>

          <div className="text-center text-[10px] text-gray-400 mt-4">
            🔒 Pagamento 100% Seguro • Garantia incondicional de 7 dias
          </div>
        </div>
      </div>
    </div>
  );
};