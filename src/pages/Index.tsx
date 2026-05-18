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
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };
  const total = cart.reduce((sum, item) => sum + item.preco, 0);
  const handleRecipeFound = (recipe: Recipe) => {
    setError(null);
    setShowRecipe(recipe);
  };
  const handleRecipeNotFound = () => {
    setError("Codigo nao encontrado. Verifique o numero e tente novamente.");
    setTimeout(() => setError(null), 3000);
  };
  const handleRecipeAdd = (recipe: Recipe) => {
    addToCart({ id: recipe.id, nome: recipe.nome, preco: recipe.preco, tipo: "recipe" });
    setFoundRecipes((prev) => {
      if (prev.find((r) => r.id === recipe.id)) return prev;
      return [...prev, recipe];
    });
  };
  const handleRecipeReject = () => {
    setShowRecipe(null);
  };
  const handlePackAdd = (packId: string) => {
    const pack = packs.find((p) => p.id === packId);
    if (pack) addToCart({ id: pack.id, nome: pack.nome, preco: pack.precoAtual, tipo: "pack" });
  };
  const handlePackRemove = (packId: string) => {
    removeFromCart(packId);
  };
  const handleComboAdd = (comboId: string) => {
    const combo = combos.find((c) => c.id === comboId);
    if (combo) addToCart({ id: combo.id, nome: combo.nome, preco: combo.preco, tipo: "combo" });
  };
  const handleComboRemove = (comboId: string) => {
    removeFromCart(comboId);
  };
  const handleUpsellBuy = () => {
    if (activeUpsell) {
      const upsell = upsells.find((u) => u.id === activeUpsell);
      if (upsell) addToCart({ id: upsell.id, nome: upsell.nome, preco: upsell.precoAtual, tipo: "upsell" });
      setActiveUpsell(null);
    }
  };
  const isInCart = (id: string) => cart.some((item) => item.id === id);
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: "#FFF8F2" }}>
      <Header />
      <section className="max-w-6xl mx-auto px-4">
        {/* Banner Checkout */}
        <div className="banner">
          <span className="absolute left-4 top-4 text-5xl font-bold text-gray-600 opacity-60">🧶</span>
          <span className="absolute right-4 bottom-4 text-5xl font-bold text-gray-600 opacity-60">✂️</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Fredoka One', cursive", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
            🧶 Suas receitas de amigurumi, na hora, no seu WhatsApp!
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto">
            Digite o codigo da receita que voce viu no grupo e adicione ao carrinho
          </p>
        </div>
        {/* Gamification */}
        <GamificationBar cartCount={cart.length} />
        {/* Code Input */}
        <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} />
        {/* Error Toast */}
        {error && <ErrorToast message={error} onClose={() => setError(null)} />}
        {/* Found Recipe Modal */}
        {showRecipe && (
          <div className="modal-overlay" onClick={() => setShowRecipe(null)}>
            <div className="modal-content p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <RecipeCard
                recipe={showRecipe}
                inCart={isInCart(showRecipe.id)}
                onAdd={() => handleRecipeAdd(showRecipe)}
                onReject={handleRecipeReject}
              />
            </div>
          </div>
        )}
        {/* Found Recipes Grid */}
        {foundRecipes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}>
              Receitas Adicionadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {foundRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  inCart={isInCart(recipe.id)}
                  onAdd={() => handleRecipeAdd(recipe)}
                  onReject={() => handleRecipeReject()}
                />
              ))}
            </div>
          </div>
        )}
      </section>
      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 my-8">
        <div className="gradient-store rounded-3xl px-6 py-10 sm:py-14 text-center text-white mb-6" style={{ minHeight: "160px" }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
            🏪 Loja AmiguMundo
          </h1>
          <p className="text-white/80 text-sm sm:text-base">Explore nossa colecao completa de receitas e produtos</p>
        </div>
        <div className="h-6 gradient-redline mb-8" />
      </div>
      {/* Store Section */}
      <section className="max-w-6xl mx-auto px-4">
        {/* Upsells */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fredoka One', cursive", color: "#9B59B6" }}>
            ⭐ Produtos que Vao Transformar sua Arte
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upsells.map((upsell) => (
              <UpsellCard key={upsell.id} upsell={upsell} onOpen={() => setActiveUpsell(upsell.id)} />
            ))}
          </div>
        </div>
        {/* Upsell Modal */}
        {activeUpsell && (
          <UpsellModal
            upsell={upsells.find((u) => u.id === activeUpsell)!}
            onClose={() => setActiveUpsell(null)}
            onBuy={handleUpsellBuy}
          />
        )}
        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fredoka One', cursive", color: "#7BC843" }}>
            🧶 Categorias de Receitas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat} nome={cat} />
            ))}
          </div>
        </div>
        {/* Packs */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}>
            📦 Packs Tematicos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packs.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                inCart={isInCart(pack.id)}
                onAdd={() => handlePackAdd(pack.id)}
                onRemove={() => handlePackRemove(pack.id)}
              />
            ))}
          </div>
        </div>
        {/* Combos */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fredoka One', cursive", color: "#F5A623" }}>
            👑 Combos Elite — Volume com Desconto
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {combos.map((combo) => (
              <ComboCard
                key={combo.id}
                combo={combo}
                inCart={isInCart(combo.id)}
                onAdd={() => handleComboAdd(combo.id)}
                onRemove={() => handleComboRemove(combo.id)}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="text-center py-8 px-4">
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