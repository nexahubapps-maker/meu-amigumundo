"use client";

import React, { useState } from "react";
import { ArrowLeft, Ruler, Search, Lightbulb } from "lucide-react";

interface ConversorAgulhaProps {
  onBack: () => void;
}

interface ItemConversao {
  mm: string;
  us: string;
}

const TABELA_CONVERSAO: ItemConversao[] = [
  { mm: "2.25mm", us: "B/1" },
  { mm: "2.75mm", us: "C/2" },
  { mm: "3.25mm", us: "D/3" },
  { mm: "3.5mm", us: "E/4" },
  { mm: "3.75mm", us: "F/5" },
  { mm: "4.0mm", us: "G/6" },
  { mm: "4.5mm", us: "7" },
  { mm: "5.0mm", us: "H/8" },
  { mm: "5.5mm", us: "I/9" },
  { mm: "6.0mm", us: "J/10" },
  { mm: "6.5mm", us: "K/10.5" },
  { mm: "8.0mm", us: "L/11" },
  { mm: "9.0mm", us: "M/13" },
  { mm: "10.0mm", us: "N/15" },
  { mm: "11.5mm", us: "P/16" },
  { mm: "15.0mm", us: "Q" },
  { mm: "19.0mm", us: "S" },
];

export const ConversorAgulha = ({ onBack }: ConversorAgulhaProps) => {
  const [busca, setBusca] = useState("");

  const termoLimpo = busca.trim().toLowerCase();

  const itensFiltrados = TABELA_CONVERSAO.filter(
    (item) =>
      item.mm.toLowerCase().includes(termoLimpo) ||
      item.us.toLowerCase().includes(termoLimpo)
  );

  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
      {/* Cabeçalho Fixo com Textura Laranja */}
      <div
        style={textureLaranjaStyle}
        className="sticky top-0 z-10 py-4 px-4 flex items-center justify-between shadow-md shrink-0"
      >
        <button
          onClick={onBack}
          className="text-white hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 font-black text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <h2 className="text-white font-black text-sm uppercase tracking-widest m-0 flex items-center gap-2">
          <Ruler size={18} /> CONVERSOR DE AGULHA
        </h2>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 p-4 sm:p-6 max-w-xl mx-auto w-full space-y-4">
        {/* Campo de Busca no Topo */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por mm ou tamanho EUA (ex: 3.5mm, G/6)..."
            className="w-full h-12 pl-4 pr-11 bg-white border-2 border-gray-200 rounded-2xl text-xs sm:text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#44FF00] transition-all shadow-sm"
          />
          <div className="absolute right-3.5 text-gray-400 pointer-events-none">
            <Search size={18} />
          </div>
        </div>

        {/* Lista de Conversão */}
        {itensFiltrados.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <Ruler size={36} className="text-gray-300 mx-auto" />
            <p className="text-gray-600 font-black text-xs uppercase tracking-wider">
              Nenhum tamanho encontrado.
            </p>
            <p className="text-gray-400 text-[11px]">
              Tente buscar por um valor diferente de milímetros ou letra dos EUA.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {itensFiltrados.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#44FF00] shrink-0" />
                  <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                    {item.mm}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">
                    Numeração EUA:{" "}
                    <strong className="text-gray-900 font-black">{item.us}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card de Dica de Crochê */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-4 shadow-sm text-amber-900 space-y-2 mt-4">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-800">
            <Lightbulb size={18} className="text-amber-600 shrink-0" />
            <span>💡 Qual agulha usar?</span>
          </div>
          <p className="text-xs leading-relaxed font-medium text-amber-900/90">
            <strong>Fios finos (bebê, bicos):</strong> 1.25mm–2.0mm <br />
            <strong>Amigurumi e fios médios:</strong> 2.5mm–3.5mm <br />
            <strong>Fios grossos e cestos:</strong> 7.0mm–12.0mm. <br />
            <span className="block mt-1.5 text-[11px] italic font-semibold text-amber-800">
              Sempre confira a recomendação na etiqueta do fio antes de começar.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};