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
import { FooterNavigation } from "@/components/FooterNavigation";
import { NotificationsModal } from "@/components/NotificationsModal";
import { InternalPopup } from "@/components/InternalPopup";
import { categories } from "@/data/categories";
import { 
  getRecipes, 
  getInfoprodutos, 
  getPacks, 
  getNotifications,
  type SheetRecipe,
  type SheetInfoproduto,
  type SheetPack,
  type SheetNotification
} from "@/utils/sheets";
import { X, ShoppingBag, Heart, MessageCircle, ArrowLeft } from "lucide-react";
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
  const { categoria_slug, id: routeProductId } = useParams();
  
  // State for fetched data
  const [recipesList, setRecipesList] = useState<SheetRecipe[]>([]);
  const [infoprodutosList, setInfoprodutosList] = useState<SheetInfoproduto[]>([]);
  const [packsList, setPacksList] = useState<SheetPack[]>([]);
  const [notificationsList, setNotificationsList] = useState<SheetNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showRecipe, setShowRecipe] = useState<SheetRecipe | null>(null);
  const [activeUpsell, setActiveUpsell] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [foundRecipes, setFoundRecipes] = useState<SheetRecipe[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeUpsellIndex, setActiveUpsellIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("amigumundo-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch all data from Google Sheets
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [recipesData, infoprodutosData, packsData, notificationsData] = await Promise.all([
          getRecipes(),
          getInfoprodutos(),
          getPacks(),
          getNotifications()
        ]);

        setRecipesList(recipesData);
        setInfoprodutosList(infoprodutosData);
        setPacksList(packsData);
        setNotificationsList(notificationsData);

        // Push Notification Listener (Client-side simulation)
        const pushItem = [...recipesData, ...infoprodutosData, ...packsData].find(item => item.disparar_push);
        if (pushItem) {
          if (Notification.permission === "granted") {
            new Notification(`Novidade: ${pushItem.nome}`, {
              body: pushItem.descricao,
              icon: "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png"
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                new Notification(`Novidade: ${pushItem.nome}`, {
                  body: pushItem.descricao
                });
              }
            });
          }
          console.log(`[Push Notification Triggered] ${pushItem.nome}: ${pushItem.descricao}`);
        }

      } catch (e) {
        console.error("Error loading sheets data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Scroll Lock Effect
  useEffect(() => {
    const isModalOpen = !!showRecipe || !!activeUpsell || isFavoritesOpen || !!zoomImage || !!categoria_slug || !!routeProductId;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showRecipe, activeUpsell, isFavoritesOpen, zoomImage, categoria_slug, routeProductId]);

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

  // Deep Linking Handler for Product Detail
  useEffect(() => {
    if (routeProductId && recipesList.length > 0) {
      const recipe = recipesList.find(r => r.id === routeProductId);
      if (recipe) {
        setShowRecipe(recipe);
      }
    }
  }, [routeProductId, recipesList]);

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
      return "Você ganhou uma receita grátis! Escolha qualquer uma na loja.";
    }
  };

  const handleRecipeFound = (recipe: SheetRecipe) => {
    setError(null);
    setShowRecipe(recipe);
  };

  const handleRecipeNotFound = () => {
    setError("Código não encontrado.");
    setTimeout(() => setError(null), 3000);
  };

  const handleRecipeAdd = (recipe: SheetRecipe) => {
    addToCart({ 
      id: recipe.id, 
      nome: recipe.nome, 
      preco: recipe.preco, 
      tipo: "recipe",
      imagem: recipe.url_foto
    });
    setFoundRecipes((prev) => {
      if (prev.find((r) => r.id === recipe.id)) return prev;
      return [...prev, recipe];
    });
  };

  const handlePackAdd = (packId: string) => {
    const pack = packsList.find((p) => p.id === packId);
    if (pack) addToCart({ 
      id: pack.id, 
      nome: pack.nome, 
      preco: pack.preco, 
      tipo: "pack",
      imagem: pack.url_foto
    });
  };

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      const index = Math.round(scrollLeft / (width * 0.85));
      if (index >= 0 && index < infoprodutosList.length) {
        setActiveUpsellIndex(index);
      }
    }
  };

  const isInCart = (id: string) => cart.some((item) => item.id === id);

  // Textures Styles (Fixed zoom to 150px repeat)
  const textureLaranjaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_laranja.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  const textureVerdeOlivaStyle = {
    backgroundImage: "url('https://ik.imagekit.io/51b3srlsg/textura_verde_oliva.jpeg')",
    backgroundRepeat: "repeat",
    backgroundSize: "150px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
  };

  // Filter recipes for the selected category
  const selectedCategoryRecipes = categoria_slug 
    ? recipesList.filter(r => r.categoria.toLowerCase() === categoria_slug.toLowerCase() || r.categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === categoria_slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
    : [];

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      <Header cartCount={cart.length} />

      {/* Internal Popup for active notifications */}
      <InternalPopup notifications={notificationsList} />

      {/* DAILY GIFT ANNOUNCEMENT BOX (Shrunk with Olive Green Texture) */}
      <div className="max-w-6xl mx-auto px-4 mt-1 flex flex-col gap-1">
        <div 
          style={textureVerdeOlivaStyle}
          className="text-white p-2 rounded-lg text-center text-[10px] font-black uppercase tracking-wide shadow-sm"
        >
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

            {/* WhatsApp Group Card (With Olive Green Texture) */}
            <div className="max-w-2xl mx-auto mb-2">
              <a 
                href="https://wa.me/5544999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                style={textureVerdeOlivaStyle}
                className="text-white p-2.5 rounded-xl text-center text-xs font-black uppercase tracking-wide shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] transition-transform"
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
                        Receitas de Amigurumi
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
                        Mimos Especiais
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
                        Presentes Ganhos
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

            {/* SUPER MIMOS AMIGUMUNDO Title Card (With Orange Texture) & GamificationBar below the cart */}
            <div className="max-w-2xl mx-auto my-2">
              <div 
                style={textureLaranjaStyle}
                className="w-full py-2 px-4 mb-2 shadow-sm rounded-xl text-center border border-gray-100"
              >
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white m-0">
                  SUPER MIMOS AMIGUMUNDO
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

        {/* SEÇÃO 2: UPSELLS (TRANSFORME SUAS PEÇAS EM UM ATELIÊ LUCRATIVO) */}
        <section className="pt-4 pb-6 bg-[#FDFBF7] overflow-hidden">
          <div className="max-w-3xl mx-auto px-4">
            {/* Card de Título de Largura Total e Altura Mínima with Orange Texture */}
            <div 
              style={textureLaranjaStyle}
              className="w-full py-2 px-4 mb-3 shadow-sm rounded-xl text-center border border-gray-100"
            >
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white m-0">
                TRANSFORME SUAS PEÇAS EM UM ATELIÊ LUCRATIVO
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
                <h2 className="section-title text-[#171717] italic">Receitas Adicionadas</h2>
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
              {isLoading ? (
                /* Skeleton Loaders */
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-gray-100 rounded-2xl aspect-[16/10] animate-pulse" />
                ))
              ) : (
                infoprodutosList.map((upsell) => (
                  <div key={upsell.id} className="snap-center shrink-0 w-[85vw] max-w-[320px]">
                    <UpsellCard 
                      upsell={{
                        id: upsell.id,
                        nome: upsell.nome,
                        descricao: upsell.descricao,
                        descricaoLonga: upsell.descricao,
                        precoOriginal: upsell.preco * 1.5,
                        precoAtual: upsell.preco,
                        emoji: "💡",
                        cor: "#FF3D9A",
                        beneficios: ["Acesso imediato", "Suporte exclusivo"],
                        copiaVendas: [upsell.descricao]
                      }} 
                      isFavorite={favorites.includes(upsell.id)}
                      onToggleFavorite={() => toggleFavorite(upsell.id)}
                      onOpen={() => {
                        playHeartbeatSound();
                        setActiveUpsell(upsell.id);
                      }} 
                    />
                  </div>
                ))
              )}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-1.5 mt-2">
              {infoprodutosList.map((_, i) => (
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
          upsell={{
            ...infoprodutosList.find((u) => u.id === activeUpsell)!,
            descricaoLonga: infoprodutosList.find((u) => u.id === activeUpsell)!.descricao,
            precoOriginal: infoprodutosList.find((u) => u.id === activeUpsell)!.preco * 1.5,
            precoAtual: infoprodutosList.find((u) => u.id === activeUpsell)!.preco,
            emoji: "💡",
            cor: "#FF3D9A",
            beneficios: ["Acesso imediato", "Suporte exclusivo"],
            copiaVendas: [infoprodutosList.find((u) => u.id === activeUpsell)!.descricao]
          }}
          onClose={() => setActiveUpsell(null)}
          onBuy={handleUpsellBuy}
        />
      )}

      {/* SEÇÃO 3: CATEGORIAS (With Orange Texture) */}
      <section className="bg-[#F5F5F7] py-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Card de Título de Largura Total e Altura Mínima with Orange Texture */}
          <div 
            style={textureLaranjaStyle}
            className="w-full py-2 px-4 mb-4 shadow-sm rounded-xl text-center border border-gray-100"
          >
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white m-0">
              CATEGORIAS DE AMIGURUMIS
            </h2>
          </div>
          <p className="text-gray-600 text-xs font-bold mb-6 text-center uppercase tracking-tight">
            Novas receitas adicionadas todos os dias
          </p>
          
          {/* Grid of 3 Columns representing Category Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <CategoryCard 
                key={cat} 
                nome={cat} 
                onClick={() => {
                  playHeartbeatSound();
                  navigate(`/categoria/${encodeURIComponent(cat.toLowerCase())}`);
                }} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: PACKS (Fundo #e6dcd3 with Orange Texture) */}
      <section className="bg-[#e6dcd3] py-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Card de Título de Largura Total e Altura Mínima with Orange Texture */}
          <div 
            style={textureLaranjaStyle}
            className="w-full py-2 px-4 mb-4 shadow-sm rounded-xl text-center border border-gray-100"
          >
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white m-0">
              Packs e Combos Especiais
            </h2>
          </div>
          <p className="text-gray-600 text-xs font-bold mb-4 text-center uppercase tracking-tight">
            Suas coleções favoritas reunidas em pacotes completos com descontos imperdíveis.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {isLoading ? (
              /* Skeleton Loaders */
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
              ))
            ) : (
              packsList.map((pack) => (
                <PackCard
                  key={pack.id}
                  pack={{
                    id: pack.id,
                    nome: pack.nome,
                    descricao: pack.descricao,
                    receitas: 20,
                    precoOriginal: pack.preco * 1.5,
                    precoAtual: pack.preco,
                    emoji: "🎁"
                  }}
                  inCart={isInCart(pack.id)}
                  isFavorite={favorites.includes(pack.id)}
                  onToggleFavorite={() => toggleFavorite(pack.id)}
                  onAdd={() => handlePackAdd(pack.id)}
                  onRemove={() => removeFromCart(pack.id)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: MIMO GRATUITO DIÁRIO */}
      <DailyGiftSection />

      <footer className="text-center py-3 px-4 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">© 2024 AmiguMundo Artes</p>
      </footer>

      {/* FOOTER NAVIGATION BAR */}
      <FooterNavigation
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        favoritesCount={favorites.length}
        notificationsCount={notificationsList.filter(n => n.status).length}
      />

      {/* FAVORITES MODAL */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteIds={favorites}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
        isInCart={isInCart}
      />

      {/* NOTIFICATIONS MODAL */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notificationsList}
      />

      {/* DYNAMIC CATEGORY DETAIL VIEW (Full-screen Overlay) */}
      {categoria_slug && (
        <div className="fixed inset-0 z-[90] bg-[#F5F5F7] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          {/* Header with Orange Texture */}
          <div style={textureLaranjaStyle} className="sticky top-0 z-10 py-4 px-4 flex items-center justify-between shadow-md">
            <button 
              onClick={() => navigate("/")}
              className="text-white hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 font-black text-xs uppercase tracking-wider"
            >
              <ArrowLeft size={18} /> Voltar
            </button>
            <h2 className="text-white font-black text-sm uppercase tracking-widest m-0">
              {decodeURIComponent(categoria_slug)}
            </h2>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>

          <div className="max-w-6xl mx-auto px-4 py-6">
            <p className="text-gray-500 text-xs font-bold mb-6 text-center uppercase tracking-wider">
              Explore as receitas exclusivas da categoria {decodeURIComponent(categoria_slug)}
            </p>

            {isLoading ? (
              /* Skeleton Loaders */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : selectedCategoryRecipes.length === 0 ? (
              /* Ghost Card Placeholder */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gray-100 border border-dashed border-gray-200 rounded-2xl aspect-[3/4] flex flex-col items-center justify-center p-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
                  <div className="w-20 h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : (
              /* Real Recipe Cards */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedCategoryRecipes.map((recipe) => {
                  const added = isInCart(recipe.id);
                  return (
                    <div key={recipe.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                      {/* Header with Orange Texture */}
                      <div style={textureLaranjaStyle} className="py-1.5 px-3 text-center text-[9px] font-black text-white uppercase tracking-wider">
                        CÓD: {recipe.id}
                      </div>
                      
                      {/* Image with Lightbox Zoom on Click */}
                      <div 
                        className="relative aspect-square bg-gray-50 cursor-zoom-in overflow-hidden group"
                        onClick={() => setZoomImage(recipe.url_foto)}
                      >
                        <img 
                          src={recipe.url_foto} 
                          alt={recipe.nome} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {recipe.tamanho && (
                          <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                            {recipe.tamanho}
                          </span>
                        )}
                      </div>

                      {/* Info & Buy Button */}
                      <div className="p-3 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight line-clamp-2 leading-tight">
                            {recipe.nome}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-medium mt-1 line-clamp-2 leading-tight">
                            {recipe.descricao}
                          </p>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between gap-1.5">
                          <span className="text-xs font-black text-gray-900">
                            R$ {recipe.preco.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRecipeAdd(recipe)}
                            disabled={added}
                            className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all ${
                              added 
                                ? 'bg-gray-100 text-gray-400' 
                                : 'bg-[#44FF00] text-[#171717] hover:scale-105 active:scale-95'
                            }`}
                          >
                            {added ? "✓" : "Quero"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <button 
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            onClick={() => setZoomImage(null)}
          >
            <X size={24} />
          </button>
          <img 
            src={zoomImage} 
            alt="Zoom" 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}