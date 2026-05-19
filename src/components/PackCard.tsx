"use client";

import { type Pack } from "@/data/packs";

interface PackCardProps {
  pack: Pack;
  inCart: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export const PackCard = ({ pack, inCart, onAdd, onRemove }: PackCardProps) => {
  return (
    <div className="bg-white rounded-[16px] overflow-hidden flex flex-col h-[280px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.06)] card-hover hover:shadow-2xl">
      <div className="relative h-[196px] w-full">
        <img
          src={`https://picsum.photos/seed/${pack.id}/600/400`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-[#F8DD12] text-[#171717] text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm">
          {pack.emoji} {pack.receitas} Receitas
        </div>
      </div>
      <div className="h-[84px] p-3 flex flex-col justify-between bg-white">
        <div>
          <h3 className="text-[0.9rem] font-bold leading-tight truncate text-[#171717] uppercase">{pack.nome}</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 line-through text-[0.7rem]">R${pack.precoOriginal.toFixed(2)}</span>
            <span className="text-[0.95rem] font-bold text-[#171717]">R${pack.precoAtual.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={onAdd}
            disabled={inCart}
            className={`flex-1 py-1.5 rounded-full font-bold text-[0.75rem] transition-all active:scale-95 ${inCart ? 'bg-gray-100 text-gray-400' : 'bg-[#44FF00] text-[#171717]'}`}
          >
            {inCart ? "✓ Adicionado" : "+ Adicionar"}
          </button>
          {inCart && (
            <button onClick={onRemove} className="px-2 rounded-full bg-red-50 text-red-500 text-xs">✕</button>
          )}
        </div>
      </div>
    </div>
  );
};