"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { UpsellCard } from "@/components/UpsellCard";
import { UpsellModal } from "@/components/UpsellModal";
import { CategoryCard } from "@/components/CategoryCard";
import { PackCard } from "@/components/PackCard";
import { ErrorToast } from "@/components/ErrorToast";
import { DailyGiftSection } from "@/components/DailyGiftSection";
import { PwaPrompt } from "@/components/PwaPrompt";
import { FavoritesModal } from "@/components/FavoritesModal";
import { FooterNavigation } from "@/components/FooterNavigation";
import { NotificationsModal } from "@/components/NotificationsModal";
import { InternalPopup } from "@/components/InternalPopup";
import { UnifiedCheckoutHub } from "@/components/UnifiedCheckoutHub";
import { CartFooter } from "@/components/CartFooter";
import { CategoryDetailView } from "@/components/CategoryDetailView";
import { LightboxModal } from "@/components/LightboxModal";
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
import { playHeartbeatSound } from "@/utils/audio";
import { type CartItem, calculateCart } from "@/utils/pricing";

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
  
  // Notifications Read State
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

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

        // Check if there are new notifications since last read
        const lastRead = localStorage.getItem("notifications-last-read");
        if (lastRead) {
          const activeNotifs = notificationsData.filter(n => n.status);
          const hasNew = activeNotifs.some(n => new Date(n.data_hora) > new Date(lastRead));
          setHasUnreadNotifications(hasNew);
        } else {
          setHasUnreadNotifications(notificationsData.filter(n => n.status).length > 0);
        }

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

  // Calculate cart values using the centralized pricing utility
  const calculatedCart = calculateCart(cart, recipesList);

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

  const handleUpsellBuy = () => {
    if (activeUpsell) {
      const upsell = infoprodutosList.find((u) => u.id === activeUpsell);
      if (upsell) {
        addToCart({
          id: upsell.id,
          nome: upsell.nome,
          preco: upsell.preco,
          tipo: "upsell",
          imagem: upsell.url_foto
        });
        setActiveUpsell(null);
        navigate("/checkout");
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

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true);
    setHasUnreadNotifications(false);
    localStorage.setItem("notifications-last-read", new Date().toISOString());
  };

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      <Header cartCount={cart.length} />

      {/* Internal Popup for active notifications */}
      <InternalPopup notifications={notificationsList} />

      {/* DAILY GIFT ANNOUNCEMENT BOX (Shrunk with Olive Green Texture) */}
      <div className="max-w-6xl mx-auto px-4 mt-1 flex flex-col gap-1">
        <div 
          style={textureVerdeOlivaStyle}
          className="text-white p-2.5 rounded-lg text-center text-xs sm:text-sm font-black uppercase tracking-wide shadow-sm"
        >
          PRESENTE DIÁRIO: Vá até o final da página e baixe a Receita Gratuita de hoje! ↓
        </div>
      </div>

      {/* SESSÃO UNIFICADA COM FUNDO #e6dcd3 */}
      <div className="bg-[#e6dcd3] mt-1 pt-1 pb-2">
        
        {/* SEÇÃO 1: CHECKOUT (Topo) */}
        <section className="pb-1">
          <div className="max-w-6xl mx-auto px-4">
            
            {/* PWA Install Prompt */}
            <PwaPrompt />

            {/* Unified Checkout Hub Component */}
            <UnifiedCheckoutHub
              cart={cart}
              allRecipes={recipesList}
              onRemoveFromCart={removeFromCart}
              onAddToCart={addToCart}
              onCheckout={() => navigate("/checkout")}
            />

          </div>
        </section>

      </div>

      {/* SEÇÃO 3: CATEGORIAS UNIFICADA COM O BANNER DA LOJA */}
      <section className="bg-[#F5F5F7] pt-0 pb-6">
        {/* 1. BANNER DA LOJA (Colado nas laterais absolutas da tela, sem espaçamento lateral) */}
        <div className="w-full overflow-hidden">
          <img 
            src="https://ik.imagekit.io/51b3srlsg/Loja_AmiguMundo_amigurumis.jpeg" 
            alt="Loja AmiguMundo" 
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="max-w-6xl mx-auto px-2 sm:px-4 mt-3">
          
          {/* CARD ÚNICO UNIFICADO (TÍTULO + CATEGORIAS) */}
          <div className="bg-white rounded-3xl p-2 sm:p-3 shadow-lg border border-gray-100/80 flex flex-col gap-2">

            {/* 2. CARD DE TÍTULO (Textura Laranja) - Bem colado ao banner */}
            <div 
              style={textureLaranjaStyle}
              className="w-full py-1.5 px-3 shadow-sm rounded-xl text-center border border-gray-100"
            >
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white m-0">
                CATEGORIAS DE AMIGURUMIS
              </h2>
            </div>
            
            {/* 3. SUBTÍTULO - Espaçamento mínimo */}
            <p className="text-gray-600 text-[10px] sm:text-xs font-bold text-center uppercase tracking-tight -mt-1 mb-1">
              Novas receitas adicionadas todos os dias
            </p>
            
            {/* 4. GRID DE CATEGORIAS (3 em 3 colunas, espaçamento mínimo lateral e vertical) */}
            <div className="grid grid-cols-3 gap-x-1 gap-y-1.5 px-0.5">
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

        </div>
      </section>

      {/* SEÇÃO 2: UPSELLS (TRANSFORME SUAS PEÇAS EM UM ATELIÊ LUCRATIVO) - DESCEU */}
      <section className="py-8 bg-[#2A2A2A] overflow-hidden rounded-3xl mx-4 sm:mx-auto max-w-3xl shadow-xl border border-white/5 my-6">
        <div className="px-4">
          {/* Card de Título de Largura Total e Altura Mínima with Orange Texture */}
          <div 
            style={textureLaranjaStyle}
            className="w-full py-2 px-4 mb-3 shadow-sm rounded-xl text-center border border-white/10"
          >
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white m-0">
              TRANSFORME SUAS PEÇAS EM UM ATELIÊ LUCRATIVO
            </h2>
          </div>
          
          <div className="mb-4 text-center">
            <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1 max-w-2xl mx-auto leading-relaxed">
              Descubra as soluções exclusivas para atrair clientes pagantes, valorizar o seu trabalho e profissionalizar suas vendas.
            </p>
            {/* Helper text for horizontal scroll */}
            <p className="text-xs text-[#44FF00] font-bold mt-2 animate-pulse">
              Arraste para o lado para ver todas as soluções ➔
            </p>
          </div>

          {foundRecipes.length > 0 && (
            <div className="mb-4">
              <h2 className="section-title text-white italic">Receitas Adicionadas</h2>
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
                <div key={i} className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-gray-800 rounded-2xl aspect-[16/10] animate-pulse" />
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
                className={`h-1.5 rounded-full transition-all ${i === activeUpsellIndex ? 'w-4 bg-[#44FF00]' : 'w-1.5 bg-gray-500'}`}
              />
            ))}
          </div>
        </div>
      </section>

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

      {/* WhatsApp Group Card (With Teal/Blue-Petrol Background and Unified Crochet Cube Asset) */}
      <div className="max-w-2xl mx-auto px-4 my-6">
        <a 
          href="https://wa.me/5544999999999" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#0E5E6F] text-white p-3.5 rounded-2xl text-center shadow-md flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-[0.99] transition-transform border border-white/10"
        >
          <div className="h-[44px] w-[44px] rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center bg-transparent">
            <img 
              src="/Gemini_Generated_Image_c43hoxc43hoxc43h (1).png" 
              className="w-full h-full object-cover scale-[1.12] origin-center" 
              alt="WhatsApp" 
            />
          </div>
          <div className="text-left">
            <p className="text-[12px] sm:text-[13px] font-black uppercase tracking-wide leading-tight">
              Ainda não faz parte do nosso grupo?
            </p>
            <p className="text-[10px] sm:text-[11px] font-bold text-white/90 leading-tight mt-0.5">
              Então CLIQUE AQUI e entre no nosso Grupo de Promoções do WhatsApp
            </p>
          </div>
        </a>
      </div>

      {/* SEÇÃO 6: MIMO GRATUITO DIÁRIO */}
      <DailyGiftSection />

      <footer className="text-center py-3 px-4 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">© 2024 AmiguMundo Artes</p>
      </footer>

      {/* CART FOOTER PREVIEW */}
      <CartFooter
        count={cart.length}
        total={calculatedCart.total}
        onCheckout={() => navigate("/checkout")}
      />

      {/* FOOTER NAVIGATION BAR */}
      <FooterNavigation
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenNotifications={handleOpenNotifications}
        favoritesCount={favorites.length}
        notificationsCount={hasUnreadNotifications ? notificationsList.filter(n => n.status).length : 0}
      />

      {/* FAVORITES MODAL */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteIds={favorites}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
        isInCart={isInCart}
        recipes={recipesList}
        packs={packsList}
        infoprodutos={infoprodutosList}
      />

      {/* NOTIFICATIONS MODAL */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notificationsList}
      />

      {/* DYNAMIC CATEGORY DETAIL VIEW (Full-screen Overlay) */}
      {categoria_slug && (
        <CategoryDetailView
          categoriaSlug={categoria_slug}
          recipes={selectedCategoryRecipes}
          isLoading={isLoading}
          isInCart={isInCart}
          onBack={() => navigate("/")}
          onRecipeAdd={handleRecipeAdd}
          onZoomImage={setZoomImage}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <LightboxModal
          imageUrl={zoomImage}
          onClose={() => setZoomImage(null)}
        />
      )}
    </div>
  );
}