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

  // Split items into regular and bonus items for separate display
  const regularItems = calculated.items.filter(item => !item.isBonus);
  const bonusItems = calculated.items.filter(item => item.isBonus);

  // Define the table rows with active state logic matching the pricing tiers
  const tableRows = [
    {
      range: "Todas as receitas AmiguMundo",
      price: "R$ 5,00 cada",
      bonus: "—",
      isBonusActive: false,
      isActive: count <= 4,
      isBasePrice: true
    },
    {
      range: "Com 5 a 9 receitas no carrinho",
      price: "R$ 4,00 cada",
      bonus: "—",
      isBonusActive: false,
      isActive: count >= 5 && count <= 9,
      isBasePrice: false
    },
    {
      range: "Com 10 a 14 receitas no carrinho",
      price: "R$ 3,00 cada",
      bonus: "+1 GRÁTIS",
      isBonusActive: true,
      isActive: count >= 10 && count <= 14,
      isBasePrice: false
    },
    {
      range: "Acima de 15 receitas no carrinho",
      price: "R$ 2,50 cada",
      bonus: "+2 GRÁTIS",
      isBonusActive: true,
      isActive: count >= 15 && count <= 19,
      isBasePrice: false
    },
    {
      range: "Com 20 ou mais receitas no carrinho",
      price: "R$ 2,50 cada",
      bonus: "+5 GRÁTIS",
      isBonusActive: true,
      isActive: count >= 20,
      isBasePrice: false
    }
  ];

  return (
    <div id="cart-section" className="max-w-xl mx-auto my-2 bg-white rounded-xl p-3 shadow-md border-2 border-[#44FF00] text-left w-full">
      
      {/* 1. CAIXA DE CÓDIGO (TOPO DO CARD) */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
        <div className="text-center mb-2">
          <p className="text-sm font-extrabold text-gray-900 leading-tight">
            Se apaixonou por alguma<br />receita do grupo?
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Digite abaixo o código da receita <br /> e adicione ao carrinho.
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

      {/* 2. SEÇÃO DE DESCONTOS PROGRESSIVOS (TABELA MINIMALISTA) */}
      <div className="mb-3">
        {/* Mini Card Verde de Preços Acessíveis */}
        <div className="mb-2 flex justify-center">
          <div className="bg-[#44FF00] text-[#171717] px-3 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm text-center">
            Preços acessíveis para todas as Crocheteiras
          </div>
        </div>

        <div className="mb-2 text-center">
          <p className="text-xs sm:text-sm text-gray-700 font-black leading-snug">
            Quanto mais receitas você adicionar ao carrinho, mais baratas elas ficam
          </p>
        </div>

        {/* Tabela de Descontos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <tbody>
              {tableRows.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-[#f0f0f0] last:border-0 transition-colors ${
                    row.isActive 
                      ? "bg-[#f0fdf4] border-l-4 border-l-[#22c55e]" 
                      : row.isBasePrice 
                        ? "bg-gray-50/50" 
                        : "bg-white"
                  }`}
                >
                  <td className={`py-1.5 px-2.5 text-xs font-medium text-[#333333] ${row.isBasePrice ? "font-bold text-gray-900" : ""}`}>
                    {row.range}
                  </td>
                  <td className={`py-1.5 px-2.5 text-xs font-bold text-[#333333] text-center ${row.isBasePrice ? "text-sm" : ""}`}>
                    {row.price}
                  </td>
                  <td className="py-1.5 px-2.5 text-xs text-center">
                    {row.isBonusActive ? (
                      <span className="text-[#22c55e] font-bold">{row.bonus}</span>
                    ) : (
                      <span className="text-gray-300 font-medium">{row.bonus}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. RESUMO DO CARRINHO */}
      <div className="mb-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight mb-1.5 flex items-center gap-1.5">
          🛒 Meu Carrinho ({regularItems.length} {regularItems.length === 1 ? "receita" : "receitas"})
        </h3>

        {regularItems.length === 0 ? (
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
          <div className="space-y-1.5 h-auto overflow-visible pr-1">
            {regularItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-lg border transition-all bg-white border-gray-100"
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
                    CÓD: {item.id}
                  </span>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-xs">
                    R$ {item.precoFinal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remover item"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3.1 SEÇÃO DE BÔNUS CONQUISTADOS */}
      {bonusItems.length > 0 && (
        <div className="mb-3 p-3 bg-[#f0fdf4] border border-[#22c55e] rounded-xl space-y-2">
          <h4 className="text-xs font-black text-[#16a34a] uppercase tracking-wider flex items-center gap-1.5">
            🎁 Seus Bônus Conquistados
          </h4>
          <div className="space-y-1.5">
            {bonusItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-white border border-green-100"
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
                    PRESENTE AUTOMÁTICO
                  </span>
                </div>
                <div className="shrink-0">
                  <span className="text-xs font-black text-[#22c55e] uppercase tracking-wider">
                    GRÁTIS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BOTÃO DE CHAMADA PARA AÇÃO */}
      {calculated.items.length > 0 && (
        <div className="pt-2.5 border-t border-gray-100">
          <div className="flex flex-col items-end mb-2.5 w-full">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
              VALOR TOTAL DO PEDIDO
            </span>
            <span className="text-lg font-bold text-blue-600">
              R$ {calculated.total.toFixed(2)}
            </span>
            {calculated.bonusCount > 0 && (
              <span className="text-green-600 font-bold text-[9px] uppercase mt-1">
                🎉 {calculated.bonusCount} PRESENTE(S) INCLUÍDO(S)!
              </span>
            )}
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