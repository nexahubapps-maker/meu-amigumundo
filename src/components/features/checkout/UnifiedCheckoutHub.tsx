"use client";

import React, { useState } from "react";
import { ShoppingBag, X, ArrowRight, Search } from "lucide-react";
import { type SheetRecipe, getRecipesByIds } from "@/utils/sheets";
import { type CartItem, calculateCart } from "@/utils/pricing";
import { LiquidGlassCard } from "@/components/common/LiquidGlassCard";

interface UnifiedCheckoutHubProps {
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
  onAddToCart: (item: CartItem) => void;
  onCheckout: () => void;
  onZoomImage?: (url: string) => void;
  hasOpenBonusSlot: boolean;
}

export const UnifiedCheckoutHub = ({
  cart,
  onRemoveFromCart,
  onAddToCart,
  onCheckout,
  onZoomImage,
}: UnifiedCheckoutHubProps) => {
  const [code, setCode] = useState("");
  const [foundRecipe, setFoundRecipe] = useState<SheetRecipe | null>(null);
  const [searchError, setSearchError] = useState(false);

  const calculated = calculateCart(cart);

  const handleCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCode(value);

    if (value.length === 4) {
      const results = await getRecipesByIds([value]);
      const recipe = results[0] || null;
      if (recipe) {
        setFoundRecipe(recipe);
        setSearchError(false);
      } else {
        setFoundRecipe(null);
        setSearchError(true);
      }
    } else {
      setFoundRecipe(null);
      setSearchError(false);
    }
  };

  const handleAddFoundRecipe = () => {
    if (foundRecipe) {
      onAddToCart({
        id: foundRecipe.id,
        nome: foundRecipe.nome,
        preco: foundRecipe.preco,
        tipo: "recipe",
        imagem: foundRecipe.imagem_url
      });
      setFoundRecipe(null);
      setCode("");
    }
  };

  const P = calculated.recipeCount;

  let tierMessage = "";
  if (P === 0) {
    tierMessage = "Comece sua coleção agora. A partir de 6 receitas o preço já cai para R$3,00 cada.";
  } else if (P < 6) {
    tierMessage = `Adicione mais ${6 - P} receita(s) e o preço cai para R$3,00 cada. Sua biblioteca agradece.`;
  } else if (P < 11) {
    tierMessage = `Você já está economizando muito e vai ficar melhor ainda. Mais ${11 - P} receita(s) e o preço desce para R$2,50 — o próximo degrau já está bem pertinho.`;
  } else if (P < 21) {
    tierMessage = `Catálogo bom é quando tem muitas opções, ainda mais por esse preço. Faltam ${21 - P} receita(s) para o DESCONTO mais ABSURDO de todos: R$2,00 cada.`;
  } else {
    tierMessage = "Você chegou no lugar mais gostoso e ABSURDO. R$2,00 por receita. E quanto mais você coleciona, mais o AmiguMundo cuida de você.";
  }

  return (
    <div 
      id="cart-section" 
      className="max-w-2xl mx-auto my-4 bg-white rounded-3xl p-3 sm:p-5 text-left w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25),0_15px_25px_-5px_rgba(0,0,0,0.12)] border-2 border-gray-100/80 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="mb-3">
        <LiquidGlassCard tintColor="rgba(93,5,153,0.55)" pulse className="w-full">
          <div className="p-4">
            <p className="text-white text-[11px] font-black uppercase tracking-wider mb-1 opacity-90">
              R$ {calculated.pricePerRecipe.toFixed(2)} por receita agora
            </p>
            <p className="text-white text-sm font-bold leading-snug">
              {tierMessage}
            </p>
          </div>
        </LiquidGlassCard>
      </div>

      <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-200/80 mb-1">
        <div className="text-center mb-2">
          <p className="text-sm text-gray-500 font-bold leading-tight">
            Digite abaixo o código da receita <br />
            e adicione ao carrinho.
          </p>
        </div>

        <div className="relative max-w-[200px] mx-auto">
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={code}
            onChange={handleCodeChange}
            maxLength={4}
            placeholder="DIGITE O CÓDIGO"
            className="w-full h-11 px-3 border-2 border-gray-300 rounded-lg text-lg font-bold text-center focus:outline-none focus:border-[#44FF00] transition-all placeholder:text-gray-300 uppercase text-gray-800"
          />
        </div>

        {searchError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-600 font-bold text-sm uppercase">
              ❌ Código não encontrado. Verifique e tente novamente!
            </p>
          </div>
        )}

        {foundRecipe && (
          <div className="mt-3 p-2.5 bg-green-50 border-2 border-[#44FF00] rounded-lg flex items-center gap-3 animate-in zoom-in-95 duration-200">
            <div 
              className="relative aspect-square w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 group cursor-zoom-in"
              onClick={() => onZoomImage?.(foundRecipe.imagem_url)}
            >
              <img
                src={foundRecipe.imagem_url}
                alt={foundRecipe.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full pointer-events-none">
                <Search size={8} />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between h-16 min-w-0">
              <div className="w-full">
                <h4 className="text-sm font-bold text-gray-900 uppercase leading-tight break-words">
                  {foundRecipe.nome}
                </h4>
              </div>

              <div className="flex items-end justify-between w-full">
                <span className="text-[11px] font-black text-gray-500">
                  ({foundRecipe.id})
                </span>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-gray-900 font-black leading-none">
                    R$ {foundRecipe.preco.toFixed(2)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={handleAddFoundRecipe}
                      className="bg-[#44FF00] text-[#171717] px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => {
                        setFoundRecipe(null);
                        setCode("");
                      }}
                      className="bg-gray-200 text-gray-600 p-1 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1.5 flex items-center gap-1.5">
          🛒 Meu Carrinho ({calculated.items.length} {calculated.items.length === 1 ? "item" : "itens"})
        </h3>

        {calculated.items.length === 0 ? (
          <div className="py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 p-3">
            <ShoppingBag size={24} className="mx-auto text-gray-300 mb-1" />
            <p className="text-gray-600 font-bold text-sm uppercase">
              Seu carrinho está vazio!
            </p>
            <p className="text-gray-400 text-[11px] font-bold mt-0.5">
              Escolha receitas fofas na nossa lista abaixo para começar! ❤️
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {calculated.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 py-1.5 transition-all bg-white"
              >
                {item.imagem && (
                  <img
                    src={item.imagem}
                    className="w-8 h-8 rounded object-cover border border-gray-100 shrink-0 cursor-zoom-in"
                    alt=""
                    onClick={() => onZoomImage?.(item.imagem!)}
                  />
                )}
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-gray-800 uppercase truncate leading-none">
                    {item.nome}
                  </h4>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <span className="text-[11px] font-black text-gray-900">
                    R$ {item.precoFinal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remover item"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {calculated.items.length > 0 && (
        <div className="pt-2.5 border-t border-gray-100">
          {calculated.economia > 0 && (
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Você está economizando</span>
              <span className="text-xl font-black text-red-600">R$ {calculated.economia.toFixed(2)}</span>
            </div>
          )}

          {calculated.pricePerRecipe < 5 && (
            <div className="mb-2">
              <span className="inline-block bg-[#3CB19E] text-white text-[11px] font-black uppercase tracking-wide px-3 py-1 rounded-full animate-pulse-subtle">
                O preço caiu para R$ {calculated.pricePerRecipe.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline mb-2.5">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total a pagar</span>
            <span className="text-3xl font-black text-green-600">R$ {calculated.total.toFixed(2)}</span>
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-[#44FF00] text-[#171717] py-3 rounded-xl font-bold text-base shadow-sm hover:scale-[1.01] active:scale-95 transition-transform uppercase tracking-wider flex items-center justify-center gap-2 border-b-4 border-green-600"
          >
            FINALIZAR PEDIDO <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};