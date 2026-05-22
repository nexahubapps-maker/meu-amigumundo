"use client";

import React from "react";
import { ShoppingBag, X } from "lucide-react";
import { CodeInput } from "./CodeInput";
import { playHeartbeatSound } from "@/utils/audio";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  tipo: "recipe" | "pack" | "combo" | "upsell";
  imagem?: string;
}

interface CartSectionProps {
  cart: CartItem[];
  partition: {
    receitas: any[];
    mimos: any[];
    presentes: any[];
    otherItems: any[];
  };
  total: number;
  nudgeMessage: string;
  onRemoveFromCart: (id: string) => void;
  onRecipeFound: (recipe: any) => void;
  onRecipeNotFound: () => void;
  onCheckout: () => void;
}

export const CartSection = ({
  cart,
  partition,
  total,
  nudgeMessage,
  onRemoveFromCart,
  onRecipeFound,
  onRecipeNotFound,
  onCheckout,
}: CartSectionProps) => {
  return (
    <div id="cart-section" className="max-w-2xl mx-auto my-2 bg-white rounded-[20px] p-4 shadow-md border border-gray-100">
      {/* CodeInput attached at the top with a subtle divider */}
      <div className="pb-2 mb-2 border-b border-gray-100">
        <CodeInput onRecipeFound={onRecipeFound} onRecipeNotFound={onRecipeNotFound} />
      </div>

      <h2 className="text-[0.85rem] font-extrabold mb-2 flex items-center gap-2 uppercase italic">
        🛒 Meu Carrinho ({cart.length})
      </h2>

      {/* Dynamic UX Nudge */}
      <div className="bg-blue-50 text-blue-700 text-xs font-bold p-2 rounded-xl mb-2 text-center">
        {nudgeMessage}
      </div>
      
      {cart.length === 0 ? (
        <div className="py-2 text-center">
          <ShoppingBag size={24} className="mx-auto text-gray-100 mb-1" />
          <p className="text-gray-400 font-black text-[0.65rem] uppercase tracking-widest">
            Vazio
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* [Section 1: Recipes] */}
          {partition.receitas.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                Receitas de Amigurumi
              </h3>
              <div className="space-y-1">
                {partition.receitas.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0 pl-3">
                    <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight break-words whitespace-normal line-clamp-2 uppercase">{item.nome}</h4>
                      <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                    </div>
                    <span className="font-black text-[#171717] text-[0.8rem] shrink-0">R$ {item.precoFinal.toFixed(2)}</span>
                    <button onClick={() => onRemoveFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500 shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* [Section 2: Mimos] */}
          {partition.mimos.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-wider mb-1">
                Mimos Especiais
              </h3>
              <div className="space-y-1">
                {partition.mimos.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0 pl-3">
                    <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight break-words whitespace-normal line-clamp-2 uppercase">{item.nome}</h4>
                      <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-red-500 line-through text-[10px]">R$ {item.originalPreco.toFixed(2)}</span>
                      <span className="font-black text-green-600 text-[0.8rem]">R$ {item.precoFinal.toFixed(2)}</span>
                    </div>
                    <button onClick={() => onRemoveFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500 shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* [Section 3: Presentes] */}
          {partition.presentes.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-1">
                Presentes Ganhos
              </h3>
              <div className="space-y-1">
                {partition.presentes.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0 pl-3">
                    <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight break-words whitespace-normal line-clamp-2 uppercase">{item.nome}</h4>
                      <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-red-500 line-through text-[10px]">R$ {item.originalPreco.toFixed(2)}</span>
                      <span className="font-black text-green-600 text-[0.8rem]">GRÁTIS</span>
                    </div>
                    <button onClick={() => onRemoveFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500 shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Items (Packs, Combos, Upsells) */}
          {partition.otherItems.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-wider mb-1">
                Outros Itens
              </h3>
              <div className="space-y-1">
                {partition.otherItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0 pl-3">
                    <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight break-words whitespace-normal line-clamp-2 uppercase">{item.nome}</h4>
                      <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                    </div>
                    <span className="font-black text-[#171717] text-[0.8rem] shrink-0">R$ {item.preco.toFixed(2)}</span>
                    <button onClick={() => onRemoveFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500 shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 mt-1 border-t border-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-black text-gray-400 text-[0.7rem] uppercase tracking-widest">Total</span>
              <span className="text-[1rem] font-black text-[#171717]">R$ {total.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => {
                playHeartbeatSound();
                onCheckout();
              }}
              className="w-full bg-[#44FF00] text-[#171717] py-2.5 rounded-full font-black text-[0.8rem] shadow-sm transition-transform active:scale-95 uppercase tracking-widest"
            >
              Finalizar Pedido →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};