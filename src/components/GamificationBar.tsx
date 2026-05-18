"use client";

interface GamificationBarProps {
  cartCount: number;
}

export const GamificationBar = ({ cartCount }: GamificationBarProps) => {
  const levels = [
    { name: "Bronze", emoji: "🥉", recipes: 3, price: 3.00, color: "#CD7F32" },
    { name: "Prata", emoji: "🥈", recipes: 6, price: 2.00, color: "#A8A9AD" },
    { name: "Ouro", emoji: "🥇", recipes: 9, price: 1.00, color: "#FFD700" },
    { name: "Super Presente", emoji: "🎁", recipes: 10, price: 0, color: "#FF3D9A" },
  ];

  const nextLevel = cartCount < 3 ? 0 : cartCount < 6 ? 1 : cartCount < 9 ? 2 : cartCount < 10 ? 3 : -1;
  const progress = nextLevel === -1 ? 100 : (cartCount / levels[nextLevel].recipes) * 100;

  return (
    <div className="card-float p-6 my-6 max-w-lg mx-auto relative">
      <h2 className="text-xl sm:text-2xl text-center mb-4" style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}>
        🎁 Super Mimo AmiguMundo
      </h2>
      <div className="space-y-2 mb-4">
        {levels.map((level, i) => (
          <div key={i} className="flex items-center gap-2 text-sm sm:text-base">
            <span className="text-lg">{level.emoji}</span>
            <span className="level-pill" style={{ backgroundColor: level.color, color: "white" }}>
              {level.name}: {level.recipes} receitas
            </span>
            {level.price > 0 ? (
              <span className="text-gray-500">→ ganhe 3 por R$ {level.price.toFixed(2)} cada</span>
            ) : (
              <span className="text-gray-500">→ 3 receitas GRATIS!</span>
            )}
          </div>
        ))}
      </div>
      <div className="relative h-12 rounded-full overflow-hidden">
        <div
          className="gradient-progress h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-center text-sm mt-2 text-gray-600">
        Faltam {nextLevel === -1 ? 0 : levels[nextLevel].recipes - cartCount} receitas para o proximo nivel
      </p>
    </div>
  );
};
＜/dyad-write>

<dyad-write path="src/components/CodeInput.tsx" description="Updated CodeInput with premium styling, focus glow, and button hover effects">
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
    <div className="max-w-[480px] mx-auto my-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite o codigo da receita (ex: 3872)"
          className="flex-1 px-5 py-3 border-2.5 border-[#e0e0e0] rounded-2xl text-lg focus:outline-none focus:border-[#FF6B35] focus:ring-0 transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !code.trim()}
          className="px-6 py-3 rounded-2xl font-bold text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
          style={{ backgroundColor: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          {loading ? "Buscando..." : "Buscar Receita →"}
        </button>
      </div>
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/Cart.tsx" description="Updated Cart with premium styling, pulse animation, and gradient background">
"use client";

interface CartProps {
  count: number;
  total: number;
  onCheckout: () => void;
}

export const Cart = ({ count, total, onCheckout }: CartProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#2d2d2d] to-[#1a1a1a] border-radius-20px 20px 0 0 px-4 py-4 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛍️</span>
          <div>
            <span className="font-bold text-lg">{count} {count === 1 ? "item" : "itens"}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="font-bold text-lg" style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}>
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={count === 0}
          className="px-6 py-2.5 rounded-xl font-bold text-white text-base disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
          style={{ backgroundColor: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
        >
          Finalizar →
        </button>
      </div>
    </div>
  );
};
＜/dyad-write>

＜dyad-write path="src/components/CheckoutModal.tsx" description="Updated CheckoutModal with premium styling, gradient header, and button effects">
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
            <h2 className="text-2xl" style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}>
              Quase la! 🎉
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
              💳 Pagar com Cartao
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

＜dyad-write path="src/components/UpsellCard.tsx" description="Updated UpsellCard with premium styling, gradient headers, and button effects">
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

<dyad-write path="src/components/UpsellModal.tsx" description="Updated UpsellModal with premium styling, gradient header, and button effects">
"use client";

import { type Upsell } from "@/data/upsells";

interface UpsellModalProps {
  upsell: Upsell;
  onClose: () => void;
  onBuy: () => void;
}

export const UpsellModal = ({ upsell, onClose, onBuy }: UpsellModalProps) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-5xl">{upsell.emoji}</div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ✕
            </button>
          </div>

          <h2
            className="text-2xl text-center mb-1"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#9B59B6" }}
          >
            {upsell.nome}
          </h2>
          <p className="text-center text-gray-400 italic mb-4">{upsell.descricaoLonga}</p>

          <div className="space-y-3 mb-4">
            {upsell.copiaVendas.map((texto, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">{texto}</p>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h4 className="font-bold mb-2">Beneficios:</h4>
            <ul className="space-y-1">
              {upsell.beneficios.map((b, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span>✅</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center mb-4">
            <span className="text-gray-400 line-through text-lg">R${upsell.precoOriginal.toFixed(2)}</span>
            <div
              className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mt-1"
            >
              🔥 {Math.round(((upsell.precoOriginal - upsell.precoAtual) / upsell.precoOriginal) * 100)}% DE DESCONTO
            </div>
            <p
              className="text-3xl font-bold mt-2"
              style={{ color: "#7BC843", fontFamily: "'Fredoka One', cursive" }}
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
            JA COMPREI — INSERIR CODIGO DE ACESSO
          </button>

          <div className="text-center text-xs text-gray-400 mt-4 pb-2">
            ✅ Garantia de 7 dias — Nao gostou? Devolvemos 100%. Sem perguntas.
          </div>
        </div>
      </div>
    </div>
  );
};