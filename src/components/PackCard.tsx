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
  // Determine a badge based on pack ID
  const badge = pack.id === "pack1" ? { text: "MAIS VENDIDO", bg: "bg-[#44FF00] text-[#171717]" } : 
                pack.id === "pack2" ? { text: "NOVO", bg: "bg-blue-500 text-white" } : null;

  return (
    <div className="bg-white rounded-[16px] overflow-hidden flex flex-col h-[290px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] border border-gray-100 card-hover relative">
      <div className="relative h-[180px] w-full bg-gray-50">
        <img
          src={`https://picsum.photos/seed/${pack.id}/600/400`}
          alt={pack.nome}
          className="w-full h-full object-cover"
        />
        
        {/* Micro-badges */}
        {badge && (
          <div className={`absolute top-3 left-3 ${badge.bg} text-[8px] font-black px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider`}>
            {badge.text}
          </div>
        )}

        {/* Favorite Heart Icon */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
          {pack.emoji} {pack.receitas} Receitas
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between bg-white">
        <div>
          <h3 className="text-[0.85rem] font-black leading-tight truncate text-[#171717] uppercase tracking-tight">
            {pack.nome}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 line-through text-[0.7rem]">R$ {pack.precoOriginal.toFixed(2)}</span>
            <span className="text-[0.95rem] font-black text-[#171717]">R$ {pack.precoAtual.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={onAdd}
            disabled={inCart}
            className={`flex-1 py-2.5 rounded-full font-black text-[0.75rem] uppercase tracking-wider transition-all active:scale-95 ${
              inCart 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-[#44FF00] text-[#171717] hover:scale-[1.02]'
            }`}
          >
            {inCart ? "✓ Adicionado" : "Quero"}
          </button>
          {inCart && (
            <button 
              onClick={onRemove} 
              className="px-3 rounded-full bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};