"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellCardProps {
  upsell: Upsell;
  onOpen: () => void;
}

export const UpsellCard = ({ upsell, onOpen }: UpsellCardProps) => {
  return (
    <div className="neo-card overflow-hidden flex flex-col h-[200px]">
      <div
        className="h-[130px] flex items-center justify-center text-[3rem] border-b-2 border-[#171717] bg-[#F8DD12]"
      >
        {upsell.emoji}
      </div>
      <div className="h-[70px] p-2 flex flex-col justify-between bg-white">
        <h3 className="text-[0.8rem] font-black leading-tight truncate text-[#171717] uppercase">{upsell.nome}</h3>
        <div className="flex items-center justify-between">
          <span className="text-[#171717] font-black text-[0.9rem]">R${upsell.precoAtual.toFixed(2)}</span>
          <button
            onClick={onOpen}
            className="neo-btn-buy px-3 py-1.5 text-[0.7rem]"
          >
            QUERO →
          </button>
        </div>
      </div>
    </div>
  );
};