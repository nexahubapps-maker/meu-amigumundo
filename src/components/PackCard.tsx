"use client";

import { type Pack } from "@/data/packs";
import { Heart } from "lucide-react";

interface PackCardProps {
  pack: Pack;
  inCart: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAdd: () => void;
  onRemove: () => void;
}

export const PackCard = ({ pack, inCart, isFavorite, onToggleFavorite, onAdd, onRemove }: PackCardProps) => {
  const badge = pack.id === "pack1" ? { text: "MAIS VENDIDO", bg: "bg-[#44FF00] text-[#171717]" } : 
                pack.id === "pack2" ? { text: "NOVO", bg: "bg-blue-500 text-white" } : null;

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 border border-gray-100/50">
      {/* Imagem Quadrada 1x1 */}
      <div className="relative aspect-square w-full bg-gray-50">
        <img
          src={`https://picsum.photos/seed/${pack.id}/400/400`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        
        {badge && (
          <div className={`absolute top-2 left-2 ${badge.bg} text-[7px] font-black px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider`}>
            {badge.text}
          </div>
        )}

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
        >
          <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-0.5 rounded-md shadow-sm">
          {pack.emoji} {pack.receitas} Rec.
        </div>
      </div>

      {/* Mini Card Branco Colado */}
      <div className="p-2.5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <h3 className="text-[10px] sm:text-xs font-black leading-tight truncate text-[#171717] uppercase tracking-tight">
            {pack.nome}
          </h3>
          <p className="text-[9px] text-gray-500 font-medium line-clamp-1 mt-0.5 leading-tight">
            {pack.descricao}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-gray-400 line-through text-[8px]">R$ {pack.precoOriginal.toFixed(2)}</span>
            <span className="text-[10px] sm:text-xs font-black text-[#171717]">R$ {pack.precoAtual.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex gap-1 mt-2">
          <button
            onClick={onAdd}
            disabled={inCart}
            className={`flex-1 py-1.5 rounded-lg font-black text-[8px] sm:text-[9px] uppercase tracking-wider transition-all active:scale-95 ${
              inCart 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-[#44FF00] text-[#171717] hover:scale-[1.02]'
            }`}
          >
            {inCart ? "✓" : "Quero"}
          </button>
          {inCart && (
            <button 
              onClick={onRemove} 
              className="px-2 rounded-lg bg-red-50 text-red-500 text-[10px] hover:bg-red-100 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};