"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { BannerCarousel } from "@/components/BannerCarousel";
import { CartFooter } from "@/components/CartFooter";
import { DailyGiftSection } from "@/components/DailyGiftSection";
import { LaunchBanner } from "@/components/LaunchBanner";
import { PwaPrompt } from "@/components/PwaPrompt";
import { FavoritesModal } from "@/components/FavoritesModal";
import { recipes, type Recipe } from "@/data/recipes";
import { upsells } from "@/data/upsells";
import { categories } from "@/data/categories";
import { packs, combos } from "@/data/packs";
import { X, ShoppingBag, Heart } from "lucide-react";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  tipo: "recipe" | "pack" | "combo" | "upsell";
  imagem?: string;
}

export default function Index() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showRecipe, setShowRecipe] = useState<Recipe | null>(null);
  const [activeUpsell, setActiveUpsell] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [foundRecipes, setFoundRecipes] = useState<Recipe[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  
  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("amigumundo-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("amigumundo-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("amigumundo-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("amigumundo-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Deep Linking Handler
  useEffect(() => {
    if (routeId) {
      // Check if it's a recipe
      const recipe = recipes.find(r => r.id === routeId);
      if (recipe) {
        setShowRecipe(recipe);
        return;
      }

      // Check if it's an upsell
      const upsell = upsells.find(u => u.id === routeId);
      if (upsell) {
        setActiveUpsell(upsell.id);
        return;
      }

      // Check if it's a pack or combo (scroll to section)
      const pack = packs.find(p => p.id === routeId);
      const combo = combos.find(c => c.id === routeId);
      if (pack || combo) {
        const el = document.getElementById('cart-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [routeId]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

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

  // --- GAMIFIED PRICING LOGIC ---
  const getCartPartition = () => {
    const selectedRecipes = cart.filter(item => item.tipo === "recipe");
    const otherItems = cart.filter(item => item.tipo !== "recipe");

    const sorted = [...selectedRecipes].sort((a, b) => b.preco - a.preco);
    let bestPartition = { receitas: sorted, mimos: [] as any[], presentes: [] as any[] };

    for (let R = 0; R <= sorted.length; R++) {
      let allowedFree = 0;
      if (R >= 20) allowedFree = 2;
      else if (R >= 10) allowedFree = 1;

      let allowedMimos = 0;
      if (R >= 9) allowedMimos = 9;
      else if (R >= 6) allowedMimos = 6;
      else if (R >= 3) allowedMimos = 3;

      if (R + allowedFree + allowedMimos >= sorted.length) {
        const receitas = sorted.slice(0, R);
        const remaining = sorted.slice(R);

        const presentes = remaining.slice(0, allowedFree).map(r => ({ ...r, precoFinal: 0, originalPreco: r.preco, tipo: 'presente' }));
        const mimosRemaining = remaining.slice(allowedFree);

        const mimos = mimosRemaining.map((r, idx) => {
          let precoFinal = r.preco;
          if (idx < 3) precoFinal = 3.00;
          else if (idx < 6) precoFinal = 2.00;
          else if (idx < 9) precoFinal = 1.00;
          return { ...r, precoFinal, originalPreco: r.preco, tipo: 'mimo' };
        });

        bestPartition = {
          receitas: receitas.map(r => ({ ...r, precoFinal: r.preco, originalPreco: r.preco, tipo: 'receita' })),
          mimos,
          presentes
        };
        break;
      }
    }

    return { ...bestPartition, otherItems };
  };

  const partition = getCartPartition();
  const fullPriceRecipeCount = partition.receitas.length;

  const total = [
    ...partition.receitas,
    ...partition.mimos,
    ...partition.presentes,
    ...partition.otherItems
  ].reduce((sum, item) => sum + (item.precoFinal !== undefined ? item.precoFinal : item.preco), 0);

  const getNudgeMessage = () => {
    if (fullPriceRecipeCount < 3) {
      return `Adicione mais ${3 - fullPriceRecipeCount} receitas para liberar mimos por R$ 3!`;
    } else if (fullPriceRecipeCount < 6) {
      return "Você liberou mimos! Escolha suas receitas na loja.";
    } else if (fullPriceRecipeCount < 10) {
      return `Adicione mais ${10 - fullPriceRecipeCount} receitas para ganhar uma receita GRÁTIS!`;
    } else {
      return "🎉 VOCÊ GANHOU UMA RECEITA GRÁTIS! Escolha qualquer uma na loja.";
    }
  };

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
    <div className="min-h-screen bg-white pb-24 relative">
      <Header cartCount={cart.length} />

      {/* DAILY GIFT ANNOUNCEMENT BOX */}
      <div className="max-w-6xl mx-auto px-4 mt-3">
        <div className="bg-[#44FF00] text-[#171717] p-2.5 rounded-xl text-center text-xs font-black uppercase tracking-wide shadow-sm">
          PRESENTE DIÁRIO: Vá até o final da página e baixe a Receita Gratuita de hoje! ↓
        </div>
      </div>

      {/* SESSÃO UNIFICADA COM FUNDO #e6dcd3 */}
      <div className="bg-[#e6dcd3] mt-3 pt-3 pb-4">
        
        {/* SEÇÃO 1: CHECKOUT (Topo) */}
        <section className="pb-4">
          <div className="max-w-6xl mx-auto px-4">
            
            {/* PWA Install Prompt */}
            <PwaPrompt />

            {/* Thursday Launch Banner */}
            <LaunchBanner />

            <BannerCarousel />

            {/* ENVELOPAMENTO DA SEÇÃO "SUPER MIMO" E "DIGITE O CÓDIGO" */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 my-3 shadow-md border border-gray-100">
              <GamificationBar cartCount={fullPriceRecipeCount} />
              <div className="border-t border-gray-100 my-2 pt-2">
                <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} />
              </div>
            </div>

            {/* Carrinho Inline Compacto */}
            <div id="cart-section" className="max-w-2xl mx-auto my-2 bg-white rounded-[20px] p-3 shadow-md border border-gray-100">
              <h2 className="text-[0.85rem] font-extrabold mb-2 flex items-center gap-2 uppercase italic">
                🛒 Meu Carrinho ({cart.length})
              </h2>

              {/* Dynamic UX Nudge */}
              <div className="bg-blue-50 text-blue-700 text-xs font-bold p-2.5 rounded-xl mb-3 text-center">
                {getNudgeMessage()}
              </div>
              
              {cart.length === 0 ? (
                <div className="py-4 text-center">
                  <ShoppingBag size={32} className="mx-auto text-gray-100 mb-2" />
                  <p className="text-gray-400 font-black text-[0.65rem] uppercase tracking-widest">
                    Vazio
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* [Seção 1: Receitas] */}
                  {partition.receitas.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">
                        [Seção 1: Receitas]
                      </h3>
                      <div className="space-y-1.5">
                        {partition.receitas.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                            <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100" alt="" />
                            <div className="flex-1">
                              <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight truncate uppercase">{item.nome}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                            </div>
                            <span className="font-black text-[#171717] text-[0.8rem]">R$ {item.precoFinal.toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* [Seção 2: Mimos] */}
                  {partition.mimos.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-wider mb-1.5">
                        [Seção 2: Mimos]
                      </h3>
                      <div className="space-y-1.5">
                        {partition.mimos.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                            <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100" alt="" />
                            <div className="flex-1">
                              <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight truncate uppercase">{item.nome}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-red-500 line-through text-[10px]">R$ {item.originalPreco.toFixed(2)}</span>
                              <span className="font-black text-green-600 text-[0.8rem]">R$ {item.precoFinal.toFixed(2)}</span>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* [Seção 3: Presentes] */}
                  {partition.presentes.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-1.5">
                        [Seção 3: Presentes]
                      </h3>
                      <div className="space-y-1.5">
                        {partition.presentes.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                            <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100" alt="" />
                            <div className="flex-1">
                              <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight truncate uppercase">{item.nome}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-red-500 line-through text-[10px]">R$ {item.originalPreco.toFixed(2)}</span>
                              <span className="font-black text-green-600 text-[0.8rem]">GRÁTIS</span>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Items (Packs, Combos, Upsells) */}
                  {partition.otherItems.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-wider mb-1.5">
                        Outros Itens
                      </h3>
                      <div className="space-y-1.5">
                        {partition.otherItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                            <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100" alt="" />
                            <div className="flex-1">
                              <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight truncate uppercase">{item.nome}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                            </div>
                            <span className="font-black text-[#171717] text-[0.8rem]">R$ {item.preco.toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 mt-1 border-t border-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-gray-400 text-[0.7rem] uppercase tracking-widest">Total</span>
                      <span className="text-[1rem] font-black text-[#171717]">R$ {total.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => navigate("/checkout")}
                      className="w-full bg-[#44FF00] text-[#171717] py-2.5 rounded-full font-black text-[0.8rem] shadow-sm transition-transform active:scale-95 uppercase tracking-widest"
                    >
                      Finalizar Pedido →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CARD FLUTUANTE COM O BANNER E A DESCRIÇÃO DA LOJA */}
        <div className="max-w-6xl mx-auto px-4 mb-1">
          <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100/50">
            <div className="rounded-xl overflow-hidden">
              <img 
                src="https://ik.imagekit.io/51b3srlsg/Loja_AmiguMundo_amigurumis.jpeg" 
                alt="Loja AmiguMundo" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: UPSELLS (Profissionalize o seu negócio) */}
        <section className="pt-1 pb-2">
          <div className="max-w-6xl mx-auto px-4">
            {/* Card de Título de Largura Total e Altura Mínima */}
            <div className="w-full bg-[#dbdad9] py-3 px-4 mb-4 shadow-sm rounded-xl text-center border border-gray-100">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#171717] m-0">
                PROFISSIONALIZE O SEU NEGÓCIO
              </h2>
            </div>
            
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-gray-800 font-medium mt-1 max-w-2xl leading-relaxed">
                Aqui você vai encontrar soluções para o marketing do seu negócio, como acelerar as vendas e como fazer a sua paixão se tornar o seu conforto financeiro
              </p>
            </div>

            {foundRecipes.length > 0 && (
              <div className="mb-6">
                <h2 className="section-title text-[#171717] italic">✨ Receitas Adicionadas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {foundRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favorites.includes(recipe.id)}
                      onToggleFavorite={() => toggleFavorite(recipe.id)}
                      onAdd={() => handleRecipeAdd(recipe)}
                      onReject={() => {}}
                      isInCart={isInCart(recipe.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {upsells.map((upsell) => (
                  <UpsellCard 
                    key={upsell.id} 
                    upsell={upsell} 
                    isFavorite={favorites.includes(upsell.id)}
                    onToggleFavorite={() => toggleFavorite(upsell.id)}
                    onOpen={() => setActiveUpsell(upsell.id)} 
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}

      {showRecipe && (
        <div className="modal-overlay" onClick={() => setShowRecipe(null)}>
          <div className="modal-content p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <RecipeCard
              recipe={showRecipe}
              isFavorite={favorites.includes(showRecipe.id)}
              onToggleFavorite={() => toggleFavorite(showRecipe.id)}
              onAdd={() => handleRecipeAdd(showRecipe)}
              onReject={() => setShowRecipe(null)}
              isInCart={isInCart(showRecipe.id)}
            />
          </div>
        </div>
      )}

      {/* SEÇÃO 3: CATEGORIAS */}
      <section className="bg-[#F5F5F7] py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Card de Título de Largura Total e Altura Mínima */}
          <div className="w-full bg-[#dbdad9] py-3 px-4 mb-6 shadow-sm rounded-xl text-center border border-gray-100">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#171717] m-0">
              CATEGORIAS DE AMIGURUMIS
            </h2>
          </div>
          
          <div className="grid grid-cols-3 gap-x-0 gap-y-4">
            {categories.map((cat) => (
              <CategoryCard key={cat} nome={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: PACKS (Fundo #e6dcd3) */}
      <section className="bg-[#e6dcd3] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Card de Título de Largura Total e Altura Mínima */}
          <div className="w-full bg-[#dbdad9] py-3 px-4 mb-6 shadow-sm rounded-xl text-center border border-gray-100">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#171717] m-0">
              PACOTES TEMÁTICOS
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {packs.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                inCart={isInCart(pack.id)}
                isFavorite={favorites.includes(pack.id)}
                onToggleFavorite={() => toggleFavorite(pack.id)}
                onAdd={() => handlePackAdd(pack.id)}
                onRemove={() => removeFromCart(pack.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: COMBOS (Fundo #18191a e Título #B78209) */}
      <section className="bg-[#18191a] py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Card de Título de Largura Total e Altura Mínima */}
          <div className="w-full bg-[#dbdad9] py-3 px-4 mb-2 shadow-sm rounded-xl text-center border border-gray-100">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#171717] m-0">
              COMBOS ELITE
            </h2>
          </div>
          <p className="text-gray-400 text-xs font-medium mb-6 uppercase tracking-tight text-center">
            escolha o combo perfeito para crescer o seu negocio ou hobby
          </p>
          <div className="max-w-3xl mx-auto space-y-4">
            {combos.map((combo) => (
              <ComboCard
                key={combo.id}
                combo={combo}
                inCart={isInCart(combo.id)}
                isFavorite={favorites.includes(combo.id)}
                onToggleFavorite={() => toggleFavorite(combo.id)}
                onAdd={() => handleComboAdd(combo.id)}
                onRemove={() => removeFromCart(combo.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: MIMO GRATUITO DIÁRIO */}
      <DailyGiftSection />

      <footer className="text-center py-3 px-4 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">© 2024 AmiguMundo Artes</p>
      </footer>

      {/* FLOATING FAVORITES BUTTON */}
      <button
        onClick={() => setIsFavoritesOpen(true)}
        className="fixed bottom-16 right-4 z-50 bg-[#44FF00] text-[#171717] p-3 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center border-2 border-white"
        aria-label="Meus Favoritos"
      >
        <Heart size={20} fill="currentColor" />
      </button>

      {/* FAVORITES MODAL */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteIds={favorites}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
        isInCart={isInCart}
      />

      <CartFooter 
        count={cart.length} 
        total={total} 
        onCheckout={() => navigate("/checkout")} 
      />
    </div>
  );
}