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
    <div className="card-float p-5 flex flex-col sm:flex-row gap-4 relative">
      <div className="absolute top-2 right-3 bg-white/90 text-xs font-bold px-3 py-1 rounded-full" style={{ color: combo.cor }}>
        {combo.badge}
      </div>

      <div className="flex-shrink-0 flex flex-col items-center">
        <div
          className="h-32 w-32 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${combo.cor}, #9B59B6)`,
          }}
        >
          <span
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            {combo.receitas}
          </span>
        </div>
        <span className="text-sm text-gray-500 mt-1">receitas</span>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {combo.nome}
        </h3>
        <p className="text-gray-500 text-sm mt-1">{combo.descricao}</p>
        <p
          className="text-2xl font-bold mt-2"
          style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          R${combo.preco.toFixed(2)}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onAdd}
            disabled={inCart}
            className="flex-1 px-5 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-transform active:scale-[0.98]"
            style={{ backgroundColor: inCart ? "#ccc" : "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            {inCart ? "✓ Adicionado" : "+ Adicionar"}
          </button>
          {inCart && (
            <button
              onClick={onRemove}
              className="px-4 py-2.5 rounded-xl font-semibold text-red-500 text-sm border border-red-200 hover:bg-red-50 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};