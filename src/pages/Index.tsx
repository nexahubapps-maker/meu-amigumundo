"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { GamificationBar } from "@/components/GamificationBar";
import { CodeInput } from "@/components/CodeInput";
import RecipeCard from "@/components/RecipeCard";
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
import { X, ShoppingBag } from "lucide-react";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  tipo: "recipe" | "pack" | "combo" | "upsell";
  imagem?: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showRecipe, setShowRecipe] = useState<Recipe | null>(null);
  const [activeUpsell, setActiveUpsell] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [foundRecipes, setFoundRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("amigumundo-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("amigumundo-cart", JSON.stringify(cart));
  }, [cart]);

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
    setError("Código não encontrado.");
    setTimeout(() => setError(null), 3000);
  };

  const handleRecipeAdd = (recipe: Recipe) => {
    addToCart({ 
      id: recipe.id, 
      nome: recipe.nome, 
      preco: recipe.preco, 
      tipo: "recipe",
      imagem: `https://picsum.photos/seed/${recipe.id}/100/100`
    });
    setFoundRecipes((prev) => {
      if (prev.find((r) => r.id === recipe.id)) return prev;
      return [...prev, recipe];
    });
  };

  const handlePackAdd = (packId: string) => {
    const pack = packs.find((p) => p.id === packId);
    if (pack) addToCart({ 
      id: pack.id, 
      nome: pack.nome, 
      preco: pack.precoAtual, 
      tipo: "pack",
      imagem: `https://picsum.photos/seed/${pack.id}/100/100`
    });
  };

  const handleComboAdd = (comboId: string) => {
    const combo = combos.find((c) => c.id === comboId);
    if (combo) addToCart({ 
      id: combo.id, 
      nome: combo.nome, 
      preco: combo.preco, 
      tipo: "combo",
      imagem: `https://picsum.photos/seed/${combo.id}/100/100`
    });
  };

  const handleUpsellBuy = () => {
    if (activeUpsell) {
      const upsell = upsells.find((u) => u.id === activeUpsell);
      if (upsell) addToCart({ 
        id: upsell.id, 
        nome: upsell.nome, 
        preco: upsell.precoAtual, 
        tipo: "upsell",
        imagem: `https://picsum.photos/seed/${upsell.id}/100/100`
      });
      setActiveUpsell(null);
    }
  };

  const isInCart = (id: string) => cart.some((item) => item.id === id);

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cart.length} />

      {/* SEÇÃO 1: CHECKOUT (Topo) - Fundo Cinza Neutro */}
      <section className="bg-[#F5F5F5] border-b border-gray-200 shadow-sm pb-8">
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <GamificationBar cartCount={cart.length} />

          <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} />

          {/* Carrinho Inline Compacto */}
          <div className="max-w-2xl mx-auto my-4 bg-white rounded-[24px] p-3 shadow-lg border border-gray-100">
            <h2 className="text-[1rem] font-extrabold mb-3 flex items-center gap-2 uppercase italic">
              🛒 Meu Carrinho ({cart.length})
            </h2>
            
            {cart.length === 0 ? (
              <div className="py-6 text-center">
                <ShoppingBag size={32} className="mx-auto text-gray-200 mb-2" />
                <p className="text-gray-400 font-bold text-[0.75rem] leading-relaxed uppercase">
                  Seu carrinho está vazio
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                    <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100" alt="" />
                    <div className="flex-1">
                      <h4 className="text-[0.8rem] font-bold text-gray-800 leading-tight truncate uppercase">{item.nome}</h4>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Cód: {item.id}</span>
                    </div>
                    <span className="font-bold text-[#171717] text-[0.85rem]">R$ {item.preco.toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-300 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t-2 border-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-500 text-[0.85rem] uppercase">Total</span>
                    <span className="text-[1.1rem] font-extrabold text-[#171717]">R$ {total.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-[#44FF00] text-[#171717] py-3 rounded-full font-extrabold text-[0.9rem] shadow-md transition-transform active:scale-95 uppercase"
                  >
                    Finalizar Pedido →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}

      {showRecipe && (
        <div className="modal-overlay" onClick={() => setShowRecipe(null)}>
          <div className="modal-content p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <RecipeCard
              recipe={showRecipe}
              onAdd={() => handleRecipeAdd(showRecipe)}
              onReject={() => setShowRecipe(null)}
              isInCart={isInCart(showRecipe.id)}
            />
          </div>
        </div>
      )}

      {/* SEÇÃO 2: UPSELLS - Fundo Branco */}
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          {foundRecipes.length > 0 && (
            <div className="mb-8">
              <h2 className="section-title text-[#171717]">✨ Receitas Adicionadas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {foundRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onAdd={() => handleRecipeAdd(recipe)}
                    onReject={() => {}}
                    isInCart={isInCart(recipe.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="section-title text-[#171717]">⭐ Produtos Premium</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {upsells.map((upsell) => (
                <UpsellCard key={upsell.id} upsell={upsell} onOpen={() => setActiveUpsell(upsell.id)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeUpsell && (
        <UpsellModal
          upsell={upsells.find((u) => u.id === activeUpsell)!}
          onClose={() => setActiveUpsell(null)}
          onBuy={handleUpsellBuy}
        />
      )}

      {/* SEÇÃO 3: CATEGORIAS - Fundo Amarelo */}
      <section className="bg-[#F8DD12] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-[#171717]">🧶 Categorias</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-6">
            {categories.map((cat) => (
              <CategoryCard key={cat} nome={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: PACKS - Fundo Branco */}
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-[#171717]">📦 Packs Temáticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packs.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                inCart={isInCart(pack.id)}
                onAdd={() => handlePackAdd(pack.id)}
                onRemove={() => removeFromCart(pack.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: COMBOS - Fundo Preto */}
      <section className="bg-[#171717] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-white">👑 Combos Elite</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {combos.map((combo) => (
              <ComboCard
                key={combo.id}
                combo={combo}
                inCart={isInCart(combo.id)}
                onAdd={() => handleComboAdd(combo.id)}
                onRemove={() => removeFromCart(combo.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 px-4 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2024 AmiguMundo Artes</p>
      </footer>
    </div>
  );
}