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
      title: "O mimo grátis de todos os dias",
      description: "— salvo sozinho na sua conta, nunca mais perca o presente diário"
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
      title: "Galeria de ferramentas exclusivas de graça",
      description: "— calculadora de preço, contador de pontos e carreiras, conversor de agulha/fio, combinador de cores"
    },
    {
      emoji: "📲",
      title: "App instalado no celular em 2 cliques",
      description: "— de graça, leve, rápido, não ocupa memória nem trava seu aparelho"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-[#9241B1] to-[#FF3D9A] rounded-[32px] p-6 sm:p-8 text-white shadow-2xl border border-white/20 text-left my-6 max-w-2xl mx-auto">
      <div className="text-center sm:text-left space-y-2 mb-6">
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide leading-tight text-white">
          🎁 GANHE SEU MEU AMIGUMUNDO — DE GRAÇA, AGORA MESMO
        </h2>
        <p className="text-xs sm:text-sm font-medium text-white/90 leading-relaxed">
          Ao criar sua conta (10 segundos, só o e-mail, sem senha pra decorar), você ganha uma área de membros só sua, com:
        </p>
      </div>

      <div className="space-y-3.5 mb-6">
        {benefits.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm shrink-0 mt-0.5">
              {item.emoji}
            </div>
            <p className="text-xs sm:text-sm text-white/95 leading-snug">
              <strong className="font-bold text-white">{item.title}</strong> {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/20 mb-6">
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15 text-center">
          <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
            Sem criar sua conta, você perde tudo isso — você terá que baixar as receitas que comprar e as gratuitas e salvar no celular.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenAuth}
        className="w-full bg-[#44FF00] text-[#171717] py-4 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all text-center border-b-4 border-green-600"
      >
        QUERO MEU AMIGUMUNDO GRÁTIS →
      </button>
    </div>
  );
};