"use client";
import { useState } from "react";
import { GamificationBar } from "@/components/GamificationBar";
import { CodeInput } from "@/components/CodeInput";
import RecipeCard from "@/components/RecipeCard";
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
    setError("Código não encontrado. Verifique o número e tente novamente.");
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
    <div className="min-h-screen pb-24 sm:pb-32" style={{ backgroundColor: "#FFF8F2" }}>
      <section className="max-w-6xl mx-auto px-4">
        <div className="mb-6 sm:mb-8">
          <img 
            src="https://ik.imagekit.io/51b3srlsg/banner-checkout.jpg.jpeg" 
            alt="AmiguMundo" 
            className="w-full h-[160px] sm:h-[220px] object-cover rounded-b-[24px] block"
          />
        </div>

        <GamificationBar cartCount={cart.length} />

        <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} />

        {error && <ErrorToast message={error} onClose={() => setError(null)} />}

        {showRecipe && (
          <div className="modal-overlay" onClick={() => setShowRecipe(null)}>
            <div className="modal-content p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <RecipeCard
                recipe={showRecipe}
                onAdd={() => handleRecipeAdd(showRecipe)}
                onReject={handleRecipeReject}
                isInCart={isInCart(showRecipe.id)}
              />
            </div>
          </div>
        )}

        {foundRecipes.length > 0 && (
          <div className="mb-10 sm:mb-12">
            <h2 className="section-title text-[#FF6B35]">
              ✨ Receitas Adicionadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {foundRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onAdd={() => handleRecipeAdd(recipe)}
                  onReject={handleRecipeReject}
                  isInCart={isInCart(recipe.id)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="max-w-6xl mx-auto px-4 my-8 sm:my-12">
        <div className="redline mb-8 sm:mb-12" />
        <div className="mb-8 sm:mb-12">
          <img 
            src="https://ik.imagekit.io/51b3srlsg/banner-loja.jpg.jpeg" 
            alt="Loja AmiguMundo" 
            className="w-full h-[160px] sm:h-[220px] object-cover block rounded-2xl"
          />
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4">
        <div className="mb-12 sm:mb-16">
          <h2 className="section-title text-[#9B59B6]">
            ⭐ Produtos que Vão Transformar sua Arte
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {upsells.map((upsell) => (
              <UpsellCard key={upsell.id} upsell={upsell} onOpen={() => setActiveUpsell(upsell.id)} />
            ))}
          </div>
        </div>

        {activeUpsell && (
          <UpsellModal
            upsell={upsells.find((u) => u.id === activeUpsell)!}
            onClose={() => setActiveUpsell(null)}
            onBuy={handleUpsellBuy}
          />
        )}

        <div className="mb-12 sm:mb-16">
          <h2 className="section-title text-[#7BC843]">
            🧶 Categorias de Receitas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat} nome={cat} />
            ))}
          </div>
        </div>

        <div className="mb-12 sm:mb-16">
          <h2 className="section-title text-[#FF6B35]">
            📦 Packs Temáticos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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

        <div className="mb-12 sm:mb-16">
          <h2 className="section-title text-[#F5A623]">
            👑 Combos Elite — Volume com Desconto
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
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

      <footer className="text-center py-8 sm:py-12 px-4 border-t border-gray-100 mt-8 sm:mt-12">
        <p className="text-sm sm:text-base text-gray-500 font-bold">© 2024 AmiguMundo Artes — Todos os direitos reservados</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">Feito com ❤️ para artesãs brasileiras</p>
      </footer>

      <Cart count={cart.length} total={total} onCheckout={() => setShowCheckout(true)} />

      {showCheckout && (
        <CheckoutModal
          total={total}
          onClose={() => setShowCheckout(false)}
          onConfirm={() => {
            setShowCheckout(false);
            setCart([]);
          }}
        />
      )}
    </div>
  );
}