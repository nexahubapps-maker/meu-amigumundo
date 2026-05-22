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
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md flex flex-col transition-all duration-300 hover:shadow-lg h-full">
      {/* Top: Horizontal Rectangle Image to save vertical space */}
      <div className="relative aspect-[16/10] w-full bg-gray-50 cursor-pointer" onClick={onOpen}>
        <img 
          src={`https://picsum.photos/seed/${upsell.id}/600/375`} 
          alt={upsell.nome} 
          className="w-full h-full object-cover"
        />
        
        {/* Favorite Heart Icon */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform z-10 ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
        >
          <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Base: Text Area with white background and reduced padding */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="text-sm font-black text-gray-900 leading-tight mb-1 uppercase tracking-tight line-clamp-2">
            {upsell.nome}
          </h3>
          <p className="text-[11px] text-gray-500 leading-snug mb-3 line-clamp-3">
            {upsell.descricao}
          </p>
        </div>

        {/* Button: Saiba Mais */}
        <button
          onClick={onOpen}
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 border border-gray-200 flex items-center justify-center gap-1"
        >
          Saiba Mais →
        </button>
      </div>
    </div>
  );
};