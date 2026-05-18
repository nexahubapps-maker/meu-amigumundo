"use client";

import { type Recipe } from "@/data/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  inCart: boolean;
  onAdd: () => void;
  onReject: () => void;
}

export const RecipeCard = ({ recipe, inCart, onAdd, onReject }: RecipeCardProps) => {
  return (
    <div className="card-float p-4 fade-in relative">
      {inCart && (
        <div className="absolute top-3 right-3 bg-[#7BC843] text-white text-xs font-bold px-3 py-1 rounded-full">
          ✓ No carrinho
        </div>
      )}
      <div className="relative rounded-xl overflow-hidden mb-3" style={{ height: "200px" }}>
        <img
          src={`https://picsum.photos/seed/${recipe.id}/300/300`}
          alt={recipe.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full">
          {recipe.id}
        </div>
      </div>
      <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {recipe.nome}
      </h3>
      <p className="text-gray-500 text-sm mb-1">{recipe.descricao}</p>
      <p className="text-xs text-gray-400 mb-2">{recipe.categoria}</p>
      <p className="text-2xl font-bold mb-3" style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}>
        R$ {recipe.preco.toFixed(2)}
      </p>
      <button
        onClick={onAdd}
        disabled={inCart}
        className="w-full py-2.5 rounded-xl font-bold text-white text-base disabled:opacity-50 transition-transform active:scale-[0.98]"
        style={{ backgroundColor: inCart ? "#ccc" : "#7BC843", fontFamily: "'Fredoka One', cursive" }}
      >
        {inCart ? "✓ Adicionado" : "+ Adicionar ao Carrinho"}
      </button>
      {!inCart && (
        <button
          onClick={onReject}
          className="w-full mt-2 py-2 rounded-xl font-semibold text-red-500 text-sm border border-red-200 hover:bg-red-50 transition-colors"
        >
          ✕ Rejeitar
        </button>
      )}
    </div>
  );
};