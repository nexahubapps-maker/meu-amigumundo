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
    <div className="card-float p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 relative">
      <div className="absolute top-2 right-3 bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm" style={{ color: combo.cor }}>
        {combo.badge}
      </div>
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="h-20 w-20 sm:h-36 sm:w-36 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF3D9A] flex items-center justify-center shadow-lg">
          <span className="text-2xl sm:text-4xl font-extrabold text-white">
            {combo.receitas}
          </span>
        </div>
        <div className="text-[10px] sm:text-sm text-gray-500 mt-1 font-bold uppercase tracking-wider">receitas</div>
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-extrabold leading-tight">
          {combo.nome}
        </h3>
        <p className="text-gray-500 text-[0.85rem] sm:text-sm mt-1 leading-snug">{combo.descricao}</p>
        <p className="text-xl sm:text-2xl font-extrabold mt-2 text-[#7BC843]">
          R${combo.preco.toFixed(2)}
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <button
          onClick={onAdd}
          disabled={inCart}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white text-xs sm:text-sm disabled:opacity-50 transition-transform active:scale-95 bg-[#7BC843]"
        >
          {inCart ? "✓ Adicionado" : "+ Adicionar"}
        </button>
        {inCart && (
          <button
            onClick={onRemove}
            className="px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-red-500 text-xs sm:text-sm border border-red-200 hover:bg-red-50"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};