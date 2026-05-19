"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellCardProps {
  upsell: Upsell;
  onOpen: () => void;
}

export const UpsellCard = ({ upsell, onOpen }: UpsellCardProps) => {
  const headerColors: Record<string, string> = {
    upsell1: "#FF3D9A", upsell2: "#4A90D9", upsell3: "#7BC843",
    upsell4: "#F5A623", upsell5: "#9B59B6", upsell6: "#2EC4B6",
  };

  return (
    <div className="card-float overflow-hidden flex flex-col h-full">
      <div
        className="h-[80px] flex items-center justify-center text-4xl"
        style={{ backgroundColor: headerColors[upsell.id] || "#FF6B35" }}
      >
        {upsell.emoji}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-[0.85rem] font-bold leading-tight mb-1 line-clamp-2">{upsell.nome}</h3>
        <div className="mt-auto">
          <span className="text-[#7BC843] font-bold text-[1rem]">R${upsell.precoAtual.toFixed(2)}</span>
          <button
            onClick={onOpen}
            className="w-full mt-2 btn-premium bg-[#7BC843] text-white py-2 text-[0.75rem]"
          >
            Quero →
          </button>
        </div>
      </div>
    </div>
  );
};