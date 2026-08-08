"use client";

import React, { useState } from "react";
import { ShoppingBag, X, ArrowRight, Gift, Search } from "lucide-react";
import { type SheetRecipe, getRecipesByIds } from "@/utils/sheets";
import { type CartItem, calculateCart } from "@/utils/pricing";

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
  hasOpenBonusSlot,
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
        setTimeout(() => setSearchError(false), 4000);
      }
    } else {
      setFoundRecipe(null);
    }
  };

  const handleAddFoundRecipe = () => {
    if (foundRecipe) {
      onAddToCart({
        id: foundRecipe.id,
        nome: foundRecipe.nome,
        preco: foundRecipe.preco,
        tipo: "recipe",
        imagem: foundRecipe.imagem_url,
        isBonus: hasOpenBonusSlot && foundRecipe.preco === 5,
      });
      setFoundRecipe(null);
      setCode("");
    }
  };

  const P = calculated.recipeCount;
  const F = calculated.bonusCount;
  const maxSlots = calculated.maxBonusSlots;

  const regularItems = calculated.items.filter(item => !item.isBonus);
  const bonusItems = calculated.items.filter(item => item.isBonus);

  let neuromarketingText = "";
  if (P >= 1 && P <= 4) {
    neuromarketingText = `Adicione mais ${5 - P} receita(s) e ganhe 20% OFF em tudo!`;
  } else if (P >= 5 && P <= 10) {
    neuromarketingText = `Faltam só ${11 - P} receita(s) para o desconto subir para 40% OFF + 1 RECEITA GRÁTIS!`;
  } else if (P >= 11 && P <= 15) {
    if (F === 0) {
      neuromarketingText = `Parabéns! Você já tem 40% OFF e ganhou 1 RECEITA GRÁTIS! Escolha uma receita de R$5 para levar de presente.`;
    } else {
      neuromarketingText = `Muito bem! Adicione mais ${16 - P} receita(s) para o desconto subir para 50% OFF + mais 2 GRÁTIS!`;
    }
  } else if (P >= 16) {
    if (F < 3) {
      neuromarketingText = `Sensacional! Você atingiu o topo: 50% OFF + até 3 RECEITAS GRÁTIS no total! Escolha receitas de R$5 para completar seus presentes.`;
    } else {
      neuromarketingText = `Carrinho perfeito! Você garantiu o melhor desconto e todos os seus presentes!`;
    }
  }

  return (
    <div 
      id="cart-section" 
      className="max-w-xl mx-auto mt-1 mb-4 bg-white rounded-3xl p-4 sm:p-5 text-left w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25),0_15px_25px_-5px_rgba(0,0,0,0.12)] border-2 border-gray-100/80 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="mb-2">
        <img
          src="https://ik.imagekit.io/di3huhaluc/amigumundo_descontos"
          alt="Preços acessíveis para todas as crocheteiras apaixonadas"
          className="w-full h-auto rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
        />
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

      {neuromarketingText && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-center animate-pulse-subtle">
          <p className="text-sm font-bold text-yellow-800 leading-relaxed">
            {neuromarketingText}
          </p>
        </div>
      )}

      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1.5 flex items-center gap-1.5">
          🛒 Meu Carrinho ({regularItems.length} {regularItems.length === 1 ? "item" : "itens"})
        </h3>

        {regularItems.length === 0 ? (
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
            {regularItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 py-1.5 transition-all bg-white"
              >
                {item.imagem && (
                  <img
                    src={item.imagem}
                    className="w-7 h-7 rounded object-cover border border-gray-100 shrink-0"
                    alt=""
                  />
                )}
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-gray-800 uppercase truncate leading-none">
                    {item.nome}
                  </h4>
                  <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-1 rounded shrink-0 leading-none py-0.5">
                    {item.tipo === "recipe" ? `(${item.id})` : item.tipo.toUpperCase()}
                  </span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <span className="font-black text-gray-900 text-xs">
                    R$ {item.precoOriginal.toFixed(2)}
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

      {maxSlots > 0 && (
        <div className="mb-3 p-3 bg-[#f0fdf4] border border-[#22c55e] rounded-xl space-y-2">
          <h4 className="text-sm font-black text-[#16a34a] uppercase tracking-wider flex items-center gap-1.5">
            🎁 Seus Mimos Gratuitos ({F} de {maxSlots} liberados)
          </h4>
          <div className="divide-y divide-green-100 border-t border-b border-green-100">
            {bonusItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 py-1.5 bg-white"
              >
                {item.imagem && (
                  <img
                    src={item.imagem}
                    className="w-7 h-7 rounded object-cover border border-gray-100 shrink-0"
                    alt=""
                  />
                )}
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-gray-800 uppercase truncate leading-none">
                    {item.nome}
                  </h4>
                  <span className="text-[9px] font-black bg-green-50 text-green-600 px-1 rounded shrink-0 leading-none py-0.5">
                    (${item.id})
                  </span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <span className="text-gray-400 line-through text-[10px] font-bold">
                    R$ 5,00
                  </span>
                  <span className="text-[11px] font-black text-[#22c55e] uppercase tracking-wider">
                    Grátis
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

            {Array.from({ length: maxSlots - F }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center justify-center py-2 border-2 border-dashed border-green-200 bg-green-50/30 text-center rounded-lg mt-1"
              >
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider flex items-center gap-1">
                  <Gift size={10} /> Aguardando sua escolha grátis...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {calculated.items.length > 0 && (
        <div className="pt-2.5 border-t border-gray-100">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">Subtotal</span>
            <span className="text-base font-bold text-gray-500">R$ {calculated.subtotalRecipesOriginal.toFixed(2)}</span>
          </div>

          {calculated.subtotalRecipesOriginal > calculated.subtotalRecipes && (
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-black text-green-600 uppercase tracking-wide">Desconto</span>
              <span className="text-base font-black text-green-600">
                - R$ {(calculated.subtotalRecipesOriginal - calculated.subtotalRecipes).toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline mb-2.5">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">VALOR TOTAL DO PEDIDO</span>
            <span className="text-xl font-bold text-blue-600">R$ {calculated.total.toFixed(2)}</span>
          </div>

          {calculated.bonusCount > 0 && (
            <div className="text-center mb-2">
              <span className="text-green-600 font-bold text-[10px] uppercase">
                🎉 {calculated.bonusCount} PRESENTE(S) INCLUÍDO(S)!
              </span>
            </div>
          )}

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