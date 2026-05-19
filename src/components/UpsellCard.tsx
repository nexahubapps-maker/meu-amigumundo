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
    <div className="card-float overflow-hidden flex flex-col h-[200px]">
      <div
        className="h-[140px] flex items-center justify-center text-[2.5rem]"
        style={{ backgroundColor: headerColors[upsell.id] || "#FF6B35" }}
      >
        {upsell.emoji}
      </div>
      <div className="h-[60px] p-2 flex flex-col justify-between bg-white">
        <h3 className="text-[0.8rem] font-bold leading-tight truncate">{upsell.nome}</h3>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[#7BC843] font-bold text-[0.85rem]">R${upsell.precoAtual.toFixed(2)}</span>
          <button
            onClick={onOpen}
            className="btn-premium bg-[#7BC843] text-white px-3 py-1.5 text-[0.75rem]"
          >
            Quero →
          </button>
        </div>
      </div>
    </div>
  );
};