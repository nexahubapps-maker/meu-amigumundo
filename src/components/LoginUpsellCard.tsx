"use client";

import React from "react";

interface LoginUpsellCardProps {
  onOpenAuth: () => void;
}

export const LoginUpsellCard = ({ onOpenAuth }: LoginUpsellCardProps) => {
  const benefits = [
    {
      emoji: "📚",
      title: "Biblioteca de tudo que você comprar",
      description: "— organizada automaticamente, baixe e imprima quantas vezes quiser, monte seu próprio catálogo ou coleção dentro do AmiguMundo"
    },
    {
      emoji: "🎁",
      title: "A Receita grátis de todos os dias",
      description: "— salve diretamente na sua conta, nunca mais perca o presente diário"
    },
    {
      emoji: "❤️",
      title: "Seus favoritos guardados",
      description: "— acessíveis de qualquer celular ou computador"
    },
    {
      emoji: "🧾",
      title: "Histórico completo das suas compras",
      description: "— sempre disponível"
    },
    {
      emoji: "🧰",
      title: "Galeria de ferramentas exclusivas e de graça",
      description: "— calculadora de preço, contador de pontos e carreiras, conversor de agulha/fio, combinador de cores"
    },
    {
      emoji: "📲",
      title: "App instalado no celular em 2 cliques",
      description: "— de graça, leve, rápido, não ocupa memória nem trava seu aparelho"
    }
  ];

  return (
    <div style={{ textShadow: "none" }} className="bg-[#E5E7EB] rounded-[28px] p-3 sm:p-5 text-gray-900 shadow-[0_12px_28px_rgba(0,0,0,0.22),_0_6px_12px_rgba(0,0,0,0.15)] border-2 border-gray-300 text-left my-4 mx-1">
      <div className="text-center sm:text-left space-y-1.5 mb-4">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight text-gray-900">
          🎁 GANHE SUA BIBLIOTECA<br />DE GRAÇA, AGORA MESMO
        </h2>
        <p className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">
          Ao criar sua conta (10 segundos, só o e-mail), você ganha uma área de membros só sua, com:
        </p>
      </div>

      <div className="space-y-2.5 mb-4">
        {benefits.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-start gap-2.5 py-1">
              <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm border border-gray-300/60">
                {item.emoji}
              </div>
              <p className="text-xs sm:text-sm text-gray-800 leading-snug">
                <strong className="font-bold text-gray-900">{item.title}</strong> {item.description}
              </p>
            </div>
            {index < benefits.length - 1 && (
              <div className="border-b border-gray-300/80 mx-3 my-1" />
            )}
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-300/80 mb-4">
        <div className="bg-white/80 rounded-2xl p-3 border border-gray-300/70 text-center shadow-inner">
          <p className="text-xs font-bold text-gray-800 leading-relaxed">
            Mas, sem criar sua conta, você perde tudo isso — você terá que baixar as receitas que comprar e as gratuitas e salvar no celular.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenAuth}
        className="w-full bg-[#44FF00] hover:bg-[#3ee600] text-[#171717] py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_6px_16px_rgba(68,255,0,0.35)] hover:scale-[1.01] active:scale-95 transition-all text-center border-b-4 border-green-600 leading-tight"
      >
        QUERO MINHA AREA DE<br />MEMBROS GRÁTIS →
      </button>
    </div>
  );
};