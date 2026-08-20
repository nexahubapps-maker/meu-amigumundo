"use client";

import { useNavigate } from "react-router-dom";
import { X, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import type { SheetInfoproduto } from "@/utils/sheets";

interface InfoprodutoSalesModalProps {
  infoproduto: SheetInfoproduto;
  onClose: () => void;
}

const PONTOS_DE_DOR = [
  "Você publica, mas ninguém compra?",
  "Não sabe o que postar além de foto do produto pronto?",
  "Sente que está deixando dinheiro na mesa por falta de estratégia?",
];

const BENEFICIOS_GENERICOS = [
  "Passo a passo prático, sem enrolação",
  "Linguagem simples, pensada pra quem crocheta, não pra quem estuda marketing",
  "Aplicável ainda hoje, mesmo com pouco tempo livre",
  "Acesso vitalício — volte sempre que precisar consultar",
];

export const InfoprodutoSalesModal = ({ infoproduto, onClose }: InfoprodutoSalesModalProps) => {
  const navigate = useNavigate();

  const handleComprar = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("amigumundo-cart") || "[]");
      const jaTem = cart.find((i: any) => i.id === infoproduto.id);
      const atualizado = jaTem ? cart : [...cart, { id: infoproduto.id, nome: infoproduto.nome, preco: infoproduto.preco, tipo: "upsell", imagem: infoproduto.imagem_url }];
      localStorage.setItem("amigumundo-cart", JSON.stringify(atualizado));
    } catch (e) {
      console.error("Erro ao adicionar ao carrinho:", e);
    }
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="bg-[#FDFBF7] w-full sm:max-w-lg sm:rounded-[28px] rounded-t-[28px] max-h-[92vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="relative bg-gradient-to-br from-[#5D0599] to-[#2E0350] px-6 pt-10 pb-14 text-white overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#E8734A]/20 -mb-10 -ml-10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} className="text-[#F4D160]" /> Conteúdo AmiguMundo
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase leading-[1.05] tracking-tight">
              {infoproduto.nome}
            </h2>
            <p className="text-white/80 text-sm font-medium mt-3 leading-relaxed max-w-sm">
              {infoproduto.descricao}
            </p>
          </div>
        </div>

        <div className="h-3 bg-[#FDFBF7] relative -mt-3">
          <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-[#5D0599]/25" />
        </div>

        <div className="px-6 py-6 space-y-7">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#E8734A] mb-2.5">Isso é pra você se...</p>
            <div className="space-y-2">
              {PONTOS_DE_DOR.map((ponto, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700 font-medium leading-snug">
                  <span className="text-[#E8734A] font-black shrink-0">—</span>
                  {ponto}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200" />

          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#5D0599] mb-3">O que você vai dominar</p>
            <div className="space-y-2.5">
              {BENEFICIOS_GENERICOS.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-[#3CB19E]/8 rounded-xl px-3.5 py-2.5">
                  <CheckCircle2 size={17} className="text-[#3CB19E] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800 font-bold leading-snug">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#FDFBF7] border-t border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Investimento único</p>
              <p className="text-2xl font-black text-gray-900">R$ {infoproduto.preco.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              <ShieldCheck size={14} className="text-[#3CB19E]" /> Acesso imediato
            </div>
          </div>
          <button
            onClick={handleComprar}
            className="w-full bg-[#5D0599] hover:bg-[#4a047a] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#5D0599]/30 active:scale-[0.98] transition-all"
          >
            Quero Aprender Agora →
          </button>
        </div>
      </div>
    </div>
  );
};