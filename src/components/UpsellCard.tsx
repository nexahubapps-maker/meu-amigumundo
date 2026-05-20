"use client";

import { type Upsell } from "@/data/upsells";
import { Heart } from "lucide-react";

interface UpsellCardProps {
  upsell: Upsell;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}

export const UpsellCard = ({ upsell, isFavorite, onToggleFavorite, onOpen }: UpsellCardProps) => {
  return (
    <div className="card-hover flex flex-col relative">
      <div 
        className="relative aspect-[2/1] rounded-xl overflow-hidden shadow-sm cursor-pointer"
        onClick={onOpen}
      >
        <img 
          src={`https://picsum.photos/seed/${upsell.id}/600/300`} 
          alt={upsell.nome} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
          <span className="text-white text-[0.7rem] font-black leading-tight uppercase tracking-tighter line-clamp-1">
            {upsell.nome}
          </span>
        </div>
      </div>

      {/* Favorite Heart Icon */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform z-10 ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
      >
        <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      
      <div className="flex items-center justify-between mt-1.5 px-1">
        <span className="text-[#171717] font-black text-[0.85rem]">R$ {upsell.precoAtual.toFixed(2)}</span>
        <button
          onClick={onOpen}
          className="bg-[#44FF00] text-[#171717] px-3 py-1 rounded-full font-black text-[0.65rem] uppercase transition-all active:scale-95"
        >
          Quero →
        </button>
      </div>
    </div>
  );
};