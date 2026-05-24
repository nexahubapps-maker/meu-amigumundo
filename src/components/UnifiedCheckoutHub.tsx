"use client";

import React, { useState } from "react";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
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
    <div className="max-w-md mx-auto my-4 bg-white rounded-xl p-4 shadow-md border-2 border-[#44FF00] text-left">
      
      {/* 1. CAIXA DE CÓDIGO (TOPO DO CARD) */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
        <label className="block text-center text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
          🔍 Encontrou um código no WhatsApp?
        </label>
        <div className="relative max-w-[200px] mx-auto">
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={code}
            onChange={handleCodeChange}
            maxLength={4}
            placeholder="DIGITE O CÓDIGO"
            className="w-full h-10 px-3 border-2 border-gray-300 rounded-lg text-base font-bold text-center focus:outline-none focus:border-[#44FF00] transition-all placeholder:text-gray-300 uppercase text-gray-800"
          />
        </div>
        <p className="text-center text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
          Busca automática ao digitar 4 números
        </p>

        {/* Search Error Feedback */}
        {searchError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-600 font-bold text-xs uppercase">
              ❌ Código não encontrado. Verifique e tente novamente!
            </p>
          </div>
        )}

        {/* Found Recipe Mini-Card */}
        {foundRecipe && (
          <div className="mt-3 p-2.5 bg-green-50 border-2 border-[#44FF00] rounded-lg flex items-center gap-3 animate-in zoom-in-95 duration-200">
            <img
              src={foundRecipe.url_foto}
              alt={foundRecipe.nome}
              className="w-12 h-12 rounded-md object-cover border border-white shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-black bg-black text-white px-1.5 py-0.5 rounded uppercase">
                CÓD: {foundRecipe.id}
              </span>
              <h4 className="text-xs font-bold text-gray-900 uppercase truncate mt-0.5">
                {foundRecipe.nome}
              </h4>
              <p className="text-[10px] text-gray-500 font-bold">
                R$ {foundRecipe.preco.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={handleAddFoundRecipe}
                className="bg-[#44FF00] text-[#171717] px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
              >
                Adicionar
              </button>
              <button
                onClick={() => {
                  setFoundRecipe(null);
                  setCode("");
                }}
                className="bg-gray-200 text-gray-600 p-1.5 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. RÉGUA DE PROGRESSO GAMIFICADA */}
      <div className="mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
          🏆 Descontos Progressivos e Presentes
        </h3>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden border border-gray-300 mb-2 relative">
          <div
            className="bg-gradient-to-r from-[#44FF00] to-green-500 h-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-800 uppercase">
            {calculated.recipeCount} {calculated.recipeCount === 1 ? "Receita" : "Receitas"} no Carrinho
          </span>
        </div>

        {/* Dynamic High-Contrast Message */}
        <div className="text-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm mb-3">
          <p className="text-xs font-bold text-gray-900 leading-tight">
            {calculated.recipeCount >= 10 ? (
              <span>
                Parabéns! Você ganhou{" "}
                <span className="text-green-600 font-bold uppercase">
                  +{calculated.bonusCount} {calculated.bonusCount === 1 ? "RECEITA" : "RECEITAS"} de PRESENTE! 🎁
                </span>
              </span>
            ) : (
              <span className="text-gray-800">
                {calculated.nextTierMessage.replace("PRESENTE", "PRESENTE 🎁").replace("GRÁTIS", "GRÁTIS 🎁")}
              </span>
            )}
          </p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
            Preço atual por receita: <span className="text-blue-600 font-bold">R$ {calculated.pricePerRecipe.toFixed(2)}</span>
          </p>
        </div>

        {/* LISTA VERTICAL MINIMALISTA DE PROMOÇÕES */}
        <div className="flex flex-col text-[13px] text-gray-700 leading-tight">
          <div className="py-1.5 border-b border-gray-200">
            💡 <strong>Todas as receitas</strong> do AmiguMundo por <strong>R$ 5,00</strong> cada!
          </div>
          <div className="py-1.5 border-b border-gray-200">
            🏷️ De <strong>5 a 9 receitas</strong>: <strong>R$ 4,00</strong> cada
          </div>
          <div className="py-1.5 border-b border-gray-200">
            🏷️ De <strong>10 a 14 receitas</strong>: <strong>R$ 3,00</strong> cada + <strong className="text-green-600">RECEITA GRÁTIS 🎁</strong>
          </div>
          <div className="py-1.5 border-b border-gray-200">
            🏷️ Acima de <strong>15 receitas</strong>: <strong>R$ 2,50</strong> cada + <strong className="text-green-600">2 RECEITAS GRÁTIS 🎁</strong>
          </div>
          <div className="py-1.5">
            🏷️ Atingiu <strong>20 receitas</strong>: <strong className="text-green-600">+ 5 RECEITAS GRÁTIS 🎁</strong>
          </div>
        </div>
      </div>

      {/* 3. RESUMO DO CARRINHO */}
      <div className="mb-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight mb-1.5 flex items-center gap-1.5">
          🛒 Meu Carrinho ({calculated.recipeCount} {calculated.recipeCount === 1 ? "receita" : "receitas"})
        </h3>

        {calculated.items.length === 0 ? (
          <div className="py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 p-3">
            <ShoppingBag size={24} className="mx-auto text-gray-300 mb-1" />
            <p className="text-gray-600 font-bold text-xs uppercase">
              Seu carrinho está vazio!
            </p>
            <p className="text-gray-400 text-[10px] font-bold mt-0.5">
              Escolha receitas fofas na nossa lista abaixo para começar! ❤️
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
            {calculated.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                  item.isBonus
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-100"
                }`}
              >
                {item.imagem && (
                  <img
                    src={item.imagem}
                    className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0"
                    alt=""
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 uppercase truncate leading-tight">
                    {item.nome}
                  </h4>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    {item.isBonus ? "🎁 PRESENTE AUTOMÁTICO" : `CÓD: ${item.id}`}
                  </span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-xs">
                    {item.isBonus ? "GRÁTIS" : `R$ ${item.precoFinal.toFixed(2)}`}
                  </span>
                  {!item.isBonus && (
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remover item"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. BOTÃO DE CHAMADA PARA AÇÃO */}
      {calculated.items.length > 0 && (
        <div className="pt-2.5 border-t border-gray-100">
          <div className="flex justify-between items-end mb-2.5">
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                VALOR TOTAL DO PEDIDO
              </span>
              <span className="text-lg font-bold text-blue-600">
                R$ {calculated.total.toFixed(2)}
              </span>
            </div>
            <div className="text-right text-[9px] font-bold text-gray-500 uppercase">
              {calculated.bonusCount > 0 && (
                <span className="text-green-600 font-bold block">
                  🎉 {calculated.bonusCount} PRESENTE(S) INCLUÍDO(S)!
                </span>
              )}
              Sem taxas adicionais
            </div>
          </div>

          <button
            onClick={() => {
              playHeartbeatSound();
              onCheckout();
            }}
            className="w-full bg-[#44FF00] text-[#171717] py-3 rounded-xl font-bold text-sm shadow-sm hover:scale-[1.01] active:scale-95 transition-transform uppercase tracking-wider flex items-center justify-center gap-2 border-b-4 border-green-600"
          >
            FINALIZAR PEDIDO <ArrowRight size={16} />
          </button>
          
          <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-2">
            🔒 Pagamento 100% Seguro • Receba em segundos no seu WhatsApp
          </p>
        </div>
      )}
    </div>
  );
};