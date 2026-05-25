"use client";

import React from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { type SheetRecipe } from "@/utils/sheets";

interface CategoryDetailViewProps {
  categoriaSlug: string;
  recipes: SheetRecipe[];
  isLoading: boolean;
  isInCart: (id: string) => boolean;
  onBack: () => void;
  onRecipeAdd: (recipe: SheetRecipe) => void;
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-gray-500 text-xs font-bold mb-6 text-center uppercase tracking-wider">
          Explore as receitas exclusivas da categoria {decodeURIComponent(categoriaSlug)}
        </p>

        {isLoading ? (
          /* Skeleton Loaders */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          /* Ghost Card Placeholder */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-gray-100 border border-dashed border-gray-200 rounded-2xl aspect-[3/4] flex flex-col items-center justify-center p-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
              <div className="w-20 h-3 bg-gray-200 rounded mb-2"></div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          /* Real Recipe Cards */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {recipes.map((recipe) => {
              const added = isInCart(recipe.id);
              const isFavorite = favorites.includes(recipe.id);
              return (
                <div key={recipe.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                  {/* Header with Orange Texture */}
                  <div style={textureLaranjaStyle} className="py-1.5 px-3 text-center text-[9px] font-black text-white uppercase tracking-wider">
                    CÓD: {recipe.id}
                  </div>
                  
                  {/* Image with Lightbox Zoom on Click & Favorite Heart */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden group">
                    <img 
                      src={recipe.url_foto} 
                      alt={recipe.nome} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                      onClick={() => onZoomImage(recipe.url_foto)}
                    />
                    
                    {/* Favorite Heart Icon */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recipe.id);
                      }}
                      className={`absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform z-10 ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
                    >
                      <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Info & Buy Button */}
                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight line-clamp-2 leading-tight">
                        {recipe.nome}
                      </h4>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between gap-1.5">
                      <span className="text-xs font-black text-gray-900">
                        R$ {recipe.preco.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onRecipeAdd(recipe)}
                        disabled={added}
                        className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${
                          added 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-[#44FF00] text-[#171717] hover:scale-105 active:scale-95'
                        }`}
                      >
                        {added ? "✓" : "Quero"}
                      </button>
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