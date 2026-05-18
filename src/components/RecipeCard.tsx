"use client";

import { type Recipe } from "@/data/recipes";

interface RecipeCardProps {
  recipe: Recipe;
  inCart: boolean;
  onAdd: () => void;
  onReject: () => void;
}

export const RecipeCard = ({ recipe, inCart, onAdd, onReject }: RecipeCardProps) => {
  return (
    <div className="card-float p-4 fade-in relative group">
      {/* Image with rounded top only and fixed height */}
      <div className="relative rounded-t-[16px] rounded-b-0 h-180 w-full overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${recipe.id}/300/300`}
          alt={recipe.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full">
          Código: {recipe.id}
        </div>
      </div>

      {/* Recipe Name */}
      <h3 className="text-lg font-bold mb-1 mt-3" style={{ fontFamily: "'Fredoka One', cursive", color: "#2d2d2d" }}>
        {recipe.nome}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-1 line-clamp-2">{recipe.descricao}</p>

      {/* Category */}
      <p className="text-xs text-gray-400 mb-2">{recipe.categoria}</p>

      {/* Price */}
      <p className="text-2xl font-bold mb-3" style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive", textShadow: "1px 1px 0 rgba(123,200,67,0.2)" }}>
        R$ {recipe.preco.toFixed(2)}
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={onAdd}
        disabled={inCart}
        className="w-full py-2.5 rounded-12 bg-gradient-to-r from-[#7BC843] to-[#5fa832] shadow-0-4-15 rgba(123,200,67,0.35) text-white font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {inCart ? "✓ Adicionado" : "+ Adicionar ao Carrinho"}
      </button>

      {/* Reject Button */}
      {!inCart && (
        <button
          onClick={onReject}
          className="w-full mt-2 py-2 rounded-12 bg-gradient-to-r from-[#ff5252] to-[#d32f2f] text-red-600 font-semibold text-sm border border-red-200 hover:bg-red-50 transition-colors"
        >
          ✕ Rejeitar
        </button>
      )}
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/Cart.tsx" description="Enhanced floating cart with premium gradient, pulse animation, and responsive styling">
"use client";

interface CartProps {
  count: number;
  total: number;
  onCheckout: () => void;
}

export const Cart = ({ count, total, onCheckout }: CartProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center">
      <div className="bg-gradient-to-r from-[#2d2d2d] to-[#1a1a1a] rounded-2xl p-4 shadow-2xl w-full max-w-2xl text-center animate-pulse-green">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛍️</span>
          <div>
            <span className="font-bold text-lg">🛍️ {count} {count === 1 ? "item" : "itens"}</span>
            <span className="font-bold text-lg" style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}>
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={count === 0}
          className="mt-3 w-full bg-gradient-to-r from-[#7BC843] to-[#5fa832] rounded-50px py-2.5 text-lg font-bold text-white transition-all duration-200 hover:scale-105"
          style={{ boxShadow: "0 4px 20px rgba(123,200,67,0.5)" }}
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/CheckoutModal.tsx" description="Enhanced checkout modal with premium gradient header, inputs, total, Pix button, delivery badge, and dark footer">
"use client";

interface CheckoutModalProps {
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const CheckoutModal = ({ total, onClose, onConfirm }: CheckoutModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Quase lá! 🎉
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">WhatsApp</label>
              <input
                type="text"
                placeholder="55 (00) 00000-0000"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Resumo do Pedido
            </h3>
            <p className="text-gray-500 text-sm mb-2">Suas receitas serão enviadas pelo WhatsApp.</p>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-lg" style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}>
                Total: R$ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <button
              onClick={onConfirm}
              className="w-full py-3 rounded-xl font-bold text-white text-lg transition-transform active:scale-[0.98]"
              style={{ backgroundColor: "#FF6B35", fontFamily: "'Fredoka One', cursive" }}
            >
              💳 Pagar via Pix
            </button>
            <button
              className="w-full py-3 rounded-xl font-bold text-white text-base transition-transform active:scale-[0.98]"
              style={{ backgroundColor: "#4A90D9", fontFamily: "'Fredoka One', cursive" }}
            >
              💳 Pagar com Cartão
            </button>
          </div>

          <div className="bg-[#FFF8F2] rounded-xl p-3 mb-4 text-center">
            <p className="text-sm font-semibold" style={{ color: "#FF6B35" }}>
              ⚡ Entrega em 5 segundos após pagamento
            </p>
          </div>

          <div className="text-center text-sm text-gray-400 pb-2">
            📱 Suas receitas chegam no seu WhatsApp em segundos após o pagamento
          </div>
        </div>
      </div>
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/UpsellCard.tsx" description="Enhanced UpsellCard with premium gradient header, colored category badge, and enhanced styling">
"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellCardProps {
  upsell: Upsell;
  onOpen: () => void;
}

export const UpsellCard = ({ upsell, onOpen }: UpsellCardProps) => {
  return (
    <div className="card-float overflow-hidden">
      <div
        className="h-32 flex items-center justify-center text-5xl"
        style={{ background: `linear-gradient(135deg, ${upsell.cor}, #9B59B6)` }}
      >
        {upsell.emoji}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full text-gray-500">
          {upsell.nome.split(" ").slice(0, 2).join(" ")}
        </span>
        <h3 className="text-base font-bold mt-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {upsell.nome}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{upsell.descricao}</p>
        <div className="mt-3">
          <span className="text-gray-400 line-through text-sm">De R${upsell.precoOriginal.toFixed(2)}</span>
          <span
            className="ml-2 text-xl font-bold"
            style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            R${upsell.precoAtual.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onOpen}
          className="w-full mt-3 py-2.5 rounded-xl font-bold text-white text-sm transition-transform active:scale-[0.98]"
          style={{ backgroundColor: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          Quero esse produto →
        </button>
      </div>
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/UpsellModal.tsx" description="Enhanced UpsellModal with premium overlay, gradient header, discount badge, CTA buttons, and footer">
"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellModalProps {
  upsell: Upsell;
  onClose: () => void;
  onBuy: () => void;
}

export const UpsellModal = ({ upsell, onClose, onBuy }: UpsellModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-8 flex items-center justify-center p-4">
      <div className="bg-white rounded-28 shadow-3xl max-w-560 w-full max-w-2xl overflow-y-auto">
        <div className="relative">
          <div
            className="h-120 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${upsell.cor}, #9B59B6)` }}
          >
            <span className="text-5xl">{upsell.emoji}</span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white/20 rounded-full w-9 h-9 flex items-center justify-center text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h2
            className="text-2xl text-center mb-1"
            style={{ fontFamily: "'Fredoka One', cursive", color: upsell.cor }}
          >
            {upsell.nome}
          </h2>

          <div className="space-y-3 mb-4">
            {upsell.copiaVendas.map((texto, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">
                {texto}
              </p>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h4 className="font-bold mb-2">Benefícios:</h4>
            <ul className="space-y-1">
              {upsell.beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span>✅</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mb-4">
            <span className="text-gray-400 line-through text-lg">
              R${upsell.precoOriginal.toFixed(2)}
            </span>
            <div className="inline-block bg-gradient-to-r from-[#ff5252] to-[#d32f2f] rounded-full font-bold px-6 py-2 text-xs shadow-0-4-15 rgba(255,82,82,0.4) mt-2">
              🔥 {Math.round(((upsell.precoOriginal - upsell.precoAtual) / upsell.precoOriginal) * 100)}% DE DESCONTO
            </div>
            <p
              className="text-3xl font-bold mt-2"
              style={{
                color: "#7BC843",
                fontFamily: "'Fredoka One', cursive",
                textShadow: "2px 2px 0 rgba(123,200,67,0.2)",
              }}
            >
              R${upsell.precoAtual.toFixed(2)}
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mb-3">
            Pagamento unico • Sem mensalidade • Acesso imediato
          </p>

          <div className="bg-[#FFF0E0] rounded-xl p-2 text-center mb-4">
            <p className="text-sm font-bold" style={{ color: "#FF6B35" }}>
              ⚠️ Oferta por tempo limitado
            </p>
          </div>

          <button
            onClick={onBuy}
            className="w-full py-3 rounded-xl font-bold text-white text-lg transition-transform active:scale-[0.98] mb-3"
            style={{ backgroundColor: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            💳 QUERO AGORA — R${upsell.precoAtual.toFixed(2)}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-transform active:scale-[0.98]"
            style={{ backgroundColor: "#FF6B35", fontFamily: "'Fredoka One', cursive" }}
          >
            JA COMPREI — INSERIR CÓDIGO DE ACESSO
          </button>

          <div className="text-center text-xs text-gray-400 mt-4 pb-2">
            ✅ Garantia de 7 dias — Não gostou? Devolvemos 100%. Sem perguntas.
          </div>
        </div>
      </div>
    </div>
  );
};
＜/dyad-write>

<dyad-write path="src/components/GamificationBar.tsx" description="Enhanced gamification bar with colored border, gradient background, pill levels, animated progress bar and shimmer effect">
"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { name: "Bronze", emoji: "🥉", recipes: 3, price: 3.0, color: "#CD7F32" },
    { name: "Prata", emoji: "🥈", recipes: 6, price: 2.0, color: "#A8A9AD" },
    { name: "Ouro", emoji: "🥇", recipes: 9, price: 1.0, color: "#FFD700" },
    { name: "Super Presente", emoji: "🎁", recipes: 10, price: 0, color: "#FF3D9A" },
  ];

  const nextLevel =
    cartCount < 3
      ? 0
      : cartCount < 6
      ? 1
      : cartCount < 9
      ? 2
      : cartCount < 10
      ? 3
      : -1;

  const progress =
    nextLevel === -1
      ? 100
      : (cartCount / levels[nextLevel].recipes) * 100;

  return (
    <div className="card-float p-6 my-6 max-w-lg mx-auto relative border-3 border-[#FF6B35] bg-gradient-to-b from-[#ffffff] to-[#FFF5EE] backdrop-filter-blur-2">
      <h2
        className="text-xl sm:text-2xl text-center mb-4"
        style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}
      >
        🎁 Super Mimo AmiguMundo
      </h2>

      <div className="space-y-2 mb-4">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-lg">{level.emoji}</span>
            <span
              className="px-4 py-1 rounded-full text-white font-bold"
              style={{ backgroundColor: level.color }}
            >
              {level.name}: {level.recipes} receitas
            </span>
            {level.price > 0 ? (
              <span className="text-gray-500">
                → ganhe 3 por R$ {level.price.toFixed(2)} cada
              </span>
            ) : (
              <span className="text-gray-500">→ 3 receitas GRÁTIS!</span>
            )}
          </div>
        ))}
      </div>

      <div className="relative h-12 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] via-[#F5A623] to-[#7BC843] transition-all duration-600"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>

      <p className="text-center text-sm mt-2 text-gray-600">
        Faltam{" "}
        {nextLevel === -1 ? 0 : levels[nextLevel].recipes - cartCount} receitas
        para o próximo nível
      </p>
    </div>
  );
};
＜/dyad-write>

<dyad-write path="src/components/CodeInput.tsx" description="Enhanced code input with thicker border, focus glow, and animated button">
"use client";

import { useState } from "react";
import { recipes, type Recipe } from "@/data/recipes";

interface CodeInputProps {
  onRecipeFound: (recipe: Recipe) => void;
  onRecipeNotFound: () => void;
}

export const CodeInput = ({ onRecipeFound, onRecipeNotFound }: CodeInputProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const recipe = recipes.find((r) => r.id === code.trim());
      if (recipe) {
        onRecipeFound(recipe);
      } else {
        onRecipeNotFound();
      }
      setLoading(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="max-w-[480px] mx-auto my-6 code-input">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o código da receita (ex: 3872)"
          className="flex-1 px-5 py-4 border-2.5 border-[#e0e0e0] rounded-16 text-lg focus:outline-none focus:border-[#FF6B35] focus:ring-0 focus:shadow-[0_0_0_4px_rgba(255,107,53,0.15)] transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !code.trim()}
          className="px-7 py-4 rounded-14 font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:translate-y-[-2px] shadow-[0_4px_15px_rgba(123,200,67,0.4)]"
          style={{
            background:
              "linear-gradient(135deg, #7BC843, #5fa832)",
            fontFamily: "'Fredoka One', cursive",
          }}
        >
          {loading ? "Buscando..." : "Buscar Receita →"}
        </button>
      </div>
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/CategoryCard.tsx" description="Enhanced category card with gradient overlay, hover zoom, text shadow and lupa icon">
"use client";

import { useState } from "react";

interface CategoryCardProps {
  nome: string;
}

export const CategoryCard = ({ nome }: CategoryCardProps) => {
  const [hover, setHover] = useState(false);
  return (
    <div className="card-float overflow-hidden relative h-160 sm:h-180 rounded-lg shadow-lg bg-white cursor-pointer">
      <img
        src={`https://picsum.photos/seed/${nome
          .toLowerCase()
          .replace(/ /g, "-")}/400/300`}
        alt={nome}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          hover ? "scale-108" : ""
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/85 to-transparent transition-opacity duration-300 ${
          hover ? "opacity-70" : "opacity-0"
        }`}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3
          className="text-white text-base font-bold"
          style={{
            fontFamily: "'Fredoka One', cursive",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {nome}
        </h3>
      </div>
      {hover && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30">
          <span className="text-2xl font-bold text-gray-800">🔍</span>
        </div>
      )}
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/PackCard.tsx" description="Enhanced pack card with responsive 2‑column layout, gradient badges and hover effect">
"use client";

import { type Pack } from "@/data/packs";

interface PackCardProps {
  pack: Pack;
  inCart: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export const PackCard = ({ pack, inCart, onAdd, onRemove }: PackCardProps) => {
  return (
    <div className="card-float overflow-hidden">
      <div className="relative h-48 rounded-t-[12px] rounded-b-0">
        <img
          src={`https://picsum.photos/seed/${pack.nome
            .toLowerCase()
            .replace(/ /g, "-")}/400/300`}
          alt={pack.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/85 to-transparent" />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-4 px-2 py-1 rounded-full flex items-center gap-1 text-white text-xs">
          <span>{pack.emoji}</span>
          <span>{pack.receitas} receitas</span>
        </div>
        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#FF6B35] to-[#FF3D9A] px-2 py-1 rounded-full text-white text-xs font-semibold">
          {pack.emoji}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {pack.nome}
        </h3>
        <p className="text-gray-500 text-sm">{pack.descricao}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 line-through text-sm">
            De R${pack.precoOriginal.toFixed(2)}
          </span>
          <span
            className="text-xl font-bold"
            style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            R${pack.precoAtual.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onAdd}
          disabled={inCart}
          className="w-full py-2.5 rounded-12 bg-gradient-to-r from-[#7BC843] to-[#5fa832] text-white font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {inCart ? "✓ No carrinho" : "+ Adicionar ao Carrinho"}
        </button>
        {inCart && (
          <button
            onClick={onRemove}
            className="w-full mt-2 py-2 rounded-10 bg-red-500 text-red-600 text-sm border border-red-200 hover:bg-red-50 transition-colors"
          >
            ✕ Remover do Carrinho
          </button>
        )}
      </div>
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/ComboCard.tsx" description="Enhanced combo card with circular badge, colored pill, and responsive layout">
"use client";

import { type Combo } from "@/data/packs";

interface ComboCardProps {
  combo: Combo;
  inCart: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export const ComboCard = ({ combo, inCart, onAdd, onRemove }: ComboCardProps) => {
  return (
    <div className="card-float p-5 flex flex-col sm:flex-row gap-4 relative">
      <div className="absolute top-2 right-3 bg-white/90 text-xs font-bold px-3 py-1 rounded-full" style={{ color: combo.cor }}>
        {combo.badge}
      </div>

      <div className="flex-shrink-0 flex flex-col items-center">
        <div
          className="h-32 w-32 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${combo.cor}, #9B59B6)`,
          }}
        >
          <span
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            {combo.receitas}
          </span>
        </div>
        <span className="text-sm text-gray-500 mt-1">receitas</span>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {combo.nome}
        </h3>
        <p className="text-gray-500 text-sm mt-1">{combo.descricao}</p>
        <p
          className="text-2xl font-bold mt-2"
          style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          R${combo.preco.toFixed(2)}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={onAdd}
            disabled={inCart}
            className="flex-1 px-5 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-transform active:scale-[0.98]"
            style={{ backgroundColor: inCart ? "#ccc" : "#7BC843", fontFamily: "'Fredoka One', cursive" }}
          >
            {inCart ? "✓ Adicionado" : "+ Adicionar"}
          </button>
          {inCart && (
            <button
              onClick={onRemove}
              className="px-4 py-2.5 rounded-xl font-semibold text-red-500 text-sm border border-red-200 hover:bg-red-50 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/SectionDivider.tsx" description="Reusable decorative divider between store sections">
"use client";

export const SectionDivider = () => (
  <div className="my-12">
    <div className="h-2 bg-gradient-to-r from-transparent via-[#FF6B35] via-[#FF3D9A] via-[#9B59B6] to-transparent rounded-2px" />
  </div>
);
＜/dyad-write>

＜dyad-write path="src/components/SectionTitle.tsx" description="Reusable section title with decorative underline">
"use client";

interface SectionTitleProps {
  children: React.ReactNode;
  color: string;
}

export const SectionTitle = ({ children, color }: SectionTitleProps) => (
  <div className="text-center mb-8">
    <h2
      className="text-2xl font-bold"
      style={{ fontFamily: "'Fredoka One', cursive", color }}
    >
      {children}
    </h2>
    <div
      className="mx-auto mt-2 w-16 h-4 rounded"
      style={{ backgroundColor: color }}
    />
  </div>
);
＜/dyad-write>

＜dyad-write path="src/pages/Index.tsx" description="Use new SectionTitle, SectionDivider and apply responsive paddings">
"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { GamificationBar } from "@/components/GamificationBar";
import { CodeInput } from "@/components/CodeInput";
import { RecipeCard } from "@/components/RecipeCard";
import { Cart } from "@/components/Cart";
import { CheckoutModal } from "@/components/CheckoutModal";
import { UpsellCard } from "@/components/UpsellCard";
import { UpsellModal } from "@/components/UpsellModal";
import { CategoryCard } from "@/components/CategoryCard";
import { PackCard } from "@/components/PackCard";
import { ComboCard } from "@/components/ComboCard";
import { ErrorToast } from "@/components/ErrorToast";
import { SectionTitle } from "@/components/SectionTitle";
import { SectionDivider } from "@/components/SectionDivider";
import { recipes, type Recipe } from "@/data/recipes";
import { upsells } from "@/data/upsells";
import { categories } from "@/data/categories";
import { packs, combos } from "@/data/packs";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  tipo: "recipe" | "pack" | "combo" | "upsell";
}

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showRecipe, setShowRecipe] = useState<Recipe | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeUpsell, setActiveUpsell] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [foundRecipes, setFoundRecipes] = useState<Recipe[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    if (showRecipe) setShowRecipe(null);
  };
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const total = cart.reduce((sum, i) => sum + i.preco, 0);
  const isInCart = (id: string) => cart.some((i) => i.id === id);

  const handleRecipeFound = (r: Recipe) => {
    setError(null);
    setShowRecipe(r);
  };
  const handleRecipeNotFound = () => {
    setError("Código não encontrado. Verifique o número e tente novamente.");
    setTimeout(() => setError(null), 3000);
  };
  const handleRecipeAdd = (r: Recipe) => {
    addToCart({ id: r.id, nome: r.nome, preco: r.preco, tipo: "recipe" });
    setFoundRecipes((prev) => (prev.find((x) => x.id === r.id) ? prev : [...prev, r]));
  };
  const handlePackAdd = (id: string) => {
    const p = packs.find((p) => p.id === id);
    if (p) addToCart({ id: p.id, nome: p.nome, preco: p.precoAtual, tipo: "pack" });
  };
  const handlePackRemove = (id: string) => removeFromCart(id);
  const handleComboAdd = (id: string) => {
    const c = combos.find((c) => c.id === id);
    if (c) addToCart({ id: c.id, nome: c.nome, preco: c.preco, tipo: "combo" });
  };
  const handleComboRemove = (id: string) => removeFromCart(id);
  const handleUpsellBuy = () => {
    if (activeUpsell) {
      const u = upsells.find((u) => u.id === activeUpsell);
      if (u) addToCart({ id: u.id, nome: u.nome, preco: u.precoAtual, tipo: "upsell" });
      setActiveUpsell(null);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <Header />
      <section className="max-w-6xl mx-auto">
        {/* Banner */}
        <div className="banner flex flex-col items-center justify-center text-center">
          <span className="absolute left-4 top-4 text-5xl opacity-60">🧶</span>
          <span className="absolute right-4 bottom-4 text-5xl opacity-60">✂️</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Fredoka One', cursive", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
            🧶 Suas receitas de amigurumi, na hora, no seu WhatsApp!
          </h1>
          <p className="text-white/80 max-w-lg">
            Digite o código da receita que você viu no grupo e adicione ao carrinho
          </p>
        </div>

        {/* Gamification */}
        <GamificationBar cartCount={cart.length} />

        {/* Code Input */}
        <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} />

        {/* Error Toast */}
        {error && <ErrorToast message={error} onClose={() => setError(null)} />}

        {/* Recipe Modal */}
        {showRecipe && (
          <div className="modal-overlay" onClick={() => setShowRecipe(null)}>
            <div className="modal-content p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <RecipeCard
                recipe={showRecipe}
                inCart={isInCart(showRecipe.id)}
                onAdd={() => handleRecipeAdd(showRecipe)}
                onReject={() => setShowRecipe(null)}
              />
            </div>
          </div>
        )}

        {/* Added Recipes */}
        {foundRecipes.length > 0 && (
          <div className="mt-8">
            <SectionTitle color="#FF6B35">Receitas Adicionadas</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {foundRecipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  inCart={isInCart(r.id)}
                  onAdd={() => handleRecipeAdd(r)}
                  onReject={() => setShowRecipe(null)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Store Header */}
      <section className="max-w-6xl mx-auto mt-12">
        <SectionTitle color="#FF3D9A">🏪 Loja AmiguMundo</SectionTitle>
        <div className="gradient-store rounded-3xl p-10 text-center text-white mb-6">
          <p className="text-white/80">Explore nossa coleção completa de receitas e produtos</p>
        </div>
      </section>

      {/* Store Sections */}
      <section className="max-w-6xl mx-auto">
        {/* Upsells */}
        <SectionTitle color="#9B59B6">⭐ Produtos que Vão Transformar sua Arte</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upsells.map((u) => (
            <UpsellCard key={u.id} upsell={u} onOpen={() => setActiveUpsell(u.id)} />
          ))}
        </div>
        {activeUpsell && (
          <UpsellModal
            upsell={upsells.find((u) => u.id === activeUpsell)!}
            onClose={() => setActiveUpsell(null)}
            onBuy={handleUpsellBuy}
          />
        )}
        <SectionDivider />

        {/* Categories */}
        <SectionTitle color="#7BC843">🧶 Categorias de Receitas</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c} nome={c} />
          ))}
        </div>
        <SectionDivider />

        {/* Packs */}
        <SectionTitle color="#FF6B35">📦 Packs Temáticos</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packs.map((p) => (
            <PackCard
              key={p.id}
              pack={p}
              inCart={isInCart(p.id)}
              onAdd={() => handlePackAdd(p.id)}
              onRemove={() => handlePackRemove(p.id)}
            />
          ))}
        </div>
        <SectionDivider />

        {/* Combos */}
        <SectionTitle color="#F5A623">👑 Combos Elite — Volume com Desconto</SectionTitle>
        <div className="space-y-4">
          {combos.map((c) => (
            <ComboCard
              key={c.id}
              combo={c}
              inCart={isInCart(c.id)}
              onAdd={() => handleComboAdd(c.id)}
              onRemove={() => handleComboRemove(c.id)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-sm text-gray-400">© 2024 AmiguMundo Artes — Todos os direitos reservados</p>
        <p className="text-xs text-gray-300 mt-1">Feito com ❤️ para artesãs brasileiras</p>
      </footer>

      {/* Floating Cart */}
      <Cart count={cart.length} total={total} onCheckout={() => setShowCheckout(true)} />

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal total={total} onClose={() => setShowCheckout(false)} onConfirm={() => { setShowCheckout(false); setCart([]); }} />
      )}
    </div>
  );
}