"use client";

import React from "react";
import { ArrowLeft, Heart, Search } from "lucide-react";
import { type SheetRecipe } from "@/utils/sheets";

interface CategoryDetailViewProps {
  categoriaSlug: string;
  recipes: SheetRecipe[];
  isLoading: boolean;
  isInCart: (id: string) => boolean;
  onBack: () => void;
  onRecipeAdd: (recipe: SheetRecipe) => void;
  onRecipeRemove: (id: string) => void;
  onZoomImage: (url: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const CategoryDetailView = ({
  categoriaSlug,
  recipes,
  isLoading,
  isInCart,
  onBack,
  onRecipeAdd,
  onRecipeRemove,
  onZoomImage,
  favorites,
  onToggleFavorite,
}: CategoryDetailViewProps) => {
  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300">
      {/* Header with Orange Texture */}
      <div style={textureLaranjaStyle} className="sticky top-0 z-10 py-4 px-4 flex items-center justify-between shadow-md">
        <button 
          onClick={onBack}
          className="text-white hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 font-black text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <h2 className="text-white font-black text-sm uppercase tracking-widest m-0">
          {decodeURIComponent(categoriaSlug)}
        </h2>
        <div className="w-12"></div> {/* Spacer for centering */}
      </div>

      <div className="max-w-6xl mx-auto px-2 py-4">
        {/* Texto de Aviso de Zoom no Topo */}
        <div className="bg-blue-50 text-blue-700 text-[10px] font-bold py-1.5 px-3 rounded-lg text-center mb-3 uppercase tracking-wider">
          🔍 Clique nas imagens para ampliá-las
        </div>

        {isLoading ? (
          /* Skeleton Loaders */
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          /* Ghost Card Placeholder */
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <div className="bg-gray-100 border border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center p-2 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-12 h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          /* Real Recipe Cards - Grade 3x3 Ultra-Compacta */
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {recipes.map((recipe) => {
              const added = isInCart(recipe.id);
              const isFavorite = favorites.includes(recipe.id);
              return (
                <div key={recipe.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between p-1">
                  
                  {/* Image with Lightbox Zoom on Click & Favorite Heart */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg group">
                    <img 
                      src={recipe.url_foto} 
                      alt={recipe.nome} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                      onClick={() => onZoomImage(recipe.url_foto)}
                    />
                    
                    {/* Ícone de Lupa no Canto Superior Esquerdo */}
                    <div className="absolute top-1.5 left-1.5 bg-black/50 text-white p-1 rounded-full pointer-events-none">
                      <Search size={10} />
                    </div>

                    {/* Favorite Heart Icon */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recipe.id);
                      }}
                      className={`absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform z-10 ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
                    >
                      <Heart size={10} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Info & Buy Button - Bloco de Dados Ultra-Compacto */}
                  <div className="pt-1.5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-[9px] font-black text-gray-800 uppercase tracking-tight line-clamp-1 leading-none mb-1">
                        {recipe.nome}
                      </h4>
                      <div className="flex items-center justify-between text-[8px] text-gray-400 font-bold mb-1.5">
                        <span>({recipe.id})</span>
                        <span className="text-gray-900 font-black">R$ {recipe.preco.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => onRecipeAdd(recipe)}
                        disabled={added}
                        className={`flex-1 py-1 rounded-lg font-black text-[8px] uppercase tracking-wider transition-all ${
                          added 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-[#44FF00] text-[#171717] hover:scale-105 active:scale-95'
                        }`}
                      >
                        {added ? "✓" : "Quero"}
                      </button>
                      {added && (
                        <button 
                          onClick={() => onRecipeRemove(recipe.id)} 
                          className="px-1.5 rounded-lg bg-red-50 text-red-500 text-[10px] hover:bg-red-100 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};