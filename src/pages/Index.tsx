"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
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

      <section className="max-w-6xl mx-auto px-4 pt-8">
        <div 
          className="relative overflow-hidden rounded-[32px] px-6 flex flex-col items-center justify-center text-center mb-8 shadow-[0_20px_40px_rgba(255,107,53,0.25)]"
          style={{ 
            background: "linear-gradient(135deg, #FF6B35 0%, #FF3D9A 50%, #9B59B6 100%)",
            minHeight: "170px",
          }}
        >
          {/* Emojis decorativos */}
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-6xl sm:text-7xl opacity-60 select-none pointer-events-none">🧶</span>
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl sm:text-7xl opacity-60 select-none pointer-events-none">✂️</span>
          
          <div className="relative z-10 max-w-2xl">
            <h1
              className="text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-white mb-3 leading-tight"
              style={{ fontFamily: "'Fredoka One', cursive", textShadow: "0 2px_20px_rgba(0,0,0,0.3)" }}
            >
              Suas receitas de amigurumi, na hora, no seu WhatsApp!
            </h1>
            <p className="text-white/90 text-sm sm:text-lg font-medium">
              Digite o código da receita que você viu no grupo e adicione ao carrinho
            </p>
          </div>
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
          <div className="mb-12">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}
            >
              ✨ Receitas Adicionadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div className="max-w-6xl mx-auto px-4 my-12">
        <div
          className="gradient-store rounded-[32px] px-6 py-12 sm:py-16 text-center text-white mb-6"
          style={{ minHeight: "160px" }}
        >
          <h1 className="text-3xl sm:text-5xl font-bold mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>
            🏪 Loja AmiguMundo
          </h1>
          <p className="text-white/90 text-base sm:text-xl">Explore nossa coleção completa de receitas e produtos</p>
        </div>
        <div className="h-6 gradient-redline mb-12" />
      </div>

      <section className="max-w-6xl mx-auto px-4">
        <div className="mb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#9B59B6" }}
          >
            ⭐ Produtos que Vão Transformar sua Arte
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div className="mb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#7BC843" }}
          >
            🧶 Categorias de Receitas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat} nome={cat} />
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8"
            style={{ fontFamily: "Fredoka One, cursive", color: "#FF6B35" }}
          >
            📦 Packs Temáticos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

        <div className="mb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#F5A623" }}
          >
            👑 Combos Elite — Volume com Desconto
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
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

      <footer className="text-center py-12 px-4 border-t border-gray-100 mt-12">
        <p className="text-base text-gray-500 font-medium">© 2024 AmiguMundo Artes — Todos os direitos reservados</p>
        <p className="text-sm text-gray-400 mt-2">Feito com ❤️ para artesãs brasileiras</p>
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