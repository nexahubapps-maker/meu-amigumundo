"use client";

import React from "react";
import { ArrowLeft, Crown, Check, Sparkles } from "lucide-react";
import { showInfo } from "@/utils/toast";

// PREÇO PROVISÓRIO — ajustar aqui quando o valor definitivo for decidido, antes do lançamento
const PRECO_MENSAL = "29,90";

interface PremiumSalesViewProps {
  onBack: () => void;
}

const BENEFICIOS = [
  "Acesso a TODAS as receitas de todas as categorias, sem comprar uma por uma",
  "Novidades toda semana direto na sua Biblioteca",
  "Abra e imprima na hora, sempre que precisar",
  "Conteúdo exclusivo pra quem é assinante",
];

export const PremiumSalesView = ({ onBack }: PremiumSalesViewProps) => {
  const handleAssinar = () => {
    showInfo("Em breve! Estamos preparando o lançamento do AmiguMundo Premium.");
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#F8F6F2] flex flex-col overflow-y-auto">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center active:scale-95 transition-all">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">AmiguMundo Premium</h1>
      </div>

      <div className="flex-1 px-5 py-8 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F4D160] to-[#C9971C] flex items-center justify-center mb-4 shadow-lg">
            <Crown size={36} className="text-[#3A2A00]" fill="#3A2A00" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">
            Todo o AmiguMundo,<br />sem limites
          </h2>
          <p className="text-sm text-gray-500 font-bold mt-2">
            [TEXTO PROVISÓRIO — copy definitiva a inserir depois]
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          {BENEFICIOS.map((beneficio, i) => (
            <div key={i} className={`flex items-start gap-3 ${i > 0 ? "mt-3 pt-3 border-t border-gray-50" : ""}`}>
              <div className="w-5 h-5 rounded-full bg-[#3CB19E]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={13} className="text-[#3CB19E]" strokeWidth={3} />
              </div>
              <p className="text-xs font-bold text-gray-700 leading-snug">{beneficio}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#5D0599] to-[#42026b] rounded-2xl p-5 text-center text-white mb-6">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Sparkles size={14} className="text-[#F4D160]" />
            <p className="text-[10px] font-black uppercase tracking-wider text-white/80">Assinatura mensal</p>
          </div>
          <p className="text-3xl font-black">
            R$ {PRECO_MENSAL}<span className="text-sm font-bold text-white/70">/mês</span>
          </p>
        </div>

        <button
          onClick={handleAssinar}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F4D160] to-[#C9971C] text-[#3A2A00] font-black uppercase tracking-wider text-sm py-3.5 rounded-full shadow-lg active:scale-[0.98] transition-all"
        >
          <Crown size={16} fill="#3A2A00" />
          Quero ser Premium
        </button>

        <p className="text-[10px] text-gray-400 font-bold text-center mt-4">
          Cancele quando quiser. Sem fidelidade.
        </p>
      </div>
    </div>
  );
};