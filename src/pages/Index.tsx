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

        <GamificationBar cartCount={cart.length} />

        <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} />

        {error && <ErrorToast message={error} onClose={() => setError(null)} />}

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

      <section className="max-w-6xl mx-auto mt-12">
        <SectionTitle color="#FF3D9A">🏪 Loja AmiguMundo</SectionTitle>
        <div className="gradient-store rounded-3xl p-10 text-center text-white mb-6">
          <p className="text-white/80">Explore nossa coleção completa de receitas e produtos</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto">
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

        <SectionTitle color="#7BC843">🧶 Categorias de Receitas</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c} nome={c} />
          ))}
        </div>
        <SectionDivider />

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

      <footer className="text-center py-8">
        <p className="text-sm text-gray-400">© 2024 AmiguMundo Artes — Todos os direitos reservados</p>
        <p className="text-xs text-gray-300 mt-1">Feito com ❤️ para artesãs brasileiras</p>
      </footer>

      <Cart count={cart.length} total={total} onCheckout={() => setShowCheckout(true)} />

      {showCheckout && (
        <CheckoutModal total={total} onClose={() => setShowCheckout(false)} onConfirm={() => { setShowCheckout(false); setCart([]); }} />
      )}
    </div>
  );
}