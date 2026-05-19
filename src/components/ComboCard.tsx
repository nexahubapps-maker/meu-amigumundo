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
    <div className="bg-white rounded-[16px] overflow-hidden flex h-[110px] items-center shadow-lg card-hover">
      <div 
        className="w-[100px] h-full flex flex-col items-center justify-center text-[#171717] bg-[#F8DD12]"
      >
        <span className="text-[2.5rem] font-black leading-none">{combo.receitas}</span>
        <span className="text-[10px] font-black uppercase tracking-tighter">Receitas</span>
      </div>
      <div className="flex-1 px-4 flex flex-col justify-center">
<h3 className="text-[1rem] font-black leading-tight truncate text-[#171717] uppercase">{combo.nome}</h3>
        <p className="text-[#171717]/60 text-[0.75rem] font-bold line-clamp-1 uppercase">{combo.descricao}</p>
        <span className="text-[#171717] font-black text-[1.2rem]">R$ {combo.preco.toFixed(2)}</span>
      </div>
      <div className="pr-4">
        <button
          onClick={onAdd}
          disabled={inCart}
          className={`px-5 py-2.5 rounded-full text-[0.8rem] font-extrabold uppercase transition-all ${
            inCart 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-[#44FF00] text-[#171717] animate-pulse-subtle shadow-md active:scale-95'
          }`}
        >
          {inCart ? "✓" : "+ ADD"}
        </button>
      </div>
    </div>
  );
};