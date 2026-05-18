"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellCardProps {
  upsell: Upsell;
  onOpen: () => void;
}

export const UpsellCard = ({ upsell, onOpen }: UpsellCardProps) => {
  return (
    <div className="card-float overflow-hidden">
      <div
        className="h-32 flex items-center justify-center text-5xl"
        style={{ background: `linear-gradient(135deg, ${upsell.cor}, #9B59B6)` }}
      >
        {upsell.emoji}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full text-gray-500">
          {upsell.nome.split(" ").slice(0, 2).join(" ")}
        </span>
        <h3 className="text-base font-bold mt-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {upsell.nome}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{upsell.descricao}</p>
        <div className="mt-3">
          <span className="text-gray-400 line-through text-sm">De R${upsell.precoOriginal.toFixed(2)}</span>
          <span
            className="ml-2 text-xl font-bold"
            style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            R${upsell.precoAtual.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onOpen}
          className="w-full mt-3 py-2.5 rounded-xl font-bold text-white text-sm transition-transform active:scale-[0.98]"
          style={{ backgroundColor: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          Quero esse produto →
        </button>
      </div>
    </div>
  );
};