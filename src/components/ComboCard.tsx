"use client";

import { type Combo } from "@/data/packs";

interface ComboCardProps {
  combo: Combo;
  inCart: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export const ComboCard = ({ combo, inCart, onAdd, onRemove }: ComboCardProps) => {
  const comboColors: Record<number, string> = {
    20: "#FF6B35",
    50: "#4A90D9",
    100: "#7BC843",
  };

  const bgColor = comboColors[combo.receitas] || "#FF6B35";

  return (
    <div className="card-float overflow-hidden flex h-[100px] items-center">
      <div 
        className="w-[80px] sm:w-[100px] h-full flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-[2.2rem] sm:text-[2.5rem] font-extrabold leading-none">{combo.receitas}</span>
        <span className="text-[10px] font-bold uppercase tracking-tighter">Receitas</span>
      </div>
      <div className="flex-1 px-3 sm:px-4 flex flex-col justify-center">
        <h3 className="text-[0.9rem] sm:text-[1rem] font-bold leading-tight truncate">{combo.nome}</h3>
        <p className="text-gray-500 text-[0.75rem] sm:text-[0.8rem] line-clamp-1">{combo.descricao}</p>
        <span className="text-[#7BC843] font-bold text-[1rem] sm:text-[1.1rem]">R$ {combo.preco.toFixed(2)}</span>
      </div>
      <div className="pr-3">
        <button
          onClick={onAdd}
          disabled={inCart}
          className="btn-premium bg-[#7BC843] text-white px-4 py-2 text-[0.75rem]"
        >
          {inCart ? "✓" : "+ Add"}
        </button>
      </div>
    </div>
  );
};