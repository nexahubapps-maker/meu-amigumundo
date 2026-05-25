"use client";

import React from 'react';
import { X, Heart } from 'lucide-react';
import { type SheetRecipe, type SheetInfoproduto, type SheetPack } from '@/utils/sheets';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCart: (item: any) => void;
  isInCart: (id: string) => boolean;
  recipes: SheetRecipe[];
  packs: SheetPack[];
  infoprodutos: SheetInfoproduto[];
}

export const FavoritesModal = ({
  isOpen,
  onClose,
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  isInCart,
  recipes,
  packs,
  infoprodutos
}: FavoritesModalProps) => {
  if (!isOpen) return null;

  // Gather all favorited items from dynamic lists
  const favoritedRecipes = recipes.filter(r => favoriteIds.includes(r.id)).map(r => ({ ...r, tipo: 'recipe' as const, preco: r.preco, imagem: r.url_foto }));
  const favoritedPacks = packs.filter(p => favoriteIds.includes(p.id)).map(p => ({ ...p, tipo: 'pack' as const, preco: p.preco, imagem: p.url_foto }));
  const favoritedUpsells = infoprodutos.filter(u => favoriteIds.includes(u.id)).map(u => ({ ...u, tipo: 'upsell' as const, preco: u.preco, imagem: u.url_foto }));

  const allFavorites = [...favoritedRecipes, ...favoritedPacks, ...favoritedUpsells];
  const totalValue = allFavorites.reduce((sum, item) => sum + item.preco, 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="text-[#44FF00]" fill="currentColor" size={20} />
            <h2 className="text-base font-black uppercase tracking-tight text-gray-800">Meus Favoritos</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allFavorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Heart size={48} className="text-gray-200 mb-3" />
              <p className="text-gray-400 font-black text-xs uppercase tracking-wider">Nenhum item favoritado ainda</p>
              <p className="text-gray-300 text-[10px] mt-1">Navegue pela loja e clique no coração para salvar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allFavorites.map((item) => {
                const added = isInCart(item.id);
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                    <img 
                      src={item.imagem || `https://picsum.photos/seed/${item.id}/100/100`} 
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200" 
                      alt="" 
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-gray-800 truncate uppercase leading-tight">{item.nome}</h4>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.tipo}</span>
                      <p className="text-xs font-black text-[#171717] mt-0.5">R$ {item.preco.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAddToCart({
                          id: item.id,
                          nome: item.nome,
                          preco: item.preco,
                          tipo: item.tipo,
                          imagem: item.imagem
                        })}
                        disabled={added}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                          added 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-[#44FF00] text-[#171717] hover:scale-105 active:scale-95'
                        }`}
                      >
                        {added ? "✓" : "+ ADD"}
                      </button>
                      <button 
                        onClick={() => onToggleFavorite(item.id)}
                        className="p-1.5 text-[#44FF00] hover:bg-green-50 rounded-full transition-colors"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        {allFavorites.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Favoritos ({allFavorites.length})</span>
                <span className="text-base font-black text-gray-800">R$ {totalValue.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                // Add all non-added favorites to cart
                allFavorites.forEach(item => {
                  if (!isInCart(item.id)) {
                    onAddToCart({
                      id: item.id,
                      nome: item.nome,
                      preco: item.preco,
                      tipo: item.tipo,
                      imagem: item.imagem
                    });
                  }
                });
                onClose();
                // Scroll to cart section
                setTimeout(() => {
                  const el = document.getElementById('cart-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full bg-[#44FF00] text-[#171717] py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Adicionar Todos ao Carrinho →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};