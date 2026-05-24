"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, X, Search, Check, ArrowRight, Gift } from "lucide-react";
import { type SheetRecipe } from "@/utils/sheets";
import { type CartItem, calculateCart } from "@/utils/pricing";
import { playHeartbeatSound } from "@/utils/audio";

interface UnifiedCheckoutHubProps {
  cart: CartItem[];
  allRecipes: SheetRecipe[];
  onRemoveFromCart: (id: string) => void;
  onAddToCart: (item: CartItem) => void;
  onCheckout: () => void;
}

export const UnifiedCheckoutHub = ({
  cart,
  allRecipes,
  onRemoveFromCart,
  onAddToCart,
  onCheckout,
}: UnifiedCheckoutHubProps) => {
  const [code, setCode] = useState("");
  const [foundRecipe, setFoundRecipe] = useState<SheetRecipe | null>(null);
  const [searchError, setSearchError] = useState(false);

  // Calculate cart values using the centralized pricing utility
  const calculated = calculateCart(cart, allRecipes);

  // Handle code input change with automatic search on 4 digits
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    setCode(value);

    if (value.length === 4) {
      const recipe = allRecipes.find((r) => r.id === value);
      if (recipe) {
        setFoundRecipe(recipe);
        setSearchError(false);
        playHeartbeatSound();
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
        imagem: foundRecipe.url_foto,
      });
      setFoundRecipe(null);
      setCode("");
    }
  };

  // Progress bar percentage calculation
  const getProgressPercentage = () => {
    const count = calculated.recipeCount;
    if (count >= 20) return 100;
    if (count >= 15) return 75 + ((count - 15) / 5) * 25;
    if (count >= 10) return 50 + ((count - 10) / 5) * 25;
    if (count >= 5) return 25 + ((count - 5) / 5) * 25;
    return (count / 5) * 25;
  };

  return (
    <div className="max-w-2xl mx-auto my-6 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border-4 border-[#44FF00] text-left">
      
      {/* 1. CAIXA DE CÓDIGO (TOPO DO CARD) */}
      <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 mb-6">
        <label className="block text-center text-lg font-black text-gray-800 uppercase tracking-wide mb-2">
          🔍 Encontrou um código no WhatsApp?
        </label>
        <div className="relative max-w-xs mx-auto">
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={code}
            onChange={handleCodeChange}
            maxLength={4}
            placeholder="DIGITE O CÓDIGO AQUI"
            className="w-full px-4 py-3 border-4 border-gray-300 rounded-xl text-2xl font-black text-center focus:outline-none focus:border-[#44FF00] transition-all placeholder:text-gray-300 uppercase text-gray-800"
          />
        </div>
        <p className="text-center text-xs text-gray-500 font-bold mt-2 uppercase tracking-wider">
          Busca automática ao digitar 4 números
        </p>

        {/* Search Error Feedback */}
        {searchError && (
          <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-center">
            <p className="text-red-600 font-black text-sm uppercase">
              ❌ Código não encontrado. Verifique e tente novamente!
            </p>
          </div>
        )}

        {/* Found Recipe Mini-Card */}
        {foundRecipe && (
          <div className="mt-4 p-4 bg-green-50 border-4 border-[#44FF00] rounded-xl flex flex-col sm:flex-row items-center gap-4 animate-in zoom-in-95 duration-200">
            <img
              src={foundRecipe.url_foto}
              alt={foundRecipe.nome}
              className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-md shrink-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded uppercase">
                CÓD: {foundRecipe.id}
              </span>
              <h4 className="text-base font-black text-gray-900 uppercase mt-1">
                {foundRecipe.nome}
              </h4>
              <p className="text-xs text-gray-500 font-bold">
                R$ {foundRecipe.preco.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={handleAddFoundRecipe}
                className="flex-1 sm:flex-none bg-[#44FF00] text-[#171717] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-transform"
              >
                Adicionar ao Carrinho
              </button>
              <button
                onClick={() => {
                  setFoundRecipe(null);
                  setCode("");
                }}
                className="bg-gray-200 text-gray-600 p-2.5 rounded-xl hover:bg-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. RÉGUA DE PROGRESSO GAMIFICADA (MUITO VISUAL) */}
      <div className="mb-6 bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3 text-center">
          🏆 Descontos Progressivos e Presentes
        </h3>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden border-2 border-gray-300 mb-4 relative">
          <div
            className="bg-gradient-to-r from-[#44FF00] to-green-500 h-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-gray-800 uppercase">
            {calculated.recipeCount} {calculated.recipeCount === 1 ? "Receita" : "Receitas"} no Carrinho
          </span>
        </div>

        {/* Dynamic High-Contrast Message */}
        <div className="text-center p-3 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
          <p className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
            {calculated.recipeCount >= 10 ? (
              <span>
                Parabéns! Você ganhou{" "}
                <span className="text-green-600 font-black uppercase">
                  +{calculated.bonusCount} {calculated.bonusCount === 1 ? "RECEITA" : "RECEITAS"} de PRESENTE! 🎁
                </span>
              </span>
            ) : (
              <span className="text-gray-800">
                {calculated.nextTierMessage.replace("PRESENTE", "PRESENTE 🎁").replace("GRÁTIS", "GRÁTIS 🎁")}
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1.5">
            Preço atual por receita: <span className="text-blue-600 font-black text-sm">R$ {calculated.pricePerRecipe.toFixed(2)}</span>
          </p>
        </div>

        {/* Visual Milestones */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center text-[10px] font-black uppercase text-gray-400">
          <div className={`p-1.5 rounded-lg border ${calculated.recipeCount >= 5 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-100'}`}>
            5 Rec. = R$ 4,00
          </div>
          <div className={`p-1.5 rounded-lg border ${calculated.recipeCount >= 10 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-100'}`}>
            10 Rec. = R$ 3,00 + 1 GRÁTIS
          </div>
          <div className={`p-1.5 rounded-lg border ${calculated.recipeCount >= 20 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-100'}`}>
            20 Rec. = R$ 2,50 + 5 GRÁTIS
          </div>
        </div>
      </div>

      {/* 3. RESUMO DO CARRINHO (MEIO) */}
      <div className="mb-6">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 flex items-center gap-2">
          🛒 Meu Carrinho ({calculated.recipeCount} {calculated.recipeCount === 1 ? "receita" : "receitas"})
        </h3>

        {calculated.items.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6">
            <ShoppingBag size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-600 font-black text-base uppercase">
              Seu carrinho está vazio!
            </p>
            <p className="text-gray-400 text-xs font-bold mt-1">
              Escolha receitas fofas na nossa lista abaixo para começar! ❤️
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {calculated.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  item.isBonus
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-100"
                }`}
              >
                {item.imagem && (
                  <img
                    src={item.imagem}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                    alt=""
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-gray-800 uppercase truncate leading-tight">
                    {item.nome}
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {item.isBonus ? "🎁 PRESENTE AUTOMÁTICO" : `CÓD: ${item.id}`}
                  </span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-3">
                  <span className="font-black text-gray-900 text-sm">
                    {item.isBonus ? "GRÁTIS" : `R$ ${item.precoFinal.toFixed(2)}`}
                  </span>
                  {!item.isBonus && (
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remover item"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. BOTÃO DE CHAMADA PARA AÇÃO (BASE DO CARD) */}
      {calculated.items.length > 0 && (
        <div className="pt-4 border-t-4 border-gray-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">
                VALOR TOTAL DO PEDIDO
              </span>
              <span className="text-3xl font-black text-blue-600">
                R$ {calculated.total.toFixed(2)}
              </span>
            </div>
            <div className="text-right text-xs font-bold text-gray-500 uppercase">
              {calculated.bonusCount > 0 && (
                <span className="text-green-600 font-black block">
                  🎉 {calculated.bonusCount} PRESENTE(S) INCLUÍDO(S)!
                </span>
              )}
              Sem taxas ou juros adicionais
            </div>
          </div>

          <button
            onClick={() => {
              playHeartbeatSound();
              onCheckout();
            }}
            className="w-full bg-[#44FF00] text-[#171717] py-5 rounded-2xl font-black text-xl sm:text-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform uppercase tracking-wider flex items-center justify-center gap-3 border-b-8 border-green-600"
          >
            FINALIZAR PEDIDO <ArrowRight size={24} />
          </button>
          
          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">
            🔒 Pagamento 100% Seguro • Receba em segundos no seu WhatsApp
          </p>
        </div>
      )}
    </div>
  );
};