"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/common/Header";
import { PushOptInCard } from "@/components/features/pwa/PushOptInCard";
import RecipeCard from "@/components/features/catalog/RecipeCard";
import { UpsellCard } from "@/components/features/upsell/UpsellCard";
import { UpsellModal } from "@/components/features/upsell/UpsellModal";
import { CategoryCard } from "@/components/features/catalog/CategoryCard";
import { PackCard } from "@/components/features/catalog/PackCard";
import { ErrorToast } from "@/components/common/ErrorToast";
import { DailyGiftSection } from "@/components/features/gamification/DailyGiftSection";
import { PwaPrompt } from "@/components/features/pwa/PwaPrompt";
import { FavoritesModal } from "@/components/FavoritesModal";
import { FooterNavigation } from "@/components/common/FooterNavigation";
import { NotificationsModal } from "@/components/NotificationsModal";
import { InternalPopup } from "@/components/common/InternalPopup";
import { UnifiedCheckoutHub } from "@/components/features/checkout/UnifiedCheckoutHub";
import { CartFooter } from "@/components/features/checkout/CartFooter";
import { CategoryDetailView } from "@/components/features/catalog/CategoryDetailView";
import { SearchResultsView } from "@/components/features/catalog/SearchResultsView";
import { RecipeSearchBar } from "@/components/features/catalog/RecipeSearchBar";
import { LightboxModal } from "@/components/features/catalog/LightboxModal";
import { InstallGuideCard } from "@/components/features/pwa/InstallGuideCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { AdminSyncButton } from "@/components/features/admin/AdminSyncButton";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { getProfile } from "@/utils/profile";
import { CompleteProfileModal } from "@/components/CompleteProfileModal";
import { MeuAmiguMundoView } from "@/components/features/membros/MeuAmiguMundoView";
import { captureUTMs } from "@/lib/tracking/utmify-service";
import { supabase } from "@/lib/supabase";
import { getReadNotificationIds } from "@/utils/notificacoesLidas";
import { 
  getInfoprodutos, 
  getPacks, 
  getNotifications,
  getCategories,
  getRecipesByCategoria,
  getRecipesByIds,
  searchRecipes,
  type SheetRecipe,
  type SheetInfoproduto,
  type SheetPack,
  type SheetNotification,
  type SheetCategoria
} from "@/utils/sheets";
import { playHeartbeatSound } from "@/utils/audio";
import { type CartItem, calculateCart } from "@/utils/pricing";
import { showCartAdd, showSuccess, showInfo, showNotificationPopup } from "@/utils/toast";

const ADMIN_EMAIL = "crochecrochet1@gmail.com";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getBonusSlotsForPaidCount(paidCount: number): number {
  if (paidCount < 10) return 0;
  if (paidCount < 15) return 1;
  if (paidCount < 20) return 2;
  return 5;
}

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoria_slug, id: routeProductId, slug_and_id, termo } = useParams();
  const { user } = useAuth();
  
  const [infoprodutosList, setInfoprodutosList] = useState<SheetInfoproduto[]>([]);
  const [packsList, setPacksList] = useState<SheetPack[]>([]);
  const [notificationsList, setNotificationsList] = useState<SheetNotification[]>([]);
  const [categoriesList, setCategoriesList] = useState<SheetCategoria[]>([]);
  const [shuffledRecipes, setShuffledRecipes] = useState<SheetRecipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<SheetRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showRecipe, setShowRecipe] = useState<SheetRecipe | null>(null);
  const [activeUpsell, setActiveUpsell] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMeuAmiguMundoOpen, setIsMeuAmiguMundoOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMeuAuthModalOpen, setIsMeuAuthModalOpen] = useState(false);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);
  const [activeUpsellIndex, setActiveUpsellIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => getReadNotificationIds());
  const [isDirectEntry, setIsDirectEntry] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("amigumundo-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchResults, setSearchResults] = useState<SheetRecipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    captureUTMs();
  }, []);

  const getTargetId = () => {
    if (slug_and_id) {
      const parts = slug_and_id.split("-");
      return parts[parts.length - 1];
    }
    return routeProductId;
  };

  const targetId = getTargetId();

  useEffect(() => {
    const isPackOrUpsellLink = location.pathname.startsWith("/pack/") || location.pathname.startsWith("/infoproduto/");
    if (isPackOrUpsellLink && targetId && !isLoading) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`item-${targetId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, targetId, isLoading]);

  useEffect(() => {
    const mesclarFavoritos = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("favoritos")
        .select("codigo_item")
        .eq("usuario_id", user.id);
      if (data && data.length > 0) {
        setFavorites((prev) => {
          const idsSupabase = data.map((f: any) => f.codigo_item);
          const combinados = Array.from(new Set([...prev, ...idsSupabase]));
          return combinados;
        });
      }
    };
    mesclarFavoritos();
  }, [user]);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [infoprodutosData, packsData, notificationsData, categoriesData] = await Promise.all([
          getInfoprodutos(),
          getPacks(),
          getNotifications(),
          getCategories()
        ]);

        setInfoprodutosList(infoprodutosData);
        setPacksList(packsData);
        setNotificationsList(notificationsData);

        const activeCategories = categoriesData
          .filter(c => c.ativo)
          .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));
        setCategoriesList(activeCategories);

      } catch (e) {
        console.error("Error loading sheets data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  useEffect(() => {
    const fetchCategoryRecipes = async () => {
      if (categoria_slug && categoriesList.length > 0) {
        const decodedCat = decodeURIComponent(categoria_slug).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const matchedCat = categoriesList.find(c => {
          const titleNormalized = c.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return titleNormalized === decodedCat;
        });

        if (!matchedCat) {
          navigate("/");
          return;
        }

        try {
          const filtered = await getRecipesByCategoria(matchedCat.id);
          setShuffledRecipes(shuffleArray(filtered));
        } catch (e) {
          console.error("Error fetching category recipes:", e);
          setShuffledRecipes([]);
        }
      } else {
        setShuffledRecipes([]);
      }
    };

    fetchCategoryRecipes();
  }, [categoria_slug, categoriesList, navigate]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (termo) {
        setIsSearching(true);
        setSearchResults([]);
        try {
          const results = await searchRecipes(decodeURIComponent(termo));
          setSearchResults(results);
        } catch (e) {
          console.error("Error searching recipes:", e);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [termo]);

  useEffect(() => {
    const fetchTargetRecipe = async () => {
      if (targetId) {
        try {
          const recipes = await getRecipesByIds([targetId]);
          if (recipes && recipes.length > 0) {
            setShowRecipe(recipes[0]);
          }
        } catch (e) {
          console.error("Error fetching target recipe:", e);
        }
      }
    };

    fetchTargetRecipe();
  }, [targetId]);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      if (isFavoritesOpen && favorites.length > 0) {
        try {
          const recipes = await getRecipesByIds(favorites);
          setFavoriteRecipes(recipes);
        } catch (e) {
          console.error("Error fetching favorite recipes:", e);
        }
      }
    };

    fetchFavoriteRecipes();
  }, [isFavoritesOpen, favorites]);

  useEffect(() => {
    if (notificationsList.length === 0) return;

    const checkNotifications = () => {
      const now = new Date();
      notificationsList.forEach((notif) => {
        if (!notif.ativo) return;
        
        const notifTime = new Date(notif.data_hora);
        if (now >= notifTime) {
          const hasBeenShown = localStorage.getItem(`notif-shown-${notif.id}`);
          if (!hasBeenShown) {
            showNotificationPopup(notif.titulo, notif.mensagem, notif.imagem_url);
            localStorage.setItem(`notif-shown-${notif.id}`, "true");
          }
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, [notificationsList]);

  useEffect(() => {
    const isDynamicRoute = location.pathname.startsWith("/receita/") || 
                           location.pathname.startsWith("/pack/") || 
                           location.pathname.startsWith("/infoproduto/");
    
    if (isDynamicRoute) {
      setIsDirectEntry(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const isModalOpen = !!showRecipe || !!activeUpsell || isFavoritesOpen || !!zoomImage || !!categoria_slug || !!targetId || !!termo || isMeuAmiguMundoOpen;
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showRecipe, activeUpsell, isFavoritesOpen, zoomImage, categoria_slug, targetId, termo, isMeuAmiguMundoOpen]);

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

  const toggleFavorite = (id: string, item?: { nome: string; imagem_url: string; tipo: string }) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        showSuccess("Item removido dos favoritos.");
        if (user) {
          supabase.from("favoritos").delete()
            .eq("usuario_id", user.id).eq("codigo_item", id).then(() => {});
        }
        return prev.filter((favId) => favId !== id);
      } else {
        showSuccess("Item adicionado aos favoritos! ❤️");
        if (user && item) {
          supabase.from("favoritos").upsert({
            usuario_id: user.id,
            tipo_item: item.tipo,
            codigo_item: id,
            nome_item: item.nome,
            imagem_url: item.imagem_url,
            favoritado_em: new Date().toISOString(),
          }, { onConflict: "usuario_id,tipo_item,codigo_item" }).then(() => {});
        }
        return [...prev, id];
      }
    });
  };

  const addToCart = (item: CartItem | CartItem[]) => {
    playHeartbeatSound();
    setCart((prev) => {
      const itemsToAdd = Array.isArray(item) ? item : [item];
      const filteredNewItems = itemsToAdd.filter(
        (newItem) => !prev.some((existing) => existing.id === newItem.id)
      );
      if (filteredNewItems.length > 0) {
        const names = filteredNewItems.map(i => i.nome).join(", ");
        showCartAdd(`${names} adicionado(s) ao carrinho!`);
      }
      return [...prev, ...filteredNewItems];
    });
    if (showRecipe) {
      setShowRecipe(null);
      if (targetId) navigate("/");
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      const paidCount = updated.filter(i => i.tipo === "recipe" && !i.isBonus).length;
      const allowedSlots = getBonusSlotsForPaidCount(paidCount);
      const bonusItems = updated.filter(i => i.tipo === "recipe" && i.isBonus);
      if (bonusItems.length > allowedSlots) {
        const excesso = bonusItems.length - allowedSlots;
        const idsParaRemover = bonusItems.slice(bonusItems.length - excesso).map(b => b.id);
        return updated.filter(i => !idsParaRemover.includes(i.id));
      }
      return updated;
    });
  };

  const calculatedCart = calculateCart(cart);
  const paidRecipeCountAtual = cart.filter(i => i.tipo === "recipe" && !i.isBonus).length;
  const bonusRecipeCountAtual = cart.filter(i => i.tipo === "recipe" && i.isBonus).length;
  const hasOpenBonusSlot = getBonusSlotsForPaidCount(paidRecipeCountAtual) > bonusRecipeCountAtual;

  const handleRecipeAdd = (recipe: SheetRecipe) => {
    const paidCount = cart.filter(i => i.tipo === "recipe" && !i.isBonus).length;
    const bonusCount = cart.filter(i => i.tipo === "recipe" && i.isBonus).length;
    const allowedSlots = getBonusSlotsForPaidCount(paidCount);
    const isBonus = allowedSlots > bonusCount && recipe.preco === 5;

    addToCart({
      id: recipe.id,
      nome: recipe.nome,
      preco: recipe.preco,
      tipo: "recipe",
      imagem: recipe.imagem_url,
      isBonus
    });
  };

  const handlePackAdd = (packId: string) => {
    const pack = packsList.find((p) => p.id === packId);
    if (pack) addToCart({ 
      id: pack.id, 
      nome: pack.nome, 
      preco: pack.preco, 
      tipo: "pack",
      imagem: pack.imagem_url
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
        const newItem: CartItem = {
          id: upsell.id,
          nome: upsell.nome,
          preco: upsell.preco,
          tipo: "upsell",
          imagem: upsell.imagem_url
        };
        
        setCart((prev) => {
          const updated = prev.find((i) => i.id === newItem.id) ? prev : [...prev, newItem];
          localStorage.setItem("amigumundo-cart", JSON.stringify(updated));
          return updated;
        });

        setActiveUpsell(null);
        navigate("/checkout");
      }
    }
  };

  const isInCart = (id: string) => cart.some((item) => item.id === id);

  const handleOpenMeuAmiguMundo = async () => {
    if (!user) {
      setIsMeuAuthModalOpen(true);
      return;
    }
    const profile = await getProfile(user.id);
    if (!profile?.telefone) {
      setIsCompleteProfileOpen(true);
    } else {
      setIsMeuAmiguMundoOpen(true);
    }
  };

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

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true);
  };

  const handleCloseNotifications = () => {
    setIsNotificationsOpen(false);
    setReadNotificationIds(getReadNotificationIds());
  };

  let metaTitle = "Amigu Mundo";
  let metaImage = "https://ik.imagekit.io/51b3srlsg/icone_amigumundo.png";
  let metaDescription = "Olha o que encontrei no AmiguMundo! Tudo sem ocupar espaço na memória do celular.";

  if (location.pathname.startsWith("/receita/") && targetId) {
    if (showRecipe) {
      metaTitle = `${showRecipe.nome} - R$ ${showRecipe.preco.toFixed(2)}`;
      metaImage = showRecipe.imagem_url;
    }
  } else if (location.pathname.startsWith("/pack/") && targetId) {
    const pack = packsList.find(p => p.id === targetId);
    if (pack) {
      metaTitle = `${pack.nome} - R$ ${pack.preco.toFixed(2)}`;
      metaImage = pack.imagem_url;
    }
  } else if (location.pathname.startsWith("/infoproduto/") && targetId) {
    const upsell = infoprodutosList.find(u => u.id === targetId);
    if (upsell) {
      metaTitle = `${upsell.nome} - R$ ${upsell.preco.toFixed(2)}`;
      metaImage = upsell.imagem_url;
    }
  } else if (termo) {
    metaTitle = `Busca: "${decodeURIComponent(termo)}" - AmiguMundo`;
  } else if (categoria_slug) {
    const decodedCat = decodeURIComponent(categoria_slug).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matchedCat = categoriesList.find(c => {
      const titleNormalized = c.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return titleNormalized === decodedCat;
    });
    
    if (matchedCat) {
      metaTitle = `Coleção ${matchedCat.titulo} - Amigu Mundo`;
      metaImage = matchedCat.imagem_url;
    }
  }

  return (
    <div className="min-h-screen bg-white pb-24 relative lg:max-w-6xl lg:mx-auto lg:shadow-2xl">
      <Helmet>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:description" content={metaDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image:type" content="image/jpeg" />
      </Helmet>

      <Header cartCount={cart.length} onOpenMeuAmiguMundo={handleOpenMeuAmiguMundo} />
      <PushOptInCard />

      <InternalPopup notifications={notificationsList} />

      <div className="max-w-6xl mx-auto px-4 mt-1 flex flex-col gap-1">
        <div 
          style={textureVerdeOlivaStyle}
          className="text-white p-2.5 rounded-lg text-center text-xs sm:text-sm font-black uppercase tracking-wide shadow-sm"
        >
          PRESENTE DIÁRIO: Vá até o final da página e baixe a Receita Gratuita de hoje! ↓
        </div>
      </div>

      <div className="bg-[#e6dcd3] mt-1 pt-1 pb-2">
        <section className="pb-1">
          <div className="max-w-6xl mx-auto px-4">
            <PwaPrompt />

            <UnifiedCheckoutHub
              cart={cart}
              onRemoveFromCart={removeFromCart}
              onAddToCart={addToCart}
              onCheckout={() => navigate("/checkout")}
              onZoomImage={setZoomImage}
              hasOpenBonusSlot={hasOpenBonusSlot}
            />
          </div>
        </section>
      </div>

      <section className="bg-[#F5F5F7] pt-0 pb-0">
        <div className="w-full overflow-hidden">
          <img 
            src="https://ik.imagekit.io/51b3srlsg/Loja_AmiguMundo_amigurumis.jpeg" 
            alt="Loja AmiguMundo" 
            className="w-full h-auto object-cover"
          />
        </div>

        <RecipeSearchBar />

        <div id="secao-categorias" className="max-w-6xl mx-auto px-2 sm:px-4 mt-3">
          <div className="bg-white rounded-3xl p-2 sm:p-3 shadow-lg border border-gray-100/80 flex flex-col gap-2">
            <div 
              style={textureLaranjaStyle}
              className="w-full py-2 px-3 shadow-sm rounded-xl text-center border border-gray-100"
            >
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white m-0">
                CATEGORIAS DE AMIGURUMIS
              </h2>
            </div>
            
            <p className="text-gray-600 text-xs sm:text-sm font-bold text-center uppercase tracking-tight -mt-0.5 mb-1">
              NOVAS TRADUÇÕES ADICIONADAS TODOS OS DIAS
            </p>
            
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-1 gap-y-1.5 lg:gap-4 px-0.5">
              {categoriesList.map((cat) => (
                <CategoryCard 
                  key={cat.id} 
                  nome={cat.titulo} 
                  imagem={cat.imagem_url}
                  onClick={() => {
                    playHeartbeatSound();
                    navigate(`/categoria/${encodeURIComponent(cat.titulo.toLowerCase())}`);
                  }} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#2A2A2A] overflow-hidden rounded-3xl mx-4 sm:mx-auto max-w-3xl shadow-xl border border-white/5 my-6">
        <div className="px-4">
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
            <p className="text-xs text-[#44FF00] font-bold mt-2 animate-pulse">
              Arraste para o lado para ver todas as soluções ➔
            </p>
          </div>

          <div className="relative">
            <div 
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 px-4 -mx-4"
              style={{ scrollbarWidth: 'none' }}
            >
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-gray-800 rounded-2xl aspect-[16/10] animate-pulse" />
                ))
              ) : (
                infoprodutosList.map((upsell) => (
                  <div key={upsell.id} id={`item-${upsell.id}`} className="snap-center shrink-0 w-[85vw] max-w-[320px]">
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
                        copiaVendas: [upsell.descricao],
                        imagem_url: upsell.imagem_url
                      }} 
                      isFavorite={favorites.includes(upsell.id)}
                      onToggleFavorite={() => toggleFavorite(upsell.id, { nome: upsell.nome, imagem_url: upsell.imagem_url, tipo: "infoproduto" })}
                      onOpen={() => {
                        playHeartbeatSound();
                        setActiveUpsell(upsell.id);
                      }} 
                    />
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => carouselRef.current?.scrollBy({ left: -340, behavior: "smooth" })}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white text-[#171717] p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
              aria-label="Anterior"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => carouselRef.current?.scrollBy({ left: 340, behavior: "smooth" })}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white text-[#171717] p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
              aria-label="Próximo"
            >
              <ArrowRight size={20} />
            </button>
          </div>

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
        <div className="modal-overlay" onClick={() => {
          setShowRecipe(null);
          if (targetId) navigate("/");
        }}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <Breadcrumbs 
              categoria={categoriesList.find(c => c.id === showRecipe.categoria)?.titulo || showRecipe.categoria} 
              produtoNome={showRecipe.nome} 
            />

            <RecipeCard
              recipe={showRecipe}
              isFavorite={favorites.includes(showRecipe.id)}
              onToggleFavorite={() => toggleFavorite(showRecipe.id, { nome: showRecipe.nome, imagem_url: showRecipe.imagem_url, tipo: "receita" })}
              onAdd={() => handleRecipeAdd(showRecipe)}
              onReject={() => {
                setShowRecipe(null);
                if (targetId) navigate("/");
              }}
              isInCart={isInCart(showRecipe.id)}
            />

            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowRecipe(null);
                  navigate(`/categoria/${encodeURIComponent(
                    (categoriesList.find(c => c.id === showRecipe.categoria)?.titulo || showRecipe.categoria).toLowerCase()
                  )}`);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                Conhecer mais receitas em {categoriesList.find(c => c.id === showRecipe.categoria)?.titulo || showRecipe.categoria} ➔
              </button>
              <button
                onClick={() => {
                  setShowRecipe(null);
                  navigate("/");
                }}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all text-center"
              >
                Ver o catálogo completo do AmiguMundo ➔
              </button>
            </div>
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

      <section className="bg-[#e6dcd3] py-6">
        <div className="max-w-6xl mx-auto px-4">
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
              ))
            ) : (
              packsList.map((pack) => (
                <div key={pack.id} id={`item-${pack.id}`}>
                  <PackCard
                    pack={{
                      id: pack.id,
                      nome: pack.nome,
                      descricao: pack.descricao,
                      receitas: 20,
                      precoOriginal: pack.preco * 1.5,
                      precoAtual: pack.preco,
                      emoji: "🎁",
                      imagem_url: pack.imagem_url
                    }}
                    inCart={isInCart(pack.id)}
                    isFavorite={favorites.includes(pack.id)}
                    onToggleFavorite={() => toggleFavorite(pack.id, { nome: pack.nome, imagem_url: pack.imagem_url, tipo: "pack" })}
                    onAdd={() => handlePackAdd(pack.id)}
                    onRemove={() => removeFromCart(pack.id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 my-6">
        <a 
          href="/entrar-grupo" 
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

      <DailyGiftSection />

      <InstallGuideCard />

      <footer className="text-center py-3 px-4 border-t border-gray-100 bg-white">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">© 2026 AmiguMundo Artes</p>
      </footer>

      <CartFooter
        count={cart.length}
        total={calculatedCart.total}
        onCheckout={() => navigate("/checkout")}
      />

      <FooterNavigation
        onOpenMeuAmiguMundo={handleOpenMeuAmiguMundo}
        onOpenNotifications={handleOpenNotifications}
        favoritesCount={favorites.length}
        notificationsCount={notificationsList.filter(n => n.ativo && !readNotificationIds.includes(n.id)).length}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteIds={favorites}
        onToggleFavorite={(id) => {
          const recipe = favoriteRecipes.find((r) => r.id === id);
          const pack = packsList.find((p) => p.id === id);
          const upsell = infoprodutosList.find((u) => u.id === id);
          const item = recipe 
            ? { nome: recipe.nome, imagem_url: recipe.imagem_url, tipo: "receita" }
            : pack 
            ? { nome: pack.nome, imagem_url: pack.imagem_url, tipo: "pack" }
            : upsell 
            ? { nome: upsell.nome, imagem_url: upsell.imagem_url, tipo: "infoproduto" }
            : undefined;
          toggleFavorite(id, item);
        }}
        onAddToCart={addToCart}
        isInCart={isInCart}
        recipes={favoriteRecipes}
        packs={packsList}
        infoprodutos={infoprodutosList}
        hasOpenBonusSlot={hasOpenBonusSlot}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={handleCloseNotifications}
        notifications={notificationsList}
      />

      {categoria_slug && (
        <CategoryDetailView
          categoriaSlug={categoria_slug}
          recipes={shuffledRecipes}
          isLoading={isLoading}
          isInCart={isInCart}
          onBack={() => navigate("/")}
          onRecipeAdd={handleRecipeAdd}
          onRecipeRemove={removeFromCart}
          onZoomImage={setZoomImage}
          favorites={favorites}
          onToggleFavorite={(id) => {
            const recipe = shuffledRecipes.find((r) => r.id === id);
            toggleFavorite(id, recipe ? { nome: recipe.nome, imagem_url: recipe.imagem_url, tipo: "receita" } : undefined);
          }}
          hasOpenBonusSlot={hasOpenBonusSlot}
        />
      )}

      {termo && (
        <SearchResultsView
          termo={termo}
          recipes={searchResults}
          isLoading={isSearching}
          isInCart={isInCart}
          onBack={() => {
            navigate("/");
            setTimeout(() => {
              document.getElementById("secao-categorias")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          onRecipeAdd={handleRecipeAdd}
          onRecipeRemove={removeFromCart}
          onZoomImage={setZoomImage}
          favorites={favorites}
          onToggleFavorite={(id) => {
            const recipe = searchResults.find((r) => r.id === id);
            toggleFavorite(id, recipe ? { nome: recipe.nome, imagem_url: recipe.imagem_url, tipo: "receita" } : undefined);
          }}
          hasOpenBonusSlot={hasOpenBonusSlot}
        />
      )}

      {zoomImage && (
        <LightboxModal
          imageUrl={zoomImage}
          onClose={() => setZoomImage(null)}
        />
      )}

      {isMeuAmiguMundoOpen && (
        <MeuAmiguMundoView onBack={() => setIsMeuAmiguMundoOpen(false)} onAddToCart={addToCart} />
      )}

      {user?.email === ADMIN_EMAIL && <AdminSyncButton />}

      <AuthModal isOpen={isMeuAuthModalOpen} onClose={() => setIsMeuAuthModalOpen(false)} />

      <CompleteProfileModal
        isOpen={isCompleteProfileOpen}
        onClose={() => setIsCompleteProfileOpen(false)}
        userId={user?.id}
        emailAtual={user?.email}
        onSuccess={() => {
          setIsCompleteProfileOpen(false);
          setIsMeuAmiguMundoOpen(true);
        }}
      />
    </div>
  );
}