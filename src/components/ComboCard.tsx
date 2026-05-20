"use client";

import { type Combo } from "@/data/packs";
import { Heart } from "lucide-react";

interface ComboCardProps {
  combo: Combo;
  inCart: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAdd: () => void;
  onRemove: () => void;
}

export const ComboCard = ({ combo, inCart, isFavorite, onToggleFavorite, onAdd, onRemove }: ComboCardProps) => {
  return (
    <div className="bg-white rounded-[16px] overflow-hidden flex h-[130px] items-center shadow-lg card-hover border border-white/10 relative">
      <div 
        className="w-[110px] h-full flex flex-col items-center justify-center text-[#171717] bg-[#F8DD12] shrink-0"
      >
        <span className="text-[2.8rem] font-black leading-none">{combo.receitas}</span>
        <span className="text-[10px] font-black uppercase tracking-tighter">Receitas</span>
      </div>
      
      <div className="flex-1 pl-5 pr-4 flex flex-col justify-center min-w-0">
        <h3 className="text-[0.95rem] font-extrabold leading-tight truncate text-[#171717] uppercase tracking-tight">
          {combo.nome}
        </h3>
        <p className="text-gray-500 text-[0.75rem] font-medium line-clamp-2 uppercase tracking-tight mt-0.5">
          {combo.descricao}
        </p>
        <span className="text-[#171717] font-black text-[1.15rem] mt-1">
          R$ {combo.preco.toFixed(2)}
        </span>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform z-10 ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
      >
        <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      
      <div className="pr-5 flex items-center justify-center shrink-0">
        <button
          onClick={onAdd}
          disabled={inCart}
          className={`px-5 py-2.5 rounded-full text-[0.75rem] font-black uppercase tracking-wider transition-all ${
            inCart 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-[#44FF00] text-[#171717] shadow-md active:scale-95 hover:scale-105'
          }`}
        >
          {inCart ? "✓" : "+ ADD"}
        </button>
      </div>
    </div>
  );
};