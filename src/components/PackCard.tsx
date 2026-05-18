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
    <div className="card-float overflow-hidden col-span-1 sm:col-span-2 lg:col-span-3">
      <div className="relative h-36 rounded-t-[12px] rounded-b-0">
        <img
          src={`https://picsum.photos/seed/${pack.nome.toLowerCase().replace(/ /g, "-")}/400/300`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-[#000] text-white text-xs font-semibold backdrop-filter-blur-4 px-2 py-1 rounded-full">
          {pack.emoji} {pack.receitas} receitas
        </div>
      </div>
      <div className="p-4 flex flex-col sm:flex-row items-start gap-4">
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#000] text-white px-2 py-1 text-xs font-semibold backdrop-filter-blur-4">
            {pack.emoji}
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[#000] text-white px-2 py-1 text-xs font-semibold backdrop-filter-blur-4">
            {pack.receitas}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {pack.nome}
          </h3>
          <p className="text-gray-500 text-sm mt-1">{pack.descricao}</p>
          <div className="mt-2 flex justify-between">
            <span className="text-gray-400 line-through text-sm">De R${pack.precoOriginal.toFixed(2)}</span>
            <span className="text-xl font-bold text-[#7BC843]" style={{ fontFamily: "'Fredoka One', cursive" }}>
              R${pack.precoAtual.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onAdd}
            disabled={inCart}
            className="w-full mt-3 py-2.5 rounded-12 bg-gradient-to-r from-[#7BC843] to-[#5fa832] text-white font-bold transition-all duration-200 hover:scale-105"
          >
            {inCart ? "✓ No carrinho" : "+ Adicionar ao Carrinho"}
          </button>
          {inCart && (
            <button
              onClick={onRemove}
              className="w-full mt-2 py-2 rounded-10 bg-red-500 text-red-600 text-sm border border-red-200 hover:bg-red-50 transition-colors"
            >
              ✕ Remover do Carrinho            </button>
          )}
        </div>
      </div>
    </div>
  );
};