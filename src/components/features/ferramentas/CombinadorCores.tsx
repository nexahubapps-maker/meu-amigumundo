"use client";

import React, { useState } from "react";
import { ArrowLeft, Palette, Copy, Check } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface CombinadorCoresProps {
  onBack: () => void;
}

type EsquemaCromatico = "Complementar" | "Análoga" | "Tríade" | "Split-Complementar" | "Monocromática";

const ESQUEMAS: { id: EsquemaCromatico; nome: string; descricao: string }[] = [
  {
    id: "Complementar",
    nome: "Complementar",
    descricao: "Cores opostas no círculo cromático — contraste forte e vibrante, perfeito para detalhes que se destacam no seu amigurumi.",
  },
  {
    id: "Análoga",
    nome: "Análoga",
    descricao: "Cores vizinhas no círculo cromático — combinação suave, harmoniosa e relaxante para o olhar.",
  },
  {
    id: "Tríade",
    nome: "Tríade",
    descricao: "Três cores igualmente espaçadas no círculo cromático — paleta viva e equilibrada.",
  },
  {
    id: "Split-Complementar",
    nome: "Split-Complementar",
    descricao: "Usa a cor base e as duas vizinhas da sua complementar — alto contraste, porém mais equilibrado.",
  },
  {
    id: "Monocromática",
    nome: "Monocromática",
    descricao: "Variações de tom e luminosidade da mesma cor — visual elegante, delicado e uniforme.",
  },
];

function hexParaHsl(hex: string): [number, number, number] {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslParaHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const CombinadorCores = ({ onBack }: CombinadorCoresProps) => {
  const [corBase, setCorBase] = useState<string>("#9241B1");
  const [esquemaAtivo, setEsquemaAtivo] = useState<EsquemaCromatico>("Complementar");
  const [copiadoIndex, setCopiadoIndex] = useState<number | null>(null);

  const [h, s, l] = hexParaHsl(corBase);

  const gerarPaleta = (): string[] => {
    switch (esquemaAtivo) {
      case "Complementar":
        return [corBase, hslParaHex(h + 180, s, l)];
      case "Análoga":
        return [hslParaHex(h - 30, s, l), corBase, hslParaHex(h + 30, s, l)];
      case "Tríade":
        return [corBase, hslParaHex(h + 120, s, l), hslParaHex(h + 240, s, l)];
      case "Split-Complementar":
        return [corBase, hslParaHex(h + 150, s, l), hslParaHex(h + 210, s, l)];
      case "Monocromática":
        return [
          hslParaHex(h, s, Math.max(l - 30, 10)),
          hslParaHex(h, s, l),
          hslParaHex(h, s, Math.min(l + 30, 90)),
        ];
      default:
        return [corBase];
    }
  };

  const paleta = gerarPaleta();
  const infoEsquema = ESQUEMAS.find((e) => e.id === esquemaAtivo);

  const handleCopiarHex = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopiadoIndex(index);
    showSuccess(`Código ${hex.toUpperCase()} copiado!`);
    setTimeout(() => setCopiadoIndex(null), 2000);
  };

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
          <Palette size={18} /> COMBINADOR DE CORES
        </h2>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 p-4 sm:p-6 max-w-xl mx-auto w-full space-y-5">
        {/* Seletor de Cor Base */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
              Cor Principal do Amigurumi
            </span>
            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
              Escolha a cor do seu fio base
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200 shrink-0">
            <div
              className="w-10 h-10 rounded-xl shadow-inner border-2 border-white relative overflow-hidden shrink-0 cursor-pointer"
              style={{ backgroundColor: corBase }}
            >
              <input
                type="color"
                value={corBase}
                onChange={(e) => setCorBase(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                title="Escolher cor"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-800 font-mono">
                {corBase.toUpperCase()}
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase">Toque na cor pra alterar</span>
            </div>
          </div>
        </div>

        {/* Abas de Esquema Cromático */}
        <div className="space-y-2">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider block ml-1">
            Esquema de Teoria das Cores
          </span>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {ESQUEMAS.map((esq) => {
              const isSelected = esq.id === esquemaAtivo;
              return (
                <button
                  key={esq.id}
                  onClick={() => setEsquemaAtivo(esq.id)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? "bg-[#171717] text-white border-[#171717] shadow-md scale-[1.02]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {esq.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Texto Explicativo do Esquema */}
        {infoEsquema && (
          <div className="bg-purple-50/80 border border-purple-100 rounded-2xl p-3.5 text-center">
            <p className="text-xs text-purple-900 font-bold leading-relaxed">
              💡 {infoEsquema.descricao}
            </p>
          </div>
        )}

        {/* Paleta Gerada */}
        <div className="space-y-3">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider block ml-1">
            Paleta Harmônica Sugerida
          </span>

          <div
            className={`grid gap-3 ${
              paleta.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {paleta.map((hex, index) => {
              const upperHex = hex.toUpperCase();
              const isCopied = copiadoIndex === index;

              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm flex flex-col items-center gap-2.5 transition-all hover:shadow-md"
                >
                  {/* Bloco de Cor Principal */}
                  <div
                    className="w-full aspect-[4/3] rounded-2xl shadow-inner border border-black/10 transition-transform"
                    style={{ backgroundColor: hex }}
                  />

                  {/* Código Hex e Botão de Copiar */}
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <span className="text-xs font-black text-gray-800 font-mono tracking-tight">
                      {upperHex}
                    </span>

                    <button
                      onClick={() => handleCopiarHex(hex, index)}
                      className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all active:scale-95 border ${
                        isCopied
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      {isCopied ? "Copiado!" : "Copiar Hex"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};