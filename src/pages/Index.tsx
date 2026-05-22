"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { GamificationBar } from "@/components/GamificationBar";
import { CodeInput } from "@/components/CodeInput";
import RecipeCard from "@/components/RecipeCard";
import { UpsellCard } from "@/components/UpsellCard";
import { UpsellModal } from "@/components/UpsellModal";
import { CategoryCard } from "@/components/CategoryCard";
import { PackCard } from "@/components/PackCard";
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
import { packs } from "@/data/packs";
import { X, ShoppingBag, Heart, MessageCircle } from "lucide-react";
import { playHeartbeatSound } from "@/utils/audio";

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
  const [activeUpsellIndex, setActiveUpsellIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("amigumundo-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Scroll Lock Effect
  useEffect(() => {
    const isModalOpen = !!showRecipe || !!activeUpsell || isFavoritesOpen;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showRecipe, activeUpsell, isFavoritesOpen]);

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

      // Check if it's a pack (scroll to section)
      const pack = packs.find(p => p.id === routeId);
      if (pack) {
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
    playHeartbeatSound();
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

  const handleUpsellBuy = () => {
    if (activeUpsell) {
      const upsell = upsells.find((u) => u.id === activeUpsell);
      if (upsell) {
        // Add to cart
        addToCart({ 
          id: upsell.id, 
          nome: upsell.nome, 
          preco: upsell.precoAtual, 
          tipo: "upsell",
          imagem: `https://picsum.photos/seed/${upsell.id}/100/100`
        });
        setActiveUpsell(null);
        // Fast-Pass Checkout: Redirect immediately
        navigate("/checkout");
      }
    }
  };

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      const index = Math.round(scrollLeft / (width * 0.85));
      if (index >= 0 && index < upsells.length) {
        setActiveUpsellIndex(index);
      }
    }
  };

  const isInCart = (id: string) => cart.some((item) => item.id === id);

  return (
    <div className="min-h-screen bg-white pb-16 relative">
      <Header cartCount={cart.length} />

      {/* DAILY GIFT ANNOUNCEMENT BOX (Shrunk) */}
      <div className="max-w-6xl mx-auto px-4 mt-1 flex flex-col gap-1">
        <div className="bg-[#44FF00] text-[#171717] p-1.5 rounded-lg text-center text-[10px] font-black uppercase tracking-wide shadow-sm">
          PRESENTE DIÁRIO: Vá até o final da página e baixe a Receita Gratuita de hoje! ↓
        </div>
      </div>

      {/* SESSÃO UNIFICADA COM FUNDO #e6dcd3 */}
      <div className="bg-[#e6dcd3] mt-1 pt-1 pb-2">
        
        {/* SEÇÃO 1: CHECKOUT (Topo) */}
        <section className="pb-2">
          <div className="max-w-6xl mx-auto px-4">
            
            {/* PWA Install Prompt */}
            <PwaPrompt />

            {/* Thursday Launch Banner */}
            <LaunchBanner />

            <BannerCarousel />

            {/* WhatsApp Group Card (Moved below the banner and above the cart/code input) */}
            <div className="max-w-2xl mx-auto mb-2">
              <a 
                href="https://wa.me/5544999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#44FF00] text-[#171717] p-2 rounded-xl text-center text-xs font-black uppercase tracking-wide shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                <MessageCircle size={16} fill="currentColor" /> Entre no nosso Grupo de Promoções do WhatsApp
              </a>
            </div>

            {/* Carrinho Inline Compacto com CodeInput anexado no topo */}
            <div id="cart-section" className="max-w-2xl mx-auto my-2 bg-white rounded-[20px] p-4 shadow-md border border-gray-100">
              {/* CodeInput anexado no topo com margem divisória suave */}
              <div className="pb-2 mb-2 border-b border-gray-100">
                <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} />
              </div>

              <h2 className="text-[0.85rem] font-extrabold mb-2 flex items-center gap-2 uppercase italic">
                🛒 Meu Carrinho ({cart.length})
              </h2>

              {/* Dynamic UX Nudge */}
              <div className="bg-blue-50 text-blue-700 text-xs font-bold p-2 rounded-xl mb-2 text-center">
                {getNudgeMessage()}
              </div>
              
              {cart.length === 0 ? (
                <div className="py-2 text-center">
                  <ShoppingBag size={24} className="mx-auto text-gray-100 mb-1" />
                  <p className="text-gray-400 font-black text-[0.65rem] uppercase tracking-widest">
                    Vazio
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* [Seção 1: Receitas] */}
                  {partition.receitas.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                        [Seção 1: Receitas]
                      </h3>
                      <div className="space-y-1">
                        {partition.receitas.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0 pl-3">
                            <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt="" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight break-words whitespace-normal line-clamp-2 uppercase">{item.nome}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                            </div>
                            <span className="font-black text-[#171717] text-[0.8rem] shrink-0">R$ {item.precoFinal.toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500 shrink-0">
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
                      <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-wider mb-1">
                        [Seção 2: Mimos]
                      </h3>
                      <div className="space-y-1">
                        {partition.mimos.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0 pl-3">
                            <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt="" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight break-words whitespace-normal line-clamp-2 uppercase">{item.nome}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-red-500 line-through text-[10px]">R$ {item.originalPreco.toFixed(2)}</span>
                              <span className="font-black text-green-600 text-[0.8rem]">R$ {item.precoFinal.toFixed(2)}</span>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500 shrink-0">
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
                      <h3 className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-1">
                        [Seção 3: Presentes]
                      </h3>
                      <div className="space-y-1">
                        {partition.presentes.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0 pl-3">
                            <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt="" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight break-words whitespace-normal line-clamp-2 uppercase">{item.nome}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-red-500 line-through text-[10px]">R$ {item.originalPreco.toFixed(2)}</span>
                              <span className="font-black text-green-600 text-[0.8rem]">GRÁTIS</span>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500 shrink-0">
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
                      <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-wider mb-1">
                        Outros Itens
                      </h3>
                      <div className="space-y-1">
                        {partition.otherItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0 pl-3">
                            <img src={item.imagem} className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0" alt="" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[0.75rem] font-black text-gray-800 leading-tight break-words whitespace-normal line-clamp-2 uppercase">{item.nome}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">Cód: {item.id}</span>
                            </div>
                            <span className="font-black text-[#171717] text-[0.8rem] shrink-0">R$ {item.preco.toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-200 hover:text-red-500 shrink-0">
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
                      onClick={() => {
                        playHeartbeatSound();
                        navigate("/checkout");
                      }}
                      className="w-full bg-[#44FF00] text-[#171717] py-2.5 rounded-full font-black text-[0.8rem] shadow-sm transition-transform active:scale-95 uppercase tracking-widest"
                    >
                      Finalizar Pedido →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SUPER MIMO AMIGUMUNDO Title Card & GamificationBar below the cart */}
            <div className="max-w-2xl mx-auto my-2">
              <div className="w-full bg-[#44FF00] py-2 px-4 mb-2 shadow-sm rounded-xl text-center border border-gray-100">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#171717] m-0">
                  ✨ SUPER MIMOS AMIGUMUNDO
                </h2>
              </div>
              <GamificationBar cartCount={fullPriceRecipeCount} />
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
        <section className="pt-4 pb-6 bg-[#FDFBF7] overflow-hidden">
          <div className="max-w-3xl mx-auto px-4">
            {/* Card de Título de Largura Total e Altura Mínima */}
            <div className="w-full bg-[#44FF00] py-2 px-4 mb-3 shadow-sm rounded-xl text-center border border-gray-100">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#171717] m-0">
                ✨ Transforme suas Peças em um Ateliê Lucrativo
              </h2>
            </div>
            
            <div className="mb-4 text-center">
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 max-w-2xl mx-auto leading-relaxed">
                Descubra as soluções exclusivas para atrair clientes pagantes, valorizar o seu trabalho e profissionalizar suas vendas.
              </p>
              {/* Helper text for horizontal scroll */}
              <p className="text-xs text-green-600 font-bold mt-2 animate-pulse">
                Arraste para o lado para ver todas as soluções ➔
              </p>
            </div>

            {foundRecipes.length > 0 && (
              <div className="mb-4">
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

            {/* Horizontal Carousel with Peek Effect */}
            <div 
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 px-4 -mx-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {upsells.map((upsell) => (
                <div key={upsell.id} className="snap-center shrink-0 w-[85vw] max-w-[320px]">
                  <UpsellCard 
                    upsell={upsell} 
                    isFavorite={favorites.includes(upsell.id)}
                    onToggleFavorite={() => toggleFavorite(upsell.id)}
                    onOpen={() => {
                      playHeartbeatSound();
                      setActiveUpsell(upsell.id);
                    }} 
                  />
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-1.5 mt-2">
              {upsells.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${i === activeUpsellIndex ? 'w-4 bg-[#44FF00]' : 'w-1.5 bg-gray-300'}`}
                />
              ))}
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

      {activeUpsell && (
        <UpsellModal
          upsell={upsells.find((u) => u.id === activeUpsell)!}
          onClose={() => setActiveUpsell(null)}
          onBuy={handleUpsellBuy}
        />
      )}

      {/* SEÇÃO 3: CATEGORIAS */}
      <section className="bg-[#F5F5F7] py-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Card de Título de Largura Total e Altura Mínima */}
          <div className="w-full bg-[#44FF00] py-2 px-4 mb-2 shadow-sm rounded-xl text-center border border-gray-100">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#171717] m-0">
              CATEGORIAS DE AMIGURUMIS
            </h2>
          </div>
          <p className="text-gray-600 text-xs font-bold mb-4 text-center uppercase tracking-tight">
            Novas receitas adicionadas todos os dias
          </p>
          
          <div className="grid grid-cols-3 gap-x-2 gap-y-2">
            {categories.map((cat) => (
              <CategoryCard key={cat} nome={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: PACKS (Fundo #e6dcd3) */}
      <section className="bg-[#e6dcd3] py-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Card de Título de Largura Total e Altura Mínima */}
          <div className="w-full bg-[#44FF00] py-2 px-4 mb-4 shadow-sm rounded-xl text-center border border-gray-100">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#171717] m-0">
              PACOTES TEMÁTICOS
            </h2>
          </div>
          <p className="text-gray-600 text-xs font-bold mb-4 text-center uppercase tracking-tight">
            Suas coleções favoritas reunidas em pacotes completos com descontos imperdíveis, exclusivas para o seu ateliê.
          </p>

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

      {/* SEÇÃO 6: MIMO GRATUITO DIÁRIO */}
      <DailyGiftSection />

      <footer className="text-center py-3 px-4 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">© 2024 AmiguMundo Artes</p>
      </footer>

      {/* FLOATING FAVORITES BUTTON */}
      <button
        onClick={() => setIsFavoritesOpen(true)}
        className="fixed bottom-[60px] right-2.5 z-50 bg-[#44FF00] text-[#171717] p-2.5 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center border-2 border-white"
        aria-label="Meus Favoritos"
      >
        <Heart size={18} fill="currentColor" />
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
        onCheckout={() => {
          playHeartbeatSound();
          navigate("/checkout");
        }} 
      />
    </div>
  );
}