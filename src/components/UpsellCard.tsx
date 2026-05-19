"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellCardProps {
  upsell: Upsell;
  onOpen: () => void;
}

export const UpsellCard = ({ upsell, onOpen }: UpsellCardProps) => {
  // Mapeamento de cores sólidas conforme solicitado
  const headerColors: Record<string, string> = {
    upsell1: "#FF3D9A",
    upsell2: "#4A90D9",
    upsell3: "#7BC843",
    upsell4: "#F5A623",
    upsell5: "#9B59B6",
    upsell6: "#2EC4B6",
  };

  const headerColor = headerColors[upsell.id] || "#FF6B35";

  return (
    <div className="card-float overflow-hidden flex flex-col h-full">
      <div
        className="h-32 flex items-center justify-center text-5xl"
        style={{ backgroundColor: headerColor }}
      >
        {upsell.emoji}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-500 uppercase tracking-wider">
            {upsell.nome.split(" ").slice(0, 2).join(" ")}
          </span>
          <h3 className="text-lg font-extrabold mt-2 leading-tight">
            {upsell.nome}
          </h3>
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 font-medium">{upsell.descricao}</p>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-gray-400 line-through text-xs">De R${upsell.precoOriginal.toFixed(2)}</span>
            <span className="text-xl font-extrabold text-[#7BC843]">
              R${upsell.precoAtual.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onOpen}
            className="w-full mt-3 py-3 rounded-xl font-bold text-white text-sm transition-transform active:scale-[0.98] bg-[#7BC843]"
          >
            Quero esse produto →
          </button>
        </div>
      </div>
    </div>
  );
};