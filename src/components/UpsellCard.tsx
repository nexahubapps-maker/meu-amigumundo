"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellCardProps {
  upsell: Upsell;
  onOpen: () => void;
}

export const UpsellCard = ({ upsell, onOpen }: UpsellCardProps) => {
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
        className="h-20 sm:h-32 flex items-center justify-center text-3xl sm:text-5xl"
        style={{ backgroundColor: headerColor }}
      >
        {upsell.emoji}
      </div>
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <div className="flex-1">
          <span className="hidden sm:inline-block text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-500 uppercase tracking-wider">
            {upsell.nome.split(" ").slice(0, 2).join(" ")}
          </span>
          <h3 className="text-sm sm:text-lg font-extrabold mt-1 sm:mt-2 leading-tight">
            {upsell.nome}
          </h3>
          <p className="hidden sm:block text-gray-500 text-xs mt-2 line-clamp-2 font-medium">
            {upsell.descricao}
          </p>
        </div>
        <div className="mt-2 sm:mt-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
            <span className="text-gray-400 line-through text-[10px] sm:text-xs">De R${upsell.precoOriginal.toFixed(2)}</span>
            <span className="text-sm sm:text-xl font-extrabold text-[#7BC843]">
              R${upsell.precoAtual.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onOpen}
            className="w-full mt-2 sm:mt-3 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white text-[10px] sm:text-sm transition-transform active:scale-[0.98] bg-[#7BC843]"
          >
            Quero →
          </button>
        </div>
      </div>
    </div>
  );
};