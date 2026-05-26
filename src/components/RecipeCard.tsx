"use client";

import { Heart } from "lucide-react";

interface RecipeCardProps {
  recipe: {
    id: string;
    nome: string;
    preco: number;
    categoria: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAdd: () => void;
  onReject: () => void;
  isInCart: boolean;
}

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite, onAdd, onReject, isInCart }: RecipeCardProps) => {
  // Determine a badge based on recipe ID
  const badge = recipe.id === "387" ? { text: "MAIS VENDIDO", bg: "bg-[#44FF00] text-[#171717]" } : 
                recipe.id === "120" ? { text: "NOVO", bg: "bg-blue-500 text-white" } : null;

  return (
    <div className={`overflow-hidden relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 ${isInCart ? 'animate-pulse-subtle border-[#44FF00] shadow-md' : ''}`}>
      <div className="relative h-[120px] w-full bg-gray-50">
        <img
          src={`https://picsum.photos/seed/${recipe.id}/400/300`}
          alt={recipe.nome}
          className="w-full h-full object-cover"
        />
        
        {/* Micro-badges */}
        {badge && (
          <div className={`absolute top-2 left-2 ${badge.bg} text-[7px] font-black px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider`}>
            {badge.text}
          </div>
        )}

        {/* Favorite Heart Icon */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
        >
          <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-0.5 rounded-md shadow-md">
          ({recipe.id})
        </div>
      </div>
      
      <div className="p-3 flex flex-col gap-2 flex-1 justify-between">
        <div>
          <h3 className="text-gray-800 text-[0.85rem] font-bold leading-tight uppercase tracking-tight line-clamp-2">
            {recipe.nome}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[#171717] font-black text-[0.95rem]">R$ {recipe.preco.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={onAdd}
            disabled={isInCart}
            className="flex-1 bg-[#44FF00] text-[#171717] py-2 rounded-xl text-[0.75rem] font-black uppercase tracking-wider transition-all active:scale-95"
          >
            {isInCart ? "✓ No Carrinho" : "+ Adicionar"}
          </button>
          {!isInCart && (
            <button
              onClick={onReject}
              className="px-2.5 py-2 rounded-full bg-red-50 text-red-500 text-[0.7rem] font-bold hover:bg-red-100 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;