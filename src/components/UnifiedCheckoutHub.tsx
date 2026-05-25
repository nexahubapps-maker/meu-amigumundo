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

  const count = calculated.recipeCount;

  // 5 Tiers of progressive discounts
  const tiers = [
    {
      id: 1,
      emoji: "💡",
      active: count >= 1 && count <= 4,
      border: "border-l-4 border-l-green-500",
      activeBg: "bg-green-50/80 border-green-300 ring-2 ring-green-400",
      pillBg: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      emoji: "🏷️",
      active: count >= 5 && count <= 9,
      border: "border-l-4 border-l-green-500",
      activeBg: "bg-green-50/80 border-green-300 ring-2 ring-green-400",
      pillBg: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      emoji: "🏷️",
      active: count >= 10 && count <= 14,
      border: "border-l-4 border-l-green-500",
      activeBg: "bg-green-50/80 border-green-300 ring-2 ring-green-400",
      pillBg: "bg-green-100 text-green-800"
    },
    {
      id: 4,
      emoji: "🏷️",
      active: count >= 15 && count <= 19,
      border: "border-l-4 border-l-green-500",
      activeBg: "bg-green-50/80 border-green-300 ring-2 ring-green-400",
      pillBg: "bg-green-100 text-green-800"
    },
    {
      id: 5,
      emoji: "🏷️",
      active: count >= 20,
      border: "border-l-4 border-l-yellow-500",
      activeBg: "bg-yellow-50/80 border-yellow-300 ring-2 ring-yellow-400",
      pillBg: "bg-yellow-100 text-yellow-800"
    }
  ];

  return (
    <div className="max-w-md mx-auto my-4 bg-white rounded-xl p-4 shadow-md border-2 border-[#44FF00] text-left">
      
      {/* 1. CAIXA DE CÓDIGO (TOPO DO CARD) */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
        <div className="text-center mb-3">
          <p className="text-sm font-extrabold text-gray-900 leading-tight">
            Se apaixonou por alguma receita do grupo?
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Digite abaixo o código da receita e adicione ao carrinho.
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
            className="w-full h-11 px-3 border-2 border-gray-300 rounded-lg text-base font-bold text-center focus:outline-none focus:border-[#44FF00] transition-all placeholder:text-gray-300 uppercase text-gray-800"
          />
        </div>

        <div className="text-center mt-3 leading-tight">
          <p className="text-xs font-bold text-[#22c55e] flex items-center justify-center gap-1">
            🔒 Pagamento 100% Seguro
          </p>
          <p className="text-[10px] font-bold text-[#22c55e] mt-0.5">
            Receba em segundos no seu WhatsApp
          </p>
        </div>

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

      {/* 2. SEÇÃO DE DESCONTOS PROGRESSIVOS */}
      <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="mb-4 text-center">
          <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-snug">
            Quanto mais receitas você adicionar ao carrinho, mais baratas elas ficam
          </p>
        </div>

        {/* Cards de Faixas de Desconto */}
        <div className="space-y-2.5">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-sm transition-all ${tier.border} ${
                tier.active ? `${tier.activeBg} scale-[1.02]` : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">{tier.emoji}</span>
                <p className="text-xs text-gray-800 font-bold leading-tight">
                  {tier.id === 1 && <>Todas as receitas do AmiguMundo por <span className="text-green-600 font-black">R$ 5,00</span> cada</>}
                  {tier.id === 2 && <>De 5 a 9 receitas: <span className="text-green-600 font-black">R$ 4,00</span> cada</>}
                  {tier.id === 3 && <>De 10 a 14 receitas: <span className="text-green-600 font-black">R$ 3,00</span> cada + <span className="text-green-600 font-black">RECEITA GRÁTIS</span> 🎁</>}
                  {tier.id === 4 && <>Acima de 15 receitas: <span className="text-green-600 font-black">R$ 2,50</span> cada + <span className="text-green-600 font-black">2 RECEITAS GRÁTIS</span> 🎁</>}
                  {tier.id === 5 && <>Atingiu 20 receitas: <span className="text-green-600 font-black">+ 5 RECEITAS GRÁTIS</span> 🎁</>}
                </p>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${tier.pillBg}`}>
                {tier.id === 1 && "R$ 5,00"}
                {tier.id === 2 && "R$ 4,00"}
                {tier.id === 3 && "R$ 3,00 + Grátis"}
                {tier.id === 4 && "R$ 2,50 + 2 Grátis"}
                {tier.id === 5 && "+ 5 Grátis"}
              </div>
            </div>
          ))}
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