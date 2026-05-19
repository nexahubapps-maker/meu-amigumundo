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
      <div className="relative h-[150px] sm:h-[200px] w-full">
        <img
          src={`https://picsum.photos/seed/${pack.nome.toLowerCase().replace(/ /g, "-")}/600/400`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <span>{pack.emoji}</span>
          <span>{pack.receitas} receitas</span>
        </div>
      </div>
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-base sm:text-xl font-bold mb-1 leading-tight">
            {pack.nome}
          </h3>
          <p className="text-gray-500 text-[0.85rem] sm:text-sm leading-snug line-clamp-2">
            {pack.descricao}
          </p>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-end mb-3">
            <div className="flex flex-col">
              <span className="text-gray-400 line-through text-[10px]">De R${pack.precoOriginal.toFixed(2)}</span>
              <span className="text-lg sm:text-2xl font-bold text-[#7BC843]">
                R${pack.precoAtual.toFixed(2)}
              </span>
            </div>
            <div className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
              -{Math.round((1 - pack.precoAtual / pack.precoOriginal) * 100)}%
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onAdd}
              disabled={inCart}
              className="flex-1 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-[#7BC843] text-white font-bold text-xs sm:text-base transition-all active:scale-95 disabled:opacity-50"
            >
              {inCart ? "✓ No carrinho" : "+ Adicionar"}
            </button>
            {inCart && (
              <button
                onClick={onRemove}
                className="px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-red-50 text-red-500 border border-red-100"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};