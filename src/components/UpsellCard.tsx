"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellCardProps {
  upsell: Upsell;
  onOpen: () => void;
}

export const UpsellCard = ({ upsell, onOpen }: UpsellCardProps) => {
  return (
    <div className="bg-white rounded-[16px] overflow-hidden flex flex-col h-[200px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.02)] card-hover hover:shadow-xl">
      <div
        className="h-[140px] flex items-center justify-center text-[2.5rem] bg-white"
      >
        {upsell.emoji}
      </div>
      <div className="h-[60px] p-2 flex flex-col justify-between bg-white">
        <h3 className="text-[0.8rem] font-bold leading-tight truncate text-[#171717] uppercase">{upsell.nome}</h3>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[#171717] font-bold text-[0.85rem]">R${upsell.precoAtual.toFixed(2)}</span>
          <button
            onClick={onOpen}
            className="bg-[#44FF00] text-[#171717] px-3 py-1.5 rounded-full font-bold text-[0.75rem] transition-all active:scale-95"
          >
            Quero →
          </button>
        </div>
      </div>
    </div>
  );
};