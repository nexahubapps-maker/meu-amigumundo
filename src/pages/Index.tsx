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
    <div className="min-h-screen pb-12 bg-white">
      <Header cartCount={cart.length} />

      <section className="max-w-6xl mx-auto px-4">
        <div className="mt-4 mb-6">
          <img 
            src="https://ik.imagekit.io/51b3srlsg/banner-checkout.jpg.jpeg" 
            alt="AmiguMundo" 
            className="w-full h-[150px] sm:h-[200px] object-cover border-4 border-[#171717] rounded-[16px]"
            style={{ boxShadow: '6px 6px 0px 0px #171717' }}
          />
        </div>

        <GamificationBar cartCount={cart.length} />

        <div className="my-8">
          <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} />
        </div>

        {/* Carrinho Inline Neobrutalista */}
        <div className="max-w-2xl mx-auto my-8 neo-card p-4">
          <h2 className="text-[1.2rem] font-black mb-4 flex items-center gap-2 uppercase italic">
            🛒 MEU CARRINHO ({cart.length})
          </h2>
          
          {cart.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-[#171717] rounded-[12px]">
              <ShoppingBag size={40} className="mx-auto text-[#171717] mb-3" />
              <p className="text-[#171717] font-black text-[0.85rem] uppercase">
                Seu carrinho está vazio!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 border-2 border-[#171717] rounded-[8px] bg-white">
                  <img src={item.imagem} className="w-10 h-10 rounded-[4px] border-2 border-[#171717] object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="text-[0.85rem] font-black text-[#171717] leading-tight uppercase truncate">{item.nome}</h4>
                    <span className="text-[10px] font-black text-[#171717]/60 uppercase">Cód: {item.id}</span>
                  </div>
                  <span className="font-black text-[#171717] text-[0.9rem]">R$ {item.preco.toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="p-1.5 bg-white border-2 border-[#171717] rounded-[4px] hover:bg-red-50">
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t-4 border-[#171717]">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-[#171717] text-[1rem] uppercase">TOTAL</span>
                  <span className="text-[1.5rem] font-black text-[#171717]">R$ {total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => navigate("/checkout")}
                  className="w-full neo-btn-buy py-4 text-[1rem] uppercase tracking-widest"
                >
                  FINALIZAR PEDIDO →
                </button>
              </div>
            </div>
          )}
        </div>

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

        {foundRecipes.length > 0 && (
          <div className="mb-12">
            <h2 className="section-title">✨ RECEITAS ADICIONADAS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </section>

      <div className="max-w-6xl mx-auto px-4 my-10">
        <div className="redline" />
        <div className="my-8">
          <img 
            src="https://ik.imagekit.io/51b3srlsg/banner-loja.jpg.jpeg" 
            alt="Loja AmiguMundo" 
            className="w-full h-[150px] sm:h-[200px] object-cover border-4 border-[#171717] rounded-[16px]"
            style={{ boxShadow: '6px 6px 0px 0px #171717' }}
          />
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="section-title">⭐ PRODUTOS PREMIUM</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

        <div className="mb-12">
          <h2 className="section-title">🧶 CATEGORIAS</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat} nome={cat} />
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="section-title">📦 PACKS TEMÁTICOS</h2>
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

        <div className="mb-12">
          <h2 className="section-title">👑 COMBOS ELITE</h2>
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

      <footer className="text-center py-10 px-4 border-t-4 border-[#171717] mt-12 bg-[#F8DD12]">
        <p className="text-[12px] text-[#171717] font-black uppercase tracking-widest">© 2024 AMIGUMUNDO ARTES • TODOS OS DIREITOS RESERVADOS</p>
      </footer>
    </div>
  );
}