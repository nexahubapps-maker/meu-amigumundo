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
    <div className="card-float overflow-hidden flex flex-col h-full">
      <div className="relative h-[160px] w-full">
        <img
          src={`https://picsum.photos/seed/${pack.id}/600/400`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
          {pack.emoji} {pack.receitas} Receitas
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[1rem] font-bold mb-1 leading-tight">{pack.nome}</h3>
        <p className="text-gray-500 text-[0.8rem] line-clamp-2 mb-3">{pack.descricao}</p>
        
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-gray-400 line-through text-[10px]">R${pack.precoOriginal.toFixed(2)}</span>
            <span className="text-[1.1rem] font-bold text-[#7BC843]">R${pack.precoAtual.toFixed(2)}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onAdd}
              disabled={inCart}
              className="btn-premium bg-[#7BC843] text-white px-4 py-2"
            >
              {inCart ? "✓" : "+ Adicionar"}
            </button>
            {inCart && (
              <button onClick={onRemove} className="p-2 rounded-full bg-red-50 text-red-500">✕</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};