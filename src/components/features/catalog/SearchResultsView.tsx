"use client";

import React from "react";
import { ArrowLeft, Heart, Search, Share2 } from "lucide-react";
import { type SheetRecipe } from "@/utils/sheets";
import { showSuccess } from "@/utils/toast";

interface SearchResultsViewProps {
  termo: string;
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

export const SearchResultsView = ({
  termo,
  recipes,
  isLoading,
  isInCart,
  onBack,
  onRecipeAdd,
  onRecipeRemove,
  onZoomImage,
  favorites,
  onToggleFavorite,
}: SearchResultsViewProps) => {
  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  const handleShare = async (recipe: SheetRecipe, e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = recipe.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const shareUrl = `${window.location.origin}/receita/${slug}-${recipe.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AmiguMundo - ' + recipe.nome,
          text: 'Olha o que encontrei no AmiguMundo! Tudo sem ocupar espaço na memória do celular.',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess("Link copiado com sucesso!");
      }
    } catch (err) {
      console.warn("Erro ao compartilhar:", err);
      try {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess("Link copiado com sucesso!");
      } catch (clipErr) {
        console.error(clipErr);
      }
    }
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
        <h2 className="text-white font-black text-sm uppercase tracking-widest m-0 max-w-[60%] truncate">
          Resultados para "{decodeURIComponent(termo)}"
        </h2>
        <div className="w-12"></div>
      </div>

      <div className="max-w-6xl mx-auto px-2 py-4">
        <div className="bg-blue-50 text-blue-700 text-[10px] font-bold py-1.5 px-3 rounded-lg text-center mb-3 uppercase tracking-wider">
          🔍 Clique nas imagens para ampliá-las
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-bold text-sm mb-1">Nenhuma receita encontrada</p>
            <p className="text-gray-400 text-xs">Tente buscar por outro nome ou palavra-chave</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-4">
            {recipes.map((recipe) => {
              const added = isInCart(recipe.id);
              const isFavorite = favorites.includes(recipe.id);
              return (
                <div key={recipe.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between p-1">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg group">
                    <img 
                      src={recipe.imagem_url} 
                      alt={recipe.nome} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                      onClick={() => onZoomImage(recipe.imagem_url)}
                    />
                    
                    <div className="absolute top-1.5 left-1.5 bg-black/50 text-white p-1 rounded-full pointer-events-none">
                      <Search size={10} />
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(recipe.id);
                      }}
                      className={`absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform z-10 ${isFavorite ? 'text-[#44FF00]' : 'text-gray-400'}`}
                    >
                      <Heart size={10} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                    <button 
                      onClick={(e) => handleShare(recipe, e)}
                      className="absolute top-7 right-1.5 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-md hover:scale-110 active:scale-90 transition-transform text-gray-500 hover:text-gray-800 z-10"
                      title="Compartilhar"
                    >
                      <Share2 size={10} />
                    </button>
                  </div>

                  <div className="pt-1.5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-[9px] lg:text-xs font-black text-gray-800 uppercase tracking-tight line-clamp-1 leading-none mb-1">
                        {recipe.nome}
                      </h4>
                      <div className="flex items-center justify-between text-[8px] lg:text-[10px] text-gray-400 font-bold mb-1.5">
                        <span>({recipe.id})</span>
                        <span className="text-gray-900 font-black">R$ {recipe.preco.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => onRecipeAdd(recipe)}
                        disabled={added}
                        className={`flex-1 py-1 rounded-lg font-black text-[8px] lg:text-[10px] uppercase tracking-wider transition-all ${
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