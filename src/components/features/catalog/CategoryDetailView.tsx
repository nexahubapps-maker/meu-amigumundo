"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { type SheetRecipe } from "@/utils/sheets";
import { RecipeSearchBar } from "@/components/features/catalog/RecipeSearchBar";
import { RecipeGridCard } from "@/components/features/catalog/RecipeGridCard";

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
  hasOpenBonusSlot?: boolean;
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
        <div className="w-12"></div>
      </div>

      <div className="max-w-6xl mx-auto px-2 pt-4 pb-24">
        <RecipeSearchBar />

        <div className="w-2/3 max-w-xs mx-auto h-px bg-gray-200 my-3"></div>

        <div className="bg-white text-gray-700 text-sm font-bold py-2.5 px-4 rounded-xl text-center mb-3 uppercase tracking-wider shadow-[0_6px_16px_rgba(0,0,0,0.1),_0_3px_6px_rgba(0,0,0,0.06)] border border-gray-100">
          🔍 Clique nas imagens para ampliá-las
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4">
            <div className="bg-gray-100 border border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center p-2 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-12 h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4">
            {recipes.map((recipe) => (
              <RecipeGridCard
                key={recipe.id}
                recipe={recipe}
                added={isInCart(recipe.id)}
                isFavorite={favorites.includes(recipe.id)}
                onAdd={onRecipeAdd}
                onRemove={onRecipeRemove}
                onZoomImage={onZoomImage}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};