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
    <div className="card-float overflow-hidden">
      <div className="relative h-48 rounded-t-[12px] overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${pack.nome
            .toLowerCase()
            .replace(/ /g, "-")}/400/300`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/85 to-transparent" />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-4 px-2 py-1 rounded-full flex items-center gap-1 text-white text-xs">
          <span>{pack.emoji}</span>
          <span>{pack.receitas} receitas</span>
        </div>
        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#FF6B35] to-[#FF3D9A] px-2 py-1 rounded-full text-white text-xs font-semibold">
          {pack.emoji}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {pack.nome}
        </h3>
        <p className="text-gray-500 text-sm">{pack.descricao}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 line-through text-sm">
            De R${pack.precoOriginal.toFixed(2)}
          </span>
          <span
            className="text-xl font-bold"
            style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            R${pack.precoAtual.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onAdd}
          disabled={inCart}
          className="w-full py-2.5 rounded-12 bg-gradient-to-r from-[#7BC843] to-[#5fa832] text-white font-bold transition-all duration-200 hover:scale-105"
        >
          {inCart ? "✓ No carrinho" : "+ Adicionar ao Carrinho"}
        </button>
        {inCart && (
          <button
            onClick={onRemove}
            className="w-full py-2 rounded-10 bg-red-500 text-red-600 text-sm border border-red-200 hover:bg-red-50 transition-colors"
          >
            ✕ Remover do Carrinho
          </button>
        )}
      </div>
    </div>
  );
};