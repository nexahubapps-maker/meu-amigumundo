"use client";

import { type Combo } from "@/data/packs";

interface ComboCardProps {
  combo: Combo;
  inCart: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export const ComboCard = ({ combo, inCart, onAdd, onRemove }: ComboCardProps) => {
  return (
    <div className="bg-white rounded-[16px] overflow-hidden flex h-[110px] items-center shadow-lg card-hover border border-white/10">
      <div 
        className="w-[100px] h-full flex flex-col items-center justify-center text-[#171717] bg-[#F8DD12] shrink-0"
      >
        <span className="text-[2.5rem] font-black leading-none">{combo.receitas}</span>
        <span className="text-[10px] font-black uppercase tracking-tighter">Receitas</span>
      </div>
      
      {/* Added pl-5 for proper breathing room */}
      <div className="flex-1 pl-5 pr-4 flex flex-col justify-center min-w-0">
        <h3 className="text-[0.95rem] font-extrabold leading-tight truncate text-[#171717] uppercase tracking-tight">
          {combo.nome}
        </h3>
        <p className="text-gray-500 text-[0.75rem] font-medium line-clamp-1 uppercase tracking-tight mt-0.5">
          {combo.descricao}
        </p>
        <span className="text-[#171717] font-black text-[1.15rem] mt-1">
          R$ {combo.preco.toFixed(2)}
        </span>
      </div>
      
      {/* Perfectly centered button container */}
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