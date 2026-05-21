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
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md flex flex-col transition-all duration-300 hover:shadow-lg">
      {/* Top: Strictly Square Image */}
      <div className="relative aspect-square w-full bg-gray-50 cursor-pointer" onClick={onOpen}>
        <img 
          src={`https://picsum.photos/seed/${upsell.id}/600/600`} 
          alt={upsell.nome} 
          className="w-full h-full object-cover"
        />
        
        {/* Favorite Heart Icon */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform z-10 ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Base: Text Area with white background */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="text-lg font-black text-gray-900 leading-snug mb-2 uppercase tracking-tight">
            {upsell.nome}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {upsell.descricao}
          </p>
        </div>

        {/* Button: Saiba Mais */}
        <button
          onClick={onOpen}
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border border-gray-200 flex items-center justify-center gap-1"
        >
          Saiba Mais →
        </button>
      </div>
    </div>
  );
};