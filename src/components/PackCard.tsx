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
      <div className="relative h-[200px] w-full">
        <img
          src={`https://picsum.photos/seed/${pack.nome.toLowerCase().replace(/ /g, "-")}/600/400`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span>{pack.emoji}</span>
          <span>{pack.receitas} receitas</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {pack.nome}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">{pack.descricao}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col">
              <span className="text-gray-400 line-through text-xs">De R${pack.precoOriginal.toFixed(2)}</span>
              <span className="text-2xl font-bold text-[#7BC843]" style={{ fontFamily: "'Fredoka One', cursive" }}>
                R${pack.precoAtual.toFixed(2)}
              </span>
            </div>
            <div className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              -{Math.round((1 - pack.precoAtual / pack.precoOriginal) * 100)}% OFF
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onAdd}
              disabled={inCart}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7BC843] to-[#5fa832] text-white font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              {inCart ? "✓ No carrinho" : "+ Adicionar"}
            </button>
            {inCart && (
              <button
                onClick={onRemove}
                className="px-4 py-3 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
                title="Remover"
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