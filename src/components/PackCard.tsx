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
      <div className="relative h-36">
        <img
          src={`https://picsum.photos/seed/${pack.nome.toLowerCase().replace(/ /g, "-")}/400/300`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-white/90 text-sm font-bold px-3 py-1 rounded-full">
          {pack.emoji} {pack.receitas} receitas
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {pack.nome}
        </h3>
        <p className="text-gray-500 text-sm mt-1">{pack.descricao}</p>
        <div className="mt-2">
          <span className="text-gray-400 line-through text-sm">De R${pack.precoOriginal.toFixed(2)}</span>
          <span
            className="ml-2 text-xl font-bold"
            style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            R${pack.precoAtual.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onAdd}
          disabled={inCart}
          className="w-full mt-3 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-transform active:scale-[0.98]"
          style={{ backgroundColor: inCart ? "#ccc" : "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          {inCart ? "✓ No carrinho" : "+ Adicionar ao Carrinho"}
        </button>
        {inCart && (
          <button
            onClick={onRemove}
            className="w-full mt-2 py-2 rounded-xl font-semibold text-red-500 text-sm border border-red-200 hover:bg-red-50 transition-colors"
          >
            ✕ Remover do Carrinho
          </button>
        )}
      </div>
    </div>
  );
};