"use client";

import React from "react";

interface LoginUpsellCardProps {
  onOpenAuth: () => void;
}

export const LoginUpsellCard = ({ onOpenAuth }: LoginUpsellCardProps) => {
  const benefits = [
    {
      emoji: "📚",
      title: "Biblioteca que se organiza sozinha",
      description: "— cada receita que você compra cai automaticamente no lugar certo. Baixe, imprima e monte sua coleção quantas vezes quiser, sem procurar em pasta nenhuma."
    },
    {
      emoji: "🛍️",
      title: "Sua própria vitrine para vender",
      description: "— compartilhe um link e deixe suas clientes escolherem os amigurumis direto pela sua coleção, sem precisar mandar foto por foto no WhatsApp."
    },
    {
      emoji: "🎁",
      title: "A receita grátis de todos os dias, guardada",
      description: "— nunca mais perca o presente por esquecer de baixar a tempo."
    },
    {
      emoji: "❤️",
      title: "Seus favoritos, sempre com você",
      description: "— abra do celular, do computador, de onde estiver."
    },
    {
      emoji: "🧾",
      title: "Histórico completo dos seus pedidos",
      description: "— cada compra vira um cardzinho que você pode reabrir quando quiser, sem precisar procurar e-mail ou print."
    },
    {
      emoji: "🧰",
      title: "Ferramentas exclusivas, de graça",
      description: "— calculadora de preço, contador de pontos e carreiras, conversor de agulha/fio, combinador de cores."
    },
    {
      emoji: "📲",
      title: "App no celular em 2 cliques",
      description: "— leve, rápido, sem ocupar memória."
    }
  ];

  return (
    <div style={{ textShadow: "none" }} className="bg-[#E5E7EB] rounded-[28px] p-3 sm:p-5 text-gray-900 shadow-[0_12px_28px_rgba(0,0,0,0.22),_0_6px_12px_rgba(0,0,0,0.15)] border-2 border-gray-300 text-left my-4 mx-0">
      <div className="text-center sm:text-left space-y-1.5 mb-4">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight text-gray-900">
          GANHE SUA BIBLIOTECA<br />DE GRAÇA, AGORA MESMO
        </h2>
        <p className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">
          Leva 10 segundos (só o seu e-mail) — e a partir de agora, nada mais se perde.
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
            Sem conta, você perde tudo isso — vai depender de lembrar de baixar cada receita, uma por uma, antes que o link suma da sua cabeça.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenAuth}
        className="w-full bg-[#44FF00] hover:bg-[#3ee600] text-[#171717] py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_6px_16px_rgba(68,255,0,0.35)] hover:scale-[1.01] active:scale-95 transition-all text-center border-b-4 border-green-600 leading-tight"
      >
        QUERO MINHA BIBLIOTECA GRÁTIS →
      </button>
    </div>
  );
};