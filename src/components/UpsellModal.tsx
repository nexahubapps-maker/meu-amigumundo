"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellModalProps {
  upsell: Upsell;
  onClose: () => void;
  onBuy: () => void;
}

export const UpsellModal = ({ upsell, onClose, onBuy }: UpsellModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-8 flex items-center justify-center p-4">
      <div className="bg-white rounded-28 shadow-3xl max-w-560 w-full max-w-2xl overflow-y-auto">
        <div className="relative">
          <div
            className="h-120 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${upsell.cor}, #9B59B6)` }}
          >
            <span className="text-5xl">{upsell.emoji}</span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/20 rounded-full w-9 h-9 flex items-center justify-center text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h2
            className="text-2xl text-center mb-1"
            style={{ fontFamily: "'Fredoka One', cursive", color: upsell.cor }}
          >
            {upsell.nome}
          </h2>

          <div className="space-y-3 mb-4">
            {upsell.copiaVendas.map((texto, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">
                {texto}
              </p>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h4 className="font-bold mb-2">Benefícios:</h4>
            <ul className="space-y-1">
              {upsell.beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span>✅</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mb-4">
            <span className="text-gray-400 line-through text-lg">
              R${upsell.precoOriginal.toFixed(2)}
            </span>
            <div className="inline-block bg-gradient-to-r from-[#ff5252] to-[#d32f2f] rounded-full font-bold px-6 py-2 text-xs shadow-0-4-15 rgba(255,82,82,0.4) mt-2">
              🔥 {Math.round(((upsell.precoOriginal - upsell.precoAtual) / upsell.precoOriginal) * 100)}% DE DESCONTO
            </div>
            <p
              className="text-3xl font-bold mt-2"
              style={{
                color: "#7BC843",
                fontFamily: "'Fredoka One', cursive",
                textShadow: "2px 2px 0 rgba(123,200,67,0.2)",
              }}
            >
              R${upsell.precoAtual.toFixed(2)}
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mb-3">
            Pagamento unico • Sem mensalidade • Acesso imediato
          </p>

          <div className="bg-[#FFF0E0] rounded-xl p-2 text-center mb-4">
            <p className="text-sm font-bold" style={{ color: "#FF6B35" }}>
              ⚠️ Oferta por tempo limitado
            </p>
          </div>

          <button
            onClick={onBuy}
            className="w-full py-3 rounded-xl font-bold text-white text-lg transition-transform active:scale-[0.98] mb-3"
            style={{ backgroundColor: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            💳 QUERO AGORA — R${upsell.precoAtual.toFixed(2)}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-transform active:scale-[0.98]"
            style={{ backgroundColor: "#FF6B35", fontFamily: "'Fredoka One', cursive" }}
          >
            JA COMPREI — INSERIR CÓDIGO DE ACESSO
          </button>

          <div className="text-center text-xs text-gray-400 mt-4 pb-2">
            ✅ Garantia de 7 dias — Não gostou? Devolvemos 100%. Sem perguntas.
          </div>
        </div>
      </div>
    </div>
  );
};